import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // JSONPlaceholderからサンプルユーザーデータを取得
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('ユーザーデータの取得に失敗しました:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="user-list-container">
      <h1>ユーザー一覧</h1>
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h2>{user.name}</h2>
            <p><strong>ユーザー名:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <Link to={`/users/${user.id}`} className="user-link">
              詳細を見る
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
