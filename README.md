RUN LOCALLY
Open this folder in Visual Studio Code and use Live Server on index.html, or serve this
folder with any static HTTP server. No build step, package installation, backend, or database
is required. The Google Fonts link is optional; the application remains usable offline.

VERCEL DEPLOYMENT
This is a static HTML, CSS, and JavaScript app. The included vercel.json serves the project
root directly; there is no build step, package installation, environment variable, or backend.

Deploy from GitHub:
1. Push the project to a GitHub repository.
2. Sign in at https://vercel.com and choose Add New > Project.
3. Import the GitHub repository and approve access if prompted.
4. In project settings, select Other as the framework, keep the root directory as `./`, leave
   the build and install commands empty, and set the output directory to `.`.
5. Choose Deploy. Vercel will provide a production URL when the deployment finishes.
6. To use a custom domain, open the project's Settings > Domains and follow the instructions.

With the Git integration enabled, pushes to the production branch trigger a production
deployment, and pull requests get preview deployments. No Vercel environment variables are
needed. Browser LocalStorage is scoped to the deployed domain, so local demo records do not
automatically transfer to the Vercel URL.

APPLICATION
- index.html: application shell, workspace navigation and shared search.
- styles.css: responsive enterprise interface, dark/light themes and print styles.
- app.js: view rendering, local workspace state, simulated analysis and export workflows.

WORKSPACES
- Command center: workspace summary, module shortcuts and recent cases.
- Media forensics: choose or drop local image, video or audio files to create demo records.
- Threat analyzer: submit a URL for a local, illustrative format and string-pattern assessment.
- Identity intelligence: create an authorized research workflow record.
- TrustGraph: filter and rearrange case nodes, then open records.
- Trust score: see how the average simulated record risk maps to the workspace score.
- Investigations & reports: search records and export JSON, CSV, or a print/PDF view.
- Settings: switch theme, back up data, restore sample records, and review limitations.

SIMULATION, PRIVACY AND DATA
This is a frontend-only demonstration. It does not perform deepfake detection, malware scanning,
phishing reputation checks, identity searches, or evidence verification. Scores and indicators
are simulated and must not be used to make security or identity decisions.

Files selected in Media forensics are not uploaded or read for content; only their name, type,
and size are used for a simulated case record. Workspace records and theme preferences are stored
in browser LocalStorage on this device. Use fictional or authorized data, and avoid sensitive
personal information. Clear this site's browser storage to remove locally saved records.

Exports contain local demo records. The PDF option opens the browser print dialog; choose
"Save as PDF" in your browser. Live backend, authentication, and intelligence integrations are
not included.
