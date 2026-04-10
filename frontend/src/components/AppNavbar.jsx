import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AUTH_UPDATED_EVENT, clearAuth, getAuth, getTheme, saveTheme, THEME_UPDATED_EVENT } from "../utils/storage";

function AppNavbar() {
  const [auth, setAuth] = useState(getAuth());
  const [theme, setTheme] = useState(getTheme());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const syncAuth = () => setAuth(getAuth());
    syncAuth();
    window.addEventListener(AUTH_UPDATED_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener(AUTH_UPDATED_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [location.pathname]);

  useEffect(() => {
    const syncTheme = () => setTheme(getTheme());
    window.addEventListener(THEME_UPDATED_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_UPDATED_EVENT, syncTheme);
  }, []);

  const initials = auth?.name
    ? auth.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "G";

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const toggleTheme = () => {
    saveTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Navbar expand="lg" sticky="top" className="nav-shell py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-success">
          Fitness Space
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="align-items-lg-center gap-lg-3">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/packages">Packages</Nav.Link>
            <Nav.Link as={Link} to="/trainers">Trainers</Nav.Link>
            <Nav.Link as={Link} to="/bmi">BMI Calculator</Nav.Link>
            {!auth && <Nav.Link as={Link} to="/admin/login">Admin Login</Nav.Link>}
            {!auth && <Nav.Link as={Link} to="/member/login">Member Login</Nav.Link>}
            {!auth && <Nav.Link as={Link} to="/member/register">Member Register</Nav.Link>}
            {auth?.role === "ADMIN" && <Nav.Link as={Link} to="/admin/dashboard">Admin Dashboard</Nav.Link>}
            {auth?.role === "MEMBER" && <Nav.Link as={Link} to="/member/dashboard">Member Dashboard</Nav.Link>}
          </Nav>
          <div className="ms-lg-auto d-flex align-items-center gap-3 navbar-tools">
            <button
              type="button"
              className={`theme-toggle ${theme === "light" ? "is-light" : ""}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <span className="theme-toggle-track">
                <span className="theme-toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</span>
              </span>
            </button>
            {auth && (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  {auth.photoUrl ? (
                    <img src={auth.photoUrl} alt={auth.name} className="profile-avatar" />
                  ) : (
                    <div className="profile-avatar avatar-fallback">{initials}</div>
                  )}
                  <div className="text-end">
                    <div className="small fw-semibold">{auth.name}</div>
                    <div className="small text-muted">{auth.role}</div>
                  </div>
                </div>
                <button className="btn btn-warning rounded-pill px-4" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
