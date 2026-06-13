import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

function handleSubmit(event) {
  event.preventDefault();
  setError("");

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  })
    .then((res) => {
      return res.text().then((text) => {
        const data = text ? JSON.parse(text) : {};

        if (res.ok) {
          return data;
        }

        throw new Error(data.error || "Login failed.");
      });
    })
    .then((userData) => {
      setUser(userData);
      navigate("/dashboard");
    })
    .catch((error) => setError(error.message));
}

  return (
    <main>
      <h1>Login</h1>

      {error ? <p>{error}</p> : null}

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Log In</button>
      </form>

      <p>
        Need an account? <Link to="/signup">Sign up</Link>
      </p>
    </main>
  );
}

export default Login;