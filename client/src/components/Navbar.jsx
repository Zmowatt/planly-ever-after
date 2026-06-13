import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("/api/logout", {
      method: "DELETE",
    }).then(() => {
      setUser(null);
      navigate("/");
    });
  }

  return (
    <nav>
      <Link to="/">Planly Ever After</Link>

      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/wedding">Wedding</Link>
          <Link to="/budget">Budget</Link>
          <Link to="/vendors">Vendors</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;