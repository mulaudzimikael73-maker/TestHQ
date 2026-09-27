TESTHQ — LIZZY LIFE INTERVIEW + CONTRACT UPDATE

Replace in TestHQ:
- index.html
- test-life.js
- test-hq.css

Redeploy TEST Cloudflare Worker using:
- cloudflare-worker-test.js

Why Worker update is required:
The Life queue must allow two new HQ command kinds:
- contract_offer
- hiring_decision

TestHQ now receives:
- scheduled interviews
- the exact 3 questions asked automatically
- Lizzy's typed answers
- counter salary requests
- accepted/rejected/hired status

From TestHQ you can:
- send President Mikael recruitment
- send Michael Scott recruitment
- review answers
- propose a job title + salary
- reject applicant
- revise salary after Lizzy counters
