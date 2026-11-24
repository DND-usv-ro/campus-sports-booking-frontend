import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

function RegisterPage({ onRegisterSuccess, onSwitchToLogin }) {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [rol, setRol] = useState("Student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        nume,
        email,
        parola,
        rol,
      });
      onRegisterSuccess(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Eroare la crearea contului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-left-panel">
          <div className="brand-header">
            <div className="brand-icon">🏛️</div>
            <div>
              <p className="brand-title">CAMPUS UNIVERSITAR</p>
              <p className="brand-subtitle">Rezervări sportive</p>
            </div>
          </div>

          <div className="tagline">
            <span className="tagline-line"></span>
            <span>ALĂTURĂ-TE COMUNITĂȚII</span>
          </div>

          <h1 className="auth-heading">
            Creează-ți
            <br />
            contul acum.
          </h1>

          <p className="auth-description">
            Ai acces instant la bazin, sala de fitness, terenurile de fotbal și
            baschet direct din browser.
          </p>
        </div>

        <div className="auth-right-panel">
          <h2 className="form-title">Înregistrare</h2>
          <p className="form-subtitle">
            Completează datele tale instituționale
          </p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nume complet</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Maria Stan"
                value={nume}
                onChange={(e) => setNume(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email instituțional (.ro)</label>
              <input
                type="email"
                className="form-input"
                placeholder="maria.stan@campus.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rol</label>
              <select
                className="form-input"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
              >
                <option value="Student">Student</option>
                <option value="Profesor">Profesor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Parolă</label>
              <input
                type="password"
                className="form-input"
                placeholder="Alege o parolă"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Se creează contul..." : "Creează cont →"}
            </button>
          </form>

          <div className="switch-auth">
            Ai deja cont?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={onSwitchToLogin}
            >
              Autentifică-te
            </button>
          </div>

          <div className="auth-footer">
            🛡️ Acces securizat pentru comunitatea universitară
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
