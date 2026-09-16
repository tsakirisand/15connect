# 15Connect 🎓

> **Η σύγχρονη ψηφιακή πλατφόρμα για τα 15μελή Μαθητικά Συμβούλια των ελληνικών σχολείων.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

---

## 🌟 Επισκόπηση (Overview)

Το **15Connect** είναι μια πολυ-μισθωτική (multi-tenant) διαδικτυακή πλατφόρμα σχεδιασμένη ειδικά για τα 15μελή μαθητικά συμβούλια των ελληνικών γυμνασίων και λυκείων. 

Παρέχει έναν ασφαλή, ιδιωτικό ψηφιακό χώρο για κάθε σχολείο, όπου ο Πρόεδρος και το συμβούλιο μπορούν να δημοσιεύουν ανακοινώσεις, να οργανώνουν εκδηλώσεις και να διαχειρίζονται τις προτάσεις των μαθητών, ενώ οι μαθητές αποκτούν άμεση ενημέρωση και φωνή.

---

## ✨ Βασικά Χαρακτηριστικά (Features)

### 1. 🔐 Αυθεντικοποίηση & Ρόλοι (Auth & Security)
- **Firebase Authentication**: Σύνδεση & Εγγραφή με email και κωδικό πρόσβασης.
- **Διακριτοί Ρόλοι**:
  - **Πρόεδρος / Admin**: Δημιουργεί και διαχειρίζεται το χώρο του σχολείου, δημοσιεύει ανακοινώσεις/εκδηλώσεις, απαντά σε προτάσεις μαθητών.
  - **Μαθητής / Student**: Εγγράφεται με τον 4-ψήφιο κωδικό πρόσκλησης του σχολείου του, παρακολουθεί την ενημέρωση και υποβάλλει ιδέες.

### 2. 🏫 Δημιουργία Σχολείου & Προσκλήσεις (Onboarding & Invites)
- **Δημιουργία Χώρου Σχολείου**: Ο Πρόεδρος ορίζει όνομα σχολείου, λογότυπο, περιγραφή και στοιχεία επικοινωνίας.
- **Αυτόματος 4-Ψήφιος Κωδικός**: Παραγωγή μοναδικού κωδικού πρόσκλησης (π.χ. `VMD2`).
- **Downloadable QR Code**: Αυτόματη παραγωγή εικόνας PNG του QR Code για εκτύπωση στον πίνακα ανακοινώσεων του σχολείου.
- **Αυστηρή Προστασία Πρόσβασης**: Κανένας χρήστης δεν αποκτά πρόσβαση στο σχολείο χωρίς έγκυρο κωδικό πρόσκλησης.

### 3. 📢 Ανακοινώσεις & Νέα (Announcements Feed)
- Δημοσίευση επίσημων ανακοινώσεων με κατηγοριοποίηση (*Γενικά, Εκδηλώσεις, Αθλητισμός, Εκδρομές, Θέματα Σχολείου*).
- Δυνατότητα καρφιτσώματος (Pinning) σημαντικών ανακοινώσεων στην κορυφή.

### 4. 📅 Ημερολόγιο Εκδηλώσεων (School Events)
- Προγραμματισμός εκδηλώσεων με ημερομηνία, ώρα, τοποθεσία, εικόνα και εξωτερικούς συνδέσμους εγγραφής.

### 5. 💡 Προτάσεις Μαθητών & Ιδιωτικότητα (Student Ideas Portal)
- Οι μαθητές υποβάλλουν ιδέες για τη βελτίωση του σχολείου.
- **Ιδιωτικότητα**: Ο κάθε μαθητής βλέπει **αποκλειστικά και μόνο τις δικές του προτάσεις** και την εξέλιξή τους (*Νέα, Υπό εξέταση, Εγκρίθηκε, Απορρίφθηκε*) μαζί με την επίσημη απάντηση του 15μελούς.

### 6. 🛡️ Πίνακας Διαχείρισης Προέδρου (Admin Control Panel)
- Πλήρης πίνακας ελέγχου 5 καρτελών για τον Πρόεδρο:
  1. *Πρόσκληση & QR Code*
  2. *Διαχείριση Ανακοινώσεων*
  3. *Διαχείριση Εκδηλώσεων*
  4. *Διαχείριση & Απάντηση σε Προτάσεις Μαθητών*
  5. *Λίστα Εγγεγραμμένων Μελών & Ρυθμίσεις Σχολείου*

---

## 🛠️ Τεχνολογικό Στάκ (Tech Stack)

- **Frontend Framework**: [Next.js 15 (App Router)](https://nextjs.org/) με [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database & Storage**: [Supabase PostgreSQL](https://supabase.com/) με Row-Level Security (RLS) policies
- **QR Code Generator**: `qrcode.react` (SVG & Canvas PNG Download)

---

## 🚀 Οδηγός Εγκατάστασης & Εκτέλεσης (Getting Started)

### 1. Απαιτήσεις (Prerequisites)
- [Node.js](https://nodejs.org/) >= v20.x
- [npm](https://www.npmjs.com/) ή `pnpm`

### 2. Κλωνοποίηση & Εγκατάσταση Εξαρτήσεων
```bash
git clone https://github.com/your-username/15connect.git
cd 15connect
npm install
```

### 3. Ρύθμιση Μεταβλητών Περιβάλλοντος (`.env.local`)
Δημιουργήστε ένα αρχείο `.env.local` στη ρίζα του έργου:

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

### 4. Ρύθμιση Βάσης Δεδομένων Supabase
Εκτελέστε το script `supabase/schema.sql` στον **SQL Editor** του Supabase για να δημιουργήσετε τους πίνακες και τα RLS policies:
- `schools`
- `school_members`
- `announcements`
- `events`
- `ideas`

### 5. Εκτέλεση σε Τοπικό Server (Development)
```bash
npm run dev
```
Η εφαρμογή θα είναι διαθέσιμη στη διεύθυνση [http://localhost:3005](http://localhost:3005) (ή στο καθορισμένο port).

---

## 📂 Δομή Έργου (Project Structure)

```
15connect/
├── supabase/
│   └── schema.sql              # Supabase DDL, RLS policies & indexes
├── src/
│   ├── app/
│   │   ├── admin/page.tsx      # Πίνακας Διαχείρισης Προέδρου
│   │   ├── announcements/page.tsx # Ροή Ανακοινώσεων
│   │   ├── dashboard/page.tsx  # Κεντρικός Χώρος Σχολείου
│   │   ├── events/page.tsx     # Ημερολόγιο Εκδηλώσεων
│   │   ├── ideas/page.tsx      # Πύλη Προτάσεων Μαθητών
│   │   ├── join/               # Είσοδος με 4-ψήφιο κωδικό / QR link
│   │   ├── login/page.tsx      # Σύνδεση Χρήστη
│   │   ├── onboarding/create-school/page.tsx # Δημιουργία Σχολείου
│   │   ├── register/page.tsx   # Εγγραφή Χρήστη
│   │   ├── globals.css         # Styling & Tailwind setup
│   │   └── layout.tsx          # Root layout & ελληνικά metadata
│   ├── components/
│   │   ├── Footer.tsx          # Minimal footer με διακριτική επιλογή Προέδρου
│   │   ├── IdeaStatusBadge.tsx # Badging κατάστασης ιδεών
│   │   ├── Navbar.tsx          # Καθαρή πλοήγηση
│   │   └── QRCodeModal.tsx     # Downloadable PNG QR Code Generator
│   ├── context/
│   │   └── AuthContext.tsx     # State management αυθεντικοποίησης & δεδομένων
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

## 📜 Άδεια Χρήσης (License)

Αυτό το έργο διατίθεται υπό την άδεια [MIT License](LICENSE).

---

<p center align="center">
  Φτιαγμένο με ❤️ για τα ελληνικά μαθητικά συμβούλια.
</p>
