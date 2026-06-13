import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard({ user }) {
  const [wedding, setWedding] = useState(null);
  const [budgetItems, setBudgetItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/wedding", {
      credentials: "include",
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : {};

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not load wedding details.");
        });
      })
      .then((weddingData) => setWedding(weddingData))
      .catch((error) => setError(error.message));

    fetch("/api/budget-items", {
      credentials: "include",
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : [];

          if (res.ok) {
            return data;
          }

          throw new Error("Could not load budget items.");
        });
      })
      .then((budgetData) => setBudgetItems(budgetData))
      .catch((error) => setError(error.message));

    fetch("/api/vendors", {
      credentials: "include",
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : [];

          if (res.ok) {
            return data;
          }

          throw new Error("Could not load vendors.");
        });
      })
      .then((vendorData) => setVendors(vendorData))
      .catch((error) => setError(error.message));
  }, []);

  const totalEstimated = budgetItems.reduce(
    (sum, item) => sum + Number(item.estimated_cost || 0),
    0
  );

  const totalActual = budgetItems.reduce(
    (sum, item) => sum + Number(item.actual_cost || 0),
    0
  );

  const totalPaid = budgetItems
    .filter((item) => item.paid)
    .reduce((sum, item) => sum + Number(item.actual_cost || 0), 0);

  const bookedVendors = vendors.filter(
    (vendor) => vendor.status === "Booked"
  ).length;

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.username}.</p>

      {error ? <p>{error}</p> : null}

      {wedding ? (
        <section>
          <h2>
            {wedding.partner_one_name} & {wedding.partner_two_name}
          </h2>
          <p>Date: {wedding.wedding_date || "Not set yet"}</p>
          <p>Venue: {wedding.venue || "Not set yet"}</p>
          <p>Guest Count: {wedding.estimated_guest_count || 0}</p>
          <p>Total Budget: ${Number(wedding.total_budget || 0).toLocaleString()}</p>
        </section>
      ) : (
        <section>
          <h2>No wedding profile found</h2>
          <Link to="/wedding">Create Wedding Profile</Link>
        </section>
      )}

      <section>
        <h2>Budget Summary</h2>
        <p>Estimated Total: ${totalEstimated.toLocaleString()}</p>
        <p>Actual Total: ${totalActual.toLocaleString()}</p>
        <p>Paid So Far: ${totalPaid.toLocaleString()}</p>
        <Link to="/budget">View Budget</Link>
      </section>

      <section>
        <h2>Vendor Summary</h2>
        <p>Total Vendors: {vendors.length}</p>
        <p>Booked Vendors: {bookedVendors}</p>
        <Link to="/vendors">View Vendors</Link>
      </section>
    </main>
  );
}

export default Dashboard;