// All site copy lives here. Edit this file to update the portfolio.
import highradius from '../assets/logos/highradius.png'
import grroom from '../assets/logos/grroom.png'
import leidos from '../assets/logos/leidos.svg'
import greenportfolio from '../assets/logos/greenportfolio.png'
import nyu from '../assets/logos/nyu.svg'
import kiit from '../assets/logos/kiit.svg'

export const profile = {
  first: 'Purvav',
  last: 'Punyani',
  initials: 'PP',
  primaryRole: 'SDE',
  secondaryRoles: 'DE · MLE',
  roles: ['Software Engineer', 'Data Engineer', 'ML Engineer'],
  lede: 'Software Engineer at Leidos on the SSA Anti-Fraud program, turning legacy fraud models into Python data pipelines on AWS that move 10M+ records a day. NYU M.S. Computer Engineering.',
  status: 'Open to new opportunities · Brooklyn, NY',
  email: 'purvavpunyani@gmail.com',
  linkedin: 'https://linkedin.com/in/purvavpunyani',
  github: 'https://github.com/Purvav0511',
  resume: `${import.meta.env.BASE_URL}resume.pdf`,
}

// Years of hands-on experience per core strength.
export const cardStats = [
  { value: '6+', label: 'Python' },
  { value: '5+', label: 'ML / AI' },
  { value: '4+', label: 'SQL' },
  { value: '4+', label: 'Backend' },
  { value: '3+', label: 'Data pipelines' },
  { value: '3+', label: 'AWS' },
]

export const summary = {
  lead: 'Software Engineer with two years full-time on the SSA Anti-Fraud program at Leidos, modernising legacy SAS fraud models into Python data pipelines on AWS that move 10M+ records a day. I scope work directly with non-technical stakeholders and own it through production.',
  more: 'Before that: data science at GreenPortfolio, client automation at HighRadius, computer vision at Grroom, and AI products built at hackathons. M.S. Computer Engineering from NYU, B.Tech Computer Science from KIIT.',
  targets: [
    { code: 'SDE', text: 'Backend services, APIs, gRPC, FastAPI' },
    { code: 'DE', text: 'Airflow, Athena, Parquet, AWS batch pipelines' },
    { code: 'MLE', text: 'Fraud models, forecasting, LLM & CV apps' },
  ],
}

export const strengths = [
  { icon: 'rows', title: 'Data pipelines at scale', text: '10M+ records/day; 21M records/month loaded in 30 min', role: 'DE' },
  { icon: 'shield', title: 'Production reliability', text: 'Built the job monitor flagging late or failed runs across 20+ models', role: 'DE' },
  { icon: 'migrate', title: 'Legacy modernisation', text: 'Ported SAS fraud models to Python, retiring 5 services and 2 pipelines', role: 'SDE' },
  { icon: 'spark', title: 'Applied ML & AI', text: '+15% forecast accuracy, poisoning detection, GPT/Whisper products', role: 'MLE' },
  { icon: 'stack', title: 'Backend systems', text: 'C++ gRPC key-value store at ~21K ops/sec, 0.36 ms GET', role: 'SDE' },
  { icon: 'people', title: 'Stakeholder ownership', text: 'Scoped data needs with SSA analysts for 3 fraud models', role: 'ALL' },
]

// Experience, rendered as a squad. line: Now | Then | Academy
export const squad = [
  {
    line: 'Now', tier: 'gold', pos: 'DE', sub: 'SDE', co: 'Leidos', logo: leidos,
    role: 'Software Engineer', when: 'Sep 2024 — Present', foot: '2024 — Now',
    title: 'Software Engineer · Data Architect/Engineer', org: 'Leidos Inc. · SSA Anti-Fraud program',
    points: [
      'Ported legacy SAS fraud models to Python, building pre-fraud and sampling modules and retiring 5 services and 2 pipelines.',
      'Built an AWS Athena batch pipeline (Parquet, bulk COPY) loading 21M telecom records a month in 30 minutes.',
      'Rebuilt a claims fraud model on payment data after a legacy source was retired, cutting its inputs from 12 tables to 3.',
      'Keep 10M+ records a day flowing to fraud models via Airflow/Lambda batch jobs on AWS EC2.',
      'Built a service that checks each job after its expected finish, flagging late or failed runs across 20+ production models.',
    ],
    stack: ['Python', 'AWS', 'Athena', 'Airflow', 'Lambda', 'Greenplum', 'Postgres', 'SQL Server'],
  },
  {
    line: 'Then', tier: 'silver', pos: 'DS', sub: 'ETL · ML', co: 'GreenPortfolio', logo: greenportfolio, logoFill: true,
    role: 'Data Science Intern', when: 'Oct 2023 — Apr 2024', foot: '2023 — 24',
    title: 'Data Science Intern', org: 'GreenPortfolio · NYC climate-fintech',
    points: [
      'Cut cloud cost 10% and processing time 20% on the daily securities ETL by tuning execution and storage.',
      'Improved forecast accuracy 15% with a deployed, explainable forecasting pipeline.',
      'Raised financial-news insight relevance 25% with embedding-based story clustering.',
    ],
    stack: ['Python', 'BigQuery', 'Cloud Functions', 'Embeddings', 'Forecasting'],
  },
  {
    line: 'Then', tier: 'silver', pos: 'SDE', sub: 'AUTO', co: 'HighRadius', logo: highradius,
    role: 'Software Engineering Intern', when: 'Jul 2021 — Jun 2022', foot: '2021 — 22',
    title: 'Software Engineering Intern', org: 'HighRadius · B2B fintech SaaS',
    points: [
      'Automated claim retrieval from 3–4 client portals a week (incl. Starbucks, Walgreens) with Java/Selenium agents, archiving to S3.',
    ],
    stack: ['Java', 'Selenium', 'AWS S3'],
  },
  {
    line: 'Then', tier: 'silver', pos: 'MLE', sub: 'CV', co: 'Grroom', logo: grroom,
    role: 'ML Engineer Intern', when: 'Nov 2019 — Feb 2020', foot: '2019 — 20',
    title: 'Machine Learning Engineer Intern', org: 'Grroom · AI fashion startup',
    points: [
      'Trained YOLO clothing detectors on NVIDIA GPUs from 200+ labelled images per category to power outfit matching.',
    ],
    stack: ['Python', 'YOLO', 'Computer vision'],
  },
  {
    line: 'Academy', tier: 'teal', pos: 'MS', sub: 'COMP ENG', co: 'NYU', logo: nyu,
    role: 'M.S. Computer Engineering', when: 'Sep 2022 — May 2024', foot: 'GPA 3.82',
    title: 'M.S. Computer Engineering', org: 'New York University · Merit Scholarship',
    points: [
      'GPA 3.82 / 4.0.',
      'Course Assistant for Computer Networking for two semesters, supporting 40+ students through lectures, office hours, and grading.',
      'Co-authored a paper on detecting data-poisoning attacks.',
    ],
    stack: ['Networking', 'Machine learning', 'Distributed systems'],
  },
  {
    line: 'Academy', tier: 'teal', pos: 'BTECH', sub: 'CSE', co: 'KIIT', logo: kiit,
    role: 'B.Tech Computer Science', when: 'Jul 2018 — Jun 2022', foot: 'GPA 8.98',
    title: 'B.Tech Computer Science & Engineering', org: 'KIIT University · Bhubaneswar, India',
    points: [
      'GPA 8.98 / 10.',
      'Honors in Distributed Algorithms, Software Defined Networks, and Transaction Processing Systems.',
      'Minors in FinTech Engineering and Entrepreneurship.',
    ],
    stack: ['Distributed algorithms', 'SDN', 'Transaction processing', 'FinTech'],
  },
]

export const squadLines = [
  { id: 'Now', label: 'Current' },
  { id: 'Then', label: 'Previous' },
  { id: 'Academy', label: 'Academy' },
]

// `result` supports a leading bold phrase via **double asterisks**.
export const projects = [
  {
    title: 'CineFIBO', event: 'Bria FIBO Hackathon · Dec 2025', roles: ['SDE', 'MLE'], tint: 'rgba(255,170,90,.45)',
    text: 'Shot-planning and storyboarding tool for creators. Describe a scene and an OpenAI planner designs the coverage, Bria FIBO renders each frame from structured JSON, and storyboards persist for iteration.',
    result: '**Up to 12-shot** coverage plans; **4 structured controls** (angle, lens, mood, colour) re-render a shot predictably',
    stack: 'Next.js · TypeScript · FastAPI · OpenAI',
    code: 'https://github.com/Purvav0511/cinefibo',
  },
  {
    title: 'AI Voice Banking Assistant', event: 'TikTok TechJam 2024', roles: ['SDE', 'MLE'], tint: 'rgba(120,160,255,.45)',
    text: 'Real-time voice assistant for bank customers: Whisper speech-to-text, semantic routing to task handlers, and GPT-4 responses over Socket.IO, with call summaries saved to MySQL.',
    result: '**8 banking tasks** across **11 intents**, with 4-step caller authentication; wrote 44 of 75 commits',
    stack: 'Flask-SocketIO · React · Whisper · GPT-4 · MySQL',
    code: 'https://github.com/Purvav0511/TikTokCodeJam-AICustomerService',
  },
  {
    title: 'Zippy Key-Value Store', event: 'Team of 3 · Jun 2024', roles: ['SDE'], tint: 'rgba(95,209,139,.4)',
    text: 'Redis-style in-memory data store in C++ with TTL expiry, eviction, and snapshots. I built the async gRPC request path, the concurrency model, and the logging.',
    result: '**~21K ops/sec** and **0.36 ms** average GET at 10 concurrent clients',
    stack: 'C++ · gRPC · Protobuf · GoogleTest',
    code: 'https://github.com/Purvav0511/zippy',
  },
  {
    title: 'Document Q&A Pipeline', event: 'Personal project · 2025', roles: ['MLE', 'DE'], tint: 'rgba(160,120,255,.45)',
    text: 'RAG system that ingests PDF, CSV, DOCX, and JSON into ChromaDB and answers questions through a FastAPI service with GPT-4, grounded only in the retrieved context.',
    result: '**4 formats** with format-specific chunking; **incremental ingestion** skips unchanged files; batched, rate-limited embedding',
    stack: 'Python · LangChain · ChromaDB · FastAPI',
    code: 'https://github.com/Purvav0511/document-ai-system',
  },
  {
    title: 'Data Poisoning Detection', event: 'NYU paper · Dec 2023', roles: ['MLE'], tint: 'rgba(212,175,90,.45)',
    text: 'Co-authored study of 4 poisoning attacks (Convex Polytope, Feature Collision, Hidden-Trigger Backdoor, MetaPoison) on a VGG16 CIFAR-10 model, with anomaly-based detection.',
    result: 'Isolation Forest detection reached **73%** vs **67%** for One-Class SVM; poisoning cut accuracy to as low as 15%',
    stack: 'TensorFlow · scikit-learn · Docker',
    code: 'https://github.com/Purvav0511/Mitigating-Data-Poisoning-in-Machine-Learning-with-Anomaly-Detection-Techniques',
  },
  {
    title: 'Backdoor Defense via Pruning', event: 'NYU · ML Security · Dec 2023', roles: ['MLE'], tint: 'rgba(255,110,110,.4)',
    text: 'Fine-pruning defense on a backdoored DeepID face-recognition network (1,283 identities), pruning channels by activation until validation accuracy dropped past a threshold.',
    result: 'Cut attack success from **~100% to 77%** while keeping **84.5%** clean accuracy, and mapped the security vs accuracy trade-off',
    stack: 'TensorFlow · Keras · NumPy',
    code: 'https://github.com/Purvav0511/MLSec-BackDoor-Attacks',
  },
]

export const projectFilters = [
  { id: 'all', label: 'All' },
  { id: 'SDE', label: 'Software' },
  { id: 'MLE', label: 'ML & AI' },
]

export const resumeFacts = [
  { value: '4', label: 'Companies' },
  { value: '2', label: 'Degrees' },
  { value: '1', label: 'Page' },
]

export const navLinks = [
  { id: 'summary', label: 'Summary' },
  { id: 'squad', label: 'Experience' },
  { id: 'highlights', label: 'Projects' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Contact' },
]
