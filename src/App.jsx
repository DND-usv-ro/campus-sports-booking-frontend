import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState("login");

  if (!currentUser) {
    if (authView === "register") {
      return (
        <RegisterPage
          onRegisterSuccess={(user) => setCurrentUser(user)}
          onSwitchToLogin={() => setAuthView("login")}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={(user) => setCurrentUser(user)}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  return (
    <div
      style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}
    >
      <span
        style={{
          padding: "6px 14px",
          borderRadius: "20px",
          backgroundColor: currentUser.rol === "Admin" ? "#fef3c7" : "#dbeafe",
          color: currentUser.rol === "Admin" ? "#b45309" : "#1e3a8a",
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        Rol: {currentUser.rol}
      </span>

      <h2 style={{ marginTop: "16px" }}>Bun venit, {currentUser.nume}!</h2>
      <p style={{ color: "#64748b" }}>{currentUser.email}</p>

      {currentUser.rol === "Admin" ? (
        <p style={{ color: "#0f172a", fontWeight: "500" }}>
          Aici va fi Panoul de Admin (toate rezervările, mentenanță facilități,
          statistici).
        </p>
      ) : (
        <p style={{ color: "#0f172a", fontWeight: "500" }}>
          Aici va fi Catalogul de Facilități și Calendarul tău de rezervări.
        </p>
      )}

      <button
        onClick={() => setCurrentUser(null)}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: "#1e3a8a",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Deconectare
      </button>
    </div>
  );
}

export default App;
