# Task Planning React App
![Screenshot 2025-01-05 192558](https://github.com/user-attachments/assets/ec35574f-0f0e-4ea9-91ca-e8fe873a2a67)



A modern task management application built with **React.js** and **TypeScript**, designed to help users efficiently organize and track tasks. The app utilizes **Firebase** for authentication and data storage, and **React Query** for seamless data fetching and state management.

## 🚀 Features

- User Authentication (Signup/Login) with Firebase
- Create, Read, Update, and Delete (CRUD) tasks
- Real-time data syncing across devices
- Task categorization and prioritization as Lists and Kanban View
- ![Screenshot 2025-01-09 182323](https://github.com/user-attachments/assets/34e57de7-1b6f-4676-aabb-591c2de4b0f7)

- ![Screenshot 2025-01-10 011553](https://github.com/user-attachments/assets/76f5de8d-59f4-402b-a1d2-fbc3cb51f80f)
- 
- Responsive and intuitive UI/UX
- State management with React Query
- Push notifications for task reminders

## 🛠 Tech Stack

- **Frontend:** React.js, TypeScript, React Query, Tailwind CSS (optional)
- **Backend/Database:** Firebase Authentication & Firestore
- **State Management:** React Query
- **Deployment:** Vercel/Netlify (optional)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/task-planning-app.git
   cd task-planning-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following Firebase configuration:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   Visit `http://localhost:5173` to view the app in your browser.

## 📂 Folder Structure

```
├── public
│   └── index.html
├── src
│   ├── assets
│   ├── components
│   │   ├── TaskList.tsx
│   │   └── TaskItem.tsx
│   ├── hooks
│   │   └── useTasks.ts
│   ├── pages
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── services
│   │   └── firebase.ts
│   ├── utils
│   │   └── helpers.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
└── README.md
```

## ⚙️ Available Scripts

- `npm run dev` — Starts the development server.
- `npm run build` — Builds the app for production.
- `npm run lint` — Runs ESLint to check for code issues.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

*Happy Coding! 🚀*

