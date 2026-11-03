# PovertyWatch

Monitoring Poverty, Understanding Local Realities.

PovertyWatch is a web application for monitoring social and economic issues through public news sources. This repository currently contains the Phase 1 Next.js foundation; product features will be implemented in later phases.

## Requirements

- Node.js LTS
- npm

## Local development

Install dependencies and start the development server:

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```shell
npx tsc --noEmit
npm run lint
npm run build
```

## Environment

Copy `.env.example` to `.env.local` when local environment values are needed. Do not commit `.env.local` or other files containing secrets.

## Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS and shadcn/ui
- ESLint, Prettier, and Zod
