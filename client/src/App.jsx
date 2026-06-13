import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WeddingProfile from "./pages/WeddingProfile";
import BudgetPage from "./pages/BudgetPage";
import VendorsPage from "./pages/VendorsPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/check_session")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Not logged in");
      })
      .then((userData) => setUser(userData))
      .catch(() => setUser(null));
  }, []);

  function requireAuth(component) {
    return user ? component : <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={requireAuth(<Dashboard user={user} />)}
        />
        <Route path="/wedding" element={requireAuth(<WeddingProfile />)} />
        <Route path="/budget" element={requireAuth(<BudgetPage />)} />
        <Route path="/vendors" element={requireAuth(<VendorsPage />)} />
      </Routes>
    </>
  );
}

export default App;