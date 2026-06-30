import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import {
  api,
  clearPendingRecommendation,
  getPendingRecommendation,
  saveLocalRecommendation,
  saveSession,
} from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setError("");
    setStatus("");
  };

  const getFriendlyError = (err) => {
    const message = err.message || "";

    if (message.includes("Failed to fetch")) {
      return "Backend is not running. Start Spring Boot on localhost:8080.";
    }

    if (
      (tab === "register" && message.includes("/api/auth/register")) ||
      (tab === "register" && message.toLowerCase().includes("internal server error")) ||
      message.includes("409") ||
      message.toLowerCase().includes("email already registered") ||
      message.toLowerCase().includes("already exist") ||
      message.toLowerCase().includes("already registered")
    ) {
      return "username or email already exist";
    }

    if (
      message.toLowerCase().includes("bad credentials") ||
      message.includes("401") ||
      message.includes("403")
    ) {
      return "The email or password is incorrect. Please check and try again.";
    }

    if (message.toLowerCase().includes("password must be at least")) {
      return "Password must be at least 8 characters.";
    }

    return message || "Unable to authenticate. Please check your details and try again.";
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setStatus("");

    try {
      const payload = tab === "login"
        ? { email, password }
        : {
            firstName: name.trim().split(" ")[0] || name.trim(),
            lastName: name.trim().split(" ").slice(1).join(" "),
            email,
            password,
          };

      const authResponse = tab === "login"
        ? await api.login(payload)
        : await api.register(payload);

      saveSession(authResponse);
      const pendingRecommendation = getPendingRecommendation();
      if (pendingRecommendation?.recommendation) {
        saveLocalRecommendation(pendingRecommendation.recommendation, pendingRecommendation.context || {});
        try {
          await api.generateRecommendation({
            occasion: pendingRecommendation.context?.occasion || "Everyday",
            weather: pendingRecommendation.context?.weather || "Mild",
            budgetRange: pendingRecommendation.context?.budgetRange || "$50 - $100",
          });
        } catch {
          // Keep the local saved look even if the backend is temporarily unavailable.
        }
        clearPendingRecommendation();
      }
      setStatus(`Welcome ${authResponse.firstName || "back"}! Redirecting...`);
      setTimeout(() => navigate(pendingRecommendation ? "/recommendations" : "/shop"), 600);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
 
      <div className="login-root">
        
        <div className="login-right">
          <div className="form-card">
            <div className="tab-row">
              <button className={`tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => switchTab("login")}>
                Sign In
              </button>
              <button className={`tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => switchTab("register")}>
                Create Account
              </button>
            </div>

            {tab === "login" ? (
              <>
                <h1 className="form-heading">Welcome back</h1>
                <p className="form-sub">{location.state?.message || "Sign in to your StyleSense account"}</p>

                <div className="field-group">
                  <div className="field-wrap">
                    <label className="field-label">Email</label>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label">Password</label>
                    <input
                      className="field-input"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="forgot-link">
                    <a href="#">Forgot password?</a>
                  </div>
                </div>

                {error && <p className="auth-message error">{error}</p>}
                {status && <p className="auth-message success">{status}</p>}
                <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign In"}
                </button>
              </>
            ) : (
              <>
                <h1 className="form-heading">Join StyleSense</h1>
                <p className="form-sub">Create your account and discover your style</p>

                <div className="field-group">
                  <div className="field-wrap">
                    <label className="field-label">Full Name</label>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label">Email</label>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label">Password</label>
                    <input
                      className="field-input"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="auth-message error">{error}</p>}
                {status && <p className="auth-message success">{status}</p>}
                <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Creating account..." : "Create Account"}
                </button>
              </>
            )}

            <div className="divider">or continue with</div>

            <div className="social-row">
              <button className="social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p className="toggle-text">
              {tab === "login" ? (
                <>Don't have an account? <button onClick={() => switchTab("register")}>Sign up free</button></>
              ) : (
                <>Already have an account? <button onClick={() => switchTab("login")}>Sign in</button></>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
