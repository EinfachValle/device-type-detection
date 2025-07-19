# Contributing to device-type-detection

Thanks for your interest in contributing! Follow the guidelines below to ensure a smooth process.

---

## 🧱 Project Setup

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/device-type-detection.git
   cd device-type-detection
   ```

3. **Install dependencies** using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

4. **Verify the project works**:

   ```bash
   npm run build && npm test
   ```

---

## 🌿 Branch Naming Convention

All changes must be made in a separate branch. Use one of the following prefixes:

| Prefix     | Use for...                       | Example                           |
| ---------- | -------------------------------- | --------------------------------- |
| `feature/` | New features                     | `feature/device-orientation-hook` |
| `bugfix/`  | Fixing a bug                     | `bugfix/missing-tv4k-detection`   |
| `patch/`   | Minor fixes or changes           | `patch/fix-readme-typo`           |
| `docs/`    | Documentation updates            | `docs/add-install-instructions`   |
| `chore/`   | Non-functional changes (e.g. CI) | `chore/setup-github-actions`      |

> ⚠️ Never push directly to `main`. All contributions must go through a pull request.

---

## 🧾 Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Examples:

- `feature: [UserName] add TV 4K screen detection`
- `bugfix: [UserName] throttle resize listener properly`
- `patch: [UserName] changed resolution`
- `docs: [UserName] update usage example`
- `chore: [UserName] add CODEOWNERS file`

---

## 🧪 Running Tests & Format

Run before pushing your branch:

```bash
npm test
```

Format code automatically:

```bash
npm run format
```

---

## 📦 Pull Request Checklist

- [ ] PR targets the `main` branch
- [ ] Descriptive title and clear description
- [ ] Code is tested and passes linting
- [ ] Follows commit and branch naming conventions
- [ ] Related issues are referenced (if applicable)

---

## 🤝 Code Review & Approval

All PRs must be reviewed by a code owner. GitHub will automatically request review based on the [CODEOWNERS](./.github/CODEOWNERS) file.

---

Thank you for contributing to `device-type-detection`! 🎉
