# TrustLens — Digital Trust Intelligence

TrustLens is a browser-based demonstration workspace for organizing simulated digital trust reviews. It is a static frontend with no build step, backend, or package installation.

## Run locally

Open `index.html` directly, or open the project in Visual Studio Code and use Live Server. Google Fonts are optional; the application remains usable without the external font request.

## Vercel deployment

This static HTML, CSS, and JavaScript app uses the included `vercel.json` to serve the project root without a build step, packages, environment variables, or a backend.

To deploy from GitHub:

1. Push the project to a GitHub repository.
2. Sign in at Vercel and choose **Add New → Project**.
3. Import the repository.
4. Select **Other** as the framework, use `./` as the root directory, leave build and install commands empty, and set the output directory to `.`.
5. Deploy. Vercel will provide a production URL; custom domains can be configured in project settings.

With Git integration enabled, pushes to the production branch trigger deployments and pull requests get preview deployments. LocalStorage data does not transfer from the local development origin to the deployed domain.

## Features

- Command center with workspace metrics and recent investigations
- Media forensics workflow for local image, video, and audio file metadata
- URL format and string-pattern assessment
- Authorized identity-review workflow records
- TrustGraph relationship visualization
- Simulated trust score, search, JSON/CSV export, and print/PDF view
- Standalone registration form with real-time client-side field validation
- Sign-up and sign-in pages with Terms of Service consent and client-side credential-format feedback
- Local keyword-matching TrustLens assistant available across app pages
- Persistent light/dark theme toggle shared across dashboard and account pages
- Standalone arithmetic calculator with safe expression parsing and keyboard support
- Local light/dark theme and browser-based workspace storage

## Project files

- `index.html` — application shell and shared navigation
- `register.html` — responsive registration form
- `registration.js` — registration field validation
- `signup.html` and `signin.html` — account onboarding and sign-in forms
- `auth-pages.js` — client-side account form feedback and password visibility toggle
- `chatbot.js` — floating local assistant and keyword-matched replies
- `theme.js` — persistent global theme preference and toggle
- `calculator.html` and `calculator.js` — arithmetic calculator interface and parser
- `styles.css` — responsive layout, themes, and print styling
- `app.js` — views, local workspace state, simulated assessments, and exports
- `vercel.json` — static Vercel deployment configuration

## Simulation and privacy

This project does **not** perform deepfake detection, malware scanning, phishing reputation checks, identity searches, or evidence verification. Scores and indicators are illustrative and must not be used to make security, identity, or other consequential decisions.

Selected media files are not uploaded or read for their contents; only the filename, type, and size are used for a simulated record. Workspace records and theme preferences are stored in browser LocalStorage on the current device. Use fictional or authorized data, avoid sensitive personal information, and clear this site's browser storage to remove locally saved records.

Exports contain local demo records. The PDF option opens the browser print dialog; select “Save as PDF” there. Registration validates entries locally without transmitting or saving them. Sign-up and sign-in are interface demos only; account creation and authentication are not connected.
