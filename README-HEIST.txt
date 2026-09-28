BANK OF MICKY HEIST — TEST HQ SIDE

Files included:
- index.html (updated: adds Heist Room tab)
- cloudflare-worker-test.js (updated with heist_state, heist_submit, heist_reset)
- heist-room.html
- heist-room.css
- heist-room.js
- README-HEIST.txt

What it does:
- Adds a new Heist Room tab in Test HQ.
- Opens Mikael's side of the 5-stage Bank of Micky heist.
- Reset button is HQ-only and uses the same HQ key / test worker.

Needed together with:
- matching TESTR update
- deploy updated cloudflare-worker-test.js to the test worker
