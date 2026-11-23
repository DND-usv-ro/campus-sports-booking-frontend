import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        parola,
      });
      onLoginSuccess(response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.error || "Eroare la conectarea cu serverul.",
      );
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
            <span>MIȘCARE. ECHILIBRU. COMUNITATE.</span>
          </div>

          <h1 className="auth-heading">
            Sportul începe
            <br />
            aici.
          </h1>

          <p className="auth-description">
            Un loc pentru energia ta. Rezervă simplu și rapid terenurile și
            facilitățile sportive din campus.
          </p>
        </div>

        <div className="auth-right-panel">
          <h2 className="form-title">Autentificare</h2>
          <p className="form-subtitle">
            Introdu datele contului tău instituțional
          </p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email instituțional (.ro)</label>
              <input
                type="email"
                className="form-input"
                placeholder="ana.popescu@campus.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parolă</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
                required
              />
            </div>

            <div className="forgot-row">
              <button
                type="button"
                className="link-btn"
                onClick={() =>
                  alert(
                    "Contactează secretariatul IT pentru resetarea parolei.",
                  )
                }
              >
                Ai uitat parola?
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Se verifică..." : "Autentificare →"}
            </button>
          </form>

          <div className="switch-auth">
            Nu ai cont?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={onSwitchToRegister}
            >
              Creează unul
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

export default LoginPage;
