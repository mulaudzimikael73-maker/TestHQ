LIZZY LIFE — TEST HQ

Upload/replace these files in TestHQ:
- index.html
- test-hq.js
- test-hq.css
- test-life.js (new)

Then redeploy:
- cloudflare-worker-test.js

to the SAME TEST Worker used by testr1 + TestHQ.
Do NOT deploy this test Worker to the live production Worker.

New TestHQ tab: Lizzy Life
It shows the saved virtual Life date/cash/job/home and lets HQ:
- send President Mikael invitations
- send recruitment
- approve/reject Bank of Micky loans
- choose loan repayments
- accept/reject Mikael Spector cases and choose legal fee structure

The Worker stores only the Life snapshot/commands. It does not advance Life time.
