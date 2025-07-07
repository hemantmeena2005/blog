# Truly IAS Blog

A modern, minimal full-stack blog platform built with Next.js 15, Tailwind CSS, MongoDB (Mongoose), and a rich text editor. Features both public and admin flows, with a simple client-side password-protected admin dashboard for demo purposes.

## Features

- **Modern UI**: Clean, card-based design with gradient headers and high-contrast minimalism.
- **Rich Text Editor**: Create and edit posts with formatting (React Quill New).
- **SEO**: Dynamic meta tags for public posts.
- **Admin Dashboard**: Create, edit, delete, and list posts. Protected by a demo password.
- **Public Blog**: View posts by slug, with styled content and responsive layout.
- **Client-side Admin Auth**: Simple password protection for demo (not for production use).

## Quick Start

### 1. Clone & Install
```sh
git clone <your-repo-url>
cd blogweb
npm install
```

### 2. Configure MongoDB
Create a `.env.local` file in the root:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```

### 3. Run the App
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 4. Admin Login
- Go to `/admin` or `/admin/create` or `/admin/edit/[slug]`
- **Password:** `admin` (see login hint on the form)

## Folder Structure
- `app/` — Next.js app directory (pages, routes, UI)
- `lib/` — Shared libraries (admin auth context, db, etc)
- `public/` — Static assets

## Tech Stack
- Next.js 15 (App Router)
- React 18+
- Tailwind CSS 4 + Typography plugin
- MongoDB + Mongoose
- React Quill New (rich text editor)

## Security Note
> **This project uses a client-side, hardcoded password for the admin dashboard for demo purposes only.**
> Do NOT use this approach in production. For real authentication, use NextAuth.js, JWT, or another secure method.

## License
MIT
