# MCA Student Management System — Frontend

## 1. Prerequisites

Install **Node.js (LTS version)** from the official website:

https://nodejs.org/

Node.js includes npm, which is used to install and manage project dependencies.

After installation, open the terminal or VS Code terminal and verify:

```bash
node -v
npm -v
```

Both commands should display their installed versions.

## 2. Create the React Project Using Vite

Run:

```bash
npm create vite@latest
```

Vite will ask you a few questions. Select the following options:

- **Project name:** `mca-student-management-system`
- **Framework:** `React`
- **Variant:** `JavaScript`

If Vite asks whether to use experimental features or a newer version of a tool, select the default or stable option.

If prompted to install the create-vite package, confirm with `y`.

> If the project has already been created, skip this step. Do not create a second project inside the existing project.

## 3. Open the Project Directory

Move into the directory created by Vite:

```bash
cd mca-student-management-system
```

If you are using an existing project, open its root directory instead.

## 4. Install Dependencies

Run:

```bash
npm install
```

This installs the dependencies required by the project and creates the `node_modules` directory.

## 5. Configure ESLint

During Vite setup, choose the **ESLint** option if the setup wizard offers a separate linter selection.

ESLint helps identify potential code errors and maintain consistent code quality.

If the project was created using the standard React JavaScript template, ESLint configuration and related dependencies may already be included.

Do not install ESLint separately unless it is missing from the project's configuration.

## 6. Install Additional Project Packages

If required by the application, install the following packages:

```bash
npm install react-router-dom lucide-react axios
```

- `react-router-dom` — navigation between pages.
- `lucide-react` — icons used in the interface.
- `axios` — HTTP requests to the backend API.

If these packages are already listed in `package.json`, this step is unnecessary.

## 7. Run the Application

Start the Vite development server:

```bash
npm run dev
```

The terminal will display a local URL, usually:

```text
http://localhost:5173/
```

Open that URL in your browser to view the application.

Keep the terminal running while developing.

## 8. Check the Code Using ESLint

Run:

```bash
npm run lint
```

This checks the project for issues covered by the configured ESLint rules.

If the command is unavailable, check the `scripts` section of `package.json` to confirm that a `lint` script is configured.

## 9. Build the Application

To check whether the application can be prepared for production, run:

```bash
npm run build
```

Vite generates the production build in the `dist` directory.

To preview that build locally, run:

```bash
npm run preview
```

## Important Notes

- Run commands from the project directory containing `package.json`.
- Do not delete `package-lock.json`; it helps maintain consistent dependency versions.
- Do not manually modify installed files inside `node_modules`.
- If the application requires a backend, the backend must also be running for its API-dependent features to work.


```bash
npm install axios
```

































# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

