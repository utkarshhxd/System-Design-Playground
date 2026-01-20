# System Design Playground

A professional-grade, interactive system design tool built with **React 19** and **Vite**. This application allows users to create, visualize, and experiment with software architecture diagrams using a drag-and-drop interface.

## 🚀 Features

- **Interactive Infinite Canvas**: A smooth, high-performance canvas environment for building large-scale diagrams.
- **Drag-and-Drop Component Library**:
  - **Core Components**: Client, API Server, Database, Load Balancer, Cache, Message Queue.
  - **Infrastructure**: CDN, Firewall, Object Storage, Event Stream, DNS.
- **Dynamic Connections**: Link components together to visualize data flow and architectural dependencies.
- **Properties Panel**: Customize specific attributes of selected nodes (e.g., database type, server capacity).
- **Keyboard Shortcuts**:
  - `Delete` / `Backspace`: Remove selected nodes or connections.
- **Premium UI**: deeply integrated dark mode aesthetics with glassmorphism effects and refined typography.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Variables & Modules) for high-performance rendering.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting**: ESLint + React Hooks & Refresh plugins.

## 📦 Getting Started

### Prerequisites

Ensure you have **Node.js** (v16+) installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/system-design-playground.git
    cd system-design-playground
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

Start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

### Building for Production

To create a production-ready build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

## 📂 Project Structure

```bash
src/
├── canvas/           # Core canvas logic (connection layers, grid, controls)
├── components/       # UI and Node components
│   ├── nodes/        # Individual architecture node definitions (Service, db, etc.)
│   └── ui/           # Sidebar, Properties Panel, and common UI elements
├── context/          # React Context providers (Canvas state management)
├── hooks/            # Custom hooks for interaction logic
├── styles/           # Global styles and mixins
├── App.jsx           # Main application layout
└── main.jsx          # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

[MIT](LICENSE)
