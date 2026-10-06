# Digana Villa Booking & Admin Management Platform

A high-performance, full-stack web application designed for boutique villa bookings and robust administrative management. Built with a responsive, modern frontend architecture and a hardened backend emphasizing enterprise security best practices.

## 🚀 Key Features
- **Public Booking Interface:** Seamless, intuitive user booking flow with real-time field validation.
- **Admin Analytics Dashboard:** Dynamic data visualization using Recharts to track revenue, occupancy patterns, active bookings, and pending review moderation.
- **Role-Based Routing:** Strict frontend layout protection paired with robust backend middleware validation to prevent unauthorized access.

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Node.js, Express 5
- **Data Persistence:** Lightweight JSON-based file store (`db.json`) optimized for high-performance localized mock environments.

## 🔒 Security Implementation (SecOps Focused)
This application was engineered with a security-first mindset, mitigating common OWASP Top 10 vulnerabilities:
- **Cryptographic Hashing:** User passwords are secured using `bcrypt` with a high-computational workload factor of 12 rounds.
- **Session Integrity:** Stateful JWT-driven authorization leveraging `httpOnly`, `sameSite`, and explicit production `secure` cookie configurations to prevent XSS and session hijacking.
- **HTTP Header Hardening:** Automated implementation of `Helmet` security headers to establish cross-origin policies and mitigate injection vectors.
- **Brute-Force & Denial of Service (DoS) Mitigation:** Automated rate limiting implemented across public-facing login (strict 20-request ceiling per 15 minutes), booking, and review endpoints.
- **Payload Restrictions:** Imposed a strict 32kb body size limit on incoming JSON payloads to block memory exhaustion attacks.
- **Fail-Safe Design:** Production runtime pipeline configurations explicitly configured to halt process initiation if cryptographically strong environment secrets are missing.

## 🛠️ Quick Start Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd digana-villa-website
   ```

2. Configure Environment Variables:
   Create a `.env` file in the `/backend` directory matching the structural definitions found within `.env.example`.

3. Install dependencies and run development engines:
   ```bash
   # Start the Backend
   cd backend
   npm install
   npm run dev

   # Start the Frontend
   cd ../frontend
   npm install
   npm run dev
   ```
