# 15Connect 🎓

> **The modern digital web platform for Greek high school student councils ("15-member councils").**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

---

## 🌟 Overview

**15Connect** is a modern multi-tenant web platform engineered specifically for Greek high school student councils (*15-μελή συμβούλια*).

It provides a secure, private digital space for each school. Council Presidents can post official announcements, schedule school events, and manage student suggestions, while students gain instant access to school updates and a private feedback channel.

---

## ✨ Key Features

### 1. 🔐 Authentication & Role Security
- **Firebase Authentication**: Email & password account creation and sign-in.
- **Role Enforcement**:
  - **President / Admin**: Creates and manages the school profile, publishes news/events, and responds to student ideas.
  - **Student**: Registers with a valid 4-character school invitation code, follows news, and submits suggestions.

### 2. 🏫 School Onboarding & Invitation System
- **School Profile Creation**: Presidents configure school name, logo, description, theme, and contact info.
- **Automatic 4-Character Invitation Code**: Generates a unique 4-character code (e.g. `VMD2`) and invite link (`/register?role=student&code=VMD2`).
- **Downloadable PNG QR Code**: Instant high-resolution PNG QR Code generator ready for printing on school notice boards.
- **Strict Access Protection**: Students cannot join a school space without a valid invitation code.

### 3. 📢 News & Announcements Feed
- Categorized news posts (*General, Events, Sports, Trips, School Topics*).
- Pinning capability for urgent or high-priority announcements.

### 4. 📅 School Life Calendar & Events
- Event scheduling with date, time, location, cover image, and external registration links.

### 5. 💡 Student Suggestions & Privacy Isolation
- Students submit ideas for school improvements.
- **Privacy Enforcement**: Each student sees **ONLY their own submitted suggestions**, tracking real-time status updates (*New, Under Review, Accepted, Rejected*) and official council responses.

### 6. 🛡️ President Admin Dashboard
- Full 5-tab control panel for Council Presidents:
  1. *Invites & Downloadable QR Code*
  2. *Announcements Management*
  3. *Events Management*
  4. *Student Ideas & Response Management*
  5. *Registered Members List & School Settings*

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/) with [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database & Storage**: [Supabase PostgreSQL](https://supabase.com/) with Row-Level Security (RLS) policies
- **QR Code Generator**: `qrcode.react` (SVG & Canvas PNG Download)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) >= v20.x
- [npm](https://www.npmjs.com/) or `pnpm`

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/tsakirisand/15connect.git
cd 15connect
npm install
```

### 3. Environment Variables (`.env.local`)
Create a `.env.local` file in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your_supabase_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Supabase Database Setup
Execute the SQL script in `supabase/schema.sql` inside your **Supabase SQL Editor** to create tables, indexes, and RLS policies:
- `schools`
- `school_members`
- `announcements`
- `events`
- `ideas`

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 📂 Project Structure

```
15connect/
├── supabase/
│   └── schema.sql              # Supabase DDL, RLS policies & indexes
├── src/
│   ├── app/
│   │   ├── admin/page.tsx      # President Admin Control Dashboard
│   │   ├── announcements/page.tsx # Announcements Feed
│   │   ├── dashboard/page.tsx  # Main School Space Hub
│   │   ├── events/page.tsx     # Events Calendar
│   │   ├── ideas/page.tsx      # Student Ideas Submission Portal
│   │   ├── join/               # Join School Flow by code
│   │   ├── login/page.tsx      # User Login
│   │   ├── onboarding/create-school/page.tsx # School Setup Flow
│   │   ├── register/page.tsx   # User Registration (Student & President)
│   │   ├── globals.css         # Styling & Tailwind setup
│   │   └── layout.tsx          # Root layout & Metadata
│   ├── components/
│   │   ├── Footer.tsx          # Minimal footer with discrete President link
│   │   ├── IdeaStatusBadge.tsx # Status badges for student ideas
│   │   ├── Navbar.tsx          # Navigation header
│   │   └── QRCodeModal.tsx     # Downloadable PNG QR Code Generator Modal
│   ├── context/
│   │   └── AuthContext.tsx     # State management for auth & data
│   ├── lib/
│   │   ├── firebase.ts         # Firebase SDK initialization
│   │   └── supabase.ts         # Supabase client setup
│   └── types/
│       └── index.ts            # TypeScript Interfaces
├── .env.example
├── .env.local
└── README.md
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for Greek school student councils.
</p>
