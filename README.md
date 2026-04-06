# TeamCKB Member Management System
### *साथ है तो संभव है।* (Saath hai toh sambhav hai)

Welcome to the official platform for **TeamCKB**, a dedicated humanitarian initiative by the **Five Fold Maitri Society (Regd)**. This system is designed to streamline social work operations, manage global volunteer networks, and track the impact of community-driven aid programs.

---

## 🌟 Vision & Mission

Our mission is to ensure that no individual in the city goes to bed hungry. Through this platform, we empower a new generation of social leaders by providing tools for efficient food distribution, educational support, and hygiene awareness.

---

## 🚀 Key Features

### 1. Multi-Role Authentication & Onboarding
- **Specialized Roles**: Custom registration and landing flows for **Volunteers**, **Interns**, **Donors**, and **Sponsors**.
- **Secure Access**: Firebase-backed authentication system with protected routes for each persona.

### 2. Role-Based Activity Dashboards
- **Daily Logs**: Interns and Volunteers can log hours, tasks, challenges, and community interactions in real-time.
- **Impact Tracking**: Donors and Sponsors have dedicated views to monitor the progress of funded projects and overall society performance.

### 3. Comprehensive Administrative Suite
- **Member Directory**: A robust, searchable directory of all team members with advanced background categorization.
- **Award System**: Integrated tracking for **Volunteer/Intern of the Month & Year** to recognize outstanding humanitarian service.
- **Citizen Inquiry Portal**: Direct management of public queries with a transparent response pipeline.
- **Restricted Viewer Access**: Secure mechanism for creating temporary credentials for external auditors or stakeholders.

### 4. Premium "Woody" Glassmorphism UI
- **Aesthetic Excellence**: A custom-designed interface utilizing vibrant earth tones and modern glassmorphism effects.
- **Mobile-First Responsiveness**: Fully optimized for smartphones, tablets, and desktops using fluid typography and a custom responsive grid system.

### 5. Security & Privacy
- **Live Project Hardening**: Strict Firestore security rules tailored for sensitive humanitarian data.
- **Privacy Safeguards**: Built-in protections to prevent unauthorized data extraction by viewer accounts.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **State & Auth**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Analytics)
- **Styling**: Vanilla CSS with custom design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/) or Yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone git@github.com:DevDhapodkar/TeamCKB---Member-Management-System.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase credentials (refer to `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   ...
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📄 License & Compliance

This project is maintained by the **Five Fold Maitri Society (Regd)**. All humanitarian data and proprietary assets are protected under internal governance policies. Legal inquiries should be directed to `support@teamckb.com`.

*Made with ❤️ in India for the world.*
