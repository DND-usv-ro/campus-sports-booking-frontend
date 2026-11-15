import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cerere
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Eroare la preluarea utilizatorilor:", err);
        setError("Nu s-a putut face conexiunea cu backend-ul.");
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          borderBottom: "2px solid #2563eb",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "#2563eb", margin: 0 }}>Campus Sports Booking</h1>
        <p style={{ color: "#4b5563" }}>
          MVP - Listă Utilizatori (Integrare Frontend & Backend)
        </p>
      </header>

      {loading && <p>Se încarcă datele de la server...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>Nume</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Rol</th>
              <th style={{ padding: "12px", textAlign: "center" }}>
                Rezervări Săpt.
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.userId}
                style={{ borderBottom: "1px solid #e5e7eb" }}
              >
                <td style={{ padding: "12px" }}>{user.userId}</td>
                <td style={{ padding: "12px", fontWeight: "500" }}>
                  {user.nume}
                </td>
                <td style={{ padding: "12px", color: "#4b5563" }}>
                  {user.email}
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor:
                        user.rol === "Profesor" ? "#f3f4f6" : "#dbeafe",
                      color: user.rol === "Profesor" ? "#374151" : "#1d4ed8",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.rol}
                  </span>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {user.rezervariSaptamana}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
