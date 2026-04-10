import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AuthPage from "./pages/AuthPage";
import BMICalculatorPage from "./pages/BMICalculatorPage";
import HomePage from "./pages/HomePage";
import MemberDashboard from "./pages/MemberDashboard";
import PackagesPage from "./pages/PackagesPage";
import TrainersPage from "./pages/TrainersPage";
import { getTheme, THEME_UPDATED_EVENT } from "./utils/storage";

function App() {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    const syncTheme = () => setTheme(getTheme());
    syncTheme();
    document.body.dataset.theme = theme;
    window.addEventListener(THEME_UPDATED_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_UPDATED_EVENT, syncTheme);
  }, [theme]);

  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bmi" element={<BMICalculatorPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/trainers" element={<TrainersPage />} />
        <Route path="/admin/register" element={<AuthPage mode="adminRegister" />} />
        <Route path="/admin/login" element={<AuthPage mode="adminLogin" />} />
        <Route path="/member/register" element={<AuthPage mode="memberRegister" />} />
        <Route path="/member/login" element={<AuthPage mode="memberLogin" />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/dashboard"
          element={
            <ProtectedRoute role="MEMBER">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
