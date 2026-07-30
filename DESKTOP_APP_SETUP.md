# Turning this into a Windows + Mac Desktop App

This project is now wired up with **Tauri**, which wraps your existing
React dashboard in a native desktop window (no browser needed). This file
explains how to get real, double-click-able `.exe` (Windows) and `.dmg`/`.app`
(macOS) installers.

There are two ways to build the installers: locally on your own machine, or
automatically in the cloud via GitHub Actions (recommended, since it builds
BOTH Windows and Mac versions without you needing both computers).

---

## Option A (recommended): Build both automatically via GitHub

1. Create a new GitHub repository and push this project to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. This project already includes a workflow file at
   `.github/workflows/build-desktop-app.yml`. It builds a Windows installer
   and a macOS universal app automatically whenever you push a version tag.

3. Trigger a build by creating and pushing a tag:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
   (Or go to the "Actions" tab on GitHub → "Build Desktop App" → "Run workflow"
   to trigger it manually without a tag.)

4. After a few minutes, go to your repo's **Releases** section on GitHub.
   You'll find a draft release with both installers attached:
   - `Project Visibility Dashboard_x.x.x_x64-setup.exe` (or `.msi`) → Windows
   - `Project Visibility Dashboard_x.x.x_universal.dmg` → macOS

5. Download, review, and click "Publish release" when ready to share it.

No Rust or Xcode installation needed on your end — GitHub's servers do the
building for you.

---

## Option B: Build locally on your own machine

You'll need to build on a Mac to get a Mac app, and on Windows to get a
Windows app (Tauri can't cross-compile from one OS to the other).

### One-time setup (per machine)
1. Install [Node.js](https://nodejs.org) (v18+)
2. Install [Rust](https://www.rust-lang.org/tools/install)
3. **Windows only:** Install "Desktop development with C++" via the
   [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
4. **Mac only:** Install Xcode Command Line Tools: `xcode-select --install`

### Run it as a dev app (live reload, for testing)
```bash
npm install
npm run desktop:dev
```
A native window will pop up running your dashboard.

### Build the final installer
```bash
npm run desktop:build
```
The installer will be created inside `src-tauri/target/release/bundle/`.

---

## Notes

- **App icon:** I generated a simple placeholder icon (blue square with bars)
  at `src-tauri/icons/`. Swap those files with your own logo whenever you're
  ready — same filenames, same sizes.
- **App name:** Currently set to "Project Visibility Dashboard" in
  `src-tauri/tauri.conf.json` (`productName`) — change it there if needed.
- **Data:** The dashboard's data is still hardcoded in `src/app/App.tsx`.
  The desktop wrapper doesn't change that — it's a separate step if/when
  you want live data.
