import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import './style.css'

const fmt = d => new Date(d).toLocaleString('ja-JP', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })

function App() {
  const [page, setPage] = useState('home')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [toast, setToast] = useState('')
  const [savedJobIds, setSavedJobIds] = useState([])
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('')
  const [english, setEnglish] = useState('')
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)

  const notify = useCallback((msg, ms = 3000) => {
    setToast(msg)
    setTimeout(() => setToast(''), ms)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadUserData(data.session.user.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s)
      if (s) loadUserData(s.user.id)
      else { setProfile(null); setSavedJobIds([]); setApplications([]) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(uid) {
    const [profRes, savedRes, appRes, convRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      supabase.from('saved_jobs').select('job_id').eq('user_id', uid),
      supabase.from('applications').select('*').eq('user_id', uid),
      supabase.from('conversations').select('*')
        .or(`participant_a.eq.${uid},participant_b.eq.${uid}`)
        .order('last_message_at', { ascending: false })
    ])
    if (profRes.data) setProfile(profRes.data)
    if (savedRes.data) setSavedJobIds(savedRes.data.map(r => r.job_id))
    if (appRes.data) setApplications(appRes.data)
    if (convRes.data) setConversations(convRes.data)
  }

  useEffect(() => {
    loadJobs()
    const ch = supabase.channel('jobs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, loadJobs)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  async function loadJobs() {
    const { data } = await supabase.from('jobs').select('*').order('id', { ascending: false })
    if (data) setJobs(data)
  }

  useEffect(() => {
    if (!session) return
    const uid = session.user.id
    const ch = supabase.channel('conv-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `participant_a=eq.${uid}` }, () => loadUserData(uid))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations', filter: `participant_b=eq.${uid}` }, () => loadUserData(uid))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [session])

  const filteredJobs = useMemo(() => jobs.filter(j => {
    const t = [j.title, j.company, j.location, j.salary, j.english_level, j.description].join(' ').toLowerCase()
    return (!search || t.includes(search.toLowerCase())) && (!area || j.location === area) && (!english || j.english_level === english)
  }), [jobs, search, area, english])

  function openJob(job) { setSelectedJob(job); setPage('job') }

  async function toggleSave(jobId) {
    if (!session) { notify('ログインが必要です'); return }
    const uid = session.user.id
    const isSavedNow = savedJobIds.includes(jobId)
    if (isSavedNow) {
      await supabase.from('saved_jobs').delete().eq('user_id', uid).eq('job_id', jobId)
      setSavedJobIds(p => p.filter(x => x !== jobId))
    } else {
      await supabase.from('saved_jobs').insert({ user_id: uid, job_id: jobId })
      setSavedJobIds(p => [...p, jobId])
    }
  }

  function isSaved(jobId) { return savedJobIds.includes(jobId) }

  async function applyToJob(job, msg) {
    if (!session) { notify('ログインが必要です'); return false }
    const uid = session.user.id
    if (applications.some(a => a.job_id === job.id)) { notify('すでに応募済みです'); return false }
    const { error } = await supabase.from('applications').insert({ user_id: uid, job_id: job.id, message: msg, status: 'pending' })
    if (error) { notify('応募できません: ' + error.message); return false }
    setApplications(p => [...p, { user_id: uid, job_id: job.id, status: 'pending' }])
    notify('応募しました！')
    return true
  }

  function hasApplied(jobId) { return applications.some(a => a.job_id === jobId) }

  async function startDM(job) {
    if (!session) { notify('ログインが必要です'); return }
    const uid = session.user.id
    let existing = conversations.find(c => c.job_id === job.id)
    if (!existing) {
      const { data, error } = await supabase.from('conversations').insert({
        job_id: job.id, participant_a: uid, participant_b: uid,
        company_name: job.company, job_title: job.title,
        last_message: '', last_message_at: new Date().toISOString()
      }).select().single()
      if (error) { notify('DM開始できません: ' + error.message); return }
      existing = data
      setConversations(p => [data, ...p])
    }
    setActiveConvId(existing.id)
    setPage('chat')
  }

  function openMap(loc) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc || 'Sydney')}`, '_blank')
  }

  async function signInGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://workmate-three.vercel.app' }
    })
    if (error) notify('ログインエラー: ' + error.message)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setPage('home')
    notify('ログアウトしました')
  }

  const avatarLetter = profile?.display_name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <div>
      {toast && <div className="toast">{toast}<button onClick={() => setToast('')}>×</button></div>}
      {page === 'home' && <Home jobs={jobs} openJob={openJob} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} session={session} profile={profile} avatarLetter={avatarLetter} />}
      {page === 'jobs' && <Jobs jobs={filteredJobs} openJob={openJob} search={search} setSearch={setSearch} area={area} setArea={setArea} english={english} setEnglish={setEnglish} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} />}
      {page === 'post' && <PostJob setPage={setPage} loadJobs={loadJobs} notify={notify} session={session} />}
      {page === 'job' && selectedJob && <JobDetail job={selectedJob} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} startDM={startDM} applyToJob={applyToJob} hasApplied={hasApplied} openMap={openMap} session={session} />}
      {page === 'staff' && <Staff setPage={setPage} session={session} />}
      {page === 'dm' && <DM conversations={conversations} setActiveConvId={setActiveConvId} setPage={setPage} session={session} signInGoogle={signInGoogle} />}
      {page === 'chat' && <Chat convId={activeConvId} setPage={setPage} session={session} conversations={conversations} setConversations={setConversations} notify={notify} />}
      {page === 'profile' && <Profile setPage={setPage} session={session} profile={profile} setProfile={setProfile} notify={notify} signInGoogle={signInGoogle} signOut={signOut} applications={applications} jobs={jobs} isSaved={isSaved} openJob={openJob} savedJobIds={savedJobIds} />}
      {page === 'login' && <Login signInGoogle={signInGoogle} setPage={setPage} />}
      <nav className="bottom">
        <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>🏠<br/><small>Home</small></button>
        <button className={['jobs','job','post'].includes(page) ? 'active' : ''} onClick={() => setPage('jobs')}>💼<br/><small>Jobs</small></button>
        <button className={page === 'staff' ? 'active' : ''} onClick={() => setPage('staff')}>👥<br/><small>Staff</small></button>
        <button className={['dm','chat'].includes(page) ? 'active' : ''} onClick={() => setPage('dm')}>💬<br/><small>DM</small></button>
        <button className={page === 'profile' ? 'active' : ''} onClick={() => setPage('profile')}>👤<br/><small>Profile</small></button>
      </nav>
    </div>
  )
}

function Login({ signInGoogle, setPage }) {
  return (
    <main style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'80vh', gap:24 }}>
      <div style={{ fontSize:56 }}>🤝</div>
      <h1 style={{ textAlign:'center' }}>WorkMateにログイン</h1>
      <p className="muted" style={{ textAlign:'center' }}>シドニーで働く留学生のためのジョブマッチングアプリ</p>
      <button className="primary" style={{ width:'100%', maxWidth:320, fontSize:18, padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:12 }} onClick={signInGoogle}>
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.7 29.2 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.7-5.1L31.5 35C29.5 36.6 27 37.5 24 37.5c-5.2 0-9.5-3.3-11.3-7.9L6 34.4C9.3 40.5 16.1 45 24 45z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.7 4.7-5 6L36.7 38C40.9 34.2 44 29.4 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
        Googleでログイン
      </button>
      <button onClick={() => setPage('home')} style={{ background:'transparent', color:'#64748b' }}>← ゲストとして続ける</button>
    </main>
  )
}

function Home({ jobs, openJob, setPage, isSaved, toggleSave, session, profile, avatarLetter }) {
  const savedJobsList = jobs.filter(j => isSaved(j.id))
  const displayName = profile?.display_name || session?.user?.email?.split('@')[0] || 'Guest'
  const fields = [profile?.display_name, profile?.bio, profile?.availability, profile?.visa_expiry, profile?.avatar_url]
  const filled = fields.filter(Boolean).length
  const pct = Math.round((filled / fields.length) * 100)
  return (
    <main>
      <section className="hero">
        <div>
          <p className="muted">Good day 👋</p>
          <h1>Hi, {displayName.split(' ')[0]}</h1>
          <p className="muted">シドニーで今日もいい仕事を見つけよう</p>
        </div>
        <button className="avatar avatarBtn" onClick={() => setPage('profile')} aria-label="プロフィールを開く">
          {profile?.avatar_url ? <img src={profile.avatar_url} style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }} alt="avatar" /> : avatarLetter}
        </button>
      </section>
      <section className="quick">
        <button onClick={() => setPage('jobs')}>💼 今日のおすすめ求人<span>求人一覧を見る</span></button>
        <button onClick={() => setPage('post')}>🏪 求人を投稿する<span>店側が求人を追加</span></button>
      </section>
      {session && pct < 100 && (
        <section className="card">
          <h2>プロフィール完成度 {pct}%</h2>
          <div className="bar"><span style={{ width: pct + '%' }} /></div>
          <p className="muted">写真・ビザ期限・勤務可能日を追加すると応募率が上がります。</p>
          <button className="primary" onClick={() => setPage('profile')}>プロフィールを完成させる</button>
        </section>
      )}
      {!session && (
        <section className="card" style={{ textAlign:'center' }}>
          <p style={{ fontSize:32, marginBottom:8 }}>🔑</p>
          <h2>ログインして全機能を使おう</h2>
          <p className="muted">求人保存・応募・リアルタイムDMが使えるようになります。</p>
          <button className="primary" onClick={() => setPage('login')}>Googleでログイン</button>
        </section>
      )}
      <Section title="近くの求人">
        <JobGrid jobs={jobs.slice(0, 4)} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />
      </Section>
      <Section title="保存した求人">
        {savedJobsList.length ? <JobGrid jobs={savedJobsList} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} /> : <div className="empty">まだ保存した求人はありません。</div>}
      </Section>
    </main>
  )
}

function Jobs({ jobs, openJob, search, setSearch, area, setArea, english, setEnglish, setPage, isSaved, toggleSave }) {
  return (
    <main>
      <header className="sticky">
        <h1>求人を探す</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="キーワード検索" />
        <div className="filters">
          <select value={area} onChange={e => setArea(e.target.value)}>
            <option value="">場所すべて</option>
            <option>Sydney</option><option>Sydney CBD</option><option>CBD</option><option>Bondi</option><option>Chatswood</option>
          </select>
          <select value={english} onChange={e => setEnglish(e.target.value)}>
            <option value="">英語条件</option>
            <option>英語初級OK</option><option>英語ほぼ不要</option><option>Intermediate以上</option>
          </select>
        </div>
        <button className="primary" onClick={() => setPage('post')}>＋ 求人投稿</button>
      </header>
      <JobGrid jobs={jobs} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />
    </main>
  )
}

function JobGrid({ jobs, openJob, isSaved, toggleSave }) {
  if (!jobs.length) return <div className="empty">求人がありません。</div>
  return <div className="grid">{jobs.map(j => <JobCard key={j.id} job={j} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />)}</div>
}

function JobCard({ job, openJob, isSaved, toggleSave }) {
  return (
    <article className="job" onClick={() => openJob(job)}>
      <div className="photo">{job.image_url ? <img src={job.image_url} alt={job.company} /> : '💼'}</div>
      <h2>{job.company || 'No company'}</h2>
      <p className="muted">{job.title}</p>
      <p className="muted" style={{ fontSize:13 }}>{job.location || '場所未設定'} / {job.salary || '時給未設定'}</p>
      <div className="tags"><span>{job.location || '未設定'}</span><span>{job.english_level || '英語条件なし'}</span></div>
      <div className="actions" onClick={e => e.stopPropagation()}>
        <button className="primary" onClick={() => openJob(job)}>詳細を見る</button>
        <button className={isSaved(job.id) ? 'fav' : ''} onClick={() => toggleSave(job.id)}>{isSaved(job.id) ? '♥ 保存済み' : '♡ 保存'}</button>
      </div>
    </article>
  )
}

function JobDetail({ job, setPage, isSaved, toggleSave, startDM, applyToJob, hasApplied, openMap, session }) {
  const [showApply, setShowApply] = useState(false)
  const [applyMsg, setApplyMsg] = useState('')
  const [busy, setBusy] = useState(false)
  async function handleApply() {
    setBusy(true)
    const ok = await applyToJob(job, applyMsg)
    setBusy(false)
    if (ok) setShowApply(false)
  }
  return (
    <main>
      <button onClick={() => setPage('jobs')}>← 求人一覧へ戻る</button>
      <section className="detail card">
        <div className="photo big">{job.image_url ? <img src={job.image_url} alt={job.company} /> : '💼'}</div>
        <h1>{job.company}</h1>
        <p className="muted">{job.title} / {job.location} / {job.salary}</p>
        <div className="tags"><span>{job.english_level}</span><span>{job.location}</span></div>
        <p style={{ lineHeight:1.8, marginTop:12 }}>{job.description}</p>
        <div className="row"><b>場所</b><span>{job.location}</span></div>
        <div className="row"><b>時給</b><span>{job.salary}</span></div>
        <div className="row"><b>英語条件</b><span>{job.english_level}</span></div>
        <button onClick={() => openMap(job.location)} style={{ marginTop:12 }}>📍 Google Mapsで見る</button>
        {showApply && (
          <div className="card" style={{ marginTop:16 }}>
            <h3>応募メッセージ（任意）</h3>
            <textarea value={applyMsg} onChange={e => setApplyMsg(e.target.value)} placeholder="自己紹介や希望シフトなど..." rows={4} />
            <div className="actions">
              <button className="primary" onClick={handleApply} disabled={busy}>{busy ? '応募中...' : '送信して応募'}</button>
              <button onClick={() => setShowApply(false)}>キャンセル</button>
            </div>
          </div>
        )}
        <div className="actions" style={{ marginTop:16 }}>
          {!showApply && (
            <button className="primary" onClick={() => session ? setShowApply(true) : setPage('login')} disabled={hasApplied(job.id)}>
              {hasApplied(job.id) ? '✓ 応募済み' : '応募する'}
            </button>
          )}
          <button className={isSaved(job.id) ? 'fav' : ''} onClick={() => toggleSave(job.id)}>{isSaved(job.id) ? '♥ 保存済み' : '♡ 保存'}</button>
          <button onClick={() => startDM(job)}>💬 DMする</button>
        </div>
      </section>
    </main>
  )
}

const emptyJob = { title:'', company:'', location:'', salary:'', english_level:'英語初級OK', description:'', image_url:'' }

function PostJob({ setPage, loadJobs, notify, session }) {
  const [job, setJob] = useState(emptyJob)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  function update(k, v) { setJob(p => ({ ...p, [k]: v })) }
  async function uploadImage() {
    if (!file) return job.image_url
    const ext = file.name.split('.').pop()
    const path = `jobs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('job-images').upload(path, file)
    if (error) throw error
    return supabase.storage.from('job-images').getPublicUrl(path).data.publicUrl
  }
  async function submit() {
    if (!job.title || !job.company) { notify('求人タイトルと店名は必須です。'); return }
    setBusy(true)
    try {
      const image_url = await uploadImage()
      const { error } = await supabase.from('jobs').insert([{ ...job, image_url }])
      if (error) throw error
      notify('求人を保存しました。')
      setJob(emptyJob); setFile(null)
      await loadJobs()
      setPage('jobs')
    } catch (e) { notify('保存できません: ' + e.message) }
    finally { setBusy(false) }
  }
  return (
    <main>
      <h1>求人を投稿する</h1>
      <section className="card form">
        <label>求人タイトル<input value={job.title} onChange={e => update('title', e.target.value)} placeholder="Kitchen staff wanted" /></label>
        <label>店名<input value={job.company} onChange={e => update('company', e.target.value)} placeholder="Sakura Kitchen" /></label>
        <label>場所<input value={job.location} onChange={e => update('location', e.target.value)} placeholder="Sydney CBD" /></label>
        <label>時給<input value={job.salary} onChange={e => update('salary', e.target.value)} placeholder="$28/h" /></label>
        <label>英語条件
          <select value={job.english_level} onChange={e => update('english_level', e.target.value)}>
            <option>英語初級OK</option><option>英語ほぼ不要</option><option>Intermediate以上</option>
          </select>
        </label>
        <label>仕事内容<textarea value={job.description} onChange={e => update('description', e.target.value)} placeholder="仕事内容、勤務時間、条件など" /></label>
        <label>画像<input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
        <button className="primary" onClick={submit} disabled={busy}>{busy ? '保存中...' : '保存する'}</button>
      </section>
    </main>
  )
}

function Staff({ setPage, session }) {
  const staffList = [
    { id:'haru', name:'Haru', icon:'🧑‍🍳', skill:'Kitchen experience' },
    { id:'mina', name:'Mina', icon:'👩', skill:'RSA / Wait staff' },
    { id:'ken', name:'Ken', icon:'👨', skill:'Barista / Coffee' },
    { id:'yuki', name:'Yuki', icon:'👩‍💼', skill:'Cashier / Reception' },
  ]
  return (
    <main>
      <h1>スタッフを探す</h1>
      <div className="grid">
        {staffList.map(s => (
          <article className="job" key={s.id}>
            <div className="photo">{s.icon}</div>
            <h2>{s.name}</h2>
            <p className="muted">{s.skill}</p>
            <button className="primary" onClick={() => { if (!session) { setPage('login'); return }; setPage('dm') }}>連絡する</button>
          </article>
        ))}
      </div>
    </main>
  )
}

function DM({ conversations, setActiveConvId, setPage, session, signInGoogle }) {
  if (!session) {
    return (
      <main style={{ textAlign:'center', paddingTop:40 }}>
        <p style={{ fontSize:40 }}>💬</p>
        <h2>DMを使うにはログインが必要です</h2>
        <button className="primary" style={{ marginTop:16 }} onClick={signInGoogle}>Googleでログイン</button>
      </main>
    )
  }
  return (
    <main>
      <h1>DM</h1>
      {!conversations.length && <div className="empty">まだDMはありません。<br />求人詳細ページから「DMする」を押してみましょう。</div>}
      {conversations.map(c => (
        <div className="dm" key={c.id} onClick={() => { setActiveConvId(c.id); setPage('chat') }}>
          <div className="avatar">🏪</div>
          <div style={{ flex:1, minWidth:0 }}>
            <b>{c.company_name || 'Unknown'}</b>
            <p className="muted" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.last_message || c.job_title || 'メッセージを送ってみましょう'}</p>
          </div>
          <small className="muted">{c.last_message_at ? fmt(c.last_message_at) : ''}</small>
        </div>
      ))}
    </main>
  )
}

function Chat({ convId, setPage, session, conversations, setConversations, notify }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const conv = conversations.find(c => c.id === convId)

  useEffect(() => {
    if (!convId) return
    loadMessages()
    const ch = supabase.channel('chat-' + convId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` }, payload => {
        setMessages(p => [...p, payload.new])
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [convId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadMessages() {
    setLoading(true)
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true })
    if (data) setMessages(data)
    setLoading(false)
  }

  async function send() {
    if (!text.trim() || busy || !session) return
    setBusy(true)
    const msg = text.trim()
    setText('')
    const { error } = await supabase.from('messages').insert({ conversation_id: convId, sender_id: session.user.id, text: msg })
    if (error) { notify('送信できません: ' + error.message); setText(msg) }
    else {
      await supabase.from('conversations').update({ last_message: msg, last_message_at: new Date().toISOString() }).eq('id', convId)
      setConversations(p => p.map(c => c.id === convId ? { ...c, last_message: msg, last_message_at: new Date().toISOString() } : c))
    }
    setBusy(false)
  }

  function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  if (!conv) return <main><button onClick={() => setPage('dm')}>← 戻る</button><p>トークが見つかりません。</p></main>

  return (
    <main style={{ paddingBottom:80 }}>
      <button onClick={() => setPage('dm')}>← DM一覧へ戻る</button>
      <section className="chat card">
        <div className="chatHead">
          <div className="avatar">🏪</div>
          <div><b>{conv.company_name}</b><p className="muted">{conv.job_title}</p></div>
        </div>
        <div className="bubbles">
          {loading && <p className="muted" style={{ textAlign:'center' }}>読み込み中...</p>}
          {!loading && !messages.length && <p className="muted" style={{ textAlign:'center', marginTop:40 }}>最初のメッセージを送ってみましょう 👋</p>}
          {messages.map(m => (
            <div key={m.id} className={'bubble ' + (m.sender_id === session?.user?.id ? 'me' : 'them')}>
              {m.text}<small>{fmt(m.created_at)}</small>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="compose">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKey} placeholder="メッセージを入力" />
          <button className="primary" onClick={send} disabled={busy || !text.trim()}>送信</button>
        </div>
      </section>
    </main>
  )
}

function Profile({ setPage, session, profile, setProfile, notify, signInGoogle, signOut, applications, jobs, isSaved, openJob, savedJobIds }) {
  const [form, setForm] = useState({ display_name:'', english_level:'Basic', availability:'', bio:'', visa_expiry:'' })
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('profile')

  useEffect(() => {
    if (profile) setForm({ display_name: profile.display_name || '', english_level: profile.english_level || 'Basic', availability: profile.availability || '', bio: profile.bio || '', visa_expiry: profile.visa_expiry || '' })
  }, [profile])

  function upd(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function save() {
    if (!session) return
    setBusy(true)
    const { data, error } = await supabase.from('profiles').upsert({ id: session.user.id, ...form, updated_at: new Date().toISOString() }).select().single()
    setBusy(false)
    if (error) { notify('保存できません: ' + error.message); return }
    setProfile(data)
    notify('プロフィールを保存しました！')
  }

  const appliedJobs = jobs.filter(j => applications.some(a => a.job_id === j.id))
  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id))

  if (!session) {
    return (
      <main style={{ textAlign:'center', paddingTop:60 }}>
        <p style={{ fontSize:56 }}>👤</p>
        <h2>ログインしてプロフィールを作成</h2>
        <p className="muted">求人保存・応募履歴がここに表示されます。</p>
        <button className="primary" style={{ marginTop:20 }} onClick={signInGoogle}>Googleでログイン</button>
      </main>
    )
  }

  return (
    <main>
      <section className="hero" style={{ alignItems:'flex-start', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center' }}>
          <div>
            <h1>{form.display_name || 'プロフィール'}</h1>
            <p className="muted">{session.user.email}</p>
          </div>
          <button onClick={signOut} style={{ background:'#fee2e2', color:'#be123c', padding:'10px 16px' }}>ログアウト</button>
        </div>
      </section>
      <div style={{ display:'flex', gap:8, margin:'16px 0', borderBottom:'2px solid #e2e8f0', paddingBottom:0 }}>
        {[['profile','プロフィール'], ['applied','応募履歴'], ['saved','保存済み']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ background:'transparent', borderRadius:0, borderBottom: tab===key ? '3px solid #2563eb' : '3px solid transparent', color: tab===key ? '#2563eb' : '#64748b', fontWeight:900, padding:'12px 16px' }}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'profile' && (
        <section className="card form">
          <label>名前<input value={form.display_name} onChange={e => upd('display_name', e.target.value)} placeholder="Haru Yamamoto" /></label>
          <label>英語レベル
            <select value={form.english_level} onChange={e => upd('english_level', e.target.value)}>
              <option>Basic</option><option>Pre-intermediate</option><option>Intermediate</option><option>Upper-intermediate</option><option>Advanced</option>
            </select>
          </label>
          <label>勤務可能日<input value={form.availability} onChange={e => upd('availability', e.target.value)} placeholder="Wed, Thu, Fri, Sat" /></label>
          <label>ビザ期限<input type="date" value={form.visa_expiry} onChange={e => upd('visa_expiry', e.target.value)} /></label>
          <label>自己紹介<textarea value={form.bio} onChange={e => upd('bio', e.target.value)} placeholder="I have 2 years restaurant experience in Japan..." /></label>
          <button className="primary" onClick={save} disabled={busy}>{busy ? '保存中...' : '保存する'}</button>
        </section>
      )}
      {tab === 'applied' && (
        <div>
          {!appliedJobs.length ? <div className="empty">まだ応募した求人はありません。</div>
            : appliedJobs.map(j => {
              const app = applications.find(a => a.job_id === j.id)
              return (
                <div key={j.id} className="dm" onClick={() => openJob(j)} style={{ cursor:'pointer' }}>
                  <div className="avatar" style={{ fontSize:24 }}>{j.image_url ? <img src={j.image_url} style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }} alt="" /> : '💼'}</div>
                  <div style={{ flex:1 }}><b>{j.company}</b><p className="muted">{j.title}</p></div>
                  <span style={{ padding:'6px 12px', borderRadius:999, fontSize:13, fontWeight:800, background: app?.status === 'accepted' ? '#dcfce7' : app?.status === 'rejected' ? '#fee2e2' : '#dbeafe', color: app?.status === 'accepted' ? '#16a34a' : app?.status === 'rejected' ? '#dc2626' : '#1d4ed8' }}>
                    {app?.status === 'accepted' ? '✓ 採用' : app?.status === 'rejected' ? '✗ 不採用' : '⏳ 審査中'}
                  </span>
                </div>
              )
            })}
        </div>
      )}
      {tab === 'saved' && (
        <div>
          {!savedJobs.length ? <div className="empty">まだ保存した求人はありません。</div>
            : <JobGrid jobs={savedJobs} openJob={openJob} isSaved={() => true} toggleSave={() => {}} />}
        </div>
      )}
    </main>
  )
}

function Section({ title, children }) {
  return <section><h2 className="sectionTitle">{title}</h2>{children}</section>
}

createRoot(document.getElementById('root')).render(<App />)
