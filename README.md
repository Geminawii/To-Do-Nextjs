
# justdooeet! – Todo List App 📝

**justdooeet!** is a responsive, offline-capable Todo List web application built with **React** and **Vite**. It fetches data from the [DummyJSON Todos API](https://dummyjson.com) and enhances it with features like local persistence, task editing, filtering, and progress visualization.

---

## 🚀 Features

- 🔁 **Hybrid Data Source**: Fetches todos from DummyJSON API and combines them with local todos.
- ✏️ **Extended Fields**: Adds priority, description, and date fields stored in `localStorage`.
- ✅ **CRUD Operations**: Add, edit, delete, and complete todos—both online and offline.
- 🔍 **Search & Filter**: Filter todos by status (completed/incomplete) and search by text.
- 📦 **Query Caching & Offline Sync**: Uses **React Query** + **TanStack Query Persister** with `localforage`.
- 🔄 **Pagination**: Displays 10 tasks per page with navigation and mobile-friendly design.
- 🗑️ **Drag-and-Drop Delete**: Delete todos by dragging them into a trash area.
- 📊 **Progress Summary**: Visual bar showing percentage of completed vs pending tasks.
- 🧩 **Modular Design**: Uses `Dialog` modals for add/edit actions via ShadCN.
- ♿ **Accessibility**: Full keyboard navigation and ARIA support.
- 📱 **Responsive Layout**: Optimized for desktop, tablet, and mobile screens.
- **justaskeet**: A chatbot powered by Gemini AI to answer FAQs regarding the app.

## 🧠justaskeet!
justaskeet! is a friendly chatbot assistant powered by Gemini 2.5 Pro. It's designed to help users navigate and interact with the justdoeet! app by answering common questions and guiding them through actions like adding, editing, or deleting to-dos and categories.

💡 **Key Features**

- **Task Guidance:** Offers clear, step-by-step instructions for common app features — such as creating tasks, managing categories, filtering, editing, or deleting items.
- **Conversational Help:** Communicates with a friendly tone and supports multilingual responses.
- **Fallback Support:** When Gemini’s API usage limit is reached, the chatbot falls back to an FAQ-based response system powered by Fuse.js to handle basic queries.

**Limitations:**
- The chatbot cannot perform actions like adding or editing tasks — it can only guide users through the steps.
- No media generation — this model does not support generating images or videos.

- **Powered by Gemini 2.5 Pro:**
RPM (Requests per minute): 150
Batch Enqueued Tokens: 5,000,000

Gemini 2.5 is free to use, but subject to rate limits.

## 🧭 Pages Overview

`/dashboard`     Main todo list with filters, pagination, and controls 
`/todo/:id`      Detailed view of individual todo item           
 `/categories`   Manage and assign categories to todos           
                  


## 🛠 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **View the app**:
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📦 Available Scripts

| Command           | Description                                 |
|------------------|---------------------------------------------|
| `npm run dev`     | Run in development mode with hot reloading  |
| `npm run build`   | Build the app for production                |
| `npm run preview` | Preview the production build                |
| `npm test`        | Run tests (if configured)                   |
| `npm run lint`    | Lint the project (if linter configured)     |

---

## 🧱 Tech Stack & Architecture

- **React + Vite** – Lightning-fast dev environment and optimized production build
- **React Router** – SPA routing
- **React Query (@tanstack/react-query)** – API caching, background refetching, state management
- **@tanstack/query-persist-client** – Persists React Query data to `localforage` for offline caching
- **localStorage** – Stores extended task fields (description, priority, etc.)
- **localforage** – Async persistent storage used with Query Persister
- **Tailwind CSS** – Utility-first styling framework
- **ShadCN UI** – Accessible and consistent UI components (e.g., `Dialog`)
- **Sonner** – Toast notifications for UX feedback
- **DnD Kit** – Drag-and-drop to delete tasks
- **DummyJSON API** – Simulated todo API for read/write operations
- **Fuse JS** - To support the chatbot
- **React Framer Motion** - For smoother animations when navigating between pages
- **React Markdown** - For italics and bold texts used by justaskeet! chatbot

---

## 🔌 API Usage

**DummyJSON Todos API**

- `GET /todos?limit=100` – Fetch up to 100 todos
- `PUT /todos/:id` – Update todo (e.g. mark as completed)
- `DELETE /todos/:id` – Delete a todo by ID

> API data is merged with local todos, and extended fields are stored locally by `todo.id`.

---

## 🖼 Screenshots / Demos

![Dashboard](./dashboard.png)
![Categories Page](./categories.png)
![Delete Modal](./delete.png)
![Drag and drop functionality](./dnd.png)
![Edit Modal](./edit.png)
![iPad View of Categories Page](./ipadcat.png)
![Loader](./loader.png)
![Login Page](./login.png)
![Mobile Login Page](./mobilelogin.png)
![Mobile Categories View](./mobilecat.png)
![Detailed ToDo Page](./todo.png)
![justaskeet! support and abilities](./jat1.png)
![justaskeet! support and abilities](./jat2.png)
![justaskeet! support and abilities](./jdt.png)


## ⚠ Known Issues / Limitations

-  **No authentication** – All data is publicly shared and session-based.
-  **API does not persist** – Changes to DummyJSON API do not persist beyond session.
-  **Offline sync is one-way** – Local changes do not auto-resync to API on reconnect.
-  **Limited filtering**
-  **Limited Mobile Responsiveness**

---

## 📅 Future Improvements

- ✅ Better offline sync between API and local storage
- 📆 Enhanced calendar/reminder system
- 📦 Installable PWA support
- 🎨 More UI illustrations and animations
- 🧭 Advanced filters (by category, priority, etc.)
- 🎹 Keyboard shortcuts and accessibility polish
- 📱 Improved mobile and tablet responsiveness
- 🔔 Push notification support for reminders
- More robust features and wider FAQs for justaskeet chatbot

---

## ✅ Offline Availability

justdooeet! supports offline access to todos via:

- **localStorage** – Persists user-created todos and metadata.
- **localforage** + **TanStack Query Persister** – Caches fetched API todos so users can return to the app without internet.

> 🔁 Once loaded, todos remain available even after reload or disconnection.

---

## 👩‍💻 Author

> Built by Oluwatiseteminirere Coker 


