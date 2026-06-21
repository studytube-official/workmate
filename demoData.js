export const demoProfile = {
  id: 'demo-employer',
  display_name: 'Sakura Kitchen',
  email: 'demo@workmate.au',
  english_level: 'Intermediate+',
  availability: 'Mon-Fri 09:00-18:00',
  visa_expiry: '2027-03-31',
  bio: 'Demo employer account for recording WorkMate walkthrough videos.',
  avatar_url: '',
}

export const demoSession = {
  user: {
    id: 'demo-employer',
    email: 'demo@workmate.au',
  },
}

const img = id => `https://images.unsplash.com/${id}?w=800&q=70&auto=format&fit=crop`

const jobTypes = [
  ['Morning Barista', 'Harbour Coffee', 'Sydney CBD', '$30/hr', 'Basic English OK', 'Cafe / Coffee Shop,Barista', img('photo-1495474472287-4d71bcdd2085')],
  ['Sushi Roll Maker', 'Sakura Kitchen', 'Sydney CBD', '$29/hr', 'No English needed', 'Sushi Restaurant,Kitchen Hand', img('photo-1579584425555-c3ce17fd4351')],
  ['Floor Staff', 'Darling Bistro', 'Darlinghurst, Sydney', '$28/hr', 'Basic English OK', 'Waiter / Waitress,Floor Staff', img('photo-1517248135467-4c7edcad34c4')],
  ['Kitchen Hand', 'Ramen Central', 'Sydney CBD', '$27/hr', 'No English needed', 'Kitchen Hand,Ramen / Noodle Shop', img('photo-1569718212165-3a8278d5f624')],
  ['Weekend Bartender', 'George Street Bar', 'Sydney CBD', '$32/hr', 'Intermediate+', 'Bartender,Bar / Pub', img('photo-1514362545857-3bc16c4c7d1b')],
  ['Cafe All-rounder', 'Bondi Brunch', 'Bondi, Sydney', '$29/hr', 'Basic English OK', 'Cafe / Coffee Shop,Floor Staff', img('photo-1525610553991-2bede1a236e2')],
  ['Line Cook', 'Izakaya Melbourne', 'Melbourne CBD', '$31/hr', 'Intermediate+', 'Line Cook,Izakaya / Japanese Restaurant', img('photo-1554118811-1e0d58224f24')],
  ['Dinner Waiter', 'Korean BBQ House', 'Surfers Paradise, Gold Coast', '$28/hr', 'Basic English OK', 'Waiter / Waitress,BBQ / Korean BBQ', img('photo-1590301157890-4810ed352733')],
  ['Prep Cook', 'Pasta Lane', 'Fortitude Valley, Brisbane', '$30/hr', 'No English needed', 'Prep Cook,Pizza / Italian', img('photo-1473093295043-cdd812d0e601')],
  ['Host / Hostess', 'Opera View Dining', 'Circular Quay, Sydney', '$31/hr', 'Intermediate+', 'Host / Hostess,Fine Dining', img('photo-1559339352-11d035aa65de')],
]

export const demoJobs = Array.from({ length: 36 }, (_, i) => {
  const base = jobTypes[i % jobTypes.length]
  const shift = ['Morning', 'Lunch', 'Dinner', 'Weekend'][i % 4]
  return {
    id: `demo-job-${i + 1}`,
    title: i < jobTypes.length ? base[0] : `${shift} ${base[0]}`,
    company: base[1],
    location: base[2],
    salary: base[3],
    english_level: base[4],
    categories: base[5],
    description: `Demo listing for recording. ${base[1]} is hiring ${base[0].toLowerCase()} staff in ${base[2]}. Trial shifts available this week, with flexible rosters for working holiday makers and international students.`,
    image_url: base[6],
    posted_by: i % 5 === 0 ? 'demo-employer' : `demo-business-${i}`,
    is_active: true,
    applications: [],
  }
})

const womanImg = n => `https://randomuser.me/api/portraits/women/${n}.jpg`
const faceImg  = id => `https://images.unsplash.com/${id}?w=400&h=400&q=70&auto=format&fit=crop&crop=faces`

export const demoStaff = [
  ['demo-staff-1', 'Mika Tanaka', 'Basic English OK', '月・火・水・木・金 07:00〜15:00', '2027-02-20', 'WHV holder. Two years cafe experience in Japan. Looking for barista or floor shifts.', 'Barista,Cafe / Coffee Shop,Floor Staff', womanImg(44)],
  ['demo-staff-2', 'Seoyeon Park', 'Intermediate+', '火・水・木・金・土・日 16:00〜23:00', '2026-12-15', 'International student. Available for dinner shifts and weekend kitchen hand work.', 'Kitchen Hand,Line Cook,Korean BBQ', womanImg(8)],
  ['demo-staff-3', 'Yui Sato', 'Basic English OK', '月・火・水 10:00〜18:00', '2027-05-01', 'Japanese restaurant experience. Comfortable with sushi prep and customer service.', 'Sushi Restaurant,Waiter / Waitress,Kitchen Hand', womanImg(85)],
  ['demo-staff-4', 'Alex Kim', 'Intermediate+', '金・土・日 12:00〜23:00', '2026-11-30', 'WHV holder. Bar and floor experience. Can start immediately.', 'Bartender,Floor Staff,Bar / Pub', faceImg('photo-1507591064344-4c6ce005b128')],
  ['demo-staff-5', 'Nana Lee', 'No English needed', '月・火・水・木・金 17:00〜23:00', '2027-01-10', 'Looking for kitchen hand or prep cook shifts around CBD.', 'Kitchen Hand,Prep Cook,Ramen / Noodle Shop', womanImg(12)],
  ['demo-staff-6', 'Riku Mori', 'Intermediate+', '土・日 08:00〜18:00', '2026-10-05', 'Cafe all-rounder with latte art practice and POS experience.', 'Barista,Cashier,Cafe / Coffee Shop', faceImg('photo-1492562080023-ab3db95bfbce')],
  ['demo-staff-7', 'Hana Choi', 'Basic English OK', '火・水・木 09:00〜16:00', '2027-06-25', 'Friendly floor staff candidate. Available around Chatswood and CBD.', 'Floor Staff,Waiter / Waitress,Host / Hostess', womanImg(90)],
  ['demo-staff-8', 'Emi Nakamura', 'Intermediate+', '月・火・水・木・金・土・日 15:00〜23:00', '2027-04-18', 'Line cook and dishwasher experience. Open to trial shifts this week.', 'Line Cook,Dishwasher,Kitchen Hand', womanImg(50)],
].map(([id, display_name, english_level, availability, visa_expiry, bio, job_categories, avatar_url], i) => ({
  id,
  display_name,
  english_level,
  availability,
  visa_expiry,
  bio,
  job_categories,
  avatar_url,
  // 早いほど先に登録（先着）、updated_at は最近ほどアクティブ
  created_at: `2026-05-${String(10 + i).padStart(2, '0')}T09:00:00.000Z`,
  updated_at: `2026-06-${String(18 - i).padStart(2, '0')}T09:00:00.000Z`,
}))

export const demoConversations = [
  {
    id: 'demo-conv-1',
    job_id: 'demo-job-2',
    participant_a: 'demo-employer',
    participant_b: 'demo-staff-3',
    company_name: 'Yui Sato',
    job_title: 'Sushi Roll Maker',
    avatar_url: 'https://randomuser.me/api/portraits/women/85.jpg',
    last_message: 'Yes, Thursday 10am works for me.',
    last_message_at: '2026-06-11T08:45:00.000Z',
  },
  {
    id: 'demo-conv-2',
    job_id: 'demo-job-1',
    participant_a: 'demo-employer',
    participant_b: 'demo-staff-1',
    company_name: 'Mika Tanaka',
    job_title: 'Morning Barista',
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    last_message: 'I can start next Monday.',
    last_message_at: '2026-06-11T07:20:00.000Z',
  },
  {
    id: 'demo-conv-3',
    job_id: null,
    participant_a: 'demo-employer',
    participant_b: 'demo-staff-4',
    company_name: 'Alex Kim',
    job_title: 'Staff',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=70&auto=format&fit=crop&crop=faces',
    last_message: 'Thanks, I am available this weekend.',
    last_message_at: '2026-06-10T22:12:00.000Z',
  },
]

export const demoMessages = {
  'demo-conv-1': [
    { id: 'm1', sender_id: 'demo-employer', text: 'Hi Yui, are you available for a sushi trial shift this week?', created_at: '2026-06-11T08:30:00.000Z' },
    { id: 'm2', sender_id: 'demo-staff-3', text: 'Yes, Wednesday or Thursday works for me.', created_at: '2026-06-11T08:34:00.000Z' },
    { id: 'm3', sender_id: 'demo-employer', text: 'Great. Can we confirm Thursday 10am at Sakura Kitchen?', created_at: '2026-06-11T08:40:00.000Z' },
    { id: 'm4', sender_id: 'demo-staff-3', text: 'Yes, Thursday 10am works for me.', created_at: '2026-06-11T08:45:00.000Z' },
  ],
  'demo-conv-2': [
    { id: 'm5', sender_id: 'demo-employer', text: 'Hi Mika, we liked your cafe experience. Are mornings okay?', created_at: '2026-06-11T07:10:00.000Z' },
    { id: 'm6', sender_id: 'demo-staff-1', text: 'Yes, I can start next Monday.', created_at: '2026-06-11T07:20:00.000Z' },
  ],
  'demo-conv-3': [
    { id: 'm7', sender_id: 'demo-employer', text: 'Hi Alex, we need weekend floor staff. Interested?', created_at: '2026-06-10T22:00:00.000Z' },
    { id: 'm8', sender_id: 'demo-staff-4', text: 'Thanks, I am available this weekend.', created_at: '2026-06-10T22:12:00.000Z' },
  ],
}

export const demoPostedJobs = [
  {
    ...demoJobs[1],
    posted_by: 'demo-employer',
    applications: [
      { id: 'demo-app-1', user_id: 'demo-staff-3', status: 'pending', message: 'I have sushi prep experience and can do weekday lunch shifts.', created_at: '2026-06-11T07:40:00.000Z', profiles: demoStaff[2] },
      { id: 'demo-app-2', user_id: 'demo-staff-5', status: 'pending', message: 'Available for dinner prep and cleaning shifts.', created_at: '2026-06-11T06:55:00.000Z', profiles: demoStaff[4] },
      { id: 'demo-app-3', user_id: 'demo-staff-8', status: 'accepted', message: 'Line cook experience and ready for trial.', created_at: '2026-06-10T21:22:00.000Z', profiles: demoStaff[7] },
    ],
  },
]

export const demoSavedJobIds = ['demo-job-1', 'demo-job-3', 'demo-job-6']

export const demoApplications = [
  { id: 'demo-user-app-1', user_id: 'demo-employer', job_id: 'demo-job-1', status: 'pending' },
]

// ─── 学生（求職者）目線のデモ（?demo=1&as=seeker）───
export const demoSeekerSession = {
  user: { id: 'demo-seeker', email: 'mika.demo@workmate.au' },
}

export const demoSeekerProfile = {
  id: 'demo-seeker',
  display_name: 'Mika Tanaka',
  email: 'mika.demo@workmate.au',
  english_level: 'Basic English OK',
  availability: '月・火・水・木・金 07:00〜15:00',
  visa_expiry: '', // デモ: 未入力にしてプロフィール完成を促すポップを見せる
  bio: 'WHV holder. Two years cafe experience in Japan. Looking for barista or floor shifts.',
  job_categories: 'Barista,Cafe / Coffee Shop,Floor Staff',
  avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
  created_at: '2026-05-11T09:00:00.000Z',
  updated_at: '2026-06-18T09:00:00.000Z',
}

// 学生 ↔ 店。company_name は店名、avatar_url は店（求人）の写真
export const demoSeekerConversations = [
  {
    id: 'demo-sconv-1',
    job_id: 'demo-job-1',
    participant_a: 'demo-seeker',
    participant_b: 'demo-shop-1',
    company_name: 'Harbour Coffee',
    job_title: 'Morning Barista',
    avatar_url: img('photo-1495474472287-4d71bcdd2085'),
    last_message: 'Sure, see you Thursday at 9am! 😊',
    last_message_at: '2026-06-12T02:15:00.000Z',
  },
  {
    id: 'demo-sconv-2',
    job_id: 'demo-job-6',
    participant_a: 'demo-seeker',
    participant_b: 'demo-shop-2',
    company_name: 'Bondi Brunch',
    job_title: 'Cafe All-rounder',
    avatar_url: img('photo-1525610553991-2bede1a236e2'),
    last_message: 'Thanks! I will send my availability now.',
    last_message_at: '2026-06-11T23:40:00.000Z',
  },
  {
    id: 'demo-sconv-3',
    job_id: 'demo-job-4',
    participant_a: 'demo-seeker',
    participant_b: 'demo-shop-3',
    company_name: 'Ramen Central',
    job_title: 'Kitchen Hand',
    avatar_url: img('photo-1569718212165-3a8278d5f624'),
    last_message: 'Got it, I can start next week.',
    last_message_at: '2026-06-10T09:05:00.000Z',
  },
]

export const demoSeekerMessages = {
  'demo-sconv-1': [
    { id: 'sm1', sender_id: 'demo-seeker', text: 'Hi! I saw your Morning Barista listing. I have 2 years of cafe experience in Japan — are you still hiring?', created_at: '2026-06-12T01:50:00.000Z' },
    { id: 'sm2', sender_id: 'demo-shop-1', text: 'Hi Mika! Yes, we are. Could you come in for a trial shift this week?', created_at: '2026-06-12T02:02:00.000Z' },
    { id: 'sm3', sender_id: 'demo-seeker', text: 'Yes, I would love to! I am free Thursday or Friday morning.', created_at: '2026-06-12T02:08:00.000Z' },
    { id: 'sm4', sender_id: 'demo-shop-1', text: 'Great — let us do Thursday 9am at our CBD shop. See you then!', created_at: '2026-06-12T02:12:00.000Z' },
    { id: 'sm5', sender_id: 'demo-seeker', text: 'Sure, see you Thursday at 9am! 😊', created_at: '2026-06-12T02:15:00.000Z' },
  ],
  'demo-sconv-2': [
    { id: 'sm6', sender_id: 'demo-shop-2', text: 'Hi Mika, thanks for applying! Are you available on weekends?', created_at: '2026-06-11T23:20:00.000Z' },
    { id: 'sm7', sender_id: 'demo-seeker', text: 'Yes, weekends work great for me. What hours do you need?', created_at: '2026-06-11T23:30:00.000Z' },
    { id: 'sm8', sender_id: 'demo-shop-2', text: 'Saturday and Sunday, 8am–2pm. Can you send your full availability?', created_at: '2026-06-11T23:36:00.000Z' },
    { id: 'sm9', sender_id: 'demo-seeker', text: 'Thanks! I will send my availability now.', created_at: '2026-06-11T23:40:00.000Z' },
  ],
  'demo-sconv-3': [
    { id: 'sm10', sender_id: 'demo-seeker', text: 'Hello! Is the Kitchen Hand position still open? I can work evenings.', created_at: '2026-06-10T08:40:00.000Z' },
    { id: 'sm11', sender_id: 'demo-shop-3', text: 'Hi! Yes it is. We need someone from next week, evenings 5–11pm.', created_at: '2026-06-10T08:55:00.000Z' },
    { id: 'sm12', sender_id: 'demo-seeker', text: 'Got it, I can start next week.', created_at: '2026-06-10T09:05:00.000Z' },
  ],
}
