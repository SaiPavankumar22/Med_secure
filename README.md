# MedSecure

A modern, secure, and user-friendly medical dashboard platform for managing sensitive healthcare data, featuring robust file encryption and decryption, AI-powered health insights, and comprehensive audit logging.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Security Notes](#security-notes)
- [Development](#development)
- [License](#license)

---

## Overview

**MedSecure** is a React-based web application designed for healthcare providers, patients, and regulatory authorities to securely manage, encrypt, and decrypt medical files. It also provides AI-driven health insights and maintains a detailed audit log for compliance and transparency.

The platform ensures that sensitive medical data is protected using AES-256 encryption, and only files encrypted by MedSecure can be decrypted within the platform, guaranteeing data integrity and privacy.

---

## Features

- **Medical Dashboard**: Centralized view for managing patient data, provider access, and audit logs.
- **File Encryption**: Securely encrypt any file (up to 100MB) using AES-256. Only MedSecure can decrypt these files.
- **File Decryption**: Decrypt files previously encrypted by MedSecure, restoring them to their original format.
- **AI Health Insights**: Visualize health risk scores and trends using interactive charts.
- **Provider Panel**: Manage access requests and view patient data (mocked for demo purposes).
- **Audit Logs**: Track all access and actions for compliance and transparency.
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS.

---


## Tech Stack

- **Frontend**: [React](https://react.dev/) (TypeScript)
- **UI**: [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) via [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Encryption**: [crypto-js](https://github.com/brix/crypto-js) (AES-256)
- **Tooling**: [Vite](https://vitejs.dev/), [ESLint](https://eslint.org/), [TypeScript](https://www.typescriptlang.org/)

---

## Project Structure

```
Med_secure/
├── src/
│   ├── App.tsx                # Main app component, handles navigation
│   ├── main.tsx               # React entry point
│   ├── index.css              # Tailwind CSS imports
│   └── components/
│       ├── Dashboard.tsx      # Dashboard, insights, provider, audit log UI
│       ├── FileEncryption.tsx # File encryption logic & UI
│       ├── FileDecryption.tsx # File decryption logic & UI
│       └── Sidebar.tsx        # Sidebar navigation
├── index.html                 # App HTML entry
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
├── tsconfig*.json             # TypeScript configs
├── eslint.config.js           # ESLint config
└── README.md                  # This file
```

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Med_secure
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open in your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (default Vite port)

---

## Usage

### File Encryption
- Navigate to **File Encryption** via the sidebar.
- Upload any file (max 100MB).
- Click **Encrypt File**. The file is encrypted with AES-256 and a proprietary signature.
- Download the encrypted `.medsecure` file. Only MedSecure can decrypt it.

### File Decryption
- Navigate to **File Decryption** via the sidebar.
- Upload a `.medsecure` file previously encrypted by MedSecure.
- Click **Decrypt File**. If valid, you can download the original file.

### Dashboard & Insights
- View patient data, manage permissions, and see AI-powered health risk scores.
- Provider panels and audit logs are available for demo and compliance purposes.

---

## Security Notes

- **AES-256 Encryption**: All files are encrypted using AES-256 via `crypto-js`.
- **Proprietary Signature**: Encrypted files are tagged with a unique signature (`MEDSECURE_2024_ENCRYPTED_FILE`). Only files with this signature can be decrypted by the platform.
- **Data Privacy**: No files are uploaded to a server; all encryption/decryption is performed client-side in the browser.
- **Audit Logging**: All access and actions are logged for transparency (demo data).

---

## Development

- **Linting:**
  ```bash
  npm run lint
  ```
- **Build for production:**
  ```bash
  npm run build
  ```
- **Preview production build:**
  ```bash
  npm run preview
  ```

---
