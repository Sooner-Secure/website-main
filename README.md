# Sooner Secure

A responsive, dependency-free website for Sooner Secure, a nonprofit working to enhance security and resilience across all sectors of human life.

## Preview locally

From this directory, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Before launch

- Confirm or replace `hello@soonersecure.org`.
- Have qualified counsel review `privacy.html`, `cookies.html`, and `terms.html` against the nonprofit's actual legal identity, address, vendors, hosting logs, retention schedule, outreach practices, and jurisdictions before launch.
- Update the privacy and cookie notices before adding forms, analytics, advertising, embedded media, payment services, or other third-party tools. Any optional script must check `window.soonerConsentAllows('analytics')` (or an appropriately added category) before loading.
- Add real program details, impact measures, and nonprofit registration information when available.
- Connect the site to a production domain and an analytics solution if desired.
