import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail";
import NotFound from "./pages/NotFound";

function App() {
  const dataLayer = window.dataLayer || [];
  dataLayer.push({
    traffic: "injectedTrafficData",
  });
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>
            &copy; {new Date().getFullYear()} User App. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
