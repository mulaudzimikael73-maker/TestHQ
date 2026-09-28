MICKYHQ TEST v8 — DATE/LAWSUIT SYNC + LOW-KV WORKER

Upload/replace in TestHQ:
- index.html
- test-hq.js
- test-world.js
- test-life.js
- test-hq.css

Then deploy cloudflare-worker-test.js to the TEST Worker only.

Fixes:
- Date/Life commands get a stable command ID and a local HQ outbox.
- If a command cannot reach Cloudflare it is retained for retry instead of disappearing.
- Worker deduplicates retried Life commands.
- Worker returns readable JSON/CORS errors, including KV quota errors, instead of a browser-only 'Failed to fetch' when possible.
- HQ Life, Market and MizzyGram polling intervals reduced to 30 seconds.
- Snapshot writes are deduplicated in the Worker.
- Unchanged Life/Market/MizzyGram snapshots do not repeatedly write KV.
- Snapshot comparison ignores the top-level `at` timestamp, preventing timestamp-only writes.

If today's Cloudflare KV WRITE quota is already exhausted, Cloudflare itself may refuse the rare queue write until the quota resets. The new code prevents the high-frequency snapshot writes that caused this and keeps HQ commands in the local outbox rather than losing them.
