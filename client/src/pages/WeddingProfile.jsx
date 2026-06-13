import { useEffect, useState } from "react";

function WeddingProfile() {
  const [weddingId, setWeddingId] = useState(null);

  const [formData, setFormData] = useState({
    partner_one_name: "",
    partner_two_name: "",
    wedding_date: "",
    venue: "",
    estimated_guest_count: "",
    total_budget: "",
    theme: "",
  });

  const [message, setMessage] = useState("");
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

          throw new Error(data.error || "Could not load wedding profile.");
        });
      })
      .then((weddingData) => {
        setWeddingId(weddingData.id);

        setFormData({
          partner_one_name: weddingData.partner_one_name || "",
          partner_two_name: weddingData.partner_two_name || "",
          wedding_date: weddingData.wedding_date || "",
          venue: weddingData.venue || "",
          estimated_guest_count: weddingData.estimated_guest_count || "",
          total_budget: weddingData.total_budget || "",
          theme: weddingData.theme || "",
        });
      })
      .catch((error) => setError(error.message));
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!weddingId) {
      setError("Wedding profile is still loading.");
      return;
    }

    fetch(`/api/wedding/${weddingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...formData,
        estimated_guest_count: Number(formData.estimated_guest_count),
        total_budget: Number(formData.total_budget),
      }),
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : {};

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not update wedding profile.");
        });
      })
      .then((updatedWedding) => {
        setWeddingId(updatedWedding.id);

        setFormData({
          partner_one_name: updatedWedding.partner_one_name || "",
          partner_two_name: updatedWedding.partner_two_name || "",
          wedding_date: updatedWedding.wedding_date || "",
          venue: updatedWedding.venue || "",
          estimated_guest_count: updatedWedding.estimated_guest_count || "",
          total_budget: updatedWedding.total_budget || "",
          theme: updatedWedding.theme || "",
        });

        setMessage("Wedding profile updated.");
      })
      .catch((error) => setError(error.message));
  }

  return (
    <main>
      <h1>Wedding Profile</h1>

      {message ? <p className="success">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <form onSubmit={handleSubmit}>
        <label>
          Partner One Name
          <input
            type="text"
            name="partner_one_name"
            value={formData.partner_one_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Partner Two Name
          <input
            type="text"
            name="partner_two_name"
            value={formData.partner_two_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Wedding Date
          <input
            type="date"
            name="wedding_date"
            value={formData.wedding_date}
            onChange={handleChange}
          />
        </label>

        <label>
          Venue
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
          />
        </label>

        <label>
          Estimated Guest Count
          <input
            type="number"
            name="estimated_guest_count"
            value={formData.estimated_guest_count}
            onChange={handleChange}
          />
        </label>

        <label>
          Total Budget
          <input
            type="number"
            name="total_budget"
            value={formData.total_budget}
            onChange={handleChange}
          />
        </label>

        <label>
          Theme
          <input
            type="text"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Update Wedding Profile</button>
      </form>
    </main>
  );
}

export default WeddingProfile;