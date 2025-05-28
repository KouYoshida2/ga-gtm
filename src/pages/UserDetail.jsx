import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../App.css";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (!user) {
    return <div className="error">ユーザーが見つかりません</div>;
  }

  return (
    <div className="user-detail-container">
      <h1>ユーザー詳細</h1>
      <div className="user-detail">
        <h2>{user.name}</h2>
        <div className="detail-section">
          <p>
            <strong>ユーザー名:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>電話番号:</strong> {user.phone}
          </p>
          <p>
            <strong>ウェブサイト:</strong> {user.website}
          </p>
        </div>

        <div className="detail-section">
          <h3>住所</h3>
          <p>
            {user.address.street}, {user.address.suite}
          </p>
          <p>
            {user.address.city}, {user.address.zipcode}
          </p>
        </div>

        <div className="detail-section">
          <h3>会社</h3>
          <p>
            <strong>会社名:</strong> {user.company.name}
          </p>
          <p>
            <strong>キャッチフレーズ:</strong> {user.company.catchPhrase}
          </p>
          <p>
            <strong>事業内容:</strong> {user.company.bs}
          </p>
        </div>

        <Link to="/users" className="back-button">
          ユーザー一覧に戻る
        </Link>
      </div>
    </div>
  );
};

export default UserDetail;
