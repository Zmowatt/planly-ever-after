import { useEffect, useState } from "react";

function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    contact_name: "",
    contact_email: "",
    phone: "",
    quoted_price: "",
    status: "Researching",
    rating: "",
    notes: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  function fetchVendors() {
    fetch("/api/vendors", {
      credentials: "include",
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : [];

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not load vendors.");
        });
      })
      .then((data) => setVendors(data))
      .catch((error) => setError(error.message));
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    fetch("/api/vendors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...formData,
        quoted_price: Number(formData.quoted_price),
        rating: formData.rating ? Number(formData.rating) : null,
      }),
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : {};

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not create vendor.");
        });
      })
      .then((newVendor) => {
        setVendors([...vendors, newVendor]);

        setFormData({
          name: "",
          category: "",
          contact_name: "",
          contact_email: "",
          phone: "",
          quoted_price: "",
          status: "Researching",
          rating: "",
          notes: "",
        });
      })
      .catch((error) => setError(error.message));
  }

  function handleStatusChange(vendor, newStatus) {
    fetch(`/api/vendors/${vendor.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : {};

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not update vendor.");
        });
      })
      .then((updatedVendor) => {
        const updatedVendors = vendors.map((vendor) => {
          if (vendor.id === updatedVendor.id) {
            return updatedVendor;
          }

          return vendor;
        });

        setVendors(updatedVendors);
      })
      .catch((error) => setError(error.message));
  }

  function handleDelete(id) {
    fetch(`/api/vendors/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          const remainingVendors = vendors.filter((vendor) => vendor.id !== id);
          setVendors(remainingVendors);
          return;
        }

        throw new Error("Could not delete vendor.");
      })
      .catch((error) => setError(error.message));
  }

  const bookedCount = vendors.filter((vendor) => vendor.status === "Booked").length;

  const totalQuoted = vendors.reduce(
    (sum, vendor) => sum + Number(vendor.quoted_price || 0),
    0
  );

  return (
    <main>
      <h1>Vendor Tracker</h1>

      {error ? <p>{error}</p> : null}

      <section>
        <h2>Vendor Summary</h2>
        <p>Total Vendors: {vendors.length}</p>
        <p>Booked Vendors: {bookedCount}</p>
        <p>Total Quoted: ${totalQuoted.toLocaleString()}</p>
      </section>

      <section>
        <h2>Add Vendor</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Vendor Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </label>

          <label>
            Contact Name
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleChange}
            />
          </label>

          <label>
            Contact Email
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Quoted Price
            <input
              type="number"
              name="quoted_price"
              value={formData.quoted_price}
              onChange={handleChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Researching">Researching</option>
              <option value="Contacted">Contacted</option>
              <option value="Quoted">Quoted</option>
              <option value="Booked">Booked</option>
              <option value="Passed">Passed</option>
            </select>
          </label>

          <label>
            Rating
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
            />
          </label>

          <label>
            Notes
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Add Vendor</button>
        </form>
      </section>

      <section>
        <h2>Vendors</h2>

        {vendors.map((vendor) => (
          <article key={vendor.id}>
            <h3>{vendor.name}</h3>
            <p>Category: {vendor.category}</p>
            <p>Contact: {vendor.contact_name || "N/A"}</p>
            <p>Email: {vendor.contact_email || "N/A"}</p>
            <p>Phone: {vendor.phone || "N/A"}</p>
            <p>Quoted Price: ${Number(vendor.quoted_price || 0).toLocaleString()}</p>
            <p>Status: {vendor.status}</p>
            <p>Rating: {vendor.rating || "N/A"}</p>
            <p>Notes: {vendor.notes || "None"}</p>

            <label>
              Update Status
              <select
                value={vendor.status}
                onChange={(event) =>
                  handleStatusChange(vendor, event.target.value)
                }
              >
                <option value="Researching">Researching</option>
                <option value="Contacted">Contacted</option>
                <option value="Quoted">Quoted</option>
                <option value="Booked">Booked</option>
                <option value="Passed">Passed</option>
              </select>
            </label>

            <button onClick={() => handleDelete(vendor.id)}>Delete</button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default VendorsPage;
