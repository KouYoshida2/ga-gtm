import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>ホームページへようこそ</h1>
      <p>このサイトではユーザー情報を閲覧することができます。</p>

      <div className="navigation-links">
        <Link to="/users" className="nav-link">
          ユーザー一覧を見る
        </Link>
      </div>

      <div className="about-section">
        <h2>このアプリケーションについて</h2>
        <p>
          これはReactとReact
          Routerを使用して作成されたサンプルアプリケーションです。
          JSONPlaceholderのAPIからユーザーデータを取得し、一覧表示および詳細表示を行います。
        </p>
      </div>
    </div>
  );
};

export default Home;
