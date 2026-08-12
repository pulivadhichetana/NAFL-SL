# NAFL Parent Attendance Sheet Portal

Two files here:

- **`index.html`** — the whole app (admin upload + teacher sheet generator). This is what gets hosted.
- **`Code.gs`** — the backend script that stores data in a Google Sheet. This goes into Google Apps Script, not GitHub.

The app is currently pointed at this Apps Script backend (see `CONFIG.API_URL` near the top of `index.html`'s `<script>` tag):
```
https://script.google.com/macros/s/AKfycbxtgfr5QNY9pmZOWm22wE9M0ou-NrRhBrdmmAy08InwR7NfNgh_dEJNHyQ9c3hoTbecnQ/exec
```

## 1. Upload to GitHub

1. Create a new repository (e.g. `NAFL-Attendance`) in your GitHub account, or reuse an existing one.
2. Add file → Upload files → drag in `index.html` (leave the name as `index.html` so it loads at the repo's root URL).
3. Commit.

## 2. Turn on GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Source**, pick the branch (usually `main`) and the root folder (`/`).
3. Save. GitHub gives you a URL like `https://<your-username>.github.io/NAFL-Attendance/` — that's the live link to share with teachers.

## 3. Confirm the Apps Script backend is public

The backend (`Code.gs`) should already be deployed. To confirm it's reachable by anyone, not just you:

1. Open the Google Sheet it's attached to → **Extensions → Apps Script**.
2. **Deploy → Manage deployments**.
3. Confirm the active deployment's **Type** is "Web app" and **Who has access** is **Anyone**.
4. Test it in an incognito window: open the API_URL above with `?action=getMeta` on the end. You should see plain JSON, not a sign-in page.

## 4. If you ever change Code.gs

Editing the script does **not** update the live URL automatically. You must:
Deploy → Manage deployments → edit (pencil) the existing deployment → Version: **New version** → Deploy.

## Everyday use

- **Admin** tab (username `nafl`, password `nafl@123`): set the school name, upload the whole-school student list as Excel/CSV (any column layout — you map columns after upload).
- **Teacher** tab: type the event, pick date + grade(s), generate the sheet, then Print / Download PDF / Download Word.

## If saves stop working

The most common cause is the Apps Script deployment access getting reset to something other than "Anyone" after an edit, or the file being opened locally (`file://...`) instead of from the hosted GitHub Pages link. Check both before anything else.
