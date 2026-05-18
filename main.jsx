import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState
} from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import './style.css'

// ═════════════════════════════════════════════
//  i18n
// ═════════════════════════════════════════════
const T = {
  ja: {
    nav_home:'ホーム', nav_jobs:'求人', nav_staff:'スタッフ', nav_dm:'DM', nav_profile:'プロフィール',
    tagline:'シドニーで今日もいい仕事を見つけよう',
    section_nearby:'近くの求人', section_saved:'保存した求人',
    login_cta_title:'ログインして全機能を使おう',
    login_cta_desc:'求人保存・応募・リアルタイムDMが使えるようになります。',
    profile_completion:'プロフィール完成度',
    profile_hint:'写真・ビザ期限・勤務可能日を追加すると応募率が上がります。',
    complete_profile:'プロフィールを完成させる',
    quick_jobs:'今日のおすすめ求人', quick_jobs_sub:'求人一覧を見る',
    quick_post:'求人を投稿する', quick_post_sub:'店側が求人を追加',
    search_jobs:'求人を探す', keyword_ph:'キーワード検索',
    all_areas:'場所すべて', eng_cond:'英語条件', post_btn:'＋ 求人投稿',
    no_jobs:'求人がありません。',
    view_detail:'詳細を見る', save:'♡ 保存', saved_btn:'♥ 保存済み',
    loc_tbd:'場所未設定', salary_tbd:'時給未設定', no_eng:'英語条件なし',
    back_jobs:'← 求人一覧へ戻る',
    apply:'応募する', applied_done:'✓ 応募済み', applying:'応募中...',
    apply_msg:'応募メッセージ（任意）', apply_ph:'自己紹介や希望シフトなど...',
    send_apply:'送信して応募', cancel:'キャンセル',
    view_map:'📍 Google Mapsで見る', dm_btn:'💬 DMする',
    badge_active:'募集中', badge_closed:'募集終了',
    post_title:'求人を投稿する', post_login_title:'求人投稿にはログインが必要です',
    post_login_desc:'Googleアカウントでログインしてください。',
    f_title:'求人タイトル *', f_company:'店名 *', f_location:'場所',
    f_salary:'時給', f_eng:'英語条件', f_desc:'仕事内容', f_img:'画像',
    f_categories:'職種（最大5つ選択）',
    save_btn:'保存する', saving:'保存中...',
    required_err:'求人タイトルと店名は必須です。', job_saved:'求人を保存しました。',
    find_staff:'スタッフを探す', staff_desc:'シドニーで働くスタッフ候補を探せます。',
    no_staff:'スタッフ登録がまだありません。', contact:'💬 連絡する', visa_lbl:'🛂 ビザ期限:',
    dm_title:'DM', dm_login_title:'DMを使うにはログインが必要です',
    no_dm:'まだDMはありません。', no_dm_hint:'求人詳細ページから「DMする」を押してみましょう。',
    back_dm:'← DM一覧へ戻る', type_msg:'メッセージを入力', send:'送信',
    first_msg:'最初のメッセージを送ってみましょう 👋', loading:'読み込み中...',
    logout:'ログアウト',
    tab_profile:'プロフィール', tab_applied:'応募履歴', tab_saved:'保存済み', tab_posted:'投稿した求人',
    change_photo:'📷 写真を変更', photo_pending:'保存するまで反映されません',
    f_name:'名前', f_eng_level:'英語レベル', f_avail:'勤務可能日・時間帯', f_visa:'ビザ期限', f_bio:'自己紹介',
    f_job_categories:'希望職種（最大5つ）',
    no_applied:'まだ応募した求人はありません。', no_saved_jobs:'まだ保存した求人はありません。',
    no_posted:'まだ求人を投稿していません。', post_first:'求人を投稿する',
    apps_count:'応募', view_apps:'▼ 応募者を見る', close_apps:'▲ 閉じる',
    no_apps:'まだ応募者はいません。', hire:'✓ 採用する', reject:'✗ 不採用',
    st_accepted:'採用', st_rejected:'不採用', st_pending:'審査中',
    b_accepted:'✓ 採用', b_rejected:'✗ 不採用', b_pending:'⏳ 審査中',
    edit_job:'✏️ 編集', delete_job:'🗑 削除', close_job:'募集を終了', reopen_job:'募集を再開',
    confirm_del:'この求人を削除しますか？', job_deleted:'求人を削除しました。',
    status_updated:'求人ステータスを更新しました', post_new:'＋ 新しい求人を投稿',
    login_title:'WorkMateにログイン',
    login_sub:'シドニーで働く留学生のためのジョブマッチングアプリ',
    login_google:'Googleでログイン', guest:'← ゲストとして続ける',
    login_profile:'ログインしてプロフィールを作成',
    login_profile_desc:'求人保存・応募履歴がここに表示されます。',
    signup_tab:'新規登録', login_tab:'ログイン',
    f_email:'メールアドレス', f_password:'パスワード', f_displayname:'名前（表示名）',
    signup_btn:'アカウントを作成', login_btn:'ログイン',
    or_google:'または',
    err_required:'名前・メール・パスワードを入力してください',
    err_password_short:'パスワードは6文字以上にしてください',
    signup_ok:'アカウントを作成しました！',
    check_email:'確認メールを送信しました。メールのリンクをクリックしてください。',
    toast_login:'ログインが必要です', toast_applied_already:'すでに応募済みです',
    toast_applied_ok:'応募しました！', toast_logout:'ログアウトしました',
    toast_profile:'プロフィールを保存しました！',
    toast_no_poster:'この求人の投稿者情報がないためDMできません',
    toast_self_dm:'自分が投稿した求人にはDMできません',
    toast_self_dm2:'自分自身にはDMできません',
    toast_new_app:'📨 新しい応募が届きました！',
    toast_closed:'この求人は募集終了です',
    eng_basic:'英語初級OK', eng_none:'英語ほぼ不要', eng_inter:'Intermediate以上',
    not_set:'未設定', parts:'件', edit_title:'求人を編集する',
  },
  en: {
    nav_home:'Home', nav_jobs:'Jobs', nav_staff:'Staff', nav_dm:'DM', nav_profile:'Profile',
    tagline:'Find your perfect job in Sydney today',
    section_nearby:'Jobs Near You', section_saved:'Saved Jobs',
    login_cta_title:'Log in to access all features',
    login_cta_desc:'Save jobs, apply, and use real-time messaging.',
    profile_completion:'Profile Completion',
    profile_hint:'Add your photo, visa expiry and availability to boost applications.',
    complete_profile:'Complete Your Profile',
    quick_jobs:"Today's Jobs", quick_jobs_sub:'Browse all listings',
    quick_post:'Post a Job', quick_post_sub:'For employers',
    search_jobs:'Find Jobs', keyword_ph:'Search keywords',
    all_areas:'All areas', eng_cond:'English level', post_btn:'＋ Post Job',
    no_jobs:'No jobs found.',
    view_detail:'View Details', save:'♡ Save', saved_btn:'♥ Saved',
    loc_tbd:'Location TBD', salary_tbd:'Rate TBD', no_eng:'No requirement',
    back_jobs:'← Back to Jobs',
    apply:'Apply Now', applied_done:'✓ Applied', applying:'Applying...',
    apply_msg:'Message (optional)', apply_ph:'Introduce yourself or mention preferred shifts...',
    send_apply:'Submit Application', cancel:'Cancel',
    view_map:'📍 View on Google Maps', dm_btn:'💬 Message',
    badge_active:'Hiring', badge_closed:'Closed',
    post_title:'Post a Job', post_login_title:'Login required to post',
    post_login_desc:'Sign in with Google to post job listings.',
    f_title:'Job Title *', f_company:'Business Name *', f_location:'Location',
    f_salary:'Hourly Rate', f_eng:'English Requirement', f_desc:'Job Description', f_img:'Photo',
    f_categories:'Job Type (up to 5)',
    save_btn:'Save', saving:'Saving...',
    required_err:'Job title and business name are required.', job_saved:'Job posted successfully.',
    find_staff:'Find Staff', staff_desc:'Browse staff candidates available in Sydney.',
    no_staff:'No staff profiles yet.', contact:'💬 Contact', visa_lbl:'🛂 Visa Expiry:',
    dm_title:'Messages', dm_login_title:'Log in to use messages',
    no_dm:'No messages yet.', no_dm_hint:'Tap "Message" on a job to get started.',
    back_dm:'← Back to Messages', type_msg:'Type a message', send:'Send',
    first_msg:'Send your first message 👋', loading:'Loading...',
    logout:'Logout',
    tab_profile:'Profile', tab_applied:'Applied', tab_saved:'Saved', tab_posted:'My Listings',
    change_photo:'📷 Change Photo', photo_pending:'Save to apply changes',
    f_name:'Name', f_eng_level:'English Level', f_avail:'Availability',
    f_job_categories:'Preferred Job Types (up to 5)',
    f_visa:'Visa Expiry', f_bio:'Bio',
    no_applied:'No applications yet.', no_saved_jobs:'No saved jobs yet.',
    no_posted:'No job listings yet.', post_first:'Post Your First Job',
    apps_count:'applications', view_apps:'▼ View Applicants', close_apps:'▲ Close',
    no_apps:'No applicants yet.', hire:'✓ Hire', reject:'✗ Reject',
    st_accepted:'Hired', st_rejected:'Rejected', st_pending:'Pending',
    b_accepted:'✓ Hired', b_rejected:'✗ Rejected', b_pending:'⏳ Pending',
    edit_job:'✏️ Edit', delete_job:'🗑 Delete', close_job:'Close Listing', reopen_job:'Reopen Listing',
    confirm_del:'Delete this job listing?', job_deleted:'Job deleted.',
    status_updated:'Job status updated', post_new:'＋ Post New Job',
    login_title:'Sign in to WorkMate',
    login_sub:'Job matching for international students in Sydney',
    login_google:'Sign in with Google', guest:'← Continue as guest',
    login_profile:'Log in to create your profile',
    login_profile_desc:'View saved jobs and application history here.',
    signup_tab:'Sign Up', login_tab:'Log In',
    f_email:'Email', f_password:'Password', f_displayname:'Display Name',
    signup_btn:'Create Account', login_btn:'Log In',
    or_google:'or',
    err_required:'Please fill in name, email and password',
    err_password_short:'Password must be at least 6 characters',
    signup_ok:'Account created!',
    check_email:'Check your email and click the confirmation link.',
    toast_login:'Login required', toast_applied_already:'Already applied',
    toast_applied_ok:'Application sent!', toast_logout:'Logged out',
    toast_profile:'Profile saved!',
    toast_no_poster:'Cannot message: poster info unavailable',
    toast_self_dm:'Cannot message your own listing',
    toast_self_dm2:'Cannot message yourself',
    toast_new_app:'📨 New application received!',
    toast_closed:'This job is no longer accepting applications',
    eng_basic:'Basic English OK', eng_none:'No English needed', eng_inter:'Intermediate+',
    not_set:'Not set', parts:'', edit_title:'Edit Job',
  }
}

const LangCtx = createContext({ lang:'ja', setLang:()=>{}, t:T.ja })
const useT = () => useContext(LangCtx)

// ─── 職種マスタ ───────────────────────────────
const JOB_CATEGORIES = [
  { group:'FOH（ホール・接客）', en:'FOH – Front of House',
    items:[
      {ja:'ウェイター・ウェイトレス', en:'Waiter / Waitress'},
      {ja:'フロアスタッフ',           en:'Floor Staff'},
      {ja:'ホスト・ホステス',         en:'Host / Hostess'},
      {ja:'ランナー（料理運び）',     en:'Food Runner'},
      {ja:'バリスタ',                 en:'Barista'},
      {ja:'バーテンダー',             en:'Bartender'},
      {ja:'カクテルバー',             en:'Cocktail Bar'},
      {ja:'レジ・キャッシャー',       en:'Cashier'},
    ]},
  { group:'BOH（キッチン・調理）', en:'BOH – Back of House',
    items:[
      {ja:'キッチンハンド',           en:'Kitchen Hand'},
      {ja:'ライン・コック',           en:'Line Cook'},
      {ja:'プレップ・クック',         en:'Prep Cook'},
      {ja:'シェフ',                   en:'Chef'},
      {ja:'スーシェフ',               en:'Sous Chef'},
      {ja:'ペイストリーシェフ',       en:'Pastry Chef'},
      {ja:'ディッシュウォッシャー',   en:'Dishwasher'},
      {ja:'ストア・マン（食材管理）', en:'Storeroom / Stock'},
    ]},
  { group:'飲食ジャンル・業態',  en:'Cuisine & Venue Type',
    items:[
      {ja:'カフェ・コーヒーショップ', en:'Café / Coffee Shop'},
      {ja:'居酒屋・和食レストラン',   en:'Izakaya / Japanese Restaurant'},
      {ja:'寿司・寿司屋',             en:'Sushi Restaurant'},
      {ja:'ラーメン・麺類',           en:'Ramen / Noodle Shop'},
      {ja:'焼肉・BBQ',                en:'BBQ / Korean BBQ'},
      {ja:'洋食・ダイニング',         en:'Western / Fine Dining'},
      {ja:'中華・アジア料理',         en:'Chinese / Asian Cuisine'},
      {ja:'ピザ・イタリアン',         en:'Pizza / Italian'},
      {ja:'ベーカリー・パン屋',       en:'Bakery'},
      {ja:'ファストフード',           en:'Fast Food'},
      {ja:'フードコート・フードホール',en:'Food Court / Food Hall'},
      {ja:'デリバリー・テイクアウト', en:'Delivery / Takeaway'},
      {ja:'ケータリング・イベント',   en:'Catering / Events'},
      {ja:'バー・パブ',               en:'Bar / Pub'},
      {ja:'ナイトクラブ・ラウンジ',   en:'Nightclub / Lounge'},
    ]},
  { group:'販売・小売',      en:'Retail & Sales',
    items:[
      {ja:'コンビニ・スーパー',en:'Convenience / Supermarket'},
      {ja:'アパレル',          en:'Apparel / Fashion'},
      {ja:'ドラッグストア',    en:'Pharmacy / Drugstore'},
      {ja:'免税店',            en:'Duty Free'},
      {ja:'家電・雑貨',        en:'Electronics / Goods'},
    ]},
  { group:'ホテル・サービス',en:'Hotel & Service',
    items:[
      {ja:'ホテル・宿泊',      en:'Hotel / Accommodation'},
      {ja:'受付・フロント',    en:'Receptionist / Front desk'},
      {ja:'清掃・ハウスキーピング', en:'Cleaning / Housekeeping'},
      {ja:'ツアーガイド',      en:'Tour Guide'},
      {ja:'旅行・観光',        en:'Travel & Tourism'},
    ]},
  { group:'オフィス・IT',    en:'Office & IT',
    items:[
      {ja:'事務・データ入力',  en:'Admin / Data Entry'},
      {ja:'翻訳・通訳',        en:'Translation / Interpretation'},
      {ja:'IT・プログラミング',en:'IT / Programming'},
      {ja:'マーケティング・SNS',en:'Marketing / SNS'},
      {ja:'営業',              en:'Sales'},
    ]},
  { group:'教育',            en:'Education',
    items:[
      {ja:'日本語教師',        en:'Japanese Teacher'},
      {ja:'家庭教師・塾',      en:'Tutor'},
      {ja:'保育・チャイルドケア',en:'Childcare'},
    ]},
  { group:'美容・ヘルス',    en:'Beauty & Health',
    items:[
      {ja:'美容師・ヘアサロン',en:'Hair Salon'},
      {ja:'ネイリスト',        en:'Nail Technician'},
      {ja:'エステ・スパ',      en:'Beauty / Spa'},
      {ja:'マッサージ・整体',  en:'Massage / Therapy'},
    ]},
  { group:'エンタメ・クリエイティブ', en:'Entertainment & Creative',
    items:[
      {ja:'イベントスタッフ',  en:'Event Staff'},
      {ja:'写真・映像',        en:'Photography / Video'},
      {ja:'音楽・DJ',          en:'Music / DJ'},
    ]},
  { group:'農業・アウトドア',en:'Agriculture & Outdoor',
    items:[
      {ja:'ファームワーク・農業',en:'Farm Work'},
      {ja:'フルーツピッキング',en:'Fruit Picking'},
      {ja:'漁業',              en:'Fishing'},
    ]},
  { group:'物流・製造',      en:'Logistics & Manufacturing',
    items:[
      {ja:'倉庫・ピッキング',  en:'Warehouse'},
      {ja:'配達・ドライバー',  en:'Delivery / Driver'},
      {ja:'工場・製造',        en:'Factory / Manufacturing'},
      {ja:'引越し',            en:'Moving / Removals'},
    ]},
  { group:'その他',          en:'Other',
    items:[
      {ja:'ベビーシッター',    en:'Babysitter'},
      {ja:'ペットシッター',    en:'Pet Sitter'},
      {ja:'建設・大工',        en:'Construction'},
      {ja:'その他',            en:'Other'},
    ]},
]

// カンマ区切り文字列 ↔ 配列
const parseCats  = s => s ? s.split(',').map(x => x.trim()).filter(Boolean) : []
const formatCats = a => a.join(',')

// CategoryPicker コンポーネント
function CategoryPicker({ value, onChange, max = 5 }) {
  const { lang } = useT()
  const selected = parseCats(value)

  function toggle(jaName) {
    const next = selected.includes(jaName)
      ? selected.filter(x => x !== jaName)
      : selected.length < max ? [...selected, jaName] : selected
    onChange(formatCats(next))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {JOB_CATEGORIES.map(({ group, en, items }) => (
        <div key={group}>
          <p style={{ margin:'0 0 6px', fontSize:12, fontWeight:700, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'.06em' }}>
            {lang === 'ja' ? group : en}
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {items.map(({ ja, en: enLabel }) => {
              const active = selected.includes(ja)
              return (
                <button key={ja} type="button" onClick={() => toggle(ja)} style={{
                  padding:'7px 14px', borderRadius:999, fontSize:13, fontWeight:700,
                  border: active ? 'none' : '1px solid var(--border2)',
                  background: active ? 'linear-gradient(135deg,#1d6bd8,#7c3aed)' : 'var(--bg2)',
                  color: active ? 'white' : 'var(--muted2)',
                  boxShadow: active ? '0 0 10px rgba(88,166,255,0.25)' : 'none',
                  transition:'all .15s',
                }}>
                  {lang === 'ja' ? ja : enLabel}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {selected.length > 0 && (
        <p style={{ margin:0, fontSize:13, color:'var(--accent)' }}>
          ✓ {selected.length}/{max}件選択中: {selected.join('・')}
        </p>
      )}
    </div>
  )
}

const fmt = (d, lang='ja') =>
  new Date(d).toLocaleString(lang === 'ja' ? 'ja-JP' : 'en-AU',
    { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })

// ═════════════════════════════════════════════
//  App
// ═════════════════════════════════════════════
function App() {
  const [lang, setLang]     = useState(() => localStorage.getItem('wm_lang') || 'ja')
  const t = T[lang]
  const changeLang = l => { setLang(l); localStorage.setItem('wm_lang', l) }

  const [page, setPage]               = useState('home')
  const [session, setSession]         = useState(null)
  const [profile, setProfile]         = useState(null)
  const [jobs, setJobs]               = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [toast, setToast]             = useState('')
  const [savedJobIds, setSavedJobIds] = useState([])
  const [applications, setApplications] = useState([])
  const [postedJobs, setPostedJobs]   = useState([])
  const [search, setSearch]           = useState('')
  const [area, setArea]               = useState('')
  const [english, setEnglish]         = useState('')
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId]   = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [editingJob, setEditingJob]   = useState(null)

  const notify = useCallback((msg, ms=3000) => {
    setToast(msg); setTimeout(() => setToast(''), ms)
  }, [])

  // ── 認証 ──────────────────────────────────
  useEffect(() => {
    // PKCE: URLに ?code= がある場合は明示的にコード交換してセッションを取得
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(async ({ data, error }) => {
        if (error) {
          console.error('Code exchange error:', error)
        } else if (data?.session) {
          setSession(data.session)
          const prof = await loadUserData(data.session.user.id)
          // 初回ログイン（名前未設定）はプロフィール設定へ、それ以外はホームへ
          setPage(!prof?.display_name ? 'profile' : 'home')
        }
        window.history.replaceState({}, document.title, window.location.pathname)
      })
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadUserData(data.session.user.id)
    })
    const { data:{ subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s)
      if (s) {
        const prof = await loadUserData(s.user.id)
        if (event === 'SIGNED_IN') {
          // 初回ログインはプロフィール設定へ、復帰ユーザーはホームへ
          setPage(!prof?.display_name ? 'profile' : 'home')
        }
      } else {
        setProfile(null); setSavedJobIds([]); setApplications([]); setPostedJobs([])
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(uid) {
    const [profRes, savedRes, appRes, convRes, postedRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      supabase.from('saved_jobs').select('job_id').eq('user_id', uid),
      supabase.from('applications').select('*').eq('user_id', uid),
      supabase.from('conversations').select('*')
        .or(`participant_a.eq.${uid},participant_b.eq.${uid}`)
        .order('last_message_at', { ascending:false }),
      supabase.from('jobs')
        .select('*, applications(id, user_id, status, message, created_at, profiles(*))')
        .eq('posted_by', uid).order('id', { ascending:false }),
    ])
    if (profRes.data)   setProfile(profRes.data)
    if (savedRes.data)  setSavedJobIds(savedRes.data.map(r => r.job_id))
    if (appRes.data)    setApplications(appRes.data)
    if (convRes.data) {
      setConversations(convRes.data)
      fetchUnread(uid, convRes.data.map(c => c.id))
    }
    if (postedRes.data) setPostedJobs(postedRes.data)
    return profRes.data  // ログイン後の遷移判定に使う
  }

  async function fetchUnread(uid, convIds) {
    if (!convIds.length) { setUnreadCount(0); return }
    const { count } = await supabase.from('messages')
      .select('*', { count:'exact', head:true })
      .eq('read', false).neq('sender_id', uid).in('conversation_id', convIds)
    setUnreadCount(count || 0)
  }

  // ── 求人リアルタイム ───────────────────────
  useEffect(() => {
    loadJobs()
    const ch = supabase.channel('jobs-rt')
      .on('postgres_changes', { event:'*', schema:'public', table:'jobs' }, loadJobs)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  async function loadJobs() {
    const { data } = await supabase.from('jobs').select('*').order('id', { ascending:false })
    if (data) setJobs(data)
  }

  // ── 会話リアルタイム ───────────────────────
  useEffect(() => {
    if (!session) return
    const uid = session.user.id
    const ch = supabase.channel('conv-rt')
      .on('postgres_changes', { event:'*', schema:'public', table:'conversations', filter:`participant_a=eq.${uid}` }, () => loadUserData(uid))
      .on('postgres_changes', { event:'*', schema:'public', table:'conversations', filter:`participant_b=eq.${uid}` }, () => loadUserData(uid))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [session])

  // ── 新着応募通知（リアルタイム）──────────────
  useEffect(() => {
    if (!session || !postedJobs.length) return
    const ch = supabase.channel('new-apps-rt')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'applications' }, payload => {
        if (postedJobs.some(j => j.id === payload.new.job_id)) {
          notify(t.toast_new_app)
          loadUserData(session.user.id)
        }
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [session, postedJobs])

  const filteredJobs = useMemo(() => jobs.filter(j => {
    if (j.is_active === false) return false
    const tx = [j.title, j.company, j.location, j.salary, j.english_level, j.description].join(' ').toLowerCase()
    return (!search || tx.includes(search.toLowerCase()))
        && (!area    || j.location      === area)
        && (!english || j.english_level === english)
  }), [jobs, search, area, english])

  // ── アクション ─────────────────────────────
  function openJob(job) { setSelectedJob(job); setPage('job') }

  async function toggleSave(jobId) {
    if (!session) { notify(t.toast_login); return }
    const uid = session.user.id
    if (savedJobIds.includes(jobId)) {
      await supabase.from('saved_jobs').delete().eq('user_id', uid).eq('job_id', jobId)
      setSavedJobIds(p => p.filter(x => x !== jobId))
    } else {
      await supabase.from('saved_jobs').insert({ user_id:uid, job_id:jobId })
      setSavedJobIds(p => [...p, jobId])
    }
  }
  const isSaved = jobId => savedJobIds.includes(jobId)

  async function applyToJob(job, msg) {
    if (!session) { notify(t.toast_login); return false }
    if (job.is_active === false) { notify(t.toast_closed); return false }
    const uid = session.user.id
    if (applications.some(a => a.job_id === job.id)) { notify(t.toast_applied_already); return false }
    const { error } = await supabase.from('applications').insert({ user_id:uid, job_id:job.id, message:msg, status:'pending' })
    if (error) { notify(error.message); return false }
    setApplications(p => [...p, { user_id:uid, job_id:job.id, status:'pending' }])
    notify(t.toast_applied_ok)
    return true
  }
  const hasApplied = jobId => applications.some(a => a.job_id === jobId)

  // ── 求人 DM ────────────────────────────────
  async function startDM(job) {
    if (!session) { notify(t.toast_login); return }
    if (job.is_active === false) { notify(t.toast_closed); return }
    const uid = session.user.id
    const empUid = job.posted_by
    if (!empUid)       { notify(t.toast_no_poster); return }
    if (empUid === uid){ notify(t.toast_self_dm);  return }
    let ex = conversations.find(c => c.job_id === job.id)
    if (!ex) {
      const { data, error } = await supabase.from('conversations').insert({
        job_id:job.id, participant_a:uid, participant_b:empUid,
        company_name:job.company, job_title:job.title,
        last_message:'', last_message_at:new Date().toISOString()
      }).select().single()
      if (error) { notify(error.message); return }
      ex = data; setConversations(p => [data, ...p])
    }
    setActiveConvId(ex.id); setPage('chat')
  }

  // ── スタッフ DM ───────────────────────────
  async function startStaffDM(targetUid, displayName) {
    if (!session) { notify(t.toast_login); return }
    const uid = session.user.id
    if (targetUid === uid) { notify(t.toast_self_dm2); return }
    let ex = conversations.find(c =>
      !c.job_id && (
        (c.participant_a === uid && c.participant_b === targetUid) ||
        (c.participant_a === targetUid && c.participant_b === uid)
      )
    )
    if (!ex) {
      const { data, error } = await supabase.from('conversations').insert({
        participant_a:uid, participant_b:targetUid,
        company_name:displayName, job_title:'Staff',
        last_message:'', last_message_at:new Date().toISOString()
      }).select().single()
      if (error) { notify(error.message); return }
      ex = data; setConversations(p => [data, ...p])
    }
    setActiveConvId(ex.id); setPage('chat')
  }

  // ── 採用・不採用更新 ──────────────────────
  async function updateAppStatus(appId, status) {
    const { error } = await supabase.from('applications').update({ status }).eq('id', appId)
    if (error) { notify(error.message); return }
    if (session) loadUserData(session.user.id)
    notify(status === 'accepted' ? t.hire : status === 'rejected' ? t.reject : t.status_updated)
  }

  // ── 求人ステータス切替 ────────────────────
  async function toggleJobStatus(jobId, isActive) {
    const { error } = await supabase.from('jobs').update({ is_active:!isActive }).eq('id', jobId)
    if (error) { notify(error.message); return }
    if (session) loadUserData(session.user.id)
    await loadJobs()
    notify(t.status_updated)
  }

  // ── 求人削除 ──────────────────────────────
  async function deleteJob(jobId) {
    if (!window.confirm(t.confirm_del)) return
    const { error } = await supabase.from('jobs').delete().eq('id', jobId)
    if (error) { notify(error.message); return }
    if (session) loadUserData(session.user.id)
    await loadJobs()
    notify(t.job_deleted)
  }

  // ── 既読処理 ──────────────────────────────
  async function markConvRead(convId) {
    if (!session) return
    await supabase.from('messages').update({ read:true })
      .eq('conversation_id', convId).eq('read', false).neq('sender_id', session.user.id)
    const convIds = conversations.map(c => c.id)
    fetchUnread(session.user.id, convIds)
  }

  function openMap(loc) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc || 'Sydney')}`, '_blank')
  }

  async function signInGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{ redirectTo: window.location.origin }
    })
    if (error) notify(error.message)
  }

  async function signOut() {
    await supabase.auth.signOut(); setPage('home'); notify(t.toast_logout)
  }

  const avatarLetter = profile?.display_name?.[0]?.toUpperCase()
    || session?.user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <LangCtx.Provider value={{ lang, setLang:changeLang, t }}>
      {/* 言語切替ボタン（固定）*/}
      <button className="lang-toggle" onClick={() => changeLang(lang === 'ja' ? 'en' : 'ja')}>
        {lang === 'ja' ? 'EN' : 'JP'}
      </button>

      {toast && <div className="toast">{toast}<button onClick={() => setToast('')}>×</button></div>}

      {page === 'home'    && <Home jobs={jobs} openJob={openJob} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} session={session} profile={profile} avatarLetter={avatarLetter} />}
      {page === 'jobs'    && <Jobs jobs={filteredJobs} openJob={openJob} search={search} setSearch={setSearch} area={area} setArea={setArea} english={english} setEnglish={setEnglish} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} />}
      {page === 'post'    && <PostJob setPage={setPage} loadJobs={loadJobs} notify={notify} session={session} signInGoogle={signInGoogle} />}
      {page === 'job' && selectedJob && <JobDetail job={selectedJob} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} startDM={startDM} applyToJob={applyToJob} hasApplied={hasApplied} openMap={openMap} session={session} />}
      {page === 'staff'   && <Staff setPage={setPage} session={session} startStaffDM={startStaffDM} isEmployer={session && postedJobs.length > 0} />}
      {page === 'dm'      && <DM conversations={conversations} setActiveConvId={setActiveConvId} setPage={setPage} session={session} signInGoogle={signInGoogle} />}
      {page === 'chat'    && <Chat convId={activeConvId} setPage={setPage} session={session} conversations={conversations} setConversations={setConversations} notify={notify} markConvRead={markConvRead} lang={lang} />}
      {page === 'profile' && <Profile setPage={setPage} session={session} profile={profile} setProfile={setProfile} notify={notify} signInGoogle={signInGoogle} signOut={signOut} applications={applications} jobs={jobs} isSaved={isSaved} openJob={openJob} savedJobIds={savedJobIds} postedJobs={postedJobs} updateAppStatus={updateAppStatus} toggleJobStatus={toggleJobStatus} deleteJob={deleteJob} setEditingJob={setEditingJob} />}
      {page === 'login'   && <Login signInGoogle={signInGoogle} setPage={setPage} notify={notify} />}

      {editingJob && <EditJobModal job={editingJob} onClose={() => setEditingJob(null)} notify={notify} session={session} loadJobs={loadJobs} loadUserData={() => session && loadUserData(session.user.id)} />}

      <nav className="bottom">
        <button className={page==='home'?'active':''} onClick={() => setPage('home')}>🏠<br/><small>{t.nav_home}</small></button>
        <button className={['jobs','job','post'].includes(page)?'active':''} onClick={() => setPage('jobs')}>💼<br/><small>{t.nav_jobs}</small></button>
        {/* 雇用主（求人投稿者）のみスタッフタブを表示 */}
        {session && postedJobs.length > 0 && (
          <button className={page==='staff'?'active':''} onClick={() => setPage('staff')}>👥<br/><small>{t.nav_staff}</small></button>
        )}
        <button className={['dm','chat'].includes(page)?'active':''} onClick={() => setPage('dm')} style={{ position:'relative' }}>
          💬<br/><small>{t.nav_dm}</small>
          {unreadCount > 0 && <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>
        <button className={page==='profile'?'active':''} onClick={() => setPage('profile')}>👤<br/><small>{t.nav_profile}</small></button>
      </nav>
    </LangCtx.Provider>
  )
}

// ═════════════════════════════════════════════
//  Login
// ═════════════════════════════════════════════
function Login({ signInGoogle, setPage, notify }) {
  const { t } = useT()
  const [tab,      setTab]      = useState('signup')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [busy,     setBusy]     = useState(false)
  const [done,     setDone]     = useState(false)

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password) { notify(t.err_required); return }
    if (password.length < 6) { notify(t.err_password_short); return }
    setBusy(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    setBusy(false)
    if (error) { notify(error.message); return }
    setDone(true)
  }

  async function handleLogin() {
    if (!email.trim() || !password) { notify(t.err_required); return }
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (error) { notify(error.message) }
    // 成功時は onAuthStateChange が page を切り替える
  }

  if (done) return (
    <main style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'80vh', gap:16, textAlign:'center', padding:'0 24px' }}>
      <div style={{ fontSize:56 }}>📧</div>
      <h2>{t.signup_ok}</h2>
      <p className="muted">{t.check_email}</p>
      <button onClick={() => setDone(false)} style={{ marginTop:8 }}>{t.login_tab}</button>
    </main>
  )

  return (
    <main style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'80vh', padding:'0 24px' }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🤝</div>
          <h1 style={{ margin:'0 0 6px' }}>{t.login_title}</h1>
          <p className="muted" style={{ margin:0 }}>{t.login_sub}</p>
        </div>

        {/* タブ */}
        <div style={{ display:'flex', background:'var(--bg2)', borderRadius:'var(--radius)', padding:4, marginBottom:22, border:'1px solid var(--border)' }}>
          {[['signup', t.signup_tab], ['login', t.login_tab]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex:1, borderRadius:10, border:'none', padding:'10px 0', fontWeight:700, fontSize:14,
              background: tab===key ? 'var(--bg4)' : 'transparent',
              color: tab===key ? 'var(--text)' : 'var(--muted2)',
              boxShadow: tab===key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              transition:'all .15s'
            }}>{label}</button>
          ))}
        </div>

        <div className="form">
          {tab === 'signup' && (
            <label>{t.f_displayname}
              <input value={name} onChange={e => setName(e.target.value)} placeholder="山田 太郎" />
            </label>
          )}
          <label>{t.f_email}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>{t.f_password}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6文字以上" />
          </label>
          <button className="primary" style={{ width:'100%', padding:'14px', fontSize:16, marginTop:4 }}
            onClick={tab==='signup' ? handleSignup : handleLogin} disabled={busy}>
            {busy ? '...' : tab==='signup' ? t.signup_btn : t.login_btn}
          </button>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0', color:'var(--muted)' }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
          <span style={{ fontSize:13 }}>{t.or_google}</span>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
        </div>

        <button onClick={signInGoogle} style={{ width:'100%', padding:'13px', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontSize:15 }}>
          <GoogleIcon /> {t.login_google}
        </button>

        <button onClick={() => setPage('home')} style={{ width:'100%', marginTop:12, background:'transparent', border:'none', color:'var(--muted2)', fontSize:14 }}>
          {t.guest}
        </button>
      </div>
    </main>
  )
}

// ═════════════════════════════════════════════
//  Home
// ═════════════════════════════════════════════
function Home({ jobs, openJob, setPage, isSaved, toggleSave, session, profile, avatarLetter }) {
  const { t } = useT()
  const savedJobsList = jobs.filter(j => isSaved(j.id))
  const displayName   = profile?.display_name || session?.user?.email?.split('@')[0] || 'Guest'
  const fields = [profile?.display_name, profile?.bio, profile?.availability, profile?.visa_expiry, profile?.avatar_url]
  const pct    = Math.round((fields.filter(Boolean).length / fields.length) * 100)
  return (
    <main>
      <section className="hero">
        <div>
          <p className="muted">Good day 👋</p>
          <h1>Hi, {displayName.split(' ')[0]}</h1>
          <p className="muted">{t.tagline}</p>
        </div>
        <button className="avatar avatarBtn" onClick={() => setPage('profile')} aria-label="profile">
          {profile?.avatar_url
            ? <img src={profile.avatar_url} style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }} alt="avatar" />
            : avatarLetter}
        </button>
      </section>
      <section className="quick">
        <button onClick={() => setPage('jobs')}>💼 {t.quick_jobs}<span>{t.quick_jobs_sub}</span></button>
        <button onClick={() => setPage('post')}>🏪 {t.quick_post}<span>{t.quick_post_sub}</span></button>
      </section>
      {session && pct < 100 && (
        <section className="card">
          <h2>{t.profile_completion} {pct}%</h2>
          <div className="bar"><span style={{ width:pct+'%' }} /></div>
          <p className="muted">{t.profile_hint}</p>
          <button className="primary" onClick={() => setPage('profile')}>{t.complete_profile}</button>
        </section>
      )}
      {!session && (
        <section className="card" style={{ textAlign:'center' }}>
          <p style={{ fontSize:32, marginBottom:8 }}>🔑</p>
          <h2>{t.login_cta_title}</h2>
          <p className="muted">{t.login_cta_desc}</p>
          <button className="primary" onClick={() => setPage('login')}>{t.login_google}</button>
        </section>
      )}
      <Section title={t.section_nearby}>
        <JobGrid jobs={jobs.filter(j => j.is_active !== false).slice(0, 4)} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />
      </Section>
      <Section title={t.section_saved}>
        {savedJobsList.length
          ? <JobGrid jobs={savedJobsList} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />
          : <div className="empty">{t.no_saved_jobs}</div>}
      </Section>
    </main>
  )
}

// ═════════════════════════════════════════════
//  Jobs
// ═════════════════════════════════════════════
function Jobs({ jobs, openJob, search, setSearch, area, setArea, english, setEnglish, setPage, isSaved, toggleSave }) {
  const { t } = useT()
  return (
    <main>
      <header className="sticky">
        <h1>{t.search_jobs}</h1>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.keyword_ph} />
        <div className="filters">
          <select value={area} onChange={e => setArea(e.target.value)}>
            <option value="">{t.all_areas}</option>
            <option>Sydney</option><option>Sydney CBD</option><option>CBD</option>
            <option>Bondi</option><option>Chatswood</option>
          </select>
          <select value={english} onChange={e => setEnglish(e.target.value)}>
            <option value="">{t.eng_cond}</option>
            <option>{t.eng_basic}</option>
            <option>{t.eng_none}</option>
            <option>{t.eng_inter}</option>
          </select>
        </div>
        <button className="primary" onClick={() => setPage('post')}>{t.post_btn}</button>
      </header>
      <JobGrid jobs={jobs} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />
    </main>
  )
}

// ═════════════════════════════════════════════
//  JobGrid / JobCard
// ═════════════════════════════════════════════
function JobGrid({ jobs, openJob, isSaved, toggleSave }) {
  const { t } = useT()
  if (!jobs.length) return <div className="empty">{t.no_jobs}</div>
  return <div className="grid">{jobs.map(j => <JobCard key={j.id} job={j} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />)}</div>
}

function JobCard({ job, openJob, isSaved, toggleSave }) {
  const { t } = useT()
  return (
    <article className="job" onClick={() => openJob(job)}>
      <div className="photo">{job.image_url ? <img src={job.image_url} alt={job.company} /> : '💼'}</div>
      <h2>{job.company || 'No company'}</h2>
      <p className="muted">{job.title}</p>
      <p className="muted" style={{ fontSize:13 }}>{job.location || t.loc_tbd} / {job.salary || t.salary_tbd}</p>
      <div className="tags">
        {parseCats(job.categories).slice(0,2).map(c => <span key={c}>{c}</span>)}
        <span>{job.english_level || t.no_eng}</span>
        {job.is_active === false && <span style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', padding:'4px 10px', borderRadius:999, fontSize:12, fontWeight:700 }}>{t.badge_closed}</span>}
      </div>
      <div className="actions" onClick={e => e.stopPropagation()}>
        <button className="primary" onClick={() => openJob(job)}>{t.view_detail}</button>
        <button className={isSaved(job.id)?'fav':''} onClick={() => toggleSave(job.id)}>
          {isSaved(job.id) ? t.saved_btn : t.save}
        </button>
      </div>
    </article>
  )
}

// ═════════════════════════════════════════════
//  JobDetail
// ═════════════════════════════════════════════
function JobDetail({ job, setPage, isSaved, toggleSave, startDM, applyToJob, hasApplied, openMap, session }) {
  const { t } = useT()
  const [showApply, setShowApply] = useState(false)
  const [applyMsg,  setApplyMsg]  = useState('')
  const [busy,      setBusy]      = useState(false)

  async function handleApply() {
    setBusy(true)
    const ok = await applyToJob(job, applyMsg)
    setBusy(false)
    if (ok) setShowApply(false)
  }

  const isClosed = job.is_active === false

  return (
    <main>
      <button onClick={() => setPage('jobs')}>{t.back_jobs}</button>
      <section className="detail card">
        <div className="photo big">{job.image_url ? <img src={job.image_url} alt={job.company} /> : '💼'}</div>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <h1 style={{ margin:0 }}>{job.company}</h1>
          <span style={{ padding:'5px 14px', borderRadius:999, fontSize:13, fontWeight:700,
            background: isClosed ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
            color:      isClosed ? '#f87171' : '#4ade80',
            border:     isClosed ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(34,197,94,0.2)' }}>
            {isClosed ? t.badge_closed : t.badge_active}
          </span>
        </div>
        <p className="muted">{job.title} / {job.location} / {job.salary}</p>
        <div className="tags"><span>{job.english_level}</span><span>{job.location}</span></div>
        <p style={{ lineHeight:1.8, marginTop:12 }}>{job.description}</p>
        <div className="row"><b>{t.f_location}</b><span>{job.location}</span></div>
        <div className="row"><b>{t.f_salary}</b><span>{job.salary}</span></div>
        <div className="row"><b>{t.f_eng}</b><span>{job.english_level}</span></div>
        <button onClick={() => openMap(job.location)} style={{ marginTop:12 }}>{t.view_map}</button>

        {showApply && (
          <div className="card" style={{ marginTop:16 }}>
            <h3>{t.apply_msg}</h3>
            <textarea value={applyMsg} onChange={e => setApplyMsg(e.target.value)} placeholder={t.apply_ph} rows={4} />
            <div className="actions">
              <button className="primary" onClick={handleApply} disabled={busy}>{busy ? t.applying : t.send_apply}</button>
              <button onClick={() => setShowApply(false)}>{t.cancel}</button>
            </div>
          </div>
        )}

        <div className="actions" style={{ marginTop:16 }}>
          {!showApply && !isClosed && (
            <button className="primary"
              onClick={() => session ? setShowApply(true) : setPage('login')}
              disabled={hasApplied(job.id)}>
              {hasApplied(job.id) ? t.applied_done : t.apply}
            </button>
          )}
          <button className={isSaved(job.id)?'fav':''} onClick={() => toggleSave(job.id)}>
            {isSaved(job.id) ? t.saved_btn : t.save}
          </button>
          {!isClosed && <button onClick={() => startDM(job)}>{t.dm_btn}</button>}
        </div>
      </section>
    </main>
  )
}

// ═════════════════════════════════════════════
//  PostJob
// ═════════════════════════════════════════════
const emptyJob = { title:'', company:'', location:'', salary:'', english_level:'英語初級OK', description:'', image_url:'', categories:'' }

function PostJob({ setPage, loadJobs, notify, session, signInGoogle }) {
  const { t } = useT()
  const [job,  setJob]  = useState(emptyJob)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!session) return (
    <main style={{ textAlign:'center', paddingTop:60 }}>
      <p style={{ fontSize:48 }}>🔒</p>
      <h2>{t.post_login_title}</h2>
      <p className="muted" style={{ marginBottom:20 }}>{t.post_login_desc}</p>
      <button className="primary" onClick={signInGoogle}>{t.login_google}</button>
      <br />
      <button style={{ marginTop:12, background:'transparent', border:'none', color:'var(--muted2)' }} onClick={() => setPage('jobs')}>← {t.nav_jobs}</button>
    </main>
  )

  function update(k, v) { setJob(p => ({ ...p, [k]:v })) }

  async function uploadImage() {
    if (!file) return job.image_url
    const ext  = file.name.split('.').pop()
    const path = `jobs/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('job-images').upload(path, file)
    if (error) throw error
    return supabase.storage.from('job-images').getPublicUrl(path).data.publicUrl
  }

  async function submit() {
    if (!job.title || !job.company) { notify(t.required_err); return }
    setBusy(true)
    try {
      const image_url = await uploadImage()
      const { error } = await supabase.from('jobs').insert([{ ...job, image_url, posted_by:session.user.id, is_active:true }])
      if (error) throw error
      notify(t.job_saved); setJob(emptyJob); setFile(null)
      await loadJobs(); setPage('jobs')
    } catch(e) { notify(e.message) }
    finally { setBusy(false) }
  }

  return (
    <main>
      <h1>{t.post_title}</h1>
      <section className="card form">
        <label>{t.f_title}<input value={job.title} onChange={e => update('title', e.target.value)} placeholder="Kitchen staff wanted" /></label>
        <label>{t.f_company}<input value={job.company} onChange={e => update('company', e.target.value)} placeholder="Sakura Kitchen" /></label>
        <label>{t.f_location}<input value={job.location} onChange={e => update('location', e.target.value)} placeholder="Sydney CBD" /></label>
        <label>{t.f_salary}<input value={job.salary} onChange={e => update('salary', e.target.value)} placeholder="$28/h" /></label>
        <label>{t.f_categories}
          <CategoryPicker value={job.categories} onChange={v => update('categories', v)} max={5} />
        </label>
        <label>{t.f_eng}
          <select value={job.english_level} onChange={e => update('english_level', e.target.value)}>
            <option>{t.eng_basic}</option><option>{t.eng_none}</option><option>{t.eng_inter}</option>
          </select>
        </label>
        <label>{t.f_desc}<textarea value={job.description} onChange={e => update('description', e.target.value)} placeholder="仕事内容、勤務時間、条件など..." /></label>
        <label>{t.f_img}<input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
        <button className="primary" onClick={submit} disabled={busy}>{busy ? t.saving : t.save_btn}</button>
      </section>
    </main>
  )
}

// ═════════════════════════════════════════════
//  EditJobModal
// ═════════════════════════════════════════════
function EditJobModal({ job, onClose, notify, session, loadJobs, loadUserData }) {
  const { t } = useT()
  const [form, setForm] = useState({ title:job.title||'', company:job.company||'', location:job.location||'', salary:job.salary||'', english_level:job.english_level||'英語初級OK', description:job.description||'' })
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  function upd(k, v) { setForm(p => ({ ...p, [k]:v })) }

  async function save() {
    if (!form.title || !form.company) { notify(t.required_err); return }
    setBusy(true)
    try {
      let image_url = job.image_url
      if (file) {
        const ext  = file.name.split('.').pop()
        const path = `jobs/${Date.now()}.${ext}`
        const { error:upErr } = await supabase.storage.from('job-images').upload(path, file)
        if (upErr) throw upErr
        image_url = supabase.storage.from('job-images').getPublicUrl(path).data.publicUrl
      }
      const { error } = await supabase.from('jobs').update({ ...form, image_url }).eq('id', job.id)
      if (error) throw error
      notify(t.job_saved); await loadJobs(); await loadUserData(); onClose()
    } catch(e) { notify(e.message) }
    finally { setBusy(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h2 style={{ margin:0 }}>{t.edit_title}</h2>
          <button onClick={onClose} style={{ fontSize:20, padding:'4px 10px' }}>×</button>
        </div>
        <div className="form">
          <label>{t.f_title}<input value={form.title} onChange={e => upd('title', e.target.value)} /></label>
          <label>{t.f_company}<input value={form.company} onChange={e => upd('company', e.target.value)} /></label>
          <label>{t.f_location}<input value={form.location} onChange={e => upd('location', e.target.value)} /></label>
          <label>{t.f_salary}<input value={form.salary} onChange={e => upd('salary', e.target.value)} /></label>
          <label>{t.f_eng}
            <select value={form.english_level} onChange={e => upd('english_level', e.target.value)}>
              <option>{t.eng_basic}</option><option>{t.eng_none}</option><option>{t.eng_inter}</option>
            </select>
          </label>
          <label>{t.f_desc}<textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={4} /></label>
          <label>{t.f_img}<input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
          <button className="primary" onClick={save} disabled={busy}>{busy ? t.saving : t.save_btn}</button>
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════
//  AvailabilityPicker
// ═════════════════════════════════════════════
const DAYS_JA = ['月','火','水','木','金','土','日']
const DAYS_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HOURS = Array.from({length:19}, (_,i) => {
  const h = i + 6  // 6:00〜24:00
  return `${String(h).padStart(2,'0')}:00`
})

// "月・水・金 09:00〜18:00" → { days:['月','水','金'], start:'09:00', end:'18:00' }
function parseAvailability(str) {
  if (!str) return { days:[], start:'09:00', end:'18:00' }
  const m = str.match(/^([月火水木金土日Mon Tue Wed Thu Fri Sat Sun・,]+)\s+(\d{2}:\d{2})〜(\d{2}:\d{2})/)
  if (m) {
    const days = m[1].split(/[・,\s]+/).filter(Boolean)
    return { days, start: m[2], end: m[3] }
  }
  return { days:[], start:'09:00', end:'18:00' }
}

// { days, start, end } → "月・水・金 09:00〜18:00"
function formatAvailability({ days, start, end }) {
  if (!days.length) return ''
  return `${days.join('・')} ${start}〜${end}`
}

function AvailabilityPicker({ value, onChange }) {
  const { lang } = useT()
  const parsed = useMemo(() => parseAvailability(value), [value])
  const days   = parsed.days
  const DAYS   = lang === 'ja' ? DAYS_JA : DAYS_EN

  function toggleDay(d) {
    const next = days.includes(d) ? days.filter(x => x !== d) : [...days, d]
    // 曜日の順番を固定
    const ordered = DAYS_JA.filter(x => next.includes(x))
    onChange(formatAvailability({ days: ordered, start: parsed.start, end: parsed.end }))
  }
  function setTime(key, val) {
    onChange(formatAvailability({ days, start: parsed.start, end: parsed.end, [key]: val }))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {/* 曜日ボタン */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {DAYS_JA.map((d, i) => {
          const active = days.includes(d)
          const isWeekend = i >= 5
          return (
            <button key={d} type="button" onClick={() => toggleDay(d)} style={{
              padding:'8px 0', width:44, borderRadius:10, fontWeight:700, fontSize:14,
              border: active ? 'none' : '1px solid var(--border2)',
              background: active
                ? isWeekend ? 'linear-gradient(135deg,#be185d,#9333ea)' : 'linear-gradient(135deg,#1d6bd8,#7c3aed)'
                : 'var(--bg2)',
              color: active ? 'white' : 'var(--muted2)',
              boxShadow: active ? '0 0 12px rgba(88,166,255,0.3)' : 'none',
              transition:'all .15s'
            }}>
              {lang === 'ja' ? d : DAYS_EN[i]}
            </button>
          )
        })}
      </div>
      {/* 時間帯 */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <select value={parsed.start} onChange={e => setTime('start', e.target.value)}
          style={{ flex:1, padding:'10px 12px' }}>
          {HOURS.map(h => <option key={h}>{h}</option>)}
        </select>
        <span style={{ color:'var(--muted2)', fontWeight:700 }}>〜</span>
        <select value={parsed.end} onChange={e => setTime('end', e.target.value)}
          style={{ flex:1, padding:'10px 12px' }}>
          {HOURS.map(h => <option key={h}>{h}</option>)}
        </select>
      </div>
      {value && (
        <p style={{ margin:0, fontSize:13, color:'var(--accent)' }}>📅 {value}</p>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════
//  Staff
// ═════════════════════════════════════════════
function Staff({ setPage, session, startStaffDM, isEmployer }) {
  const { t, lang } = useT()
  const [staffList, setStaffList] = useState([])
  const [loading,   setLoading]   = useState(true)

  // 雇用主以外はアクセス不可
  if (!session || !isEmployer) return (
    <main>
      <div className="empty" style={{ marginTop:40 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
        <b style={{ fontSize:18 }}>{lang === 'ja' ? '雇用主専用ページです' : 'Employers Only'}</b>
        <p style={{ marginTop:8 }}>{lang === 'ja'
          ? '求人を1件以上投稿すると閲覧できます。'
          : 'Post a job listing to access this page.'}</p>
        <button className="primary" style={{ marginTop:16 }} onClick={() => setPage('post')}>{t.quick_post}</button>
      </div>
    </main>
  )

  useEffect(() => {
    supabase.from('profiles').select('*')
      .not('display_name', 'is', null)
      .order('updated_at', { ascending:false }).limit(40)
      .then(({ data }) => { if (data) setStaffList(data); setLoading(false) })
  }, [])

  return (
    <main>
      <h1>{t.find_staff}</h1>
      <p className="muted" style={{ marginBottom:16 }}>{t.staff_desc}</p>
      {loading && <SkeletonGrid />}
      {!loading && !staffList.length && <div className="empty">{t.no_staff}</div>}
      <div className="grid">
        {staffList.map(s => (
          <article className="job" key={s.id} style={{ cursor:'default' }}>
            <div className="photo">
              {s.avatar_url ? <img src={s.avatar_url} alt={s.display_name} /> : <span style={{ fontSize:54 }}>👤</span>}
            </div>
            <h2>{s.display_name || 'Anonymous'}</h2>
            {s.english_level && <p className="muted">🗣 {s.english_level}</p>}
            {s.availability   && <p className="muted">📅 {s.availability}</p>}
            {s.visa_expiry    && <p className="muted" style={{ fontSize:12 }}>{t.visa_lbl} {s.visa_expiry}</p>}
            {s.bio && <p className="muted" style={{ fontSize:13, marginTop:6 }}>{s.bio.slice(0,80)}{s.bio.length>80?'…':''}</p>}
            <div className="tags">
              {s.english_level && <span>{s.english_level}</span>}
              {parseCats(s.job_categories).slice(0,3).map(c => <span key={c}>{c}</span>)}
            </div>
            <button className="primary" onClick={() => { if (!session){setPage('login');return}; startStaffDM(s.id, s.display_name||'Staff') }}>
              {t.contact}
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}

// ═════════════════════════════════════════════
//  DM
// ═════════════════════════════════════════════
function DM({ conversations, setActiveConvId, setPage, session, signInGoogle }) {
  const { t, lang } = useT()
  if (!session) return (
    <main style={{ textAlign:'center', paddingTop:40 }}>
      <p style={{ fontSize:40 }}>💬</p>
      <h2>{t.dm_login_title}</h2>
      <button className="primary" style={{ marginTop:16 }} onClick={signInGoogle}>{t.login_google}</button>
    </main>
  )
  return (
    <main>
      <h1>{t.dm_title}</h1>
      {!conversations.length && (
        <div className="empty">{t.no_dm}<br /><small>{t.no_dm_hint}</small></div>
      )}
      {conversations.map(c => (
        <div className="dm" key={c.id} onClick={() => { setActiveConvId(c.id); setPage('chat') }}>
          <div className="avatar">{c.job_title==='Staff'?'👤':'🏪'}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <b>{c.company_name || 'Unknown'}</b>
            <p className="muted" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {c.last_message || c.job_title || t.first_msg}
            </p>
          </div>
          <small className="muted">{c.last_message_at ? fmt(c.last_message_at, lang) : ''}</small>
        </div>
      ))}
    </main>
  )
}

// ═════════════════════════════════════════════
//  Chat
// ═════════════════════════════════════════════
function Chat({ convId, setPage, session, conversations, setConversations, notify, markConvRead, lang }) {
  const { t } = useT()
  const [messages, setMessages] = useState([])
  const [text,     setText]     = useState('')
  const [busy,     setBusy]     = useState(false)
  const [loading,  setLoading]  = useState(true)
  const bottomRef = useRef(null)
  const conv = conversations.find(c => c.id === convId)

  useEffect(() => {
    if (!convId) return
    loadMessages()
    const ch = supabase.channel('chat-'+convId)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${convId}` },
        payload => setMessages(p => [...p, payload.new]))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [convId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function loadMessages() {
    setLoading(true)
    const { data } = await supabase.from('messages').select('*')
      .eq('conversation_id', convId).order('created_at', { ascending:true })
    if (data) setMessages(data)
    setLoading(false)
    markConvRead(convId)
  }

  async function send() {
    if (!text.trim() || busy || !session) return
    setBusy(true)
    const msg = text.trim(); setText('')
    const { error } = await supabase.from('messages')
      .insert({ conversation_id:convId, sender_id:session.user.id, text:msg })
    if (error) { notify(error.message); setText(msg) }
    else {
      const now = new Date().toISOString()
      await supabase.from('conversations').update({ last_message:msg, last_message_at:now }).eq('id', convId)
      setConversations(p => p.map(c => c.id===convId ? { ...c, last_message:msg, last_message_at:now } : c))
    }
    setBusy(false)
  }

  function handleKey(e) { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  if (!conv) return <main><button onClick={() => setPage('dm')}>{t.back_dm}</button><p>Not found.</p></main>

  return (
    <main style={{ paddingBottom:80 }}>
      <button onClick={() => setPage('dm')}>{t.back_dm}</button>
      <section className="chat card">
        <div className="chatHead">
          <div className="avatar">{conv.job_title==='Staff'?'👤':'🏪'}</div>
          <div><b>{conv.company_name}</b><p className="muted">{conv.job_title}</p></div>
        </div>
        <div className="bubbles">
          {loading && <p className="muted" style={{ textAlign:'center' }}>{t.loading}</p>}
          {!loading && !messages.length && <p className="muted" style={{ textAlign:'center', marginTop:40 }}>{t.first_msg}</p>}
          {messages.map(m => (
            <div key={m.id} className={'bubble '+(m.sender_id===session?.user?.id?'me':'them')}>
              {m.text}<small>{fmt(m.created_at, lang)}</small>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="compose">
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKey} placeholder={t.type_msg} />
          <button className="primary" onClick={send} disabled={busy||!text.trim()}>{t.send}</button>
        </div>
      </section>
    </main>
  )
}

// ═════════════════════════════════════════════
//  Profile
// ═════════════════════════════════════════════
function Profile({ setPage, session, profile, setProfile, notify, signInGoogle, signOut,
                   applications, jobs, isSaved, openJob, savedJobIds, postedJobs,
                   updateAppStatus, toggleJobStatus, deleteJob, setEditingJob }) {
  const { t } = useT()
  const [form, setForm]       = useState({ display_name:'', english_level:'Basic', availability:'', bio:'', visa_expiry:'', job_categories:'' })
  const [busy, setBusy]       = useState(false)
  const [tab,  setTab]        = useState('profile')
  const [avatarFile, setAvatarFile]     = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [expandedJob, setExpandedJob]   = useState(null)

  useEffect(() => {
    if (profile) setForm({
      display_name:  profile.display_name  || '',
      english_level: profile.english_level || 'Basic',
      availability:    profile.availability    || '',
      bio:             profile.bio             || '',
      visa_expiry:     profile.visa_expiry     || '',
      job_categories:  profile.job_categories  || '',
    })
  }, [profile])

  function upd(k, v) { setForm(p => ({ ...p, [k]:v })) }
  function handleAvatarChange(e) {
    const f = e.target.files?.[0]; if (!f) return
    setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f))
  }

  async function uploadAvatar() {
    if (!avatarFile || !session) return profile?.avatar_url || null
    const ext  = avatarFile.name.split('.').pop()
    const path = `${session.user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert:true })
    if (error) throw error
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }

  async function save() {
    if (!session) return; setBusy(true)
    try {
      const avatar_url = await uploadAvatar()
      const updates = { id:session.user.id, ...form, updated_at:new Date().toISOString() }
      if (avatar_url) updates.avatar_url = avatar_url
      const { data, error } = await supabase.from('profiles').upsert(updates).select().single()
      if (error) throw error
      setProfile(data); setAvatarFile(null); notify(t.toast_profile)
    } catch(e) { notify(e.message) }
    setBusy(false)
  }

  const appliedJobs = jobs.filter(j => applications.some(a => a.job_id === j.id))
  const savedJobs   = jobs.filter(j => savedJobIds.includes(j.id))
  const currentAvatar = avatarPreview || profile?.avatar_url

  if (!session) return (
    <main style={{ textAlign:'center', paddingTop:60, padding:'60px 24px 0' }}>
      <p style={{ fontSize:56 }}>👤</p>
      <h2>{t.login_profile}</h2>
      <p className="muted" style={{ marginBottom:20 }}>{t.login_profile_desc}</p>
      <button className="primary" style={{ padding:'14px 32px', fontSize:16 }} onClick={() => setPage('login')}>
        {t.signup_tab} / {t.login_tab}
      </button>
    </main>
  )

  const TABS = [
    ['profile', t.tab_profile],
    ['applied', t.tab_applied],
    ['saved',   t.tab_saved],
    ['posted',  t.tab_posted + (postedJobs.length ? ` (${postedJobs.length})` : '')],
  ]

  const statusStyle = st => ({
    padding:'5px 12px', borderRadius:999, fontSize:12, fontWeight:700,
    background: st==='accepted'?'rgba(34,197,94,0.15)':st==='rejected'?'rgba(239,68,68,0.15)':'rgba(59,130,246,0.15)',
    color:      st==='accepted'?'#4ade80':st==='rejected'?'#f87171':'#93c5fd',
    border:     st==='accepted'?'1px solid rgba(34,197,94,0.2)':st==='rejected'?'1px solid rgba(239,68,68,0.2)':'1px solid rgba(59,130,246,0.2)',
  })

  return (
    <main>
      <section className="hero" style={{ flexDirection:'column', alignItems:'flex-start', gap:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center' }}>
          <div><h1>{form.display_name || t.tab_profile}</h1><p className="muted">{session.user.email}</p></div>
          <button onClick={signOut} style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', padding:'10px 16px' }}>{t.logout}</button>
        </div>
      </section>

      <div style={{ display:'flex', gap:4, margin:'16px 0 0', borderBottom:'1px solid var(--border)', overflowX:'auto' }}>
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            background:'transparent', border:'none', borderRadius:0, whiteSpace:'nowrap',
            borderBottom: tab===key ? '2px solid var(--accent)' : '2px solid transparent',
            color: tab===key ? 'var(--text)' : 'var(--muted2)',
            color: tab===key ? '#2563eb' : '#64748b', fontWeight:900, padding:'12px 14px'
          }}>{label}</button>
        ))}
      </div>

      {/* ── プロフィール編集 ── */}
      {tab === 'profile' && (
        <section className="card form" style={{ marginTop:16 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
            <div className="avatar" style={{ width:96, height:96, fontSize:36, cursor:'pointer' }}
              onClick={() => document.getElementById('avatarInput').click()}>
              {currentAvatar
                ? <img src={currentAvatar} style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }} alt="avatar" />
                : (form.display_name?.[0]?.toUpperCase() || 'U')}
            </div>
            <input id="avatarInput" type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
            <button style={{ fontSize:13, padding:'8px 16px' }} onClick={() => document.getElementById('avatarInput').click()}>{t.change_photo}</button>
            {avatarPreview && <p className="muted" style={{ fontSize:12 }}>{t.photo_pending}</p>}
          </div>
          <label>{t.f_name}<input value={form.display_name} onChange={e => upd('display_name', e.target.value)} placeholder="Haru Yamamoto" /></label>
          <label>{t.f_eng_level}
            <select value={form.english_level} onChange={e => upd('english_level', e.target.value)}>
              <option>Basic</option><option>Pre-intermediate</option><option>Intermediate</option>
              <option>Upper-intermediate</option><option>Advanced</option>
            </select>
          </label>
          <label>{t.f_avail}
            <AvailabilityPicker value={form.availability} onChange={v => upd('availability', v)} />
          </label>
          <label>{t.f_job_categories}
            <CategoryPicker value={form.job_categories} onChange={v => upd('job_categories', v)} max={5} />
          </label>
          <label>{t.f_visa}<input type="date" value={form.visa_expiry} onChange={e => upd('visa_expiry', e.target.value)} /></label>
          <label>{t.f_bio}<textarea value={form.bio} onChange={e => upd('bio', e.target.value)} placeholder="I have 2 years restaurant experience in Japan..." /></label>
          <button className="primary" onClick={save} disabled={busy}>{busy ? t.saving : t.save_btn}</button>
        </section>
      )}

      {/* ── 応募履歴 ── */}
      {tab === 'applied' && (
        <div style={{ marginTop:16 }}>
          {!appliedJobs.length ? <div className="empty">{t.no_applied}</div>
            : appliedJobs.map(j => {
              const app = applications.find(a => a.job_id === j.id)
              return (
                <div key={j.id} className="dm" onClick={() => openJob(j)} style={{ cursor:'pointer' }}>
                  <div className="avatar" style={{ fontSize:24 }}>
                    {j.image_url ? <img src={j.image_url} style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }} alt="" /> : '💼'}
                  </div>
                  <div style={{ flex:1 }}><b>{j.company}</b><p className="muted">{j.title}</p></div>
                  <span style={statusStyle(app?.status)}>
                    {app?.status==='accepted'?t.b_accepted:app?.status==='rejected'?t.b_rejected:t.b_pending}
                  </span>
                </div>
              )
            })
          }
        </div>
      )}

      {/* ── 保存済み ── */}
      {tab === 'saved' && (
        <div style={{ marginTop:16 }}>
          {!savedJobs.length ? <div className="empty">{t.no_saved_jobs}</div>
            : <JobGrid jobs={savedJobs} openJob={openJob} isSaved={() => true} toggleSave={() => {}} />}
        </div>
      )}

      {/* ── 投稿した求人（採用ダッシュボード）── */}
      {tab === 'posted' && (
        <div style={{ marginTop:16 }}>
          {!postedJobs.length
            ? <div className="empty">{t.no_posted}<br /><button className="primary" style={{ marginTop:14 }} onClick={() => setPage('post')}>{t.post_first}</button></div>
            : postedJobs.map(j => {
              const appCount = (j.applications||[]).length
              const isClosed = j.is_active === false
              return (
                <div key={j.id} className="card" style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <h3 style={{ margin:0 }}>{j.company} — {j.title}</h3>
                        <span style={{ padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:700,
                          background:isClosed?'rgba(239,68,68,0.15)':'rgba(34,197,94,0.15)',
                          color:isClosed?'#f87171':'#4ade80',
                          border:isClosed?'1px solid rgba(239,68,68,0.2)':'1px solid rgba(34,197,94,0.2)' }}>
                          {isClosed ? t.badge_closed : t.badge_active}
                        </span>
                      </div>
                      <p className="muted" style={{ fontSize:14 }}>{j.location} / {j.salary}</p>
                    </div>
                    <span style={{ background:'rgba(59,130,246,0.15)', color:'#93c5fd', border:'1px solid rgba(59,130,246,0.2)', padding:'5px 12px', borderRadius:999, fontSize:13, fontWeight:700, whiteSpace:'nowrap', flexShrink:0 }}>
                      {t.apps_count} {appCount}{t.parts}
                    </span>
                  </div>

                  {/* 操作ボタン */}
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:12 }}>
                    <button style={{ fontSize:13, padding:'8px 14px' }}
                      onClick={() => setExpandedJob(expandedJob===j.id ? null : j.id)}>
                      {expandedJob===j.id ? t.close_apps : `${t.view_apps} (${appCount})`}
                    </button>
                    <button style={{ fontSize:13, padding:'8px 14px' }} onClick={() => setEditingJob(j)}>{t.edit_job}</button>
                    <button style={{ fontSize:13, padding:'8px 14px',
                      background:isClosed?'rgba(34,197,94,0.15)':'rgba(251,191,36,0.12)',
                      color:isClosed?'#4ade80':'#fbbf24',
                      border:isClosed?'1px solid rgba(34,197,94,0.2)':'1px solid rgba(251,191,36,0.2)' }}
                      onClick={() => toggleJobStatus(j.id, !isClosed)}>
                      {isClosed ? t.reopen_job : t.close_job}
                    </button>
                    <button style={{ fontSize:13, padding:'8px 14px', background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)' }}
                      onClick={() => deleteJob(j.id)}>{t.delete_job}</button>
                  </div>

                  {/* 応募者一覧 */}
                  {expandedJob === j.id && (
                    <div style={{ marginTop:12 }}>
                      {!appCount ? <p className="muted" style={{ padding:'12px 0' }}>{t.no_apps}</p>
                        : (j.applications||[]).map(app => {
                          const p = app.profiles || {}
                          return (
                            <div key={app.id} style={{ background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:16, padding:14, marginBottom:10 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                                <div className="avatar" style={{ width:42, height:42, fontSize:16 }}>
                                  {p.avatar_url
                                    ? <img src={p.avatar_url} style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }} alt="" />
                                    : (p.display_name?.[0]?.toUpperCase() || '?')}
                                </div>
                                <div style={{ flex:1, minWidth:0 }}>
                                  <b>{p.display_name || 'Anonymous'}</b>
                                  <p className="muted" style={{ fontSize:12, margin:0 }}>
                                    {p.english_level||t.not_set} ／ {p.availability||t.not_set}
                                  </p>
                                </div>
                                <span style={statusStyle(app.status)}>
                                  {app.status==='accepted'?t.st_accepted:app.status==='rejected'?t.st_rejected:t.st_pending}
                                </span>
                              </div>
                              {app.message && (
                                <p style={{ fontSize:14, color:'var(--muted2)', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:10, padding:'8px 12px', margin:'8px 0' }}>
                                  "{app.message}"
                                </p>
                              )}
                              {p.bio && <p className="muted" style={{ fontSize:13, marginBottom:10 }}>{p.bio.slice(0,120)}{p.bio.length>120?'…':''}</p>}
                              {p.visa_expiry && <p className="muted" style={{ fontSize:12, marginBottom:8 }}>{t.visa_lbl} {p.visa_expiry}</p>}
                              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                                <button style={{ background:'rgba(34,197,94,0.15)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.2)', fontSize:13, padding:'8px 16px' }}
                                  onClick={() => updateAppStatus(app.id, 'accepted')} disabled={app.status==='accepted'}>{t.hire}</button>
                                <button style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)', fontSize:13, padding:'8px 16px' }}
                                  onClick={() => updateAppStatus(app.id, 'rejected')} disabled={app.status==='rejected'}>{t.reject}</button>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  )}
                </div>
              )
            })
          }
          <button className="primary" style={{ marginTop:4 }} onClick={() => setPage('post')}>{t.post_new}</button>
        </div>
      )}
    </main>
  )
}

// ═════════════════════════════════════════════
//  Utilities
// ═════════════════════════════════════════════
function Section({ title, children }) {
  return <section><h2 className="sectionTitle">{title}</h2>{children}</section>
}

function SkeletonGrid() {
  return (
    <div className="grid">
      {[1,2,3,4].map(i => (
        <div key={i} className="job skeleton-card">
          <div className="skeleton" style={{ height:176, borderRadius:22 }} />
          <div className="skeleton" style={{ height:20, width:'70%', marginTop:16 }} />
          <div className="skeleton" style={{ height:14, width:'50%', marginTop:8 }} />
        </div>
      ))}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.7 29.2 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.1-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.7-5.1L31.5 35C29.5 36.6 27 37.5 24 37.5c-5.2 0-9.5-3.3-11.3-7.9L6 34.4C9.3 40.5 16.1 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.6-2.7 4.7-5 6L36.7 38C40.9 34.2 44 29.4 44 24c0-1.3-.1-2.7-.4-4z"/>
    </svg>
  )
}

createRoot(document.getElementById('root')).render(<App />)
