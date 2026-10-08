// The scout's only source of truth about Purvav. Keep in sync with the résumé
// and src/data/content.js. Never put contact details like the phone number here.
export const PROFILE = `
# Purvav Punyani
Location: Brooklyn, NY. Targeting Software Engineer (primary), Data Engineer, and ML Engineer roles.
Currently a Software Engineer at Leidos, serving a notice period and open to new roles.

## Summary
Software Engineer with 2 years full-time on the SSA Anti-Fraud program at Leidos, modernizing legacy SAS fraud models into Python data pipelines on AWS that move 10M+ records a day. Earlier data science at GreenPortfolio and client automation at HighRadius, plus AI products built at hackathons. Comfortable scoping work directly with non-technical stakeholders and owning it through production.

## Experience

### Leidos Inc. — Software Engineer (Data Architect/Engineer), SSA Anti-Fraud program. Sep 2024 – Present
Fraud-detection models that flag suspicious activity for Social Security Administration analysts and investigators.
- Ported legacy SAS fraud models to Python, building pre-fraud and sampling modules and retiring 5 services and 2 pipelines.
- Built an AWS Athena batch pipeline (Parquet, bulk COPY) loading 21M telecom records/month in 30 minutes for fraud analytics.
- After a legacy data source was retired, rebuilt a claims fraud model on payment data, cutting its inputs from 12 tables to 3.
- Scoped new data needs in recurring meetings with SSA analysts, then designed schemas, queries, and pipelines for 3 fraud models.
- Keeps 10M+ records/day flowing to fraud models via Airflow and AWS Lambda batch jobs on AWS EC2 (Greenplum, SQL Server, Postgres).
- Built a service that checks each job right after its expected finish time, flagging late or failed runs across 20+ production models.

### GreenPortfolio — Data Science Intern. Oct 2023 – Apr 2024
NYC climate-fintech startup helping individual investors align their portfolios with their values.
- Cut cloud cost 10% and processing time 20% on a daily securities ETL (GCP Cloud Functions, BigQuery) by tuning execution and storage.
- Improved forecast accuracy 15% with a deployed forecasting pipeline whose explainable outputs show each prediction's drivers.
- Raised financial-news insight relevance 25% by prototyping embedding-based clustering that groups related stories into themes.

### HighRadius Corporation — Software Engineering Intern. Jul 2021 – Jun 2022
B2B fintech SaaS automating accounts receivable and order-to-cash workflows for Fortune 500 finance teams.
- Automated claim retrieval from 3–4 client portals a week (including Starbucks and Walgreens) with Java/Selenium agents, archiving to S3.

### Grroom — Machine Learning Engineer Intern. Nov 2019 – Feb 2020
AI fashion startup helping shoppers match outfits.
- Trained YOLO clothing detectors on NVIDIA GPUs from 200+ labeled images per category to power outfit matching.

## Projects
- CineFIBO (Bria FIBO Hackathon, Dec 2025; Next.js, TypeScript, FastAPI, OpenAI, Bria FIBO). Solo project. Turns one scene into a coverage plan of up to 12 shots by pairing OpenAI shot planning with Bria FIBO JSON-native image generation; 4 structured controls (angle, lens, mood, color) re-render a shot predictably; storyboards persist for iteration.
- AI Voice Banking Assistant (TikTok TechJam 2024; Flask-SocketIO, React, Whisper, GPT-4, MySQL). Team of 2; wrote 44 of 75 commits. Voice assistant resolving 8 banking requests from balance checks to fraud flags; 4-step caller authentication; real-time Socket.IO task handling across 11 intents with semantic routing; call summaries saved to MySQL.
- Zippy in-memory key-value store (Jun 2024; C++, gRPC, Protobuf, GoogleTest). Team of 3. Built the async gRPC request path (completion queue, 3 worker threads), the concurrency model, per-client request tracking, and timestamped logging; added concurrency tests to a 13-test GoogleTest suite. Store reached ~21K ops/sec and 0.36 ms average GET at 10 clients.
- Document Q&A pipeline (2025; Python, LangChain, ChromaDB, FastAPI, OpenAI). Personal project. RAG system ingesting PDF, CSV, DOCX, and JSON with format-specific chunking, incremental ingestion that skips unchanged files, and batched rate-limited embedding; answers through a FastAPI service grounded in retrieved context. No formal evaluation metrics yet.
- Data Poisoning Detection (NYU paper, Dec 2023; TensorFlow, VGG16, scikit-learn, Docker). Team of 2, co-authored paper. Studied 4 data-poisoning attacks on a VGG16 CIFAR-10 model (poisoned training cut accuracy to as low as 15%); built the baseline, 2 attack pipelines, and Isolation Forest detection (73% accuracy vs 67% for One-Class SVM).
- Backdoor Defense via Pruning (NYU ML Security, Dec 2023; TensorFlow, Keras). Fine-pruning defense on a backdoored DeepID face-recognition network (1,283 identities); reduced attack success rate from ~100% to 77% while keeping 84.5% clean accuracy.
- CheapThrills budget trip planner (NYU Big Data course, May 2023; React, Flask, PySpark, MongoDB, PostgreSQL). Team of 5. Travel recommender suggesting destinations from a traveller's dates and budget, built on airfare and points-of-interest datasets; the backend used PySpark (including the MongoDB Spark connector) to load and query the data. Purvav worked with Spark on this academic team project; he has no production Spark experience.
- This portfolio site (2026; React, Vite, Three.js, Cloudflare Workers, Claude API), including this AI scouting tool.

## Skills
- Languages: Python, SQL, Java, C++, JavaScript, TypeScript, SAS (migration work).
- Backend: FastAPI, Flask, gRPC, Socket.IO, REST API design, Selenium, Docker, Git.
- Data: ETL/ELT pipelines, data modeling, Airflow, Parquet, Greenplum, PostgreSQL, SQL Server, MySQL, BigQuery.
- AI / ML: OpenAI APIs, LangChain, RAG, embeddings, semantic routing, Whisper, YOLO, PyTorch, TensorFlow, scikit-learn.
- Cloud & Ops: AWS (EC2, S3, Athena, Lambda), GCP (BigQuery, Cloud Functions), APScheduler, monitoring and alerting.
- Frontend: React, Next.js, TypeScript, HTML/CSS, Three.js.

## Years of hands-on experience (as shown on the portfolio)
Python 6+, ML/AI 5+, SQL 4+, Backend 4+, Data pipelines 3+, AWS 3+.

## Education
- New York University — M.S. Computer Engineering, Sep 2022 – May 2024. Merit Scholarship. GPA 3.82/4.0. Course Assistant for Computer Networking (2 semesters), supporting 40+ students.
- KIIT University (Bhubaneswar, India) — B.Tech Computer Science and Engineering, Jul 2018 – Jun 2022. GPA 8.98/10. Honors in Distributed Algorithms, Software Defined Networks, and Transaction Processing Systems. Minors in FinTech Engineering and Entrepreneurship.

## Not in the record (state as gaps if a role requires them)
No listed professional experience with: Kubernetes, Kafka, Snowflake, dbt, Terraform, Go, Rust, mobile development, or managing people as a formal people manager. Spark appears only in an academic team project, not in production work. Full-time industry experience is 2 years (plus internships); treat senior/staff requirements (e.g. 5+ years) honestly.
`.trim()
