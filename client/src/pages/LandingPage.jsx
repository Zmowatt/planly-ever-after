import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <main>
      <h1>Planly Ever After</h1>
      <h2>Plan your forever without losing your mind.</h2>
      <p>
        Track your wedding budget, vendors, and planning details in one private
        dashboard.
      </p>
      <Link to="/signup">Get Started</Link>
    </main>
  );
}

export default LandingPage;