# ForceLink CRM

A modern, AI-powered Customer Relationship Management (CRM) system built with React, Vite, and Tailwind CSS. ForceLink CRM provides a sleek, dark-mode interface with powerful tools to manage leads, opportunities, and analytics.

![ForceLink CRM Banner](public/favicon.svg)

## 🚀 Features

### 🔐 Secure Authentication
- **JWT-based Authentication**: Secure Login and Signup flows.
- **Protected Routes**: Ensures only authenticated users can access the dashboard.
- **User Session Management**: Persistent login states.

### 📊 Interactive Dashboard
- **Analytics Overview**: Real-time insights into your business performance.
  - **Revenue Timeline**: Visualize financial growth over time.
  - **Opportunity Stages**: Track deals through different pipeline stages.
  - **Industry Distribution**: Understand your client demographics.
- **KPI Cards**: Quick stats for Total Revenue, Active Leads, Win Rate, and more.

### 🤖 ForceLink AI Assistant
- **Integrated AI**: Built-in AI assistant powered by Google Gemini.
- **Contextual Help**: Get instant answers to CRM queries and business advice.
- **Smart Suggestions**: AI-driven prompts to help you navigate and optimize your workflow.

### 📝 Comprehensive Management
- **Lead Management**: Capture and track potential clients.
- **Opportunity Tracking**: Manage deals from prospect to close.
- **Account Management**: Organize organizational details.
- **Task & Notes**: Built-in productivity visualization for keeping track of to-dos and important information.

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Premium aesthetic with backdrop blurs and subtle gradients.
- **Dark Mode Native**: Optimized for reduced eye strain and sleek appearance.
- **Responsive**: Fully functional across desktop and tablet devices.
- **Animations**: Smooth transitions and interactive elements using `framer-motion` concepts.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **AI Integration**: Google Gemini API

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/jkplearner/forcelinkCRM-frontend.git
    cd forcelink-crm-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your backend URL (and Gemini key if applicable on frontend):
    ```env
    VITE_BACKEND_URL=your_backend_url_here
    VITE_GEMINI_API_KEY=yout_gemini_api_key
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
