This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deploying to Vercel

This application is optimized for Vercel.

1.  **Push to GitHub:** Ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel:**
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click "Add New..." -> "Project".
    *   Import your `ambient-showcase` repository.
3.  **Configure Project:**
    *   **Framework:** Next.js (Auto-detected).
    *   **Environment Variables:** Add the following key:
        *   `AMBIENT_API_KEY`: Your Ambient API Key (required for Mission 1 Chat).
4.  **Deploy:** Click "Deploy".

Once deployed, your app will be live and SSL secured automatically.
