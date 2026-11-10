# School Dropout Tracker (CSP Project)

Static website. Works on GitHub Pages with no server.

## Pages
- `index.html` Login. Employee: EMP001 / admin123. Parent: ST001 / parent123
- `dashboard.html` Stats, add students, at-risk list with SMS/Call links
- `attendance.html` Filters, update attendance, chart, CSV export
- `risk.html` Risk scores, mark dropped out / re-enrol
- `interventions.html` Create plans, update progress
- `monthly.html` Class-wise and village-wise report, CSV, print
- `parent.html` Parent view of one child

## Deploy on GitHub Pages
1. Create a new repository and upload all files from this folder (keep them in the repo root).
2. Settings > Pages > Source: "Deploy from a branch" > Branch: `main` > `/ (root)` > Save.
3. Open `https://<your-username>.github.io/<repo-name>/` after a minute.

Data is saved in the browser (localStorage). Reset it from the Reports page.
