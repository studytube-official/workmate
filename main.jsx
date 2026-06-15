import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState
} from 'react'
import { createRoot } from 'react-dom/client'
import { supabase } from './supabase'
import {
  demoApplications,
  demoConversations,
  demoJobs,
  demoMessages,
  demoPostedJobs,
  demoProfile,
  demoSavedJobIds,
  demoSession,
  demoStaff,
} from './demoData'
import './style.css'

// ═════════════════════════════════════════════
//  i18n
// ═════════════════════════════════════════════
const T = {
  ja: {
    nav_home:'ホーム', nav_jobs:'求人', nav_staff:'スタッフ', nav_dm:'DM', nav_profile:'プロフィール',
    tagline:'シドニーで今日もいい仕事を見つけよう',
    section_nearby:'近くの求人', section_saved:'保存した求人',
    guest_banner:'ログインしてスカウトを待とう',
    guest_banner_btn:'ログイン / 登録',
    role_q_title:'WorkMateで何をしたいですか？',
    role_q_sub:'あてはまる方を選んでください。',
    role_seeker:'仕事を探したい',
    role_seeker_desc:'募集中の店を探したり、店からスカウトを受け取れます。',
    role_employer:'スタッフを探したい',
    role_employer_desc:'求人を投稿して、シドニーで働くスタッフを検索できます。',
    emp_banner:'求人を投稿するとスタッフ検索が使えるようになります。',
    emp_banner_btn:'求人を投稿',
    seeker_banner:'プロフィールを設定して、応募またはスカウトを待ちましょう。',
    seeker_banner_btn:'プロフィール設定',
    profile_privacy_note:'写真やプロフィール情報は店側にのみ表示され、一般公開はされません。',
    profile_photo_tip:'好きな写真を自由に設定できます。写真を設定するとスカウトされる可能性が上がります。',
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
    post_login_desc:'ログインして求人を投稿してください。',
    f_title:'求人タイトル *', f_company:'店名 *', f_location:'場所',
    f_salary:'時給', f_eng:'英語条件', f_desc:'仕事内容', f_img:'画像',
    f_categories:'職種（最大5つ選択）',
    map_verify_hint:'ピンが正しい場所にあるか確認し、必要なら住所を調整してください。',
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
    guest:'← ゲストとして続ける',
    login_profile:'ログインしてプロフィールを作成',
    login_profile_desc:'求人保存・応募履歴がここに表示されます。',
    signup_tab:'新規登録', login_tab:'ログイン',
    f_email:'メールアドレス', f_password:'パスワード', f_displayname:'名前（表示名）',
    signup_btn:'アカウントを作成', login_btn:'ログイン',
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
    founding_badge:'🎖 Founding Member（求人投稿 永久無料）',
    founding_toast:'🎉 先着20店舗限定！あなたは Founding Member です。求人投稿が永久無料になりました 🎊',
    home_badge:'プレローンチ中',
    home_title_guest:'Sydney hospitality hiring, simpler.',
    home_sub_guest:'ワーホリ・留学生とシドニーの飲食店をつなぐ求人プラットフォームです。',
    home_seekers_title:'仕事を探す方へ',
    home_seekers_desc:'プロフィールを先に作っておくと、求人掲載後すぐ応募できます。',
    home_employers_title:'店舗の方へ',
    home_employers_desc:'求人投稿後、スタッフ候補を検索して直接DMできます。',
    home_empty_jobs_title:'求人掲載に向けて準備中です',
    home_empty_jobs_desc:'登録後は求人掲載まで今しばらくお待ちください。プロフィールだけ先に準備できます。',
    home_empty_jobs_btn:'プロフィールを作成',
    home_empty_saved_title:'保存した求人はここに表示されます',
    home_empty_saved_desc:'気になる求人が出たら保存して、後からすぐ確認できます。',
    install_title:'WorkMateをホーム画面に追加',
    install_desc:'アプリのようにすぐ開いて、求人・DM・応募者を確認できます。',
    install_btn:'ホーム画面に追加',
    install_ios_hint:'iPhoneの場合: 共有ボタン → 「ホーム画面に追加」',
    install_browser_hint:'ブラウザのメニューから「ホーム画面に追加」または「アプリをインストール」を選んでください。',
    install_not_now:'今はしない',
    file_choose:'写真を選択',
    file_none:'ファイル未選択',
    cat_selected_suffix:'件選択中',
    cat_joiner:'・',
    category_add_job:'職種を追加…',
    category_add_preferred:'希望職種を追加…',
    password_ph:'6文字以上',
    desc_ph:'仕事内容、勤務時間、条件など...',
    founding_promo:n => `🎖 今だけ先着20店舗は求人投稿が永久無料！（残り ${n} 枠）`,
    staff_employers_only:'雇用主専用ページです',
    staff_post_required:'求人を1件以上投稿すると閲覧できます。',
    filters_show:'フィルター',
    filters_hide:'フィルターを閉じる',
    filters_clear:'クリア',
    filter_jobs_count:n => `${n}件の求人が条件に一致`,
    filter_staff_count:n => `${n}人のスタッフ候補が条件に一致`,
    any_english:'英語レベルすべて',
  },
  en: {
    nav_home:'Home', nav_jobs:'Jobs', nav_staff:'Staff', nav_dm:'DM', nav_profile:'Profile',
    tagline:'Find your perfect job in Sydney today',
    section_nearby:'Jobs Near You', section_saved:'Saved Jobs',
    guest_banner:'Log in and get scouted',
    guest_banner_btn:'Log In / Sign Up',
    role_q_title:'What brings you to WorkMate?',
    role_q_sub:'Pick the option that fits you.',
    role_seeker:"I'm looking for a job",
    role_seeker_desc:'Find shops hiring and get scouted by employers.',
    role_employer:"I'm looking for staff",
    role_employer_desc:'Post jobs and search for staff in Sydney.',
    emp_banner:'Post a job to unlock staff search.',
    emp_banner_btn:'Post a job',
    seeker_banner:'Set up your profile — then apply or get scouted.',
    seeker_banner_btn:'Set up profile',
    profile_privacy_note:'Your photo and details are only visible to employers — never shown publicly.',
    profile_photo_tip:'Use any photo you like. Adding a photo makes you far more likely to get scouted.',
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
    post_login_desc:'Log in to post job listings.',
    f_title:'Job Title *', f_company:'Business Name *', f_location:'Location',
    f_salary:'Hourly Rate', f_eng:'English Requirement', f_desc:'Job Description', f_img:'Photo',
    f_categories:'Job Type (up to 5)',
    map_verify_hint:'Check the pin is correct — adjust the address if needed.',
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
    guest:'← Continue as guest',
    login_profile:'Log in to create your profile',
    login_profile_desc:'View saved jobs and application history here.',
    signup_tab:'Sign Up', login_tab:'Log In',
    f_email:'Email', f_password:'Password', f_displayname:'Display Name',
    signup_btn:'Create Account', login_btn:'Log In',
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
    founding_badge:'🎖 Founding Member · Free Forever',
    founding_toast:'🎉 You are a Founding Member! Job posting is free forever 🎊',
    home_badge:'Pre-launch',
    home_title_guest:'Sydney hospitality hiring, simpler.',
    home_sub_guest:'WorkMate connects Working Holiday makers and international students with Sydney hospitality businesses.',
    home_seekers_title:'For job seekers',
    home_seekers_desc:'Create your profile now so you are ready when jobs go live.',
    home_employers_title:'For businesses',
    home_employers_desc:'Post a job, browse staff candidates, and message directly.',
    home_empty_jobs_title:'Job listings are being prepared',
    home_empty_jobs_desc:'Register now and stay ready while businesses start posting jobs.',
    home_empty_jobs_btn:'Create profile',
    home_empty_saved_title:'Saved jobs will appear here',
    home_empty_saved_desc:'When listings go live, save roles you like and come back anytime.',
    install_title:'Add WorkMate to your Home Screen',
    install_desc:'Open it like an app and check jobs, messages, and applicants faster.',
    install_btn:'Add to Home Screen',
    install_ios_hint:'On iPhone: tap Share, then Add to Home Screen.',
    install_browser_hint:'Use your browser menu and choose Add to Home Screen or Install app.',
    install_not_now:'Not now',
    file_choose:'Choose Photo',
    file_none:'No file selected',
    cat_selected_suffix:'selected',
    cat_joiner:', ',
    category_add_job:'Add job type…',
    category_add_preferred:'Add preferred role…',
    password_ph:'6+ characters',
    desc_ph:'Job details, hours, requirements...',
    founding_promo:n => `🎖 First 20 businesses post jobs free forever — ${n} spot${n === 1 ? '' : 's'} left!`,
    staff_employers_only:'Employers Only',
    staff_post_required:'Post a job listing to access this page.',
    filters_show:'Filters',
    filters_hide:'Hide Filters',
    filters_clear:'Clear',
    filter_jobs_count:n => `${n} shops match your filters`,
    filter_staff_count:n => `${n} staff candidates match your filters`,
    any_english:'Any English level',
  }
}

const LangCtx = createContext({ lang:'en', setLang:()=>{}, t:T.en })
const useT = () => useContext(LangCtx)

const isStandaloneApp = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

const isIosDevice = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

const makeLang = overrides => ({ ...T.en, ...overrides })

Object.assign(T, {
  ko: makeLang({
    nav_home:'홈', nav_jobs:'구인', nav_staff:'스태프', nav_dm:'DM', nav_profile:'프로필',
    tagline:'시드니에서 오늘의 일자리를 찾아보세요',
    section_nearby:'근처 구인', section_saved:'저장한 구인',
    role_q_title:'WorkMate에서 무엇을 하고 싶나요?', role_q_sub:'해당되는 옵션을 선택하세요.',
    role_seeker:'일자리를 찾고 있어요', role_seeker_desc:'채용 중인 가게를 찾고 스카우트를 받을 수 있습니다.',
    role_employer:'스태프를 찾고 있어요', role_employer_desc:'구인을 올리고 시드니의 스태프 후보를 검색할 수 있습니다.',
    emp_banner:'구인을 올리면 스태프 검색을 사용할 수 있습니다.', emp_banner_btn:'구인 올리기',
    seeker_banner:'프로필을 설정하고 지원하거나 스카우트를 기다리세요.', seeker_banner_btn:'프로필 설정',
    profile_privacy_note:'사진과 프로필 정보는 고용주에게만 보이며 공개되지 않습니다.',
    profile_photo_tip:'원하는 사진을 자유롭게 설정할 수 있습니다. 사진을 넣으면 스카우트 가능성이 높아집니다.',
    login_cta_title:'로그인하고 모든 기능 사용하기', login_cta_desc:'구인 저장, 지원, 실시간 DM을 사용할 수 있습니다.',
    profile_completion:'프로필 완성도', profile_hint:'사진, 비자 만료일, 근무 가능 시간을 추가하면 지원률이 올라갑니다.', complete_profile:'프로필 완성하기',
    quick_jobs:'오늘의 추천 구인', quick_jobs_sub:'전체 구인 보기', quick_post:'구인 올리기', quick_post_sub:'고용주용',
    search_jobs:'구인 찾기', keyword_ph:'키워드 검색', all_areas:'모든 지역', eng_cond:'영어 조건', post_btn:'＋ 구인 올리기',
    no_jobs:'구인이 없습니다.', view_detail:'상세 보기', save:'♡ 저장', saved_btn:'♥ 저장됨',
    loc_tbd:'장소 미정', salary_tbd:'시급 미정', no_eng:'영어 조건 없음', back_jobs:'← 구인 목록으로',
    apply:'지원하기', applied_done:'✓ 지원 완료', applying:'지원 중...', apply_msg:'메시지 (선택)', apply_ph:'자기소개나 희망 근무 시간을 적어주세요...', send_apply:'지원서 보내기', cancel:'취소',
    view_map:'📍 Google Maps에서 보기', dm_btn:'💬 DM 보내기', badge_active:'채용 중', badge_closed:'마감',
    post_title:'구인 올리기', post_login_title:'구인을 올리려면 로그인이 필요합니다', post_login_desc:'로그인 후 구인을 올려주세요.',
    f_title:'구인 제목 *', f_company:'가게 이름 *', f_location:'장소', f_salary:'시급', f_eng:'영어 조건', f_desc:'업무 내용', f_img:'사진', f_categories:'직종 (최대 5개)',
    map_verify_hint:'핀이 올바른 위치인지 확인하고 필요하면 주소를 조정하세요.', save_btn:'저장', saving:'저장 중...', required_err:'구인 제목과 가게 이름은 필수입니다.', job_saved:'구인을 저장했습니다.',
    find_staff:'스태프 찾기', staff_desc:'시드니에서 일할 수 있는 스태프 후보를 찾아보세요.', no_staff:'아직 등록된 스태프가 없습니다.', contact:'💬 연락하기', visa_lbl:'🛂 비자 만료일:',
    dm_title:'DM', dm_login_title:'DM을 사용하려면 로그인이 필요합니다', no_dm:'아직 DM이 없습니다.', no_dm_hint:'구인 상세 페이지에서 "DM 보내기"를 눌러보세요.', back_dm:'← DM 목록으로', type_msg:'메시지 입력', send:'보내기', first_msg:'첫 메시지를 보내보세요 👋', loading:'로딩 중...',
    logout:'로그아웃', tab_profile:'프로필', tab_applied:'지원 내역', tab_saved:'저장됨', tab_posted:'내 구인',
    change_photo:'📷 사진 변경', photo_pending:'저장해야 반영됩니다',
    f_name:'이름', f_eng_level:'영어 레벨', f_avail:'근무 가능 요일/시간', f_visa:'비자 만료일', f_bio:'자기소개', f_job_categories:'희망 직종 (최대 5개)',
    no_applied:'아직 지원한 구인이 없습니다.', no_saved_jobs:'아직 저장한 구인이 없습니다.', no_posted:'아직 구인을 올리지 않았습니다.', post_first:'구인 올리기',
    apps_count:'지원', view_apps:'▼ 지원자 보기', close_apps:'▲ 닫기', no_apps:'아직 지원자가 없습니다.', hire:'✓ 채용', reject:'✗ 불합격',
    st_accepted:'채용', st_rejected:'불합격', st_pending:'검토 중', b_accepted:'✓ 채용', b_rejected:'✗ 불합격', b_pending:'⏳ 검토 중',
    edit_job:'✏️ 수정', delete_job:'🗑 삭제', close_job:'모집 종료', reopen_job:'모집 재개', confirm_del:'이 구인을 삭제할까요?', job_deleted:'구인을 삭제했습니다.', status_updated:'구인 상태를 업데이트했습니다', post_new:'＋ 새 구인 올리기',
    login_title:'WorkMate 로그인', login_sub:'시드니 유학생을 위한 잡 매칭 앱', guest:'← 게스트로 계속하기',
    login_profile:'로그인하고 프로필 만들기', login_profile_desc:'저장한 구인과 지원 내역이 여기에 표시됩니다.',
    signup_tab:'회원가입', login_tab:'로그인', f_email:'이메일 주소', f_password:'비밀번호', f_displayname:'이름 (표시명)', signup_btn:'계정 만들기', login_btn:'로그인',
    err_required:'이름, 이메일, 비밀번호를 입력하세요', err_password_short:'비밀번호는 6자 이상이어야 합니다', signup_ok:'계정이 생성되었습니다!', check_email:'확인 메일을 보냈습니다. 이메일 링크를 클릭하세요.',
    toast_login:'로그인이 필요합니다', toast_applied_already:'이미 지원했습니다', toast_applied_ok:'지원했습니다!', toast_logout:'로그아웃했습니다', toast_profile:'프로필을 저장했습니다!', toast_no_poster:'게시자 정보가 없어 DM을 보낼 수 없습니다', toast_self_dm:'내가 올린 구인에는 DM할 수 없습니다', toast_self_dm2:'자기 자신에게는 DM할 수 없습니다', toast_new_app:'📨 새 지원이 도착했습니다!', toast_closed:'이 구인은 마감되었습니다',
    eng_basic:'기초 영어 OK', eng_none:'영어 거의 불필요', eng_inter:'중급 이상', not_set:'미설정', parts:'건', edit_title:'구인 수정',
    founding_badge:'🎖 Founding Member · 평생 무료', founding_toast:'🎉 Founding Member가 되었습니다! 구인 게시가 평생 무료입니다 🎊',
    home_badge:'프리런칭', home_title_guest:'시드니 호스피탈리티 채용을 더 쉽게.', home_sub_guest:'WorkMate는 워킹홀리데이와 유학생을 시드니 호스피탈리티 비즈니스와 연결합니다.',
    home_seekers_title:'구직자에게', home_seekers_desc:'구인이 올라오면 바로 지원할 수 있도록 지금 프로필을 만들어두세요.', home_employers_title:'비즈니스에게', home_employers_desc:'구인을 올리고 스태프 후보를 확인한 뒤 바로 메시지하세요.',
    home_empty_jobs_title:'구인 게시를 준비 중입니다', home_empty_jobs_desc:'비즈니스가 구인을 올리는 동안 먼저 등록하고 준비해 주세요.', home_empty_jobs_btn:'프로필 만들기', home_empty_saved_title:'저장한 구인이 여기에 표시됩니다', home_empty_saved_desc:'구인이 올라오면 마음에 드는 일을 저장하고 나중에 확인하세요.',
    install_title:'WorkMate를 홈 화면에 추가', install_desc:'앱처럼 열고 구인, 메시지, 지원자를 더 빠르게 확인하세요.', install_btn:'홈 화면에 추가', install_ios_hint:'iPhone: 공유 버튼 → 홈 화면에 추가를 탭하세요.', install_browser_hint:'브라우저 메뉴에서 홈 화면에 추가 또는 앱 설치를 선택하세요.', install_not_now:'나중에',
    file_choose:'사진 선택', file_none:'파일 선택 안 됨', cat_selected_suffix:'개 선택됨', cat_joiner:', ', category_add_job:'직종 추가…', category_add_preferred:'희망 직종 추가…', password_ph:'6자 이상', desc_ph:'업무 내용, 근무 시간, 조건 등...', founding_promo:n => `🎖 지금 선착순 20개 비즈니스는 구인 게시가 평생 무료! (${n}자리 남음)`, staff_employers_only:'고용주 전용 페이지입니다', staff_post_required:'구인을 1개 이상 올리면 볼 수 있습니다.', filters_show:'필터', filters_hide:'필터 숨기기', filters_clear:'초기화', filter_jobs_count:n => `${n}개의 구인이 조건과 일치`, filter_staff_count:n => `${n}명의 스태프 후보가 조건과 일치`, any_english:'모든 영어 레벨',
  }),
  zh: makeLang({
    nav_home:'首页', nav_jobs:'职位', nav_staff:'员工', nav_dm:'私信', nav_profile:'个人资料',
    tagline:'在悉尼找到适合你的工作', section_nearby:'附近职位', section_saved:'已保存职位',
    role_q_title:'你想如何使用 WorkMate？', role_q_sub:'请选择最符合你的选项。', role_seeker:'我想找工作', role_seeker_desc:'寻找正在招聘的店铺，也可以接收雇主联系。', role_employer:'我想找员工', role_employer_desc:'发布职位并搜索悉尼可工作的候选人。',
    emp_banner:'发布职位后即可使用员工搜索。', emp_banner_btn:'发布职位', seeker_banner:'完善资料后即可申请或等待雇主联系。', seeker_banner_btn:'设置资料',
    profile_privacy_note:'你的照片和资料只会显示给雇主，不会公开。', profile_photo_tip:'可以自由设置照片。添加照片会提高被联系的机会。',
    login_cta_title:'登录以使用全部功能', login_cta_desc:'保存职位、申请工作，并使用实时私信。', profile_completion:'资料完成度', profile_hint:'添加照片、签证到期日和可工作时间可提高申请率。', complete_profile:'完善资料',
    quick_jobs:'今日推荐职位', quick_jobs_sub:'查看全部职位', quick_post:'发布职位', quick_post_sub:'雇主使用',
    search_jobs:'找职位', keyword_ph:'关键词搜索', all_areas:'所有地区', eng_cond:'英语要求', post_btn:'＋ 发布职位',
    no_jobs:'暂无职位。', view_detail:'查看详情', save:'♡ 保存', saved_btn:'♥ 已保存', loc_tbd:'地点未定', salary_tbd:'薪资未定', no_eng:'无英语要求', back_jobs:'← 返回职位列表',
    apply:'立即申请', applied_done:'✓ 已申请', applying:'申请中...', apply_msg:'留言（可选）', apply_ph:'介绍自己或填写希望班次...', send_apply:'提交申请', cancel:'取消',
    view_map:'📍 在 Google Maps 查看', dm_btn:'💬 私信', badge_active:'招聘中', badge_closed:'已关闭',
    post_title:'发布职位', post_login_title:'发布职位需要登录', post_login_desc:'请登录后发布职位。',
    f_title:'职位标题 *', f_company:'店名 *', f_location:'地点', f_salary:'时薪', f_eng:'英语要求', f_desc:'工作内容', f_img:'照片', f_categories:'职位类型（最多5个）',
    map_verify_hint:'请确认地图定位是否正确，必要时调整地址。', save_btn:'保存', saving:'保存中...', required_err:'职位标题和店名为必填项。', job_saved:'职位已保存。',
    find_staff:'寻找员工', staff_desc:'浏览悉尼可工作的候选人。', no_staff:'还没有员工资料。', contact:'💬 联系', visa_lbl:'🛂 签证到期:',
    dm_title:'私信', dm_login_title:'使用私信需要登录', no_dm:'暂无私信。', no_dm_hint:'在职位详情页点击“私信”开始。', back_dm:'← 返回私信列表', type_msg:'输入消息', send:'发送', first_msg:'发送第一条消息 👋', loading:'加载中...',
    logout:'退出登录', tab_profile:'资料', tab_applied:'申请记录', tab_saved:'已保存', tab_posted:'我发布的职位',
    change_photo:'📷 更换照片', photo_pending:'保存后才会生效',
    f_name:'姓名', f_eng_level:'英语水平', f_avail:'可工作日期/时间', f_visa:'签证到期日', f_bio:'自我介绍', f_job_categories:'期望职位（最多5个）',
    no_applied:'还没有申请职位。', no_saved_jobs:'还没有保存职位。', no_posted:'还没有发布职位。', post_first:'发布职位',
    apps_count:'申请', view_apps:'▼ 查看申请者', close_apps:'▲ 关闭', no_apps:'还没有申请者。', hire:'✓ 录用', reject:'✗ 拒绝',
    st_accepted:'已录用', st_rejected:'已拒绝', st_pending:'审核中', b_accepted:'✓ 已录用', b_rejected:'✗ 已拒绝', b_pending:'⏳ 审核中',
    edit_job:'✏️ 编辑', delete_job:'🗑 删除', close_job:'结束招聘', reopen_job:'重新开放', confirm_del:'确定删除这个职位吗？', job_deleted:'职位已删除。', status_updated:'职位状态已更新', post_new:'＋ 发布新职位',
    login_title:'登录 WorkMate', login_sub:'面向悉尼国际学生的工作匹配应用', guest:'← 以访客继续',
    login_profile:'登录并创建资料', login_profile_desc:'已保存职位和申请记录会显示在这里。', signup_tab:'注册', login_tab:'登录', f_email:'邮箱地址', f_password:'密码', f_displayname:'姓名（显示名）', signup_btn:'创建账号', login_btn:'登录',
    err_required:'请输入姓名、邮箱和密码', err_password_short:'密码至少6个字符', signup_ok:'账号已创建！', check_email:'确认邮件已发送。请点击邮件中的链接。',
    toast_login:'需要登录', toast_applied_already:'已经申请过', toast_applied_ok:'申请已发送！', toast_logout:'已退出登录', toast_profile:'资料已保存！', toast_no_poster:'没有发布者信息，无法私信', toast_self_dm:'不能私信自己发布的职位', toast_self_dm2:'不能私信自己', toast_new_app:'📨 收到新的申请！', toast_closed:'该职位已关闭',
    eng_basic:'基础英语 OK', eng_none:'几乎不需要英语', eng_inter:'中级以上', not_set:'未设置', parts:'件', edit_title:'编辑职位',
    founding_badge:'🎖 Founding Member · 永久免费', founding_toast:'🎉 你已成为 Founding Member！发布职位永久免费 🎊',
    home_badge:'预发布', home_title_guest:'让悉尼餐旅招聘更简单。', home_sub_guest:'WorkMate 连接打工度假者、国际学生和悉尼餐旅商家。',
    home_seekers_title:'给求职者', home_seekers_desc:'现在先创建资料，等职位上线后即可申请。', home_employers_title:'给商家', home_employers_desc:'发布职位、浏览候选人并直接私信。',
    home_empty_jobs_title:'职位正在准备上线', home_empty_jobs_desc:'商家开始发布职位前，你可以先注册并准备资料。', home_empty_jobs_btn:'创建资料', home_empty_saved_title:'已保存职位会显示在这里', home_empty_saved_desc:'职位上线后，可以保存感兴趣的工作并随时查看。',
    install_title:'将 WorkMate 添加到主屏幕', install_desc:'像应用一样打开，更快查看职位、私信和申请者。', install_btn:'添加到主屏幕', install_ios_hint:'iPhone：点击分享按钮，然后选择“添加到主屏幕”。', install_browser_hint:'在浏览器菜单中选择“添加到主屏幕”或“安装应用”。', install_not_now:'暂不',
    file_choose:'选择照片', file_none:'未选择文件', cat_selected_suffix:'已选择', cat_joiner:'、', category_add_job:'添加职位类型…', category_add_preferred:'添加期望职位…', password_ph:'至少6个字符', desc_ph:'工作内容、时间、要求等...', founding_promo:n => `🎖 现在前20家商家发布职位永久免费！（剩余 ${n} 个名额）`, staff_employers_only:'雇主专用页面', staff_post_required:'发布至少1个职位后即可查看。', filters_show:'筛选', filters_hide:'隐藏筛选', filters_clear:'清除', filter_jobs_count:n => `${n} 个职位符合条件`, filter_staff_count:n => `${n} 位候选人符合条件`, any_english:'任意英语水平',
  }),
  es: makeLang({
    nav_home:'Inicio', nav_jobs:'Empleos', nav_staff:'Personal', nav_dm:'DM', nav_profile:'Perfil',
    tagline:'Encuentra tu trabajo ideal en Sídney', section_nearby:'Empleos cerca de ti', section_saved:'Empleos guardados',
    role_q_title:'¿Qué quieres hacer en WorkMate?', role_q_sub:'Elige la opción que encaja contigo.', role_seeker:'Busco trabajo', role_seeker_desc:'Encuentra negocios contratando y recibe contactos de empleadores.', role_employer:'Busco personal', role_employer_desc:'Publica empleos y busca candidatos en Sídney.',
    emp_banner:'Publica un empleo para desbloquear la búsqueda de personal.', emp_banner_btn:'Publicar empleo', seeker_banner:'Configura tu perfil para postular o recibir contactos.', seeker_banner_btn:'Configurar perfil',
    profile_privacy_note:'Tu foto y datos solo son visibles para empleadores, no públicamente.', profile_photo_tip:'Puedes usar la foto que prefieras. Agregar una foto aumenta tus posibilidades.',
    login_cta_title:'Inicia sesión para usar todas las funciones', login_cta_desc:'Guarda empleos, postula y usa mensajes en tiempo real.', profile_completion:'Perfil completo', profile_hint:'Agrega foto, vencimiento de visa y disponibilidad para mejorar tus postulaciones.', complete_profile:'Completar perfil',
    quick_jobs:'Empleos de hoy', quick_jobs_sub:'Ver todos', quick_post:'Publicar empleo', quick_post_sub:'Para empleadores',
    search_jobs:'Buscar empleos', keyword_ph:'Buscar palabras clave', all_areas:'Todas las zonas', eng_cond:'Nivel de inglés', post_btn:'＋ Publicar empleo',
    no_jobs:'No hay empleos.', view_detail:'Ver detalles', save:'♡ Guardar', saved_btn:'♥ Guardado', loc_tbd:'Ubicación por definir', salary_tbd:'Pago por definir', no_eng:'Sin requisito', back_jobs:'← Volver a empleos',
    apply:'Postular', applied_done:'✓ Postulado', applying:'Postulando...', apply_msg:'Mensaje (opcional)', apply_ph:'Preséntate o indica tus turnos preferidos...', send_apply:'Enviar postulación', cancel:'Cancelar',
    view_map:'📍 Ver en Google Maps', dm_btn:'💬 Mensaje', badge_active:'Contratando', badge_closed:'Cerrado',
    post_title:'Publicar empleo', post_login_title:'Debes iniciar sesión para publicar', post_login_desc:'Inicia sesión para publicar empleos.',
    f_title:'Título del empleo *', f_company:'Nombre del negocio *', f_location:'Ubicación', f_salary:'Pago por hora', f_eng:'Requisito de inglés', f_desc:'Descripción', f_img:'Foto', f_categories:'Tipo de empleo (hasta 5)',
    map_verify_hint:'Revisa que el pin esté correcto y ajusta la dirección si hace falta.', save_btn:'Guardar', saving:'Guardando...', required_err:'El título y el negocio son obligatorios.', job_saved:'Empleo publicado.',
    find_staff:'Buscar personal', staff_desc:'Explora candidatos disponibles en Sídney.', no_staff:'Aún no hay perfiles.', contact:'💬 Contactar', visa_lbl:'🛂 Vencimiento de visa:',
    dm_title:'Mensajes', dm_login_title:'Inicia sesión para usar mensajes', no_dm:'Aún no hay mensajes.', no_dm_hint:'Pulsa “Mensaje” en un empleo para empezar.', back_dm:'← Volver a mensajes', type_msg:'Escribe un mensaje', send:'Enviar', first_msg:'Envía tu primer mensaje 👋', loading:'Cargando...',
    logout:'Cerrar sesión', tab_profile:'Perfil', tab_applied:'Postulaciones', tab_saved:'Guardados', tab_posted:'Mis anuncios',
    change_photo:'📷 Cambiar foto', photo_pending:'Guarda para aplicar los cambios',
    f_name:'Nombre', f_eng_level:'Nivel de inglés', f_avail:'Disponibilidad', f_visa:'Vencimiento de visa', f_bio:'Bio', f_job_categories:'Tipos preferidos (hasta 5)',
    no_applied:'Aún no has postulado.', no_saved_jobs:'Aún no has guardado empleos.', no_posted:'Aún no publicaste empleos.', post_first:'Publicar empleo',
    apps_count:'postulaciones', view_apps:'▼ Ver postulantes', close_apps:'▲ Cerrar', no_apps:'Aún no hay postulantes.', hire:'✓ Contratar', reject:'✗ Rechazar',
    st_accepted:'Contratado', st_rejected:'Rechazado', st_pending:'Pendiente', b_accepted:'✓ Contratado', b_rejected:'✗ Rechazado', b_pending:'⏳ Pendiente',
    edit_job:'✏️ Editar', delete_job:'🗑 Eliminar', close_job:'Cerrar anuncio', reopen_job:'Reabrir', confirm_del:'¿Eliminar este empleo?', job_deleted:'Empleo eliminado.', status_updated:'Estado actualizado', post_new:'＋ Publicar nuevo empleo',
    login_title:'Inicia sesión en WorkMate', login_sub:'Matching laboral para estudiantes internacionales en Sídney', guest:'← Continuar como invitado',
    login_profile:'Inicia sesión para crear tu perfil', login_profile_desc:'Tus guardados e historial aparecerán aquí.', signup_tab:'Registrarse', login_tab:'Iniciar sesión', f_email:'Email', f_password:'Contraseña', f_displayname:'Nombre visible', signup_btn:'Crear cuenta', login_btn:'Iniciar sesión',
    err_required:'Completa nombre, email y contraseña', err_password_short:'La contraseña debe tener al menos 6 caracteres', signup_ok:'Cuenta creada', check_email:'Te enviamos un email de confirmación.',
    toast_login:'Debes iniciar sesión', toast_applied_already:'Ya postulaste', toast_applied_ok:'Postulación enviada', toast_logout:'Sesión cerrada', toast_profile:'Perfil guardado', toast_no_poster:'No se puede enviar mensaje: falta información del publicador', toast_self_dm:'No puedes escribir a tu propio anuncio', toast_self_dm2:'No puedes escribirte a ti mismo', toast_new_app:'📨 Nueva postulación recibida', toast_closed:'Este empleo está cerrado',
    eng_basic:'Inglés básico OK', eng_none:'Casi sin inglés', eng_inter:'Intermedio+', not_set:'Sin definir', parts:'', edit_title:'Editar empleo',
    founding_badge:'🎖 Founding Member · Gratis para siempre', founding_toast:'🎉 Eres Founding Member. Publicar empleos será gratis para siempre 🎊',
    home_badge:'Prelanzamiento', home_title_guest:'Contratación hospitality en Sídney, más simple.', home_sub_guest:'WorkMate conecta Working Holiday makers y estudiantes internacionales con negocios hospitality en Sídney.',
    home_seekers_title:'Para quienes buscan trabajo', home_seekers_desc:'Crea tu perfil ahora y estarás listo cuando se publiquen empleos.', home_employers_title:'Para negocios', home_employers_desc:'Publica empleos, revisa candidatos y envía mensajes directos.',
    home_empty_jobs_title:'Estamos preparando los empleos', home_empty_jobs_desc:'Regístrate ahora y mantente listo mientras los negocios empiezan a publicar.', home_empty_jobs_btn:'Crear perfil', home_empty_saved_title:'Los empleos guardados aparecerán aquí', home_empty_saved_desc:'Cuando haya empleos, guarda los que te interesen y vuelve cuando quieras.',
    install_title:'Agrega WorkMate a tu pantalla de inicio', install_desc:'Ábrelo como una app y revisa empleos, mensajes y postulantes más rápido.', install_btn:'Agregar a inicio', install_ios_hint:'En iPhone: toca Compartir y luego Agregar a pantalla de inicio.', install_browser_hint:'Usa el menú del navegador y elige Agregar a inicio o Instalar app.', install_not_now:'Ahora no',
    file_choose:'Elegir foto', file_none:'Sin archivo', cat_selected_suffix:'seleccionados', cat_joiner:', ', category_add_job:'Agregar tipo de empleo…', category_add_preferred:'Agregar rol preferido…', password_ph:'6+ caracteres', desc_ph:'Detalles, horarios, requisitos...', founding_promo:n => `🎖 Los primeros 20 negocios publican empleos gratis para siempre. Quedan ${n}.`, staff_employers_only:'Solo empleadores', staff_post_required:'Publica al menos un empleo para acceder.', filters_show:'Filtros', filters_hide:'Ocultar filtros', filters_clear:'Limpiar', filter_jobs_count:n => `${n} negocios coinciden con tus filtros`, filter_staff_count:n => `${n} candidatos coinciden con tus filtros`, any_english:'Cualquier nivel de inglés',
  }),
  fr: makeLang({
    nav_home:'Accueil', nav_jobs:'Offres', nav_staff:'Staff', nav_dm:'DM', nav_profile:'Profil',
    tagline:'Trouvez votre travail idéal à Sydney', section_nearby:'Offres près de vous', section_saved:'Offres sauvegardées',
    role_q_title:'Que voulez-vous faire sur WorkMate ?', role_q_sub:'Choisissez l’option qui vous correspond.', role_seeker:'Je cherche un travail', role_seeker_desc:'Trouvez des établissements qui recrutent et recevez des contacts.', role_employer:'Je cherche du personnel', role_employer_desc:'Publiez des offres et trouvez des candidats à Sydney.',
    emp_banner:'Publiez une offre pour débloquer la recherche de staff.', emp_banner_btn:'Publier une offre', seeker_banner:'Complétez votre profil pour postuler ou être contacté.', seeker_banner_btn:'Configurer le profil',
    profile_privacy_note:'Votre photo et vos infos ne sont visibles que par les employeurs.', profile_photo_tip:'Ajoutez la photo de votre choix. Une photo augmente vos chances.',
    login_cta_title:'Connectez-vous pour tout utiliser', login_cta_desc:'Sauvegardez des offres, postulez et envoyez des messages.', profile_completion:'Profil complété', profile_hint:'Ajoutez photo, visa et disponibilités pour améliorer vos candidatures.', complete_profile:'Compléter le profil',
    quick_jobs:'Offres du jour', quick_jobs_sub:'Voir toutes les offres', quick_post:'Publier une offre', quick_post_sub:'Pour employeurs',
    search_jobs:'Chercher des offres', keyword_ph:'Recherche par mots-clés', all_areas:'Toutes les zones', eng_cond:'Niveau d’anglais', post_btn:'＋ Publier',
    no_jobs:'Aucune offre.', view_detail:'Voir détails', save:'♡ Sauver', saved_btn:'♥ Sauvé', loc_tbd:'Lieu à définir', salary_tbd:'Salaire à définir', no_eng:'Aucune exigence', back_jobs:'← Retour aux offres',
    apply:'Postuler', applied_done:'✓ Postulé', applying:'Envoi...', apply_msg:'Message (optionnel)', apply_ph:'Présentez-vous ou indiquez vos horaires...', send_apply:'Envoyer', cancel:'Annuler',
    view_map:'📍 Voir sur Google Maps', dm_btn:'💬 Message', badge_active:'Recrute', badge_closed:'Fermé',
    post_title:'Publier une offre', post_login_title:'Connexion requise', post_login_desc:'Connectez-vous pour publier une offre.',
    f_title:'Titre du poste *', f_company:'Nom du business *', f_location:'Lieu', f_salary:'Taux horaire', f_eng:'Anglais requis', f_desc:'Description', f_img:'Photo', f_categories:'Type de poste (max 5)',
    map_verify_hint:'Vérifiez que le pin est correct et ajustez l’adresse si besoin.', save_btn:'Sauver', saving:'Sauvegarde...', required_err:'Le titre et le nom du business sont obligatoires.', job_saved:'Offre publiée.',
    find_staff:'Trouver du staff', staff_desc:'Parcourez les candidats disponibles à Sydney.', no_staff:'Aucun profil staff pour le moment.', contact:'💬 Contacter', visa_lbl:'🛂 Expiration visa:',
    dm_title:'Messages', dm_login_title:'Connectez-vous pour les messages', no_dm:'Aucun message.', no_dm_hint:'Appuyez sur “Message” sur une offre.', back_dm:'← Retour aux messages', type_msg:'Écrire un message', send:'Envoyer', first_msg:'Envoyez votre premier message 👋', loading:'Chargement...',
    logout:'Déconnexion', tab_profile:'Profil', tab_applied:'Candidatures', tab_saved:'Sauvegardées', tab_posted:'Mes offres',
    change_photo:'📷 Changer la photo', photo_pending:'Sauvegardez pour appliquer',
    f_name:'Nom', f_eng_level:'Niveau d’anglais', f_avail:'Disponibilités', f_visa:'Expiration visa', f_bio:'Bio', f_job_categories:'Postes souhaités (max 5)',
    no_applied:'Aucune candidature.', no_saved_jobs:'Aucune offre sauvegardée.', no_posted:'Aucune offre publiée.', post_first:'Publier une offre',
    apps_count:'candidatures', view_apps:'▼ Voir candidats', close_apps:'▲ Fermer', no_apps:'Aucun candidat.', hire:'✓ Recruter', reject:'✗ Refuser',
    st_accepted:'Recruté', st_rejected:'Refusé', st_pending:'En attente', b_accepted:'✓ Recruté', b_rejected:'✗ Refusé', b_pending:'⏳ En attente',
    edit_job:'✏️ Modifier', delete_job:'🗑 Supprimer', close_job:'Fermer l’offre', reopen_job:'Rouvrir', confirm_del:'Supprimer cette offre ?', job_deleted:'Offre supprimée.', status_updated:'Statut mis à jour', post_new:'＋ Nouvelle offre',
    login_title:'Connexion à WorkMate', login_sub:'Matching emploi pour étudiants internationaux à Sydney', guest:'← Continuer comme invité',
    login_profile:'Connectez-vous pour créer votre profil', login_profile_desc:'Vos offres sauvegardées et candidatures apparaîtront ici.', signup_tab:'Inscription', login_tab:'Connexion', f_email:'Email', f_password:'Mot de passe', f_displayname:'Nom affiché', signup_btn:'Créer un compte', login_btn:'Connexion',
    err_required:'Veuillez saisir nom, email et mot de passe', err_password_short:'Le mot de passe doit contenir au moins 6 caractères', signup_ok:'Compte créé !', check_email:'Vérifiez votre email et cliquez le lien.',
    toast_login:'Connexion requise', toast_applied_already:'Déjà postulé', toast_applied_ok:'Candidature envoyée !', toast_logout:'Déconnecté', toast_profile:'Profil sauvegardé !', toast_no_poster:'Impossible d’envoyer un message : infos manquantes', toast_self_dm:'Impossible d’écrire à votre propre offre', toast_self_dm2:'Impossible de vous écrire à vous-même', toast_new_app:'📨 Nouvelle candidature reçue !', toast_closed:'Cette offre est fermée',
    eng_basic:'Anglais basique OK', eng_none:'Anglais presque inutile', eng_inter:'Intermédiaire+', not_set:'Non défini', parts:'', edit_title:'Modifier l’offre',
    founding_badge:'🎖 Founding Member · Gratuit à vie', founding_toast:'🎉 Vous êtes Founding Member ! Les publications sont gratuites à vie 🎊',
    home_badge:'Pré-lancement', home_title_guest:'Le recrutement hospitality à Sydney, simplifié.', home_sub_guest:'WorkMate connecte Working Holiday makers, étudiants internationaux et businesses hospitality à Sydney.',
    home_seekers_title:'Pour les chercheurs d’emploi', home_seekers_desc:'Créez votre profil maintenant pour être prêt quand les offres arrivent.', home_employers_title:'Pour les businesses', home_employers_desc:'Publiez une offre, consultez les candidats et envoyez des messages.',
    home_empty_jobs_title:'Les offres sont en préparation', home_empty_jobs_desc:'Inscrivez-vous maintenant pendant que les businesses préparent leurs annonces.', home_empty_jobs_btn:'Créer un profil', home_empty_saved_title:'Les offres sauvegardées apparaîtront ici', home_empty_saved_desc:'Sauvegardez les offres qui vous intéressent et revenez quand vous voulez.',
    install_title:'Ajouter WorkMate à l’écran d’accueil', install_desc:'Ouvrez-le comme une app et consultez offres, messages et candidats plus vite.', install_btn:'Ajouter', install_ios_hint:'Sur iPhone : touchez Partager, puis Ajouter à l’écran d’accueil.', install_browser_hint:'Dans le menu du navigateur, choisissez Ajouter à l’écran d’accueil ou Installer l’app.', install_not_now:'Pas maintenant',
    file_choose:'Choisir une photo', file_none:'Aucun fichier', cat_selected_suffix:'sélectionnés', cat_joiner:', ', category_add_job:'Ajouter un type de poste…', category_add_preferred:'Ajouter un poste souhaité…', password_ph:'6+ caractères', desc_ph:'Détails, horaires, exigences...', founding_promo:n => `🎖 Les 20 premiers businesses publient gratuitement à vie. ${n} places restantes.`, staff_employers_only:'Réservé aux employeurs', staff_post_required:'Publiez au moins une offre pour accéder.', filters_show:'Filtres', filters_hide:'Masquer filtres', filters_clear:'Effacer', filter_jobs_count:n => `${n} businesses correspondent`, filter_staff_count:n => `${n} candidats correspondent`, any_english:'Tout niveau d’anglais',
  }),
  pt: makeLang({
    nav_home:'Início', nav_jobs:'Vagas', nav_staff:'Equipe', nav_dm:'DM', nav_profile:'Perfil',
    tagline:'Encontre seu trabalho ideal em Sydney', section_nearby:'Vagas perto de você', section_saved:'Vagas salvas',
    role_q_title:'Como você quer usar o WorkMate?', role_q_sub:'Escolha a opção que combina com você.', role_seeker:'Estou procurando trabalho', role_seeker_desc:'Encontre negócios contratando e receba contatos.', role_employer:'Estou procurando staff', role_employer_desc:'Publique vagas e busque candidatos em Sydney.',
    emp_banner:'Publique uma vaga para desbloquear a busca de staff.', emp_banner_btn:'Publicar vaga', seeker_banner:'Configure seu perfil para aplicar ou receber contatos.', seeker_banner_btn:'Configurar perfil',
    profile_privacy_note:'Sua foto e dados são visíveis apenas para empregadores.', profile_photo_tip:'Use a foto que quiser. Adicionar foto aumenta suas chances.',
    login_cta_title:'Entre para usar todos os recursos', login_cta_desc:'Salve vagas, candidate-se e use mensagens em tempo real.', profile_completion:'Perfil completo', profile_hint:'Adicione foto, visto e disponibilidade para melhorar candidaturas.', complete_profile:'Completar perfil',
    quick_jobs:'Vagas de hoje', quick_jobs_sub:'Ver todas', quick_post:'Publicar vaga', quick_post_sub:'Para empregadores',
    search_jobs:'Buscar vagas', keyword_ph:'Buscar palavras-chave', all_areas:'Todas as áreas', eng_cond:'Nível de inglês', post_btn:'＋ Publicar vaga',
    no_jobs:'Nenhuma vaga.', view_detail:'Ver detalhes', save:'♡ Salvar', saved_btn:'♥ Salvo', loc_tbd:'Local a definir', salary_tbd:'Pagamento a definir', no_eng:'Sem requisito', back_jobs:'← Voltar às vagas',
    apply:'Candidatar-se', applied_done:'✓ Candidatado', applying:'Enviando...', apply_msg:'Mensagem (opcional)', apply_ph:'Apresente-se ou indique turnos preferidos...', send_apply:'Enviar candidatura', cancel:'Cancelar',
    view_map:'📍 Ver no Google Maps', dm_btn:'💬 Mensagem', badge_active:'Contratando', badge_closed:'Fechado',
    post_title:'Publicar vaga', post_login_title:'Login necessário para publicar', post_login_desc:'Entre para publicar vagas.',
    f_title:'Título da vaga *', f_company:'Nome do negócio *', f_location:'Local', f_salary:'Valor por hora', f_eng:'Requisito de inglês', f_desc:'Descrição', f_img:'Foto', f_categories:'Tipo de vaga (até 5)',
    map_verify_hint:'Confira se o pin está correto e ajuste o endereço se necessário.', save_btn:'Salvar', saving:'Salvando...', required_err:'Título e nome do negócio são obrigatórios.', job_saved:'Vaga publicada.',
    find_staff:'Encontrar staff', staff_desc:'Veja candidatos disponíveis em Sydney.', no_staff:'Ainda não há perfis.', contact:'💬 Contatar', visa_lbl:'🛂 Vencimento do visto:',
    dm_title:'Mensagens', dm_login_title:'Entre para usar mensagens', no_dm:'Ainda não há mensagens.', no_dm_hint:'Toque em “Mensagem” em uma vaga.', back_dm:'← Voltar às mensagens', type_msg:'Digite uma mensagem', send:'Enviar', first_msg:'Envie sua primeira mensagem 👋', loading:'Carregando...',
    logout:'Sair', tab_profile:'Perfil', tab_applied:'Candidaturas', tab_saved:'Salvas', tab_posted:'Minhas vagas',
    change_photo:'📷 Alterar foto', photo_pending:'Salve para aplicar',
    f_name:'Nome', f_eng_level:'Nível de inglês', f_avail:'Disponibilidade', f_visa:'Vencimento do visto', f_bio:'Bio', f_job_categories:'Tipos preferidos (até 5)',
    no_applied:'Nenhuma candidatura.', no_saved_jobs:'Nenhuma vaga salva.', no_posted:'Nenhuma vaga publicada.', post_first:'Publicar vaga',
    apps_count:'candidaturas', view_apps:'▼ Ver candidatos', close_apps:'▲ Fechar', no_apps:'Ainda não há candidatos.', hire:'✓ Contratar', reject:'✗ Rejeitar',
    st_accepted:'Contratado', st_rejected:'Rejeitado', st_pending:'Pendente', b_accepted:'✓ Contratado', b_rejected:'✗ Rejeitado', b_pending:'⏳ Pendente',
    edit_job:'✏️ Editar', delete_job:'🗑 Excluir', close_job:'Fechar vaga', reopen_job:'Reabrir', confirm_del:'Excluir esta vaga?', job_deleted:'Vaga excluída.', status_updated:'Status atualizado', post_new:'＋ Nova vaga',
    login_title:'Entrar no WorkMate', login_sub:'Job matching para estudantes internacionais em Sydney', guest:'← Continuar como visitante',
    login_profile:'Entre para criar seu perfil', login_profile_desc:'Vagas salvas e histórico aparecem aqui.', signup_tab:'Cadastrar', login_tab:'Entrar', f_email:'Email', f_password:'Senha', f_displayname:'Nome de exibição', signup_btn:'Criar conta', login_btn:'Entrar',
    err_required:'Preencha nome, email e senha', err_password_short:'A senha deve ter pelo menos 6 caracteres', signup_ok:'Conta criada!', check_email:'Confira o email e clique no link de confirmação.',
    toast_login:'Login necessário', toast_applied_already:'Você já se candidatou', toast_applied_ok:'Candidatura enviada!', toast_logout:'Você saiu', toast_profile:'Perfil salvo!', toast_no_poster:'Não é possível enviar mensagem: dados do anunciante indisponíveis', toast_self_dm:'Não é possível enviar mensagem para sua própria vaga', toast_self_dm2:'Não é possível enviar mensagem para si mesmo', toast_new_app:'📨 Nova candidatura recebida!', toast_closed:'Esta vaga está fechada',
    eng_basic:'Inglês básico OK', eng_none:'Quase sem inglês', eng_inter:'Intermediário+', not_set:'Não definido', parts:'', edit_title:'Editar vaga',
    founding_badge:'🎖 Founding Member · Grátis para sempre', founding_toast:'🎉 Você é Founding Member! Publicar vagas será grátis para sempre 🎊',
    home_badge:'Pré-lançamento', home_title_guest:'Contratação hospitality em Sydney, mais simples.', home_sub_guest:'WorkMate conecta Working Holiday makers e estudantes internacionais com negócios hospitality em Sydney.',
    home_seekers_title:'Para quem procura trabalho', home_seekers_desc:'Crie seu perfil agora e esteja pronto quando as vagas chegarem.', home_employers_title:'Para negócios', home_employers_desc:'Publique vagas, veja candidatos e envie mensagens.',
    home_empty_jobs_title:'As vagas estão sendo preparadas', home_empty_jobs_desc:'Cadastre-se agora enquanto os negócios começam a publicar.', home_empty_jobs_btn:'Criar perfil', home_empty_saved_title:'Vagas salvas aparecerão aqui', home_empty_saved_desc:'Quando as vagas chegarem, salve as que gostar e volte quando quiser.',
    install_title:'Adicionar WorkMate à tela inicial', install_desc:'Abra como app e veja vagas, mensagens e candidatos mais rápido.', install_btn:'Adicionar', install_ios_hint:'No iPhone: toque em Compartilhar e depois Adicionar à Tela de Início.', install_browser_hint:'Use o menu do navegador e escolha Adicionar à tela inicial ou Instalar app.', install_not_now:'Agora não',
    file_choose:'Escolher foto', file_none:'Nenhum arquivo', cat_selected_suffix:'selecionados', cat_joiner:', ', category_add_job:'Adicionar tipo de vaga…', category_add_preferred:'Adicionar função preferida…', password_ph:'6+ caracteres', desc_ph:'Detalhes, horários, requisitos...', founding_promo:n => `🎖 Os primeiros 20 negócios publicam vagas grátis para sempre. Restam ${n}.`, staff_employers_only:'Somente empregadores', staff_post_required:'Publique ao menos uma vaga para acessar.', filters_show:'Filtros', filters_hide:'Ocultar filtros', filters_clear:'Limpar', filter_jobs_count:n => `${n} negócios encontrados`, filter_staff_count:n => `${n} candidatos encontrados`, any_english:'Qualquer nível de inglês',
  }),
  vi: makeLang({
    nav_home:'Trang chủ', nav_jobs:'Việc làm', nav_staff:'Nhân sự', nav_dm:'Tin nhắn', nav_profile:'Hồ sơ',
    tagline:'Tìm công việc phù hợp ở Sydney', section_nearby:'Việc gần bạn', section_saved:'Việc đã lưu',
    role_q_title:'Bạn muốn dùng WorkMate để làm gì?', role_q_sub:'Chọn lựa chọn phù hợp với bạn.', role_seeker:'Tôi đang tìm việc', role_seeker_desc:'Tìm cửa hàng đang tuyển và nhận liên hệ từ nhà tuyển dụng.', role_employer:'Tôi đang tìm nhân viên', role_employer_desc:'Đăng việc và tìm ứng viên ở Sydney.',
    emp_banner:'Đăng việc để mở khóa tìm nhân viên.', emp_banner_btn:'Đăng việc', seeker_banner:'Thiết lập hồ sơ để ứng tuyển hoặc nhận liên hệ.', seeker_banner_btn:'Thiết lập hồ sơ',
    profile_privacy_note:'Ảnh và thông tin của bạn chỉ hiển thị cho nhà tuyển dụng.', profile_photo_tip:'Bạn có thể dùng ảnh tùy thích. Thêm ảnh giúp tăng cơ hội được liên hệ.',
    login_cta_title:'Đăng nhập để dùng đầy đủ tính năng', login_cta_desc:'Lưu việc, ứng tuyển và nhắn tin thời gian thực.', profile_completion:'Mức hoàn thiện hồ sơ', profile_hint:'Thêm ảnh, hạn visa và thời gian có thể làm để tăng tỉ lệ ứng tuyển.', complete_profile:'Hoàn thiện hồ sơ',
    quick_jobs:'Việc hôm nay', quick_jobs_sub:'Xem tất cả', quick_post:'Đăng việc', quick_post_sub:'Cho nhà tuyển dụng',
    search_jobs:'Tìm việc', keyword_ph:'Tìm từ khóa', all_areas:'Tất cả khu vực', eng_cond:'Yêu cầu tiếng Anh', post_btn:'＋ Đăng việc',
    no_jobs:'Chưa có việc.', view_detail:'Xem chi tiết', save:'♡ Lưu', saved_btn:'♥ Đã lưu', loc_tbd:'Chưa có địa điểm', salary_tbd:'Chưa có lương', no_eng:'Không yêu cầu', back_jobs:'← Quay lại việc làm',
    apply:'Ứng tuyển', applied_done:'✓ Đã ứng tuyển', applying:'Đang gửi...', apply_msg:'Tin nhắn (không bắt buộc)', apply_ph:'Giới thiệu bản thân hoặc ca mong muốn...', send_apply:'Gửi ứng tuyển', cancel:'Hủy',
    view_map:'📍 Xem trên Google Maps', dm_btn:'💬 Nhắn tin', badge_active:'Đang tuyển', badge_closed:'Đã đóng',
    post_title:'Đăng việc', post_login_title:'Cần đăng nhập để đăng việc', post_login_desc:'Hãy đăng nhập để đăng việc.',
    f_title:'Tiêu đề việc *', f_company:'Tên cửa hàng *', f_location:'Địa điểm', f_salary:'Lương giờ', f_eng:'Yêu cầu tiếng Anh', f_desc:'Mô tả công việc', f_img:'Ảnh', f_categories:'Loại việc (tối đa 5)',
    map_verify_hint:'Kiểm tra ghim bản đồ đúng vị trí và chỉnh địa chỉ nếu cần.', save_btn:'Lưu', saving:'Đang lưu...', required_err:'Tiêu đề và tên cửa hàng là bắt buộc.', job_saved:'Đã đăng việc.',
    find_staff:'Tìm nhân viên', staff_desc:'Xem ứng viên có thể làm ở Sydney.', no_staff:'Chưa có hồ sơ nhân viên.', contact:'💬 Liên hệ', visa_lbl:'🛂 Hạn visa:',
    dm_title:'Tin nhắn', dm_login_title:'Cần đăng nhập để dùng tin nhắn', no_dm:'Chưa có tin nhắn.', no_dm_hint:'Nhấn “Nhắn tin” trong trang chi tiết việc.', back_dm:'← Quay lại tin nhắn', type_msg:'Nhập tin nhắn', send:'Gửi', first_msg:'Gửi tin nhắn đầu tiên 👋', loading:'Đang tải...',
    logout:'Đăng xuất', tab_profile:'Hồ sơ', tab_applied:'Đã ứng tuyển', tab_saved:'Đã lưu', tab_posted:'Việc của tôi',
    change_photo:'📷 Đổi ảnh', photo_pending:'Lưu để áp dụng thay đổi',
    f_name:'Tên', f_eng_level:'Trình độ tiếng Anh', f_avail:'Thời gian có thể làm', f_visa:'Hạn visa', f_bio:'Giới thiệu', f_job_categories:'Loại việc mong muốn (tối đa 5)',
    no_applied:'Chưa ứng tuyển việc nào.', no_saved_jobs:'Chưa lưu việc nào.', no_posted:'Chưa đăng việc.', post_first:'Đăng việc',
    apps_count:'đơn ứng tuyển', view_apps:'▼ Xem ứng viên', close_apps:'▲ Đóng', no_apps:'Chưa có ứng viên.', hire:'✓ Tuyển', reject:'✗ Từ chối',
    st_accepted:'Đã tuyển', st_rejected:'Từ chối', st_pending:'Đang xét', b_accepted:'✓ Đã tuyển', b_rejected:'✗ Từ chối', b_pending:'⏳ Đang xét',
    edit_job:'✏️ Sửa', delete_job:'🗑 Xóa', close_job:'Đóng tuyển', reopen_job:'Mở lại', confirm_del:'Xóa việc này?', job_deleted:'Đã xóa việc.', status_updated:'Đã cập nhật trạng thái', post_new:'＋ Đăng việc mới',
    login_title:'Đăng nhập WorkMate', login_sub:'Ứng dụng kết nối việc làm cho du học sinh ở Sydney', guest:'← Tiếp tục với tư cách khách',
    login_profile:'Đăng nhập để tạo hồ sơ', login_profile_desc:'Việc đã lưu và lịch sử ứng tuyển sẽ hiển thị ở đây.', signup_tab:'Đăng ký', login_tab:'Đăng nhập', f_email:'Email', f_password:'Mật khẩu', f_displayname:'Tên hiển thị', signup_btn:'Tạo tài khoản', login_btn:'Đăng nhập',
    err_required:'Vui lòng nhập tên, email và mật khẩu', err_password_short:'Mật khẩu phải có ít nhất 6 ký tự', signup_ok:'Đã tạo tài khoản!', check_email:'Hãy kiểm tra email và nhấn link xác nhận.',
    toast_login:'Cần đăng nhập', toast_applied_already:'Bạn đã ứng tuyển', toast_applied_ok:'Đã gửi ứng tuyển!', toast_logout:'Đã đăng xuất', toast_profile:'Đã lưu hồ sơ!', toast_no_poster:'Không thể nhắn tin: thiếu thông tin người đăng', toast_self_dm:'Không thể nhắn tin cho việc của chính bạn', toast_self_dm2:'Không thể nhắn tin cho chính bạn', toast_new_app:'📨 Có ứng tuyển mới!', toast_closed:'Việc này đã đóng',
    eng_basic:'Tiếng Anh cơ bản OK', eng_none:'Gần như không cần tiếng Anh', eng_inter:'Trung cấp+', not_set:'Chưa đặt', parts:'', edit_title:'Sửa việc',
    founding_badge:'🎖 Founding Member · Miễn phí mãi mãi', founding_toast:'🎉 Bạn là Founding Member! Đăng việc miễn phí mãi mãi 🎊',
    home_badge:'Sắp ra mắt', home_title_guest:'Tuyển dụng hospitality ở Sydney, đơn giản hơn.', home_sub_guest:'WorkMate kết nối Working Holiday makers, du học sinh và doanh nghiệp hospitality ở Sydney.',
    home_seekers_title:'Cho người tìm việc', home_seekers_desc:'Tạo hồ sơ ngay để sẵn sàng khi có việc mới.', home_employers_title:'Cho doanh nghiệp', home_employers_desc:'Đăng việc, xem ứng viên và nhắn tin trực tiếp.',
    home_empty_jobs_title:'Việc làm đang được chuẩn bị', home_empty_jobs_desc:'Đăng ký trước trong khi doanh nghiệp bắt đầu đăng việc.', home_empty_jobs_btn:'Tạo hồ sơ', home_empty_saved_title:'Việc đã lưu sẽ hiện ở đây', home_empty_saved_desc:'Khi có việc mới, hãy lưu việc bạn thích để xem lại.',
    install_title:'Thêm WorkMate vào màn hình chính', install_desc:'Mở như ứng dụng và xem việc, tin nhắn, ứng viên nhanh hơn.', install_btn:'Thêm vào màn hình chính', install_ios_hint:'Trên iPhone: nhấn Chia sẻ, rồi Thêm vào màn hình chính.', install_browser_hint:'Dùng menu trình duyệt và chọn Thêm vào màn hình chính hoặc Cài ứng dụng.', install_not_now:'Để sau',
    file_choose:'Chọn ảnh', file_none:'Chưa chọn file', cat_selected_suffix:'đã chọn', cat_joiner:', ', category_add_job:'Thêm loại việc…', category_add_preferred:'Thêm vai trò mong muốn…', password_ph:'6+ ký tự', desc_ph:'Chi tiết, giờ làm, yêu cầu...', founding_promo:n => `🎖 20 doanh nghiệp đầu tiên được đăng việc miễn phí mãi mãi! Còn ${n} suất.`, staff_employers_only:'Chỉ dành cho nhà tuyển dụng', staff_post_required:'Đăng ít nhất 1 việc để truy cập.', filters_show:'Bộ lọc', filters_hide:'Ẩn bộ lọc', filters_clear:'Xóa', filter_jobs_count:n => `${n} việc phù hợp`, filter_staff_count:n => `${n} ứng viên phù hợp`, any_english:'Mọi trình độ tiếng Anh',
  }),
  id: makeLang({
    nav_home:'Beranda', nav_jobs:'Lowongan', nav_staff:'Staf', nav_dm:'DM', nav_profile:'Profil',
    tagline:'Temukan pekerjaan ideal di Sydney', section_nearby:'Lowongan terdekat', section_saved:'Lowongan tersimpan',
    role_q_title:'Apa tujuanmu memakai WorkMate?', role_q_sub:'Pilih opsi yang paling cocok.', role_seeker:'Saya mencari kerja', role_seeker_desc:'Cari bisnis yang merekrut dan dapatkan kontak dari employer.', role_employer:'Saya mencari staf', role_employer_desc:'Posting lowongan dan cari kandidat di Sydney.',
    emp_banner:'Posting lowongan untuk membuka pencarian staf.', emp_banner_btn:'Posting lowongan', seeker_banner:'Atur profil untuk melamar atau mendapat kontak.', seeker_banner_btn:'Atur profil',
    profile_privacy_note:'Foto dan detail hanya terlihat oleh employer, tidak publik.', profile_photo_tip:'Gunakan foto apa pun. Foto meningkatkan peluang dihubungi.',
    login_cta_title:'Masuk untuk memakai semua fitur', login_cta_desc:'Simpan lowongan, melamar, dan gunakan DM real-time.', profile_completion:'Kelengkapan profil', profile_hint:'Tambahkan foto, masa berlaku visa, dan ketersediaan untuk meningkatkan peluang.', complete_profile:'Lengkapi profil',
    quick_jobs:'Lowongan hari ini', quick_jobs_sub:'Lihat semua', quick_post:'Posting lowongan', quick_post_sub:'Untuk employer',
    search_jobs:'Cari lowongan', keyword_ph:'Cari kata kunci', all_areas:'Semua area', eng_cond:'Syarat Inggris', post_btn:'＋ Posting lowongan',
    no_jobs:'Belum ada lowongan.', view_detail:'Lihat detail', save:'♡ Simpan', saved_btn:'♥ Tersimpan', loc_tbd:'Lokasi belum ditentukan', salary_tbd:'Gaji belum ditentukan', no_eng:'Tidak ada syarat', back_jobs:'← Kembali ke lowongan',
    apply:'Lamar', applied_done:'✓ Sudah melamar', applying:'Mengirim...', apply_msg:'Pesan (opsional)', apply_ph:'Perkenalkan diri atau sebutkan shift yang diinginkan...', send_apply:'Kirim lamaran', cancel:'Batal',
    view_map:'📍 Lihat di Google Maps', dm_btn:'💬 DM', badge_active:'Merekrut', badge_closed:'Tutup',
    post_title:'Posting lowongan', post_login_title:'Login diperlukan untuk posting', post_login_desc:'Masuk untuk posting lowongan.',
    f_title:'Judul lowongan *', f_company:'Nama bisnis *', f_location:'Lokasi', f_salary:'Upah per jam', f_eng:'Syarat Inggris', f_desc:'Deskripsi pekerjaan', f_img:'Foto', f_categories:'Jenis pekerjaan (maks. 5)',
    map_verify_hint:'Pastikan pin sudah benar dan ubah alamat jika perlu.', save_btn:'Simpan', saving:'Menyimpan...', required_err:'Judul dan nama bisnis wajib diisi.', job_saved:'Lowongan berhasil diposting.',
    find_staff:'Cari staf', staff_desc:'Lihat kandidat yang tersedia di Sydney.', no_staff:'Belum ada profil staf.', contact:'💬 Hubungi', visa_lbl:'🛂 Masa berlaku visa:',
    dm_title:'Pesan', dm_login_title:'Masuk untuk memakai pesan', no_dm:'Belum ada pesan.', no_dm_hint:'Ketuk “DM” di detail lowongan.', back_dm:'← Kembali ke pesan', type_msg:'Tulis pesan', send:'Kirim', first_msg:'Kirim pesan pertama 👋', loading:'Memuat...',
    logout:'Keluar', tab_profile:'Profil', tab_applied:'Lamaran', tab_saved:'Tersimpan', tab_posted:'Lowongan saya',
    change_photo:'📷 Ganti foto', photo_pending:'Simpan untuk menerapkan',
    f_name:'Nama', f_eng_level:'Level Inggris', f_avail:'Ketersediaan', f_visa:'Masa berlaku visa', f_bio:'Bio', f_job_categories:'Jenis pekerjaan pilihan (maks. 5)',
    no_applied:'Belum ada lamaran.', no_saved_jobs:'Belum ada lowongan tersimpan.', no_posted:'Belum ada lowongan.', post_first:'Posting lowongan',
    apps_count:'lamaran', view_apps:'▼ Lihat pelamar', close_apps:'▲ Tutup', no_apps:'Belum ada pelamar.', hire:'✓ Rekrut', reject:'✗ Tolak',
    st_accepted:'Direkrut', st_rejected:'Ditolak', st_pending:'Menunggu', b_accepted:'✓ Direkrut', b_rejected:'✗ Ditolak', b_pending:'⏳ Menunggu',
    edit_job:'✏️ Edit', delete_job:'🗑 Hapus', close_job:'Tutup lowongan', reopen_job:'Buka lagi', confirm_del:'Hapus lowongan ini?', job_deleted:'Lowongan dihapus.', status_updated:'Status diperbarui', post_new:'＋ Posting lowongan baru',
    login_title:'Masuk ke WorkMate', login_sub:'Job matching untuk pelajar internasional di Sydney', guest:'← Lanjut sebagai tamu',
    login_profile:'Masuk untuk membuat profil', login_profile_desc:'Lowongan tersimpan dan riwayat lamaran muncul di sini.', signup_tab:'Daftar', login_tab:'Masuk', f_email:'Email', f_password:'Password', f_displayname:'Nama tampilan', signup_btn:'Buat akun', login_btn:'Masuk',
    err_required:'Isi nama, email, dan password', err_password_short:'Password minimal 6 karakter', signup_ok:'Akun dibuat!', check_email:'Cek email dan klik link konfirmasi.',
    toast_login:'Login diperlukan', toast_applied_already:'Sudah melamar', toast_applied_ok:'Lamaran terkirim!', toast_logout:'Keluar', toast_profile:'Profil disimpan!', toast_no_poster:'Tidak bisa DM: info poster tidak tersedia', toast_self_dm:'Tidak bisa DM lowongan sendiri', toast_self_dm2:'Tidak bisa DM diri sendiri', toast_new_app:'📨 Lamaran baru diterima!', toast_closed:'Lowongan ini sudah ditutup',
    eng_basic:'Inggris dasar OK', eng_none:'Hampir tidak perlu Inggris', eng_inter:'Menengah+', not_set:'Belum diatur', parts:'', edit_title:'Edit lowongan',
    founding_badge:'🎖 Founding Member · Gratis selamanya', founding_toast:'🎉 Kamu Founding Member! Posting lowongan gratis selamanya 🎊',
    home_badge:'Pra-peluncuran', home_title_guest:'Hiring hospitality di Sydney, lebih simpel.', home_sub_guest:'WorkMate menghubungkan Working Holiday makers, pelajar internasional, dan bisnis hospitality di Sydney.',
    home_seekers_title:'Untuk pencari kerja', home_seekers_desc:'Buat profil sekarang agar siap saat lowongan muncul.', home_employers_title:'Untuk bisnis', home_employers_desc:'Posting lowongan, lihat kandidat, dan kirim pesan langsung.',
    home_empty_jobs_title:'Lowongan sedang disiapkan', home_empty_jobs_desc:'Daftar sekarang sambil bisnis mulai memposting lowongan.', home_empty_jobs_btn:'Buat profil', home_empty_saved_title:'Lowongan tersimpan akan muncul di sini', home_empty_saved_desc:'Saat lowongan tersedia, simpan yang kamu suka dan cek lagi nanti.',
    install_title:'Tambahkan WorkMate ke Home Screen', install_desc:'Buka seperti aplikasi dan cek lowongan, pesan, serta pelamar lebih cepat.', install_btn:'Tambahkan ke Home Screen', install_ios_hint:'Di iPhone: ketuk Share, lalu Add to Home Screen.', install_browser_hint:'Gunakan menu browser dan pilih Add to Home Screen atau Install app.', install_not_now:'Nanti saja',
    file_choose:'Pilih foto', file_none:'Belum ada file', cat_selected_suffix:'dipilih', cat_joiner:', ', category_add_job:'Tambah jenis pekerjaan…', category_add_preferred:'Tambah role pilihan…', password_ph:'6+ karakter', desc_ph:'Detail, jam kerja, syarat...', founding_promo:n => `🎖 20 bisnis pertama bisa posting lowongan gratis selamanya! Sisa ${n}.`, staff_employers_only:'Khusus employer', staff_post_required:'Posting minimal 1 lowongan untuk akses.', filters_show:'Filter', filters_hide:'Sembunyikan filter', filters_clear:'Bersihkan', filter_jobs_count:n => `${n} bisnis cocok dengan filter`, filter_staff_count:n => `${n} kandidat cocok dengan filter`, any_english:'Level Inggris apa saja',
  }),
})

const LANGS = [
  { code:'en', flag:'🇦🇺', label:'English' },
  { code:'ja', flag:'🇯🇵', label:'日本語' },
  { code:'ko', flag:'🇰🇷', label:'한국어' },
  { code:'zh', flag:'🇨🇳', label:'中文（简体）' },
  { code:'es', flag:'🇪🇸', label:'Español' },
  { code:'fr', flag:'🇫🇷', label:'Français' },
  { code:'pt', flag:'🇧🇷', label:'Português' },
  { code:'vi', flag:'🇻🇳', label:'Tiếng Việt' },
  { code:'id', flag:'🇮🇩', label:'Bahasa Indonesia' },
]

const LANG_LOCALES = {
  en:'en-AU', ja:'ja-JP', ko:'ko-KR', zh:'zh-CN', es:'es-ES', fr:'fr-FR',
  pt:'pt-BR', vi:'vi-VN', id:'id-ID',
}

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

// データはja正規で保存し、enモードでは英語ラベルに変換して表示
// 旧マスタで保存された値（DBに残存）は個別エイリアスで対応
const CAT_EN = {
  'キッチン・厨房':'Kitchen', 'レストラン':'Restaurant',
  ...Object.fromEntries(JOB_CATEGORIES.flatMap(g => g.items.map(({ ja, en }) => [ja, en]))),
}
const CAT_JA = Object.fromEntries(JOB_CATEGORIES.flatMap(g => g.items.map(({ ja, en }) => [en, ja])))
const catEnglish = c => CAT_EN[c] || c || ''
const catLabel = (c, lang) => (lang === 'ja' ? (CAT_JA[c] || c) : catEnglish(c))
const catKey = c => catEnglish(c)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
const sameCat = (a, b) => {
  if (!a || !b) return false
  const ak = catKey(a)
  const bk = catKey(b)
  return a === b || (ak && bk && (ak === bk || ak.includes(bk) || bk.includes(ak)))
}
// 複数選択カテゴリ（配列）用ヘルパー
const hasCat    = (list, c) => Array.isArray(list) && list.some(x => sameCat(x, c))
const toggleCat = (list, c) => hasCat(list, c) ? list.filter(x => !sameCat(x, c)) : [...list, c]
const catSearchTerms = c => [c, catEnglish(c), CAT_JA[catEnglish(c)] || ''].filter(Boolean)
const uniqueCatOptions = cats => {
  const seen = new Set()
  return cats.map(catEnglish).filter(c => {
    const key = catKey(c)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}
const ALL_CATEGORY_OPTIONS = uniqueCatOptions(JOB_CATEGORIES.flatMap(g => g.items.map(({ en }) => en)))

// 各行: [ja表示, en表示, ...旧データの別表記]
const ENG_PAIRS = [['英語初級OK','Basic English OK','basic','Basic'], ['英語ほぼ不要','No English needed'], ['Intermediate以上','Intermediate+']]
const engLabel = (v, lang) => { for (const p of ENG_PAIRS) { if (p.includes(v)) return lang === 'ja' ? p[0] : p[1] } return v }
const sameEng  = (a, b) => a === b || ENG_PAIRS.some(p => p.includes(a) && p.includes(b))

const DAY_EN = { '月':'Mon', '火':'Tue', '水':'Wed', '木':'Thu', '金':'Fri', '土':'Sat', '日':'Sun' }
const availLabel = (v, lang) => (!v || lang === 'ja') ? v : v.replace(/[月火水木金土日]/g, d => DAY_EN[d]).replace(/・/g, ' / ').replace('〜', '–')

// CategoryPicker コンポーネント
function CategoryPicker({ value, onChange, max = 5 }) {
  const { lang, t } = useT()
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
                  background: active ? 'linear-gradient(135deg,#7c3f12,#c2692a)' : 'var(--bg2)',
                  color: active ? '#fdf9f5' : 'var(--muted2)',
                  boxShadow: active ? '0 0 10px rgba(155,79,26,0.25)' : 'none',
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
          ✓ {selected.length}/{max} {t.cat_selected_suffix}: {selected.map(c => catLabel(c, lang)).join(t.cat_joiner)}
        </p>
      )}
    </div>
  )
}

// ─── 地図プレビュー（住所入力中に自動表示）───────
function MapPreview({ query, hint }) {
  const [liveQuery, setLiveQuery] = useState('')
  const timer = useRef(null)
  useEffect(() => {
    clearTimeout(timer.current)
    if (!query?.trim()) { setLiveQuery(''); return }
    timer.current = setTimeout(() => setLiveQuery(query.trim()), 900)
    return () => clearTimeout(timer.current)
  }, [query])
  if (!liveQuery) return null
  // シドニー以外の同名地名に飛ばないよう、地域指定がなければ Sydney を補う
  const lowerQ = liveQuery.toLowerCase()
  const mapQuery = (lowerQ.includes('sydney') || lowerQ.includes('nsw') || lowerQ.includes('australia'))
    ? liveQuery
    : `${liveQuery}, Sydney NSW Australia`
  return (
    <div className="map-preview">
      <iframe
        key={mapQuery}
        title="map-preview"
        src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&hl=en`}
        loading="lazy"
        allowFullScreen
      />
      <p className="map-preview-hint">📍 {hint}</p>
    </div>
  )
}

function ImageFilePicker({ file, onChange }) {
  const { t } = useT()
  const inputId = useMemo(() => `image-file-${Math.random().toString(36).slice(2)}`, [])

  return (
    <div className="file-picker">
      <input
        id={inputId}
        className="file-picker-input"
        type="file"
        accept="image/*"
        onChange={e => onChange(e.target.files?.[0] || null)}
      />
      <label className="file-picker-button" htmlFor={inputId}>{t.file_choose}</label>
      <span className="file-picker-name">{file?.name || t.file_none}</span>
    </div>
  )
}

const fmt = (d, lang='en') =>
  new Date(d).toLocaleString(LANG_LOCALES[lang] || 'en-AU',
    { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })

function LangSelector({ lang, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = LANGS.find(l => l.code === lang) || LANGS[0]

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="lang-selector" ref={ref}>
      <button className="lang-selector-btn" onClick={() => setOpen(v => !v)} aria-label="Select language">
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{current.code.toUpperCase()}</span>
        <span className="lang-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="lang-dropdown">
          {LANGS.map(l => (
            <button
              key={l.code}
              className={'lang-option' + (l.code === lang ? ' active' : '')}
              onClick={() => { onChange(l.code); setOpen(false) }}
            >
              <span className="lang-flag">{l.flag}</span>
              <span className="lang-option-label">{l.label}</span>
              {l.code === lang && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════
//  App
// ═════════════════════════════════════════════
function App() {
  const [lang, setLang]     = useState(() => localStorage.getItem('wm_lang') || 'en')
  const safeLang = T[lang] ? lang : 'en'
  const t = T[safeLang]
  const changeLang = l => {
    const next = T[l] ? l : 'en'
    setLang(next)
    localStorage.setItem('wm_lang', next)
  }
  const isDemo = useMemo(() => new URLSearchParams(window.location.search).get('demo') === '1', [])
  const isDemoTour = useMemo(() => new URLSearchParams(window.location.search).get('tour') === '1', [])

  const [page, setPage]               = useState('home')
  const [role, setRole]               = useState(() => localStorage.getItem('wm_role') || '')
  const chooseRole = r => { localStorage.setItem('wm_role', r); setRole(r) }
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
  const [jobCategory, setJobCategory] = useState([])
  const [staffSearch, setStaffSearch] = useState('')
  const [staffCategory, setStaffCategory] = useState([])
  const [staffEnglish, setStaffEnglish] = useState('')
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId]   = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [editingJob, setEditingJob]   = useState(null)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installDismissed, setInstallDismissed] = useState(() => localStorage.getItem('wm_install_dismissed') === '1')
  const [isStandalone, setIsStandalone] = useState(() => isStandaloneApp())
  const [isIos] = useState(() => isIosDevice())

  const notify = useCallback((msg, ms=3000) => {
    setToast(msg); setTimeout(() => setToast(''), ms)
  }, [])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const canRegister =
      window.location.protocol === 'https:' ||
      ['localhost', '127.0.0.1'].includes(window.location.hostname)
    if (!canRegister) return
    navigator.serviceWorker.register('/sw.js').catch(console.warn)
  }, [])

  useEffect(() => {
    const onBeforeInstallPrompt = e => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    const onInstalled = () => {
      setIsStandalone(true)
      setInstallPrompt(null)
      localStorage.setItem('wm_install_dismissed', '1')
      setInstallDismissed(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    const media = window.matchMedia?.('(display-mode: standalone)')
    const onDisplayModeChange = () => setIsStandalone(isStandaloneApp())
    media?.addEventListener?.('change', onDisplayModeChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      media?.removeEventListener?.('change', onDisplayModeChange)
    }
  }, [])

  async function addToHomeScreen() {
    if (!installPrompt) return false
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    setInstallPrompt(null)
    if (choice?.outcome === 'accepted') {
      localStorage.setItem('wm_install_dismissed', '1')
      setInstallDismissed(true)
    }
    return choice?.outcome === 'accepted'
  }

  function dismissInstallCard() {
    localStorage.setItem('wm_install_dismissed', '1')
    setInstallDismissed(true)
  }

  useEffect(() => {
    if (!isDemo) return
    setSession(demoSession)
    setProfile(demoProfile)
    setJobs(demoJobs)
    setSavedJobIds(demoSavedJobIds)
    setApplications(demoApplications)
    setPostedJobs(demoPostedJobs)
    setConversations(demoConversations)
    setUnreadCount(3)
    setPage('home')
  }, [isDemo])

  useEffect(() => {
    if (!isDemo || !isDemoTour) return
    const steps = [
      [900,  () => { setPage('jobs'); setSearch('barista'); setArea(''); setEnglish('') }],
      [2300, () => setEnglish(T.en.eng_basic)],
      [3700, () => { setSearch('kitchen'); setEnglish('') }],
      [5200, () => { setSelectedJob(demoJobs[1]); setPage('job') }],
      [7200, () => { setPage('staff'); setStaffSearch('barista'); setStaffCategory(['Barista']); setStaffEnglish('Basic English OK') }],
      [9800, () => { setActiveConvId('demo-conv-1'); setPage('chat') }],
      [12500, () => setPage('profile')],
    ].map(([ms, fn]) => setTimeout(fn, ms))
    return () => steps.forEach(clearTimeout)
  }, [isDemo, isDemoTour])

  // ── 認証 ──────────────────────────────────
  useEffect(() => {
    if (isDemo) return
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
    if (isDemo) return
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
    if (isDemo || !session) return
    const uid = session.user.id
    const ch = supabase.channel('conv-rt')
      .on('postgres_changes', { event:'*', schema:'public', table:'conversations', filter:`participant_a=eq.${uid}` }, () => loadUserData(uid))
      .on('postgres_changes', { event:'*', schema:'public', table:'conversations', filter:`participant_b=eq.${uid}` }, () => loadUserData(uid))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [session, isDemo])

  // ── 新着応募通知（リアルタイム）──────────────
  useEffect(() => {
    if (isDemo || !session || !postedJobs.length) return
    const ch = supabase.channel('new-apps-rt')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'applications' }, payload => {
        if (postedJobs.some(j => j.id === payload.new.job_id)) {
          notify(t.toast_new_app)
          loadUserData(session.user.id)
        }
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [session, postedJobs, isDemo])

  const filteredJobs = useMemo(() => jobs.filter(j => {
    if (j.is_active === false) return false
    const categoryTerms = parseCats(j.categories).flatMap(catSearchTerms)
    const tx = [
      j.title, j.company, j.location, j.salary, j.english_level, j.description, j.categories,
      engLabel(j.english_level, 'en'), engLabel(j.english_level, 'ja'),
      ...categoryTerms,
    ].join(' ').toLowerCase()
    return (!search || tx.includes(search.toLowerCase()))
        && (!area    || j.location      === area)
        && (!english || sameEng(j.english_level, english))
        && (!jobCategory.length || parseCats(j.categories).some(c => jobCategory.some(sel => sameCat(c, sel))))
  }), [jobs, search, area, english, jobCategory])

  // ── アクション ─────────────────────────────
  function openJob(job) { setSelectedJob(job); setPage('job') }

  async function toggleSave(jobId) {
    if (isDemo) {
      setSavedJobIds(p => p.includes(jobId) ? p.filter(x => x !== jobId) : [...p, jobId])
      return
    }
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
    if (isDemo) {
      if (applications.some(a => a.job_id === job.id)) { notify(t.toast_applied_already); return false }
      setApplications(p => [...p, { id:`demo-user-app-${Date.now()}`, user_id:demoSession.user.id, job_id:job.id, message:msg, status:'pending' }])
      notify(t.toast_applied_ok)
      return true
    }
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
    if (isDemo) {
      const ex = demoConversations.find(c => c.job_id === job.id) || demoConversations[0]
      setActiveConvId(ex.id); setPage('chat')
      return
    }
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
    if (isDemo) {
      const ex = demoConversations.find(c => c.participant_b === targetUid) || demoConversations[2]
      setActiveConvId(ex.id); setPage('chat')
      return
    }
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
    if (isDemo) {
      setPostedJobs(p => p.map(j => ({
        ...j,
        applications:(j.applications||[]).map(a => a.id === appId ? { ...a, status } : a)
      })))
      notify(status === 'accepted' ? t.hire : status === 'rejected' ? t.reject : t.status_updated)
      return
    }
    const { error } = await supabase.from('applications').update({ status }).eq('id', appId)
    if (error) { notify(error.message); return }
    if (session) loadUserData(session.user.id)
    notify(status === 'accepted' ? t.hire : status === 'rejected' ? t.reject : t.status_updated)
  }

  // ── 求人ステータス切替 ────────────────────
  async function toggleJobStatus(jobId, isActive) {
    if (isDemo) {
      setJobs(p => p.map(j => j.id === jobId ? { ...j, is_active:!isActive } : j))
      setPostedJobs(p => p.map(j => j.id === jobId ? { ...j, is_active:!isActive } : j))
      notify(t.status_updated)
      return
    }
    const { error } = await supabase.from('jobs').update({ is_active:!isActive }).eq('id', jobId)
    if (error) { notify(error.message); return }
    if (session) loadUserData(session.user.id)
    await loadJobs()
    notify(t.status_updated)
  }

  // ── 求人削除 ──────────────────────────────
  async function deleteJob(jobId) {
    if (isDemo) {
      setJobs(p => p.filter(j => j.id !== jobId))
      setPostedJobs(p => p.filter(j => j.id !== jobId))
      notify(t.job_deleted)
      return
    }
    if (!window.confirm(t.confirm_del)) return
    const { error } = await supabase.from('jobs').delete().eq('id', jobId)
    if (error) { notify(error.message); return }
    if (session) loadUserData(session.user.id)
    await loadJobs()
    notify(t.job_deleted)
  }

  // ── 既読処理 ──────────────────────────────
  async function markConvRead(convId) {
    if (isDemo) { setUnreadCount(0); return }
    if (!session) return
    await supabase.from('messages').update({ read:true })
      .eq('conversation_id', convId).eq('read', false).neq('sender_id', session.user.id)
    const convIds = conversations.map(c => c.id)
    fetchUnread(session.user.id, convIds)
  }

  function openMap(loc) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc || 'Sydney')}`, '_blank')
  }

  async function signOut() {
    await supabase.auth.signOut(); setPage('home'); notify(t.toast_logout)
  }

  const avatarLetter = profile?.display_name?.[0]?.toUpperCase()
    || session?.user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <LangCtx.Provider value={{ lang:safeLang, setLang:changeLang, t }}>
      {/* 言語セレクター（固定）*/}
      <LangSelector lang={safeLang} onChange={changeLang} />

      {toast && <div className="toast">{toast}<button onClick={() => setToast('')}>×</button></div>}
      {isDemo && <DemoRecordingBar isTour={isDemoTour} />}

      {page === 'home'    && <Home jobs={jobs} openJob={openJob} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} session={session} profile={profile} avatarLetter={avatarLetter} role={role} installPrompt={{
        canInstall:Boolean(installPrompt),
        isIos,
        isStandalone,
        dismissed:installDismissed,
        onInstall:addToHomeScreen,
        onDismiss:dismissInstallCard,
      }} />}
      {page === 'jobs'    && <Jobs jobs={filteredJobs} allJobs={jobs} openJob={openJob} search={search} setSearch={setSearch} area={area} setArea={setArea} english={english} setEnglish={setEnglish} jobCategory={jobCategory} setJobCategory={setJobCategory} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} />}
      {page === 'post'    && <PostJob setPage={setPage} loadJobs={loadJobs} loadUserData={() => session && loadUserData(session.user.id)} notify={notify} session={session} />}
      {page === 'job' && selectedJob && <JobDetail job={selectedJob} setPage={setPage} isSaved={isSaved} toggleSave={toggleSave} startDM={startDM} applyToJob={applyToJob} hasApplied={hasApplied} openMap={openMap} session={session} />}
      {page === 'staff'   && <Staff setPage={setPage} session={session} startStaffDM={startStaffDM} isEmployer={session && postedJobs.length > 0} demoStaff={isDemo ? demoStaff : null} staffSearch={staffSearch} setStaffSearch={setStaffSearch} staffCategory={staffCategory} setStaffCategory={setStaffCategory} staffEnglish={staffEnglish} setStaffEnglish={setStaffEnglish} />}
      {page === 'dm'      && <DM conversations={conversations} setActiveConvId={setActiveConvId} setPage={setPage} session={session} />}
      {page === 'chat'    && <Chat convId={activeConvId} setPage={setPage} session={session} conversations={conversations} setConversations={setConversations} notify={notify} markConvRead={markConvRead} lang={safeLang} demoMessages={isDemo ? demoMessages : null} />}
      {page === 'profile' && <Profile setPage={setPage} session={session} profile={profile} setProfile={setProfile} notify={notify} signOut={signOut} applications={applications} jobs={jobs} isSaved={isSaved} openJob={openJob} savedJobIds={savedJobIds} postedJobs={postedJobs} updateAppStatus={updateAppStatus} toggleJobStatus={toggleJobStatus} deleteJob={deleteJob} setEditingJob={setEditingJob} role={role} />}
      {page === 'login'   && <Login setPage={setPage} notify={notify} />}

      {editingJob && <EditJobModal job={editingJob} onClose={() => setEditingJob(null)} notify={notify} session={session} loadJobs={loadJobs} loadUserData={() => session && loadUserData(session.user.id)} />}

      {!role && !isDemo && <RoleSelect chooseRole={chooseRole} />}

      {role === 'employer' && postedJobs.length === 0 && page !== 'post' && page !== 'login' && (
        <RoleBanner icon="📋" text={t.emp_banner} btn={t.emp_banner_btn} onClick={() => setPage('post')} />
      )}
      {role === 'seeker' && !profile?.avatar_url && page !== 'profile' && page !== 'login' && (
        <RoleBanner icon="✨" text={t.seeker_banner} btn={t.seeker_banner_btn} onClick={() => setPage(session ? 'profile' : 'login')} />
      )}

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
//  Guest Banner
// ═════════════════════════════════════════════
function DemoRecordingBar({ isTour }) {
  return (
    <div className="demo-rec-bar">
      <b>Recording demo mode</b>
      <span>{isTour ? 'Auto tour: search, results, staff, DM, dashboard.' : 'Add &tour=1 to run the automatic walkthrough.'}</span>
    </div>
  )
}

function RoleSelect({ chooseRole }) {
  const { t } = useT()
  return (
    <div className="role-overlay">
      <div className="role-card">
        <div className="role-logo">WM</div>
        <p className="role-kicker">{t.home_badge}</p>
        <h2>{t.role_q_title}</h2>
        <p className="muted">{t.role_q_sub}</p>
        <button className="role-option" onClick={() => chooseRole('seeker')}>
          <span className="role-emoji">🔍</span>
          <span className="role-text"><b>{t.role_seeker}</b><small>{t.role_seeker_desc}</small></span>
        </button>
        <button className="role-option" onClick={() => chooseRole('employer')}>
          <span className="role-emoji">🏪</span>
          <span className="role-text"><b>{t.role_employer}</b><small>{t.role_employer_desc}</small></span>
        </button>
      </div>
    </div>
  )
}

function RoleBanner({ icon, text, btn, onClick }) {
  return (
    <div className="guest-banner">
      <span>{icon} {text}</span>
      <button className="primary" onClick={onClick}>{btn}</button>
    </div>
  )
}

// ═════════════════════════════════════════════
//  Login
// ═════════════════════════════════════════════
function Login({ setPage, notify }) {
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
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Smith" />
            </label>
          )}
          <label>{t.f_email}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>{t.f_password}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.password_ph} />
          </label>
          <button className="primary" style={{ width:'100%', padding:'14px', fontSize:16, marginTop:4 }}
            onClick={tab==='signup' ? handleSignup : handleLogin} disabled={busy}>
            {busy ? '...' : tab==='signup' ? t.signup_btn : t.login_btn}
          </button>
        </div>

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
function AddToHomeCard({ installPrompt }) {
  const { t } = useT()
  if (!installPrompt || installPrompt.dismissed || installPrompt.isStandalone) return null
  const hint = installPrompt.isIos ? t.install_ios_hint : t.install_browser_hint
  return (
    <section className="install-card" aria-label={t.install_title}>
      <div className="install-icon">📱</div>
      <div className="install-copy">
        <b>{t.install_title}</b>
        <p>{t.install_desc}</p>
        <small>{hint}</small>
      </div>
      <div className="install-actions">
        {installPrompt.canInstall && (
          <button className="primary" onClick={installPrompt.onInstall}>{t.install_btn}</button>
        )}
        <button className="install-dismiss" onClick={installPrompt.onDismiss}>{t.install_not_now}</button>
      </div>
    </section>
  )
}

function Home({ jobs, openJob, setPage, isSaved, toggleSave, session, profile, avatarLetter, role, installPrompt }) {
  const { t } = useT()
  const openJobs = jobs.filter(j => j.is_active !== false)
  const savedJobsList = jobs.filter(j => isSaved(j.id))
  const displayName   = profile?.display_name || session?.user?.email?.split('@')[0] || 'Guest'
  const fields = [profile?.display_name, profile?.bio, profile?.availability, profile?.visa_expiry, profile?.avatar_url]
  const pct    = Math.round((fields.filter(Boolean).length / fields.length) * 100)
  const hasSelectedRole = Boolean(role)
  const isEmployer = role === 'employer'
  return (
    <main className={hasSelectedRole ? 'home-main role-selected' : 'home-main'}>
      <section className={hasSelectedRole ? 'hero home-hero home-hero-compact' : 'hero home-hero'}>
        <div className="hero-copy">
          <p className="eyebrow">{t.home_badge}</p>
          <h1>{session ? `Hi, ${displayName.split(' ')[0]}` : t.home_title_guest}</h1>
          <p className="muted">{session ? t.tagline : t.home_sub_guest}</p>
          {!session && !hasSelectedRole && (
            <div className="hero-actions">
              <button className="primary" onClick={() => setPage('login')}>{t.signup_tab}</button>
              <button onClick={() => setPage('post')}>{t.quick_post}</button>
            </div>
          )}
        </div>
        <button className="avatar avatarBtn" onClick={() => setPage('profile')} aria-label="profile">
          {profile?.avatar_url
            ? <img src={profile.avatar_url} style={{ width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover' }} alt="avatar" />
            : avatarLetter}
        </button>
      </section>
      {!session && !hasSelectedRole && (
        <section className="home-audience">
          <button onClick={() => setPage('login')}>
            <b>🔎 {t.home_seekers_title}</b>
            <span>{t.home_seekers_desc}</span>
          </button>
          <button onClick={() => setPage('post')}>
            <b>🏪 {t.home_employers_title}</b>
            <span>{t.home_employers_desc}</span>
          </button>
        </section>
      )}
      <AddToHomeCard installPrompt={installPrompt} />
      <section className={hasSelectedRole ? 'quick quick-compact' : 'quick'}>
        {isEmployer && <button onClick={() => setPage('post')}>🏪 {t.quick_post}<span>{t.quick_post_sub}</span></button>}
        <button onClick={() => setPage('jobs')}>💼 {t.quick_jobs}<span>{t.quick_jobs_sub}</span></button>
        {!isEmployer && <button onClick={() => setPage('post')}>🏪 {t.quick_post}<span>{t.quick_post_sub}</span></button>}
      </section>
      {session && pct < 100 && (
        <section className="card">
          <h2>{t.profile_completion} {pct}%</h2>
          <div className="bar"><span style={{ width:pct+'%' }} /></div>
          <p className="muted">{t.profile_hint}</p>
          <button className="primary" onClick={() => setPage('profile')}>{t.complete_profile}</button>
        </section>
      )}
      {!session && !hasSelectedRole && (
        <section className="card" style={{ textAlign:'center' }}>
          <p style={{ fontSize:32, marginBottom:8 }}>🔑</p>
          <h2>{t.login_cta_title}</h2>
          <p className="muted">{t.login_cta_desc}</p>
          <button className="primary" onClick={() => setPage('login')}>{t.login_btn}</button>
        </section>
      )}
      <Section title={t.section_nearby}>
        {openJobs.length
          ? <JobGrid jobs={openJobs.slice(0, 4)} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />
          : (
            <div className="empty empty-rich">
              <div className="empty-icon">☕</div>
              <h2>{t.home_empty_jobs_title}</h2>
              <p>{t.home_empty_jobs_desc}</p>
              <button className="primary" onClick={() => setPage(session ? 'profile' : 'login')}>{t.home_empty_jobs_btn}</button>
            </div>
          )}
      </Section>
      <Section title={t.section_saved}>
        {savedJobsList.length
          ? <JobGrid jobs={savedJobsList} openJob={openJob} isSaved={isSaved} toggleSave={toggleSave} />
          : (
            <div className="empty empty-soft">
              <b>{t.home_empty_saved_title}</b>
              <p>{t.home_empty_saved_desc}</p>
            </div>
          )}
      </Section>
    </main>
  )
}

// ═════════════════════════════════════════════
//  Jobs
// ═════════════════════════════════════════════
function Jobs({ jobs, allJobs, openJob, search, setSearch, area, setArea, english, setEnglish, jobCategory, setJobCategory, setPage, isSaved, toggleSave }) {
  const { t, lang } = useT()
  const categories = ALL_CATEGORY_OPTIONS
  const [filtersOpen, setFiltersOpen] = useState(false)
  const activeFilters = (area ? 1 : 0) + (english ? 1 : 0) + jobCategory.length
  const clearFilters = () => {
    setArea('')
    setEnglish('')
    setJobCategory([])
  }
  return (
    <main>
      <header className="sticky">
        <h1>Find Shops Hiring</h1>
        <p className="muted" style={{ marginTop:-4, marginBottom:12 }}>Filter by shop name, role, area, and English level.</p>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shop, role, barista, kitchen..." />
        <div className="filter-toolbar">
          <button className="filter-toggle" onClick={() => setFiltersOpen(v => !v)} aria-expanded={filtersOpen}>
            {filtersOpen ? t.filters_hide : t.filters_show}{activeFilters ? ` (${activeFilters})` : ''}
          </button>
          {activeFilters > 0 && <button className="filter-clear" onClick={clearFilters}>{t.filters_clear}</button>}
        </div>
        {filtersOpen && (
          <div className="filter-panel">
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
            <select value="" onChange={e => { if (e.target.value) setJobCategory(toggleCat(jobCategory, e.target.value)) }}>
              <option value="">{t.category_add_job}</option>
              {categories.filter(c => !hasCat(jobCategory, c)).map(c => <option key={c} value={c}>{catLabel(c, lang)}</option>)}
            </select>
            <div className="filter-chips all-tags">
              {categories.map(c => (
                <button key={c} className={hasCat(jobCategory, c) ? 'active' : ''} onClick={() => setJobCategory(toggleCat(jobCategory, c))}>{catLabel(c, lang)}</button>
              ))}
            </div>
          </div>
        )}
        <div className="filter-summary">
          <p className="muted">{t.filter_jobs_count(jobs.length)}</p>
          <button className="primary" onClick={() => setPage('post')}>{t.post_btn}</button>
        </div>
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
  const { t, lang } = useT()
  return (
    <article className="job" onClick={() => openJob(job)}>
      <div className="photo">{job.image_url ? <img src={job.image_url} alt={job.company} /> : '💼'}</div>
      <h2>{job.company || 'No company'}</h2>
      <p className="muted">{job.title}</p>
      <p className="muted" style={{ fontSize:13 }}>{job.location || t.loc_tbd} / {job.salary || t.salary_tbd}</p>
      <div className="tags">
        {parseCats(job.categories).slice(0,2).map(c => <span key={c}>{catLabel(c, lang)}</span>)}
        <span>{job.english_level ? engLabel(job.english_level, lang) : t.no_eng}</span>
        {job.is_active === false && <span style={{ background:'rgba(184,48,48,0.1)', color:'#b83030', border:'1px solid rgba(184,48,48,0.2)', padding:'4px 10px', borderRadius:999, fontSize:12, fontWeight:700 }}>{t.badge_closed}</span>}
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
  const { t, lang } = useT()
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
            background: isClosed ? 'rgba(184,48,48,0.1)' : 'rgba(61,107,74,0.12)',
            color:      isClosed ? '#b83030' : '#3d6b4a',
            border:     isClosed ? '1px solid rgba(184,48,48,0.2)' : '1px solid rgba(61,107,74,0.25)' }}>
            {isClosed ? t.badge_closed : t.badge_active}
          </span>
        </div>
        <p className="muted">{job.title} / {job.location} / {job.salary}</p>
        <div className="tags"><span>{engLabel(job.english_level, lang)}</span><span>{job.location}</span></div>
        <p style={{ lineHeight:1.8, marginTop:12 }}>{job.description}</p>
        <div className="row"><b>{t.f_location}</b><span>{job.location}</span></div>
        <div className="row"><b>{t.f_salary}</b><span>{job.salary}</span></div>
        <div className="row"><b>{t.f_eng}</b><span>{engLabel(job.english_level, lang)}</span></div>
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
const emptyJob = { title:'', company:'', location:'', salary:'', english_level:'Basic English OK', description:'', image_url:'', categories:'' }

function FoundingPromo({ slotsLeft }) {
  const { t } = useT()
  if (!(slotsLeft > 0)) return null
  return (
    <div className="founding-promo">
      {t.founding_promo(slotsLeft)}
    </div>
  )
}

function PostJob({ setPage, loadJobs, loadUserData, notify, session }) {
  const { t } = useT()
  const [job,  setJob]  = useState(emptyJob)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [slotsLeft, setSlotsLeft] = useState(null)

  useEffect(() => {
    supabase.rpc('founding_slots_remaining').then(({ data }) => {
      if (typeof data === 'number') setSlotsLeft(data)
    })
  }, [])

  if (!session) return (
    <main style={{ textAlign:'center', paddingTop:60 }}>
      <h1>{t.post_title}</h1>
      <FoundingPromo slotsLeft={slotsLeft} />
      <p style={{ fontSize:48 }}>🔒</p>
      <h2>{t.post_login_title}</h2>
      <p className="muted" style={{ marginBottom:20 }}>{t.post_login_desc}</p>
      <button className="primary" onClick={() => setPage('login')}>{t.login_btn}</button>
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
      // 先着20店舗の永久無料（Founding Member）を確定
      const { data: founding } = await supabase.rpc('claim_founding_member')
      notify(t.job_saved); setJob(emptyJob); setFile(null)
      await loadJobs()
      await loadUserData?.()
      if (founding === 'granted') notify(t.founding_toast)
      setPage('staff')
    } catch(e) { notify(e.message) }
    finally { setBusy(false) }
  }

  return (
    <main>
      <h1>{t.post_title}</h1>
      <FoundingPromo slotsLeft={slotsLeft} />
      <section className="card form">
        <label>{t.f_title}<input value={job.title} onChange={e => update('title', e.target.value)} placeholder="Kitchen staff wanted" /></label>
        <label>{t.f_company}<input value={job.company} onChange={e => update('company', e.target.value)} placeholder="Harbour View Cafe" /></label>
        <label>{t.f_location}<input value={job.location} onChange={e => update('location', e.target.value)} placeholder="Sydney CBD" /></label>
        <MapPreview query={job.location} hint={t.map_verify_hint} />
        <label>{t.f_salary}<input value={job.salary} onChange={e => update('salary', e.target.value)} placeholder="$28/h" /></label>
        <label>{t.f_categories}
          <CategoryPicker value={job.categories} onChange={v => update('categories', v)} max={5} />
        </label>
        <label>{t.f_eng}
          <select value={job.english_level} onChange={e => update('english_level', e.target.value)}>
            <option>{t.eng_basic}</option><option>{t.eng_none}</option><option>{t.eng_inter}</option>
          </select>
        </label>
        <label>{t.f_desc}<textarea value={job.description} onChange={e => update('description', e.target.value)} placeholder={t.desc_ph} /></label>
        <label>{t.f_img}<ImageFilePicker file={file} onChange={setFile} /></label>
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
          <MapPreview query={form.location} hint={t.map_verify_hint} />
          <label>{t.f_salary}<input value={form.salary} onChange={e => upd('salary', e.target.value)} /></label>
          <label>{t.f_eng}
            <select value={form.english_level} onChange={e => upd('english_level', e.target.value)}>
              <option>{t.eng_basic}</option><option>{t.eng_none}</option><option>{t.eng_inter}</option>
            </select>
          </label>
          <label>{t.f_desc}<textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={4} /></label>
          <label>{t.f_img}<ImageFilePicker file={file} onChange={setFile} /></label>
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
                ? isWeekend ? 'linear-gradient(135deg,#8b2020,#c2692a)' : 'linear-gradient(135deg,#7c3f12,#c2692a)'
                : 'var(--bg2)',
              color: active ? '#fdf9f5' : 'var(--muted2)',
              boxShadow: active ? '0 0 12px rgba(155,79,26,0.28)' : 'none',
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
        <p style={{ margin:0, fontSize:13, color:'var(--accent)' }}>📅 {availLabel(value, lang)}</p>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════
//  Staff
// ═════════════════════════════════════════════
function Staff({ setPage, session, startStaffDM, isEmployer, demoStaff, staffSearch, setStaffSearch, staffCategory, setStaffCategory, staffEnglish, setStaffEnglish }) {
  const { t, lang } = useT()
  const [staffList, setStaffList] = useState([])
  const [loading,   setLoading]   = useState(true)
  const staffCategories = ALL_CATEGORY_OPTIONS
  const [filtersOpen, setFiltersOpen] = useState(false)
  const activeFilters = staffCategory.length + (staffEnglish ? 1 : 0)
  const clearFilters = () => {
    setStaffCategory([])
    setStaffEnglish('')
  }
  const filteredStaff = useMemo(() => staffList.filter(s => {
    const categoryTerms = parseCats(s.job_categories).flatMap(catSearchTerms)
    const tx = [
      s.display_name, s.english_level, s.availability, s.visa_expiry, s.bio, s.job_categories,
      engLabel(s.english_level, 'en'), engLabel(s.english_level, 'ja'),
      availLabel(s.availability, 'en'), availLabel(s.availability, 'ja'),
      ...categoryTerms,
    ].join(' ').toLowerCase()
    const terms = staffSearch.toLowerCase().split(/\s+/).filter(Boolean)
    return (!terms.length || terms.every(term => tx.includes(term)))
        && (!staffCategory.length || parseCats(s.job_categories).some(c => staffCategory.some(sel => sameCat(c, sel))))
        && (!staffEnglish || sameEng(s.english_level, staffEnglish))
  }), [staffList, staffSearch, staffCategory, staffEnglish])

  useEffect(() => {
    if (!session || !isEmployer) {
      setStaffList([])
      setLoading(false)
      return
    }
    setLoading(true)
    if (demoStaff) {
      setStaffList(demoStaff)
      setLoading(false)
      return
    }
    supabase.from('profiles').select('*')
      .not('display_name', 'is', null)
      .order('updated_at', { ascending:false }).limit(40)
      .then(({ data }) => { setStaffList(data || []); setLoading(false) })
  }, [session, isEmployer, demoStaff])

  // 雇用主以外はアクセス不可
  if (!session || !isEmployer) return (
    <main>
      <div className="empty" style={{ marginTop:40 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🔒</div>
        <b style={{ fontSize:18 }}>{t.staff_employers_only}</b>
        <p style={{ marginTop:8 }}>{t.staff_post_required}</p>
        <button className="primary" style={{ marginTop:16 }} onClick={() => setPage('post')}>{t.quick_post}</button>
      </div>
    </main>
  )

  return (
    <main>
      <header className="sticky">
        <h1>{t.find_staff}</h1>
        <p className="muted" style={{ marginTop:-4, marginBottom:12 }}>{t.staff_desc}</p>
        <input value={staffSearch} onChange={e => setStaffSearch(e.target.value)} placeholder="Search name, barista, kitchen, WHV..." />
        <div className="filter-toolbar">
          <button className="filter-toggle" onClick={() => setFiltersOpen(v => !v)} aria-expanded={filtersOpen}>
            {filtersOpen ? t.filters_hide : t.filters_show}{activeFilters ? ` (${activeFilters})` : ''}
          </button>
          {activeFilters > 0 && <button className="filter-clear" onClick={clearFilters}>{t.filters_clear}</button>}
        </div>
        {filtersOpen && (
          <div className="filter-panel">
            <div className="filters">
              <select value="" onChange={e => { if (e.target.value) setStaffCategory(toggleCat(staffCategory, e.target.value)) }}>
                <option value="">{t.category_add_preferred}</option>
                {staffCategories.filter(c => !hasCat(staffCategory, c)).map(c => <option key={c} value={c}>{catLabel(c, lang)}</option>)}
              </select>
              <select value={staffEnglish} onChange={e => setStaffEnglish(e.target.value)}>
                <option value="">{t.any_english}</option>
                <option>{t.eng_basic}</option>
                <option>{t.eng_none}</option>
                <option>{t.eng_inter}</option>
              </select>
            </div>
            <div className="filter-chips all-tags">
              {staffCategories.map(c => (
                <button key={c} className={hasCat(staffCategory, c) ? 'active' : ''} onClick={() => setStaffCategory(toggleCat(staffCategory, c))}>{catLabel(c, lang)}</button>
              ))}
            </div>
          </div>
        )}
        <div className="filter-summary">
          <p className="muted">{t.filter_staff_count(filteredStaff.length)}</p>
        </div>
      </header>
      {loading && <SkeletonGrid />}
      {!loading && !filteredStaff.length && <div className="empty">{t.no_staff}</div>}
      <div className="grid">
        {filteredStaff.map(s => (
          <article className="job" key={s.id} style={{ cursor:'default' }}>
            <div className="staff-avatar">
              {s.avatar_url ? <img src={s.avatar_url} alt={s.display_name} /> : <span style={{ fontSize:44 }}>👤</span>}
            </div>
            <h2>{s.display_name || 'Anonymous'}</h2>
            {s.english_level && <p className="muted">🗣 {engLabel(s.english_level, lang)}</p>}
            {s.availability   && <p className="muted">📅 {availLabel(s.availability, lang)}</p>}
            {s.visa_expiry    && <p className="muted" style={{ fontSize:12 }}>{t.visa_lbl} {s.visa_expiry}</p>}
            {s.bio && <p className="muted" style={{ fontSize:13, marginTop:6 }}>{s.bio.slice(0,80)}{s.bio.length>80?'…':''}</p>}
            <div className="tags">
              {s.english_level && <span>{engLabel(s.english_level, lang)}</span>}
              {parseCats(s.job_categories).slice(0,3).map(c => <span key={c}>{catLabel(c, lang)}</span>)}
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
function DM({ conversations, setActiveConvId, setPage, session }) {
  const { t, lang } = useT()
  if (!session) return (
    <main style={{ textAlign:'center', paddingTop:40 }}>
      <p style={{ fontSize:40 }}>💬</p>
      <h2>{t.dm_login_title}</h2>
      <button className="primary" style={{ marginTop:16 }} onClick={() => setPage('login')}>{t.login_btn}</button>
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
function Chat({ convId, setPage, session, conversations, setConversations, notify, markConvRead, lang, demoMessages }) {
  const { t } = useT()
  const [messages, setMessages] = useState([])
  const [text,     setText]     = useState('')
  const [busy,     setBusy]     = useState(false)
  const [loading,  setLoading]  = useState(true)
  const bottomRef = useRef(null)
  const conv = conversations.find(c => c.id === convId)

  useEffect(() => {
    if (!convId) return
    if (demoMessages) {
      setMessages(demoMessages[convId] || [])
      setLoading(false)
      markConvRead(convId)
      return
    }
    loadMessages()
    const ch = supabase.channel('chat-'+convId)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`conversation_id=eq.${convId}` },
        payload => setMessages(p => [...p, payload.new]))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [convId, demoMessages])

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
    if (demoMessages) {
      const msg = text.trim(); setText('')
      setMessages(p => [...p, { id:`demo-message-${Date.now()}`, sender_id:session.user.id, text:msg, created_at:new Date().toISOString() }])
      return
    }
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
function Profile({ setPage, session, profile, setProfile, notify, signOut,
                   applications, jobs, isSaved, openJob, savedJobIds, postedJobs,
                   updateAppStatus, toggleJobStatus, deleteJob, setEditingJob, role }) {
  const { t, lang } = useT()
  const [form, setForm]       = useState({ display_name:'', english_level:'Basic', availability:'', bio:'', visa_expiry:'', job_categories:'' })
  const [busy, setBusy]       = useState(false)
  const [tab,  setTab]        = useState(() => new URLSearchParams(window.location.search).get('demo') === '1' ? 'posted' : 'profile')
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
    background: st==='accepted'?'rgba(61,107,74,0.12)':st==='rejected'?'rgba(184,48,48,0.1)':'rgba(155,79,26,0.1)',
    color:      st==='accepted'?'#3d6b4a':st==='rejected'?'#b83030':'#9b4f1a',
    border:     st==='accepted'?'1px solid rgba(61,107,74,0.25)':st==='rejected'?'1px solid rgba(184,48,48,0.2)':'1px solid rgba(155,79,26,0.2)',
  })

  return (
    <main>
      <section className="hero" style={{ flexDirection:'column', alignItems:'flex-start', gap:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center' }}>
          <div><h1>{form.display_name || t.tab_profile}</h1><p className="muted">{session.user.email}</p></div>
          <button onClick={signOut} style={{ background:'rgba(184,48,48,0.1)', color:'#b83030', border:'1px solid rgba(184,48,48,0.2)', padding:'10px 16px' }}>{t.logout}</button>
        </div>
        {profile?.founding_member && (
          <span className="founding-badge">{t.founding_badge}</span>
        )}
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
            {role !== 'employer' && (
              <p className="muted" style={{ fontSize:12, textAlign:'center', margin:'2px 0 0', maxWidth:280 }}>📸 {t.profile_photo_tip}</p>
            )}
          </div>
          {role !== 'employer' && (
            <div className="privacy-note">🔒 {t.profile_privacy_note}</div>
          )}
          <label>{t.f_name}<input value={form.display_name} onChange={e => upd('display_name', e.target.value)} placeholder="Alex Smith" /></label>
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
                    <span style={{ background:'rgba(155,79,26,0.1)', color:'#9b4f1a', border:'1px solid rgba(155,79,26,0.2)', padding:'5px 12px', borderRadius:999, fontSize:13, fontWeight:700, whiteSpace:'nowrap', flexShrink:0 }}>
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
                      background:isClosed?'rgba(61,107,74,0.12)':'rgba(155,79,26,0.1)',
                      color:isClosed?'#3d6b4a':'#9b4f1a',
                      border:isClosed?'1px solid rgba(61,107,74,0.25)':'1px solid rgba(155,79,26,0.2)' }}
                      onClick={() => toggleJobStatus(j.id, !isClosed)}>
                      {isClosed ? t.reopen_job : t.close_job}
                    </button>
                    <button style={{ fontSize:13, padding:'8px 14px', background:'rgba(184,48,48,0.1)', color:'#b83030', border:'1px solid rgba(184,48,48,0.2)' }}
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
                                    {p.english_level ? engLabel(p.english_level, lang) : t.not_set} ／ {p.availability ? availLabel(p.availability, lang) : t.not_set}
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
                                <button style={{ background:'rgba(61,107,74,0.12)', color:'#3d6b4a', border:'1px solid rgba(61,107,74,0.25)', fontSize:13, padding:'8px 16px' }}
                                  onClick={() => updateAppStatus(app.id, 'accepted')} disabled={app.status==='accepted'}>{t.hire}</button>
                                <button style={{ background:'rgba(184,48,48,0.1)', color:'#b83030', border:'1px solid rgba(184,48,48,0.2)', fontSize:13, padding:'8px 16px' }}
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

createRoot(document.getElementById('root')).render(<App />)
