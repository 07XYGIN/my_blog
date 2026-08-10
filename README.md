# my_blog

Next.js App Router blog interface recreated from the provided design references.

## Getting Started

Requires Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
pnpm lint
pnpm build
```

## Vercel CI/CD

`.github/workflows/cicd.yml` runs lint and build on pull requests, then deploys production after every push to `main`.

Add these GitHub Actions secrets in **Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN`: a Vercel account token
- `VERCEL_ORG_ID`: `team_nL5FtfNOypjZgcPVK1gtHi6x`
- `VERCEL_PROJECT_ID`: `prj_PAv6st6bjqhr09jqjXgi2NjnYULA`
