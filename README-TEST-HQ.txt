MIKAEL HQ TEST LAB
==================

This is a separate test copy. It does NOT contain the live Worker URL.

FILES
- index.html
- test-hq.css
- test-hq.js
- test-world.js
- cloudflare-worker-test.js

SAFE SETUP
1. Create a separate Cloudflare Worker, e.g. mickyhq-test.
2. Paste/deploy cloudflare-worker-test.js there.
3. Bind a KV namespace under the name LIZZY_TEST. A separate KV namespace is recommended.
   The Worker also prefixes every stored key with mickyhq-test: as an extra safeguard.
4. Add a MIKAEL_HQ_KEY secret for the TEST Worker. It may be different from the live HQ key.
5. Open this Test HQ and enter the TEST Worker URL + TEST HQ key.
6. Point only a cloned/test LizzyOS site at the same TEST Worker before testing cross-device actions.

DO NOT enter the live lizzyos-notifications Worker URL into this test HQ if your goal is isolation.

The Test HQ contains the same current controls, including MizzyGram, market manipulation, and entertainment fulfilment.
