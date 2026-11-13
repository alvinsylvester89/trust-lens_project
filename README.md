# TrustLens — Digital Trust Intelligence

TrustLens is a browser-based demonstration workspace for organizing simulated digital trust reviews. It is a static frontend with no build step, backend, or package installation.

## Run locally

Open `index.html` directly, or open the project in Visual Studio Code and use Live Server. Google Fonts are optional; the application remains usable without the external font request.

## Features

- Command center with workspace metrics and recent investigations
- Media forensics workflow for local image, video, and audio file metadata
- URL format and string-pattern assessment
- Authorized identity-review workflow records
- TrustGraph relationship visualization
- Simulated trust score, search, JSON/CSV export, and print/PDF view
- Local light/dark theme and browser-based workspace storage

## Project files

- `index.html` — application shell and shared navigation
- `styles.css` — responsive layout, themes, and print styling
- `app.js` — views, local workspace state, simulated assessments, and exports

## Simulation and privacy

This project does **not** perform deepfake detection, malware scanning, phishing reputation checks, identity searches, or evidence verification. Scores and indicators are illustrative and must not be used to make security, identity, or other consequential decisions.

Selected media files are not uploaded or read for their contents; only the filename, type, and size are used in a simulated record. Workspace records and theme preferences are stored in browser LocalStorage on the current device. Use fictional or authorized data, avoid sensitive personal information, and clear this site's browser storage to remove locally saved records.

Exports contain local demo records. The PDF option opens the browser print dialog; select “Save as PDF” there. Authentication, live intelligence integrations, and a backend are not included.