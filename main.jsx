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
  },
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
  ko: {
    nav_home:'홈', nav_jobs:'구인', nav_staff:'직원', nav_dm:'메시지', nav_profile:'프로필',
    tagline:'시드니에서 오늘의 일자리를 찾아보세요',
    section_nearby:'근처 구인', section_saved:'저장한 구인',
    login_cta_title:'로그인하여 모든 기능을 사용하세요',
    login_cta_desc:'구인 저장, 지원, 실시간 메시지를 이용할 수 있습니다.',
    profile_completion:'프로필 완성도',
    profile_hint:'사진, 비자 만료일, 근무 가능 시간을 추가하면 채용 확률이 높아집니다.',
    complete_profile:'프로필 완성하기',
    quick_jobs:'오늘의 추천 구인', quick_jobs_sub:'전체 구인 보기',
    quick_post:'구인 등록', quick_post_sub:'사업주 전용',
    search_jobs:'구인 검색', keyword_ph:'키워드 검색',
    all_areas:'전체 지역', eng_cond:'영어 조건', post_btn:'＋ 구인 등록',
    no_jobs:'구인이 없습니다.',
    view_detail:'상세 보기', save:'♡ 저장', saved_btn:'♥ 저장됨',
    loc_tbd:'장소 미정', salary_tbd:'시급 미정', no_eng:'영어 조건 없음',
    back_jobs:'← 구인 목록으로',
    apply:'지원하기', applied_done:'✓ 지원완료', applying:'지원 중...',
    apply_msg:'메시지 (선택)', apply_ph:'자기소개나 희망 근무 시간을 적어주세요...',
    send_apply:'지원서 제출', cancel:'취소',
    view_map:'📍 Google Maps에서 보기', dm_btn:'💬 메시지',
    badge_active:'채용 중', badge_closed:'마감',
    post_title:'구인 등록', post_login_title:'로그인 후 등록 가능',
    post_login_desc:'Google 계정으로 로그인해 주세요.',
    f_title:'직종 *', f_company:'가게 이름 *', f_location:'장소',
    f_salary:'시급', f_eng:'영어 조건', f_desc:'업무 내용', f_img:'사진',
    f_categories:'직종 (최대 5개)',
    save_btn:'저장', saving:'저장 중...',
    required_err:'직종과 가게 이름은 필수입니다.', job_saved:'구인이 등록되었습니다.',
    find_staff:'직원 찾기', staff_desc:'시드니에서 일할 수 있는 직원 후보를 찾아보세요.',
    no_staff:'등록된 직원이 없습니다.', contact:'💬 연락하기', visa_lbl:'🛂 비자 만료일:',
    dm_title:'메시지', dm_login_title:'메시지를 사용하려면 로그인하세요',
    no_dm:'메시지가 없습니다.', no_dm_hint:'구인 상세 페이지에서 "메시지" 버튼을 눌러보세요.',
    back_dm:'← 메시지 목록으로', type_msg:'메시지 입력', send:'전송',
    first_msg:'첫 메시지를 보내보세요 👋', loading:'로딩 중...',
    logout:'로그아웃',
    tab_profile:'프로필', tab_applied:'지원 내역', tab_saved:'저장됨', tab_posted:'내 구인',
    change_photo:'📷 사진 변경', photo_pending:'저장 후 반영됩니다',
    f_name:'이름', f_eng_level:'영어 수준', f_avail:'근무 가능 시간', f_visa:'비자 만료일', f_bio:'자기소개',
    f_job_categories:'희망 직종 (최대 5개)',
    no_applied:'아직 지원한 구인이 없습니다.', no_saved_jobs:'아직 저장한 구인이 없습니다.',
    no_posted:'아직 등록한 구인이 없습니다.', post_first:'첫 구인 등록하기',
    apps_count:'명 지원', view_apps:'▼ 지원자 보기', close_apps:'▲ 닫기',
    no_apps:'아직 지원자가 없습니다.', hire:'✓ 채용', reject:'✗ 불채용',
    st_accepted:'채용됨', st_rejected:'불채용', st_pending:'검토 중',
    b_accepted:'✓ 채용됨', b_rejected:'✗ 불채용', b_pending:'⏳ 검토 중',
    edit_job:'✏️ 수정', delete_job:'🗑 삭제', close_job:'마감하기', reopen_job:'재오픈',
    confirm_del:'이 구인을 삭제하시겠습니까?', job_deleted:'구인이 삭제되었습니다.',
    status_updated:'상태가 업데이트되었습니다', post_new:'＋ 새 구인 등록',
    login_title:'WorkMate에 로그인',
    login_sub:'시드니에서 일하는 유학생을 위한 구인 앱',
    login_google:'Google로 로그인', guest:'← 게스트로 계속',
    login_profile:'로그인하여 프로필 만들기',
    login_profile_desc:'저장한 구인과 지원 내역을 확인하세요.',
    signup_tab:'회원가입', login_tab:'로그인',
    f_email:'이메일', f_password:'비밀번호', f_displayname:'표시 이름',
    signup_btn:'계정 만들기', login_btn:'로그인',
    or_google:'또는',
    err_required:'이름, 이메일, 비밀번호를 입력해주세요',
    err_password_short:'비밀번호는 6자 이상이어야 합니다',
    signup_ok:'계정이 생성되었습니다!',
    check_email:'이메일을 확인하고 링크를 클릭해주세요.',
    toast_login:'로그인이 필요합니다', toast_applied_already:'이미 지원하셨습니다',
    toast_applied_ok:'지원 완료!', toast_logout:'로그아웃되었습니다',
    toast_profile:'프로필이 저장되었습니다!',
    toast_no_poster:'등록자 정보가 없어 메시지를 보낼 수 없습니다',
    toast_self_dm:'자신의 구인에는 메시지를 보낼 수 없습니다',
    toast_self_dm2:'자기 자신에게는 메시지를 보낼 수 없습니다',
    toast_new_app:'📨 새 지원이 도착했습니다!',
    toast_closed:'이 구인은 마감되었습니다',
    eng_basic:'기초 영어 OK', eng_none:'영어 불필요', eng_inter:'중급 이상',
    not_set:'미설정', parts:'건', edit_title:'구인 수정',
  },
  zh: {
    nav_home:'首页', nav_jobs:'招聘', nav_staff:'员工', nav_dm:'消息', nav_profile:'我的',
    tagline:'在悉尼找到今天的好工作',
    section_nearby:'附近招聘', section_saved:'已收藏',
    login_cta_title:'登录以使用全部功能',
    login_cta_desc:'收藏职位、投递简历、实时聊天。',
    profile_completion:'资料完成度',
    profile_hint:'添加照片、签证到期日和可工作时间，提高录用率。',
    complete_profile:'完善资料',
    quick_jobs:'今日推荐', quick_jobs_sub:'查看全部招聘',
    quick_post:'发布招聘', quick_post_sub:'雇主专用',
    search_jobs:'搜索职位', keyword_ph:'关键词搜索',
    all_areas:'全部地区', eng_cond:'英语要求', post_btn:'＋ 发布招聘',
    no_jobs:'暂无职位。',
    view_detail:'查看详情', save:'♡ 收藏', saved_btn:'♥ 已收藏',
    loc_tbd:'地点待定', salary_tbd:'时薪待定', no_eng:'无英语要求',
    back_jobs:'← 返回职位列表',
    apply:'立即申请', applied_done:'✓ 已申请', applying:'申请中...',
    apply_msg:'留言（可选）', apply_ph:'介绍自己或说明期望班次...',
    send_apply:'提交申请', cancel:'取消',
    view_map:'📍 在Google地图查看', dm_btn:'💬 发消息',
    badge_active:'招聘中', badge_closed:'已截止',
    post_title:'发布招聘', post_login_title:'发布招聘需要登录',
    post_login_desc:'请用Google账号登录。',
    f_title:'职位名称 *', f_company:'店铺名称 *', f_location:'地点',
    f_salary:'时薪', f_eng:'英语要求', f_desc:'工作内容', f_img:'图片',
    f_categories:'职种（最多5个）',
    save_btn:'保存', saving:'保存中...',
    required_err:'职位名称和店铺名称为必填项。', job_saved:'招聘已发布。',
    find_staff:'找员工', staff_desc:'寻找在悉尼可以工作的候选人。',
    no_staff:'暂无员工注册。', contact:'💬 联系', visa_lbl:'🛂 签证到期日:',
    dm_title:'消息', dm_login_title:'使用消息功能需要登录',
    no_dm:'暂无消息。', no_dm_hint:'在职位详情页点击"发消息"即可开始。',
    back_dm:'← 返回消息列表', type_msg:'输入消息', send:'发送',
    first_msg:'发送第一条消息吧 👋', loading:'加载中...',
    logout:'退出登录',
    tab_profile:'个人资料', tab_applied:'申请记录', tab_saved:'已收藏', tab_posted:'我发布的',
    change_photo:'📷 更换头像', photo_pending:'保存后生效',
    f_name:'姓名', f_eng_level:'英语水平', f_avail:'可工作时间', f_visa:'签证到期日', f_bio:'个人简介',
    f_job_categories:'期望职种（最多5个）',
    no_applied:'还没有申请记录。', no_saved_jobs:'还没有收藏的职位。',
    no_posted:'还没有发布的招聘。', post_first:'发布第一个招聘',
    apps_count:'人申请', view_apps:'▼ 查看申请者', close_apps:'▲ 收起',
    no_apps:'暂无申请者。', hire:'✓ 录用', reject:'✗ 不录用',
    st_accepted:'已录用', st_rejected:'未录用', st_pending:'审核中',
    b_accepted:'✓ 已录用', b_rejected:'✗ 未录用', b_pending:'⏳ 审核中',
    edit_job:'✏️ 编辑', delete_job:'🗑 删除', close_job:'结束招聘', reopen_job:'重新开放',
    confirm_del:'确定删除这条招聘吗？', job_deleted:'招聘已删除。',
    status_updated:'招聘状态已更新', post_new:'＋ 发布新招聘',
    login_title:'登录 WorkMate',
    login_sub:'面向在悉尼工作的留学生的求职应用',
    login_google:'用Google登录', guest:'← 以访客身份继续',
    login_profile:'登录以创建个人资料',
    login_profile_desc:'在此查看收藏职位和申请记录。',
    signup_tab:'注册', login_tab:'登录',
    f_email:'邮箱', f_password:'密码', f_displayname:'显示名称',
    signup_btn:'创建账户', login_btn:'登录',
    or_google:'或',
    err_required:'请填写姓名、邮箱和密码',
    err_password_short:'密码至少6位',
    signup_ok:'账户创建成功！',
    check_email:'请查看邮箱并点击确认链接。',
    toast_login:'需要登录', toast_applied_already:'已经申请过',
    toast_applied_ok:'申请成功！', toast_logout:'已退出登录',
    toast_profile:'资料已保存！',
    toast_no_poster:'无法获取发布者信息，无法发送消息',
    toast_self_dm:'不能给自己发布的招聘发消息',
    toast_self_dm2:'不能给自己发消息',
    toast_new_app:'📨 收到新申请！',
    toast_closed:'该职位已停止接受申请',
    eng_basic:'基础英语OK', eng_none:'无需英语', eng_inter:'中级以上',
    not_set:'未设置', parts:'条', edit_title:'编辑招聘',
  },
  es: {
    nav_home:'Inicio', nav_jobs:'Empleos', nav_staff:'Personal', nav_dm:'Mensajes', nav_profile:'Perfil',
    tagline:'Encuentra tu trabajo ideal en Sídney hoy',
    section_nearby:'Empleos Cercanos', section_saved:'Empleos Guardados',
    login_cta_title:'Inicia sesión para acceder a todo',
    login_cta_desc:'Guarda empleos, postúlate y usa mensajes en tiempo real.',
    profile_completion:'Completar Perfil',
    profile_hint:'Agrega tu foto, vencimiento de visa y disponibilidad para mejorar tus chances.',
    complete_profile:'Completar Perfil',
    quick_jobs:'Empleos de Hoy', quick_jobs_sub:'Ver todos los anuncios',
    quick_post:'Publicar Empleo', quick_post_sub:'Para empleadores',
    search_jobs:'Buscar Empleos', keyword_ph:'Buscar por palabra clave',
    all_areas:'Todas las zonas', eng_cond:'Nivel de inglés', post_btn:'＋ Publicar',
    no_jobs:'No se encontraron empleos.',
    view_detail:'Ver Detalles', save:'♡ Guardar', saved_btn:'♥ Guardado',
    loc_tbd:'Ubicación por confirmar', salary_tbd:'Tarifa por confirmar', no_eng:'Sin requisito de inglés',
    back_jobs:'← Volver a empleos',
    apply:'Postularme', applied_done:'✓ Postulado', applying:'Enviando...',
    apply_msg:'Mensaje (opcional)', apply_ph:'Preséntate o menciona tu disponibilidad...',
    send_apply:'Enviar Postulación', cancel:'Cancelar',
    view_map:'📍 Ver en Google Maps', dm_btn:'💬 Mensaje',
    badge_active:'Contratando', badge_closed:'Cerrado',
    post_title:'Publicar Empleo', post_login_title:'Inicia sesión para publicar',
    post_login_desc:'Inicia sesión con Google para publicar empleos.',
    f_title:'Título del puesto *', f_company:'Nombre del negocio *', f_location:'Ubicación',
    f_salary:'Tarifa por hora', f_eng:'Requisito de inglés', f_desc:'Descripción del trabajo', f_img:'Foto',
    f_categories:'Tipo de empleo (máx. 5)',
    save_btn:'Guardar', saving:'Guardando...',
    required_err:'El título y el nombre del negocio son obligatorios.', job_saved:'Empleo publicado con éxito.',
    find_staff:'Buscar Personal', staff_desc:'Encuentra candidatos disponibles en Sídney.',
    no_staff:'Aún no hay perfiles de personal.', contact:'💬 Contactar', visa_lbl:'🛂 Vencimiento de visa:',
    dm_title:'Mensajes', dm_login_title:'Inicia sesión para usar mensajes',
    no_dm:'Aún no hay mensajes.', no_dm_hint:'Toca "Mensaje" en un empleo para comenzar.',
    back_dm:'← Volver a mensajes', type_msg:'Escribe un mensaje', send:'Enviar',
    first_msg:'Envía tu primer mensaje 👋', loading:'Cargando...',
    logout:'Cerrar sesión',
    tab_profile:'Perfil', tab_applied:'Postulaciones', tab_saved:'Guardados', tab_posted:'Mis Anuncios',
    change_photo:'📷 Cambiar foto', photo_pending:'Guarda para aplicar cambios',
    f_name:'Nombre', f_eng_level:'Nivel de inglés', f_avail:'Disponibilidad', f_visa:'Vencimiento de visa', f_bio:'Sobre mí',
    f_job_categories:'Tipos de empleo preferidos (máx. 5)',
    no_applied:'Aún no te has postulado.', no_saved_jobs:'Aún no tienes empleos guardados.',
    no_posted:'Aún no has publicado empleos.', post_first:'Publicar primer empleo',
    apps_count:'postulaciones', view_apps:'▼ Ver postulantes', close_apps:'▲ Cerrar',
    no_apps:'Aún no hay postulantes.', hire:'✓ Contratar', reject:'✗ Rechazar',
    st_accepted:'Contratado', st_rejected:'Rechazado', st_pending:'Pendiente',
    b_accepted:'✓ Contratado', b_rejected:'✗ Rechazado', b_pending:'⏳ Pendiente',
    edit_job:'✏️ Editar', delete_job:'🗑 Eliminar', close_job:'Cerrar anuncio', reopen_job:'Reabrir anuncio',
    confirm_del:'¿Eliminar este anuncio?', job_deleted:'Anuncio eliminado.',
    status_updated:'Estado actualizado', post_new:'＋ Publicar nuevo empleo',
    login_title:'Inicia sesión en WorkMate',
    login_sub:'Empleos para estudiantes internacionales en Sídney',
    login_google:'Iniciar sesión con Google', guest:'← Continuar como invitado',
    login_profile:'Inicia sesión para crear tu perfil',
    login_profile_desc:'Aquí verás tus empleos guardados y postulaciones.',
    signup_tab:'Registrarse', login_tab:'Iniciar sesión',
    f_email:'Correo electrónico', f_password:'Contraseña', f_displayname:'Nombre visible',
    signup_btn:'Crear cuenta', login_btn:'Iniciar sesión',
    or_google:'o',
    err_required:'Por favor completa nombre, correo y contraseña',
    err_password_short:'La contraseña debe tener al menos 6 caracteres',
    signup_ok:'¡Cuenta creada!',
    check_email:'Revisa tu correo y haz clic en el enlace de confirmación.',
    toast_login:'Inicia sesión primero', toast_applied_already:'Ya te postulaste',
    toast_applied_ok:'¡Postulación enviada!', toast_logout:'Sesión cerrada',
    toast_profile:'¡Perfil guardado!',
    toast_no_poster:'No se puede enviar mensaje: info del publicador no disponible',
    toast_self_dm:'No puedes escribirte a tu propio anuncio',
    toast_self_dm2:'No puedes enviarte mensajes a ti mismo',
    toast_new_app:'📨 ¡Nueva postulación recibida!',
    toast_closed:'Este empleo ya no acepta postulaciones',
    eng_basic:'Inglés básico OK', eng_none:'Sin inglés necesario', eng_inter:'Intermedio+',
    not_set:'No especificado', parts:'', edit_title:'Editar empleo',
  },
  fr: {
    nav_home:'Accueil', nav_jobs:'Emplois', nav_staff:'Équipe', nav_dm:'Messages', nav_profile:'Profil',
    tagline:"Trouvez le bon emploi à Sydney aujourd'hui",
    section_nearby:'Emplois à proximité', section_saved:'Emplois sauvegardés',
    login_cta_title:'Connectez-vous pour accéder à tout',
    login_cta_desc:'Sauvegardez des offres, postulez et messagez en temps réel.',
    profile_completion:'Complétion du profil',
    profile_hint:"Ajoutez votre photo, date d'expiration du visa et disponibilités pour augmenter vos chances.",
    complete_profile:'Compléter le profil',
    quick_jobs:'Emplois du jour', quick_jobs_sub:'Voir toutes les offres',
    quick_post:'Publier une offre', quick_post_sub:'Pour les employeurs',
    search_jobs:'Rechercher des emplois', keyword_ph:'Rechercher par mot-clé',
    all_areas:'Toutes les zones', eng_cond:"Niveau d'anglais", post_btn:'＋ Publier',
    no_jobs:'Aucune offre trouvée.',
    view_detail:'Voir les détails', save:'♡ Sauvegarder', saved_btn:'♥ Sauvegardé',
    loc_tbd:'Lieu à confirmer', salary_tbd:'Tarif à confirmer', no_eng:"Aucune exigence en anglais",
    back_jobs:'← Retour aux offres',
    apply:'Postuler', applied_done:'✓ Candidature envoyée', applying:'Envoi...',
    apply_msg:'Message (optionnel)', apply_ph:'Présentez-vous ou mentionnez vos disponibilités...',
    send_apply:'Envoyer la candidature', cancel:'Annuler',
    view_map:'📍 Voir sur Google Maps', dm_btn:'💬 Message',
    badge_active:'Recrutement', badge_closed:'Fermé',
    post_title:'Publier une offre', post_login_title:'Connexion requise',
    post_login_desc:'Connectez-vous avec Google pour publier des offres.',
    f_title:'Intitulé du poste *', f_company:"Nom de l'établissement *", f_location:'Lieu',
    f_salary:'Taux horaire', f_eng:'Exigence en anglais', f_desc:'Description du poste', f_img:'Photo',
    f_categories:"Type d'emploi (max 5)",
    save_btn:'Sauvegarder', saving:'Sauvegarde...',
    required_err:"L'intitulé et le nom de l'établissement sont obligatoires.", job_saved:'Offre publiée avec succès.',
    find_staff:'Trouver du personnel', staff_desc:'Parcourez les candidats disponibles à Sydney.',
    no_staff:'Aucun profil pour le moment.', contact:'💬 Contacter', visa_lbl:'🛂 Expiration du visa :',
    dm_title:'Messages', dm_login_title:'Connectez-vous pour utiliser la messagerie',
    no_dm:'Aucun message pour le moment.', no_dm_hint:'Appuyez sur "Message" depuis une offre pour commencer.',
    back_dm:'← Retour aux messages', type_msg:'Écrire un message', send:'Envoyer',
    first_msg:'Envoyez votre premier message 👋', loading:'Chargement...',
    logout:'Déconnexion',
    tab_profile:'Profil', tab_applied:'Candidatures', tab_saved:'Sauvegardés', tab_posted:'Mes offres',
    change_photo:'📷 Changer la photo', photo_pending:'Sauvegardez pour appliquer les changements',
    f_name:'Nom', f_eng_level:"Niveau d'anglais", f_avail:'Disponibilités', f_visa:'Expiration du visa', f_bio:'À propos de moi',
    f_job_categories:"Types d'emploi souhaités (max 5)",
    no_applied:'Aucune candidature pour le moment.', no_saved_jobs:'Aucune offre sauvegardée.',
    no_posted:'Aucune offre publiée.', post_first:'Publier ma première offre',
    apps_count:'candidatures', view_apps:'▼ Voir les candidats', close_apps:'▲ Fermer',
    no_apps:'Aucun candidat pour le moment.', hire:'✓ Embaucher', reject:'✗ Refuser',
    st_accepted:'Embauché', st_rejected:'Refusé', st_pending:'En attente',
    b_accepted:'✓ Embauché', b_rejected:'✗ Refusé', b_pending:'⏳ En attente',
    edit_job:'✏️ Modifier', delete_job:"🗑 Supprimer", close_job:"Fermer l'annonce", reopen_job:"Rouvrir l'annonce",
    confirm_del:'Supprimer cette offre ?', job_deleted:'Offre supprimée.',
    status_updated:'Statut mis à jour', post_new:'＋ Publier une nouvelle offre',
    login_title:'Se connecter à WorkMate',
    login_sub:'Emplois pour étudiants internationaux à Sydney',
    login_google:'Se connecter avec Google', guest:"← Continuer en tant qu'invité",
    login_profile:'Connectez-vous pour créer votre profil',
    login_profile_desc:'Retrouvez ici vos offres sauvegardées et candidatures.',
    signup_tab:"S'inscrire", login_tab:'Se connecter',
    f_email:'Adresse e-mail', f_password:'Mot de passe', f_displayname:'Pseudo',
    signup_btn:'Créer un compte', login_btn:'Se connecter',
    or_google:'ou',
    err_required:'Veuillez renseigner nom, e-mail et mot de passe',
    err_password_short:'Le mot de passe doit comporter au moins 6 caractères',
    signup_ok:'Compte créé !',
    check_email:'Vérifiez votre e-mail et cliquez sur le lien de confirmation.',
    toast_login:'Connexion requise', toast_applied_already:'Déjà candidat',
    toast_applied_ok:'Candidature envoyée !', toast_logout:'Déconnecté',
    toast_profile:'Profil sauvegardé !',
    toast_no_poster:'Impossible d\'envoyer un message : informations du publieur indisponibles',
    toast_self_dm:'Impossible de contacter votre propre annonce',
    toast_self_dm2:'Impossible de vous envoyer un message',
    toast_new_app:'📨 Nouvelle candidature reçue !',
    toast_closed:"Cette offre n'accepte plus de candidatures",
    eng_basic:'Anglais de base OK', eng_none:"Pas d'anglais requis", eng_inter:'Intermédiaire+',
    not_set:'Non renseigné', parts:'', edit_title:"Modifier l'offre",
  },
  pt: {
    nav_home:'Início', nav_jobs:'Vagas', nav_staff:'Equipe', nav_dm:'Mensagens', nav_profile:'Perfil',
    tagline:'Encontre o emprego ideal em Sydney hoje',
    section_nearby:'Vagas Próximas', section_saved:'Vagas Salvas',
    login_cta_title:'Faça login para acessar todos os recursos',
    login_cta_desc:'Salve vagas, candidate-se e use mensagens em tempo real.',
    profile_completion:'Completar Perfil',
    profile_hint:'Adicione sua foto, vencimento do visto e disponibilidade para aumentar suas chances.',
    complete_profile:'Completar Perfil',
    quick_jobs:'Vagas de Hoje', quick_jobs_sub:'Ver todas as vagas',
    quick_post:'Publicar Vaga', quick_post_sub:'Para empregadores',
    search_jobs:'Buscar Vagas', keyword_ph:'Buscar por palavra-chave',
    all_areas:'Todas as áreas', eng_cond:'Nível de inglês', post_btn:'＋ Publicar Vaga',
    no_jobs:'Nenhuma vaga encontrada.',
    view_detail:'Ver Detalhes', save:'♡ Salvar', saved_btn:'♥ Salvo',
    loc_tbd:'Local a confirmar', salary_tbd:'Valor a confirmar', no_eng:'Sem requisito de inglês',
    back_jobs:'← Voltar às vagas',
    apply:'Candidatar-me', applied_done:'✓ Candidatado', applying:'Enviando...',
    apply_msg:'Mensagem (opcional)', apply_ph:'Apresente-se ou mencione sua disponibilidade...',
    send_apply:'Enviar Candidatura', cancel:'Cancelar',
    view_map:'📍 Ver no Google Maps', dm_btn:'💬 Mensagem',
    badge_active:'Contratando', badge_closed:'Encerrado',
    post_title:'Publicar Vaga', post_login_title:'Login necessário para publicar',
    post_login_desc:'Entre com sua conta Google para publicar vagas.',
    f_title:'Título da vaga *', f_company:'Nome do negócio *', f_location:'Local',
    f_salary:'Valor por hora', f_eng:'Requisito de inglês', f_desc:'Descrição da vaga', f_img:'Foto',
    f_categories:'Tipo de vaga (máx. 5)',
    save_btn:'Salvar', saving:'Salvando...',
    required_err:'Título e nome do negócio são obrigatórios.', job_saved:'Vaga publicada com sucesso.',
    find_staff:'Encontrar Funcionários', staff_desc:'Encontre candidatos disponíveis em Sydney.',
    no_staff:'Ainda não há perfis de funcionários.', contact:'💬 Contato', visa_lbl:'🛂 Vencimento do visto:',
    dm_title:'Mensagens', dm_login_title:'Faça login para usar mensagens',
    no_dm:'Ainda não há mensagens.', no_dm_hint:'Toque em "Mensagem" em uma vaga para começar.',
    back_dm:'← Voltar às mensagens', type_msg:'Digite uma mensagem', send:'Enviar',
    first_msg:'Envie sua primeira mensagem 👋', loading:'Carregando...',
    logout:'Sair',
    tab_profile:'Perfil', tab_applied:'Candidaturas', tab_saved:'Salvos', tab_posted:'Minhas Vagas',
    change_photo:'📷 Mudar Foto', photo_pending:'Salve para aplicar as mudanças',
    f_name:'Nome', f_eng_level:'Nível de inglês', f_avail:'Disponibilidade', f_visa:'Vencimento do visto', f_bio:'Sobre mim',
    f_job_categories:'Tipos de vaga preferidos (máx. 5)',
    no_applied:'Ainda não se candidatou.', no_saved_jobs:'Ainda não há vagas salvas.',
    no_posted:'Ainda não publicou vagas.', post_first:'Publicar Primeira Vaga',
    apps_count:'candidaturas', view_apps:'▼ Ver candidatos', close_apps:'▲ Fechar',
    no_apps:'Ainda não há candidatos.', hire:'✓ Contratar', reject:'✗ Rejeitar',
    st_accepted:'Contratado', st_rejected:'Rejeitado', st_pending:'Pendente',
    b_accepted:'✓ Contratado', b_rejected:'✗ Rejeitado', b_pending:'⏳ Pendente',
    edit_job:'✏️ Editar', delete_job:'🗑 Excluir', close_job:'Encerrar vaga', reopen_job:'Reabrir vaga',
    confirm_del:'Excluir esta vaga?', job_deleted:'Vaga excluída.',
    status_updated:'Status atualizado', post_new:'＋ Publicar Nova Vaga',
    login_title:'Entrar no WorkMate',
    login_sub:'Vagas para estudantes internacionais em Sydney',
    login_google:'Entrar com Google', guest:'← Continuar como convidado',
    login_profile:'Faça login para criar seu perfil',
    login_profile_desc:'Veja suas vagas salvas e candidaturas aqui.',
    signup_tab:'Cadastrar', login_tab:'Entrar',
    f_email:'E-mail', f_password:'Senha', f_displayname:'Nome de exibição',
    signup_btn:'Criar conta', login_btn:'Entrar',
    or_google:'ou',
    err_required:'Por favor preencha nome, e-mail e senha',
    err_password_short:'A senha deve ter pelo menos 6 caracteres',
    signup_ok:'Conta criada!',
    check_email:'Verifique seu e-mail e clique no link de confirmação.',
    toast_login:'Login necessário', toast_applied_already:'Já se candidatou',
    toast_applied_ok:'Candidatura enviada!', toast_logout:'Sessão encerrada',
    toast_profile:'Perfil salvo!',
    toast_no_poster:'Não é possível enviar mensagem: informações do publicador indisponíveis',
    toast_self_dm:'Não pode enviar mensagem para sua própria vaga',
    toast_self_dm2:'Não pode se enviar mensagem',
    toast_new_app:'📨 Nova candidatura recebida!',
    toast_closed:'Esta vaga não aceita mais candidaturas',
    eng_basic:'Inglês básico OK', eng_none:'Sem inglês necessário', eng_inter:'Intermediário+',
    not_set:'Não definido', parts:'', edit_title:'Editar Vaga',
  },
  vi: {
    nav_home:'Trang chủ', nav_jobs:'Việc làm', nav_staff:'Nhân viên', nav_dm:'Tin nhắn', nav_profile:'Hồ sơ',
    tagline:'Tìm việc làm tốt tại Sydney ngay hôm nay',
    section_nearby:'Việc làm gần bạn', section_saved:'Việc đã lưu',
    login_cta_title:'Đăng nhập để dùng đầy đủ tính năng',
    login_cta_desc:'Lưu tin tuyển dụng, ứng tuyển và nhắn tin trực tiếp.',
    profile_completion:'Hoàn thiện hồ sơ',
    profile_hint:'Thêm ảnh, ngày hết hạn visa và thời gian có thể làm để tăng cơ hội nhận việc.',
    complete_profile:'Hoàn thiện hồ sơ',
    quick_jobs:'Việc làm hôm nay', quick_jobs_sub:'Xem tất cả tin tuyển dụng',
    quick_post:'Đăng tuyển dụng', quick_post_sub:'Dành cho nhà tuyển dụng',
    search_jobs:'Tìm việc làm', keyword_ph:'Tìm kiếm theo từ khóa',
    all_areas:'Tất cả khu vực', eng_cond:'Yêu cầu tiếng Anh', post_btn:'＋ Đăng tuyển',
    no_jobs:'Không có việc làm nào.',
    view_detail:'Xem chi tiết', save:'♡ Lưu', saved_btn:'♥ Đã lưu',
    loc_tbd:'Địa điểm chưa xác định', salary_tbd:'Lương chưa xác định', no_eng:'Không yêu cầu tiếng Anh',
    back_jobs:'← Quay lại danh sách',
    apply:'Ứng tuyển', applied_done:'✓ Đã ứng tuyển', applying:'Đang gửi...',
    apply_msg:'Lời nhắn (tùy chọn)', apply_ph:'Giới thiệu bản thân hoặc ca làm mong muốn...',
    send_apply:'Gửi đơn ứng tuyển', cancel:'Hủy',
    view_map:'📍 Xem trên Google Maps', dm_btn:'💬 Nhắn tin',
    badge_active:'Đang tuyển', badge_closed:'Đã đóng',
    post_title:'Đăng tuyển dụng', post_login_title:'Cần đăng nhập để đăng tin',
    post_login_desc:'Vui lòng đăng nhập bằng Google.',
    f_title:'Tên vị trí *', f_company:'Tên cơ sở *', f_location:'Địa điểm',
    f_salary:'Lương theo giờ', f_eng:'Yêu cầu tiếng Anh', f_desc:'Mô tả công việc', f_img:'Ảnh',
    f_categories:'Loại việc (tối đa 5)',
    save_btn:'Lưu', saving:'Đang lưu...',
    required_err:'Tên vị trí và tên cơ sở là bắt buộc.', job_saved:'Đăng tuyển thành công.',
    find_staff:'Tìm nhân viên', staff_desc:'Tìm ứng viên có thể làm việc tại Sydney.',
    no_staff:'Chưa có hồ sơ nhân viên.', contact:'💬 Liên hệ', visa_lbl:'🛂 Hạn visa:',
    dm_title:'Tin nhắn', dm_login_title:'Đăng nhập để sử dụng tin nhắn',
    no_dm:'Chưa có tin nhắn.', no_dm_hint:'Nhấn "Nhắn tin" từ tin tuyển dụng để bắt đầu.',
    back_dm:'← Quay lại tin nhắn', type_msg:'Nhập tin nhắn', send:'Gửi',
    first_msg:'Hãy gửi tin nhắn đầu tiên 👋', loading:'Đang tải...',
    logout:'Đăng xuất',
    tab_profile:'Hồ sơ', tab_applied:'Đơn ứng tuyển', tab_saved:'Đã lưu', tab_posted:'Tin đã đăng',
    change_photo:'📷 Đổi ảnh', photo_pending:'Lưu để áp dụng thay đổi',
    f_name:'Họ tên', f_eng_level:'Trình độ tiếng Anh', f_avail:'Thời gian có thể làm', f_visa:'Hạn visa', f_bio:'Giới thiệu bản thân',
    f_job_categories:'Loại việc mong muốn (tối đa 5)',
    no_applied:'Chưa có đơn ứng tuyển.', no_saved_jobs:'Chưa có việc làm đã lưu.',
    no_posted:'Chưa đăng tin tuyển dụng.', post_first:'Đăng tin đầu tiên',
    apps_count:'đơn ứng tuyển', view_apps:'▼ Xem ứng viên', close_apps:'▲ Đóng',
    no_apps:'Chưa có ứng viên.', hire:'✓ Tuyển dụng', reject:'✗ Từ chối',
    st_accepted:'Được tuyển', st_rejected:'Bị từ chối', st_pending:'Đang xét',
    b_accepted:'✓ Được tuyển', b_rejected:'✗ Bị từ chối', b_pending:'⏳ Đang xét',
    edit_job:'✏️ Sửa', delete_job:'🗑 Xóa', close_job:'Đóng tin tuyển', reopen_job:'Mở lại tin',
    confirm_del:'Xóa tin tuyển dụng này?', job_deleted:'Đã xóa tin tuyển dụng.',
    status_updated:'Đã cập nhật trạng thái', post_new:'＋ Đăng tin mới',
    login_title:'Đăng nhập WorkMate',
    login_sub:'Ứng dụng tìm việc cho du học sinh tại Sydney',
    login_google:'Đăng nhập bằng Google', guest:'← Tiếp tục không đăng nhập',
    login_profile:'Đăng nhập để tạo hồ sơ',
    login_profile_desc:'Xem tin đã lưu và lịch sử ứng tuyển tại đây.',
    signup_tab:'Đăng ký', login_tab:'Đăng nhập',
    f_email:'Email', f_password:'Mật khẩu', f_displayname:'Tên hiển thị',
    signup_btn:'Tạo tài khoản', login_btn:'Đăng nhập',
    or_google:'hoặc',
    err_required:'Vui lòng nhập họ tên, email và mật khẩu',
    err_password_short:'Mật khẩu phải có ít nhất 6 ký tự',
    signup_ok:'Tạo tài khoản thành công!',
    check_email:'Hãy kiểm tra email và nhấp vào liên kết xác nhận.',
    toast_login:'Vui lòng đăng nhập', toast_applied_already:'Đã ứng tuyển rồi',
    toast_applied_ok:'Đã gửi đơn ứng tuyển!', toast_logout:'Đã đăng xuất',
    toast_profile:'Đã lưu hồ sơ!',
    toast_no_poster:'Không thể nhắn tin: không tìm thấy thông tin người đăng',
    toast_self_dm:'Không thể nhắn tin cho tin đăng của chính bạn',
    toast_self_dm2:'Không thể nhắn tin cho chính mình',
    toast_new_app:'📨 Có đơn ứng tuyển mới!',
    toast_closed:'Tin tuyển dụng này đã đóng',
    eng_basic:'Tiếng Anh cơ bản OK', eng_none:'Không cần tiếng Anh', eng_inter:'Trung cấp trở lên',
    not_set:'Chưa đặt', parts:'', edit_title:'Sửa tin tuyển',
  },
  id: {
    nav_home:'Beranda', nav_jobs:'Lowongan', nav_staff:'Staf', nav_dm:'Pesan', nav_profile:'Profil',
    tagline:'Temukan pekerjaan yang tepat di Sydney hari ini',
    section_nearby:'Lowongan Terdekat', section_saved:'Lowongan Tersimpan',
    login_cta_title:'Masuk untuk mengakses semua fitur',
    login_cta_desc:'Simpan lowongan, lamar, dan gunakan pesan langsung.',
    profile_completion:'Kelengkapan Profil',
    profile_hint:'Tambahkan foto, tanggal kadaluarsa visa, dan ketersediaan untuk meningkatkan peluang Anda.',
    complete_profile:'Lengkapi Profil',
    quick_jobs:'Lowongan Hari Ini', quick_jobs_sub:'Lihat semua lowongan',
    quick_post:'Pasang Lowongan', quick_post_sub:'Untuk pengusaha',
    search_jobs:'Cari Lowongan', keyword_ph:'Cari kata kunci',
    all_areas:'Semua area', eng_cond:'Persyaratan bahasa Inggris', post_btn:'＋ Pasang Lowongan',
    no_jobs:'Tidak ada lowongan ditemukan.',
    view_detail:'Lihat Detail', save:'♡ Simpan', saved_btn:'♥ Tersimpan',
    loc_tbd:'Lokasi belum ditentukan', salary_tbd:'Gaji belum ditentukan', no_eng:'Tanpa syarat bahasa Inggris',
    back_jobs:'← Kembali ke Lowongan',
    apply:'Lamar Sekarang', applied_done:'✓ Sudah Melamar', applying:'Melamar...',
    apply_msg:'Pesan (opsional)', apply_ph:'Perkenalkan diri atau sebutkan ketersediaan shift Anda...',
    send_apply:'Kirim Lamaran', cancel:'Batal',
    view_map:'📍 Lihat di Google Maps', dm_btn:'💬 Pesan',
    badge_active:'Membuka Lowongan', badge_closed:'Ditutup',
    post_title:'Pasang Lowongan', post_login_title:'Login diperlukan untuk memasang',
    post_login_desc:'Masuk dengan Google untuk memasang lowongan.',
    f_title:'Judul Pekerjaan *', f_company:'Nama Usaha *', f_location:'Lokasi',
    f_salary:'Upah per Jam', f_eng:'Persyaratan Bahasa Inggris', f_desc:'Deskripsi Pekerjaan', f_img:'Foto',
    f_categories:'Jenis Pekerjaan (maks. 5)',
    save_btn:'Simpan', saving:'Menyimpan...',
    required_err:'Judul pekerjaan dan nama usaha wajib diisi.', job_saved:'Lowongan berhasil dipasang.',
    find_staff:'Cari Staf', staff_desc:'Temukan kandidat yang tersedia di Sydney.',
    no_staff:'Belum ada profil staf.', contact:'💬 Hubungi', visa_lbl:'🛂 Kedaluwarsa Visa:',
    dm_title:'Pesan', dm_login_title:'Masuk untuk menggunakan pesan',
    no_dm:'Belum ada pesan.', no_dm_hint:'Ketuk "Pesan" di lowongan untuk memulai.',
    back_dm:'← Kembali ke Pesan', type_msg:'Ketik pesan', send:'Kirim',
    first_msg:'Kirim pesan pertama Anda 👋', loading:'Memuat...',
    logout:'Keluar',
    tab_profile:'Profil', tab_applied:'Lamaran', tab_saved:'Tersimpan', tab_posted:'Lowongan Saya',
    change_photo:'📷 Ganti Foto', photo_pending:'Simpan untuk menerapkan perubahan',
    f_name:'Nama', f_eng_level:'Tingkat Bahasa Inggris', f_avail:'Ketersediaan', f_visa:'Kedaluwarsa Visa', f_bio:'Tentang Saya',
    f_job_categories:'Jenis Pekerjaan Diinginkan (maks. 5)',
    no_applied:'Belum ada lamaran.', no_saved_jobs:'Belum ada lowongan tersimpan.',
    no_posted:'Belum ada lowongan yang dipasang.', post_first:'Pasang Lowongan Pertama',
    apps_count:'lamaran', view_apps:'▼ Lihat Pelamar', close_apps:'▲ Tutup',
    no_apps:'Belum ada pelamar.', hire:'✓ Terima', reject:'✗ Tolak',
    st_accepted:'Diterima', st_rejected:'Ditolak', st_pending:'Menunggu',
    b_accepted:'✓ Diterima', b_rejected:'✗ Ditolak', b_pending:'⏳ Menunggu',
    edit_job:'✏️ Edit', delete_job:'🗑 Hapus', close_job:'Tutup Lowongan', reopen_job:'Buka Kembali',
    confirm_del:'Hapus lowongan ini?', job_deleted:'Lowongan dihapus.',
    status_updated:'Status lowongan diperbarui', post_new:'＋ Pasang Lowongan Baru',
    login_title:'Masuk ke WorkMate',
    login_sub:'Pencocokan pekerjaan untuk mahasiswa internasional di Sydney',
    login_google:'Masuk dengan Google', guest:'← Lanjutkan sebagai tamu',
    login_profile:'Masuk untuk membuat profil',
    login_profile_desc:'Lihat lowongan tersimpan dan riwayat lamaran di sini.',
    signup_tab:'Daftar', login_tab:'Masuk',
    f_email:'Email', f_password:'Kata Sandi', f_displayname:'Nama Tampilan',
    signup_btn:'Buat Akun', login_btn:'Masuk',
    or_google:'atau',
    err_required:'Harap isi nama, email, dan kata sandi',
    err_password_short:'Kata sandi minimal 6 karakter',
    signup_ok:'Akun berhasil dibuat!',
    check_email:'Periksa email Anda dan klik tautan konfirmasi.',
    toast_login:'Login diperlukan', toast_applied_already:'Sudah pernah melamar',
    toast_applied_ok:'Lamaran terkirim!', toast_logout:'Berhasil keluar',
    toast_profile:'Profil tersimpan!',
    toast_no_poster:'Tidak dapat mengirim pesan: info pemasang tidak tersedia',
    toast_self_dm:'Tidak dapat mengirim pesan ke lowongan Anda sendiri',
    toast_self_dm2:'Tidak dapat mengirim pesan ke diri sendiri',
    toast_new_app:'📨 Lamaran baru diterima!',
    toast_closed:'Lowongan ini sudah tidak menerima lamaran',
    eng_basic:'Bahasa Inggris dasar OK', eng_none:'Tanpa bahasa Inggris', eng_inter:'Menengah ke atas',
    not_set:'Belum diatur', parts:'', edit_title:'Edit Lowongan',
  },
}

const LANGS = [
  { code:'en', label:'English',            flag:'🇦🇺' },
  { code:'ja', label:'日本語',              flag:'🇯🇵' },
  { code:'ko', label:'한국어',              flag:'🇰🇷' },
  { code:'zh', label:'中文（简体）',        flag:'🇨🇳' },
  { code:'es', label:'Español',            flag:'🇪🇸' },
  { code:'fr', label:'Français',           flag:'🇫🇷' },
  { code:'pt', label:'Português',          flag:'🇧🇷' },
  { code:'vi', label:'Tiếng Việt',         flag:'🇻🇳' },
  { code:'id', label:'Bahasa Indonesia',   flag:'🇮🇩' },
]

const LangCtx = createContext({ lang:'en', setLang:()=>{}, t:T.en })
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
//  LangSelector
// ═════════════════════════════════════════════
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
      <button className="lang-selector-btn" onClick={() => setOpen(o => !o)} aria-label="Select language">
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
      <LangSelector lang={lang} onChange={changeLang} />

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
            background: isClosed ? 'rgba(184,48,48,0.1)' : 'rgba(61,107,74,0.12)',
            color:      isClosed ? '#b83030' : '#3d6b4a',
            border:     isClosed ? '1px solid rgba(184,48,48,0.2)' : '1px solid rgba(61,107,74,0.25)' }}>
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
