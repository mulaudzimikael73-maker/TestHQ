TESTHQ LIZZY LIFE v9

Upload to TestHQ:
- index.html
- test-life.js

No Cloudflare change is required if Cloudflare-Test-LOW-KV-v8 is already deployed.
The included cloudflare-worker-test.js is the same compatible v8 Low-KV Worker for convenience.

HQ behavior:
- loan approve/reject disappears immediately from Pending Loans
- accepted loan stays in a local delivery marker until Lizzy confirms receipt
- accepted legal case moves immediately into Court Docket
- rejected case disappears immediately
- local delivery markers prevent old snapshots from making requests reappear
- after Lizzy receives a loan approval, her Life Bucs increase by the approved loan amount exactly once
- after Lizzy receives case acceptance/rejection she gets an on-screen result
