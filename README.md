# Amin Zaherdannak — Portfolio

Static portfolio site hosted on GitHub Pages. All résumé and portfolio content lives in **`resume.json`** — one file to edit, two outputs (website + PDF).

## Updating your résumé / portfolio

1. Edit **`resume.json`** only.
2. Commit and push to `main`.
3. GitHub Actions regenerates the PDF and commits it automatically.
4. GitHub Pages serves the updated site.

### What goes where in `resume.json`

| Section | Portfolio site | PDF résumé |
|---|---|---|
| `profile`, `summary.portfolio` | Header, About | — |
| `summary.resume` | — | Professional Summary |
| `skills.portfolio` | Skills pills | — |
| `skills.resume` | — | Skills list |
| `experience` | Work Experience accordions | Work Experience |
| `projects`, `publications`, `contributions` | Site sections | — |
| `resumeContributions`, `education` | — | PDF sections |

Use `**bold**` and `[link text](url)` in text fields for rich formatting on the portfolio. PDF fields support `**bold**` only.

## Local development

```bash
# Serve the site (needs a local server for resume.json fetch)
npm run serve
# open http://localhost:4173

# Regenerate the PDF locally
npm install
npm run generate-pdf
```

## GitHub setup

1. **Push this repo** to GitHub (`AminDannak/AminDannak.github.io` or your fork).
2. **Enable GitHub Pages**: Settings → Pages → Source: **Deploy from branch** → branch `main`, folder `/ (root)`.
3. **Allow Actions to write**: Settings → Actions → General → Workflow permissions → **Read and write permissions** (required so the workflow can commit the generated PDF).
4. **First PDF generation**: Actions → **Generate Resume PDF** → **Run workflow** (or push a change to `resume.json`).

After that, every push that touches `resume.json` (or résumé templates) auto-updates `Amin-Zaherdannak--frontend-and-mobile-dev.pdf`.

## File layout

```
resume.json          ← single source of truth
index.html           ← portfolio shell + styles
resume.html          ← print/PDF layout
resume.css           ← résumé print styles
js/
  format.js          ← **bold** / [link](url) parsing
  render-portfolio.js
  render-resume.js
  portfolio-init.js
scripts/
  generate-pdf.mjs   ← Puppeteer PDF export
  serve.mjs          ← local static server
.github/workflows/
  generate-resume-pdf.yml
```
