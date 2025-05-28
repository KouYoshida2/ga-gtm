import { Link } from "react-router-dom";
import "../App.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは存在しないか、移動された可能性があります。</p>
      <Link to="/" className="home-link">
        ホームページに戻る
      </Link>
    </div>
  );
};

export default NotFound;
