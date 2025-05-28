import { Link, useLocation } from "react-router-dom";
import "../App.css";

const Header = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">User App</Link>
      </div>

      <nav className="navigation">
        <ul>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">ホーム</Link>
          </li>
          <li className={location.pathname === "/users" ? "active" : ""}>
            <Link to="/users">ユーザー一覧</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
