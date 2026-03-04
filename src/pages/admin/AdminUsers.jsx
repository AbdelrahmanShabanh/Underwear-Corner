import { useState, useEffect } from "react";
import axios from "axios";

const AdminUsers = ({ language }) => {
  const isRtl = language === "ar";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("Users error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-stats-loading">
        <div className="admin-loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-users">
      <h2 className="orders-title">
        <i className="fa-solid fa-users" />
        {isRtl ? ` المستخدمين (${users.length})` : ` Users (${users.length})`}
      </h2>

      {users.length === 0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-user-slash" />
          <p>{isRtl ? "لا يوجد مستخدمين مسجلين" : "No registered users yet"}</p>
        </div>
      ) : (
        <div className="users-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{isRtl ? "الاسم" : "Name"}</th>
                <th>{isRtl ? "البريد الإلكتروني" : "Email"}</th>
                <th>{isRtl ? "الطلبات" : "Orders"}</th>
                <th>{isRtl ? "تاريخ التسجيل" : "Joined"}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className="user-order-count">{u.orderCount || 0}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
