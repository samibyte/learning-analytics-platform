# 📊 EduAnalytics - Learning Analytics Platform

A sophisticated, modern educator's dashboard designed to empower instructors with actionable insights into student performance. Built with **Next.js 16**, **MongoDB**, and **AI-driven intelligence**, this platform transforms raw submission data into clear, visual signals of student success and potential risk.

---

## ✨ Key Features

### 👨‍🏫 Instructor Ecosystem
- **Intelligent Dashboard**: A high-level overview of class performance metrics, including total assignments, submission rates, and acceptance trends.
- **Automated Risk Detection**: A custom-built algorithm that flags "At-Risk" students based on late submissions, missing work, and performance trends.
- **Assignment Management**: Effortlessly create, view, and organize technical assignments.
- **Submission Review System**: Streamlined interface for reviewing student work, providing feedback, and managing grades.

### 🧠 AI & Data Intelligence
- **AI Assignment Refiner**: Leverages **Google Gemini (2.5 Flash)** to automatically structure and enhance assignment descriptions for maximum clarity.
- **Student Morale Analysis**: Uses natural language processing (**Sentiment**) to analyze student notes and detect patterns of frustration or enthusiasm across submissions.
- **Performance Analytics**: Visual data representations using **Recharts** to track submission health across the student body.

### 🎨 Modern UI/UX
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **Premium Aesthetics**: Built with a sleek, dark-mode-first aesthetic using **Tailwind CSS 4** and high-quality UI components from **Shadcn**.
- **Micro-animations**: Smooth transitions and hover effects for a premium application feel.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS 4, Lucide Icons, Geist Font |
| **Components** | Radix UI, Headless UI, Shadcn UI |
| **Database** | MongoDB + Mongoose |
| **Authentication** | NextAuth.js |
| **AI/ML** | Google Generative AI (Gemini), Sentiment Analysis |
| **Visualization** | Recharts |
| **State/Caching** | Next.js Server Actions & `unstable_cache` |

---

## 📂 Project Structure

```text
src/
├── app/              # Next.js App Router (instructor/student routes)
├── components/       # Shared UI components (AtRiskStudents, StatCards, etc.)
├── features/         # Domain-driven feature modules
│   ├── analytics/    # Risk scoring algorithms and action handlers
│   ├── assignments/  # CRUD logic and AI refinement actions
│   ├── submissions/  # Review logic and sentiment morale analysis
│   └── users/        # User models and authentication logic
├── lib/              # Core configurations (DB connection, Auth)
├── styles/           # Global styles and theme configurations
└── utils/            # Helper functions and shared logic
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/) (Recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB instance)
- A [Google AI Studio](https://aistudio.google.com/) API Key for Gemini features

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd learning-analytics-platform
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # AI Integration
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Access the application**:
   - Dashboard: `http://localhost:3000`
   - Instructor View: `http://localhost:3000/instructor/dashboard`

---

## 🧪 Verification & Testing

- **Backend**: Verified through server action validation and MongoDB schema integrity.
- **Analytics**: Risk detection logic is cached for performance and tested with various student submission scenarios.
- **UI**: Responsive layouts tested across multiple viewport sizes.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
