# **FTS-CRM**

FTS-CRM is a powerful **customer relationship management (CRM)** application built with **React** and **Material-UI**. It provides an intuitive interface for managing customer interactions, tracking sales, and optimizing business workflows.

---

## **Table of Contents**

- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## **Features**

✅ **User Authentication** – Secure login and role-based access control  
✅ **Dashboard** – Overview of CRM activities and key metrics  
✅ **Customer Management** – Add, update, and track customer details  
✅ **Sales & Leads Tracking** – Monitor sales pipeline and manage leads efficiently  
✅ **Reports & Analytics** – Generate insightful business reports  
✅ **Responsive UI** – Optimized for both desktop and mobile devices

---

## Tech Stack

- **Frontend**: React (Vite)
- **UI Libraries**: MUI, Mantine, Tailwind CSS
- **State Management**: React Context API, React Query
- **Routing**: React Router
- **Data Handling**: Axios, Lodash
- **Charting**: ApexCharts, Chart.js
- **PDF & Reports**: jsPDF, html2pdf.js, pdfmake
- **Security**: JWT Authentication, CryptoJS

## **Installation**

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/fts-crm.git
   ```
2. **Navigate into the project directory:**
   ```sh
   cd fts-crm
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Start the development server:**
   ```sh
   npm start
   ```
   Once started, open `http://localhost:3000` in your browser.

---

## **Project Structure**

```
fts-crm/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── context/             # Context API for global state management
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API calls and business logic
│   ├── styles/              # Global and component-specific styles
│   ├── utils/               # Helper functions and utilities
│   ├── App.js               # Main application component
│   ├── index.js             # Entry point of the application
│   ├── routes.js            # Route definitions and navigation
├── public/                  # Static assets and public files
├── package.json             # Project dependencies and scripts
├── .env                     # Environment variables
├── README.md                # Documentation
```

---

## **Scripts**

You can use the following npm scripts:

- **Start the development server:**
  ```sh
  npm start
  ```
- **Build the application for production:**
  ```sh
  npm run build
  ```
- **Run tests:**
  ```sh
  npm run test
  ```
- **Lint the code:**
  ```sh
  npm run lint
  ```
- **Format the code using Prettier:**
  ```sh
  npm run format
  ```

---

## **Environment Variables**

To configure environment variables, create a `.env` file in the root directory:

```
REACT_APP_API_URL=your_api_url_here
REACT_APP_AUTH_SECRET=your_secret_here
```

---

## **Contributing**

We welcome contributions! If you'd like to contribute:

1. **Fork the repository**
2. **Create a new branch:**
   ```sh
   git checkout -b feature-branch
   ```
3. **Make your changes**
4. **Commit and push your changes:**
   ```sh
   git commit -m "Your commit message"
   git push origin feature-branch
   ```
5. **Submit a pull request**

---

## **License**

📜 This project is licensed under the **MIT License**.


## **Pending**
 membership dashboard 
 same copy of new receipt in old receipt