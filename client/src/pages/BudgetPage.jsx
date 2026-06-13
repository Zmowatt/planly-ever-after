import { useEffect, useState } from "react";

function BudgetPage() {
  const [budgetItems, setBudgetItems] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    estimated_cost: "",
    actual_cost: "",
    paid: false,
    notes: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchBudgetItems();
  }, []);

  function fetchBudgetItems() {
    fetch("/api/budget-items", {
      credentials: "include",
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : [];

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not load budget items.");
        });
      })
      .then((data) => setBudgetItems(data))
      .catch((error) => setError(error.message));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    fetch("/api/budget-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...formData,
        estimated_cost: Number(formData.estimated_cost),
        actual_cost: Number(formData.actual_cost),
      }),
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : {};

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not create budget item.");
        });
      })
      .then((newItem) => {
        setBudgetItems([...budgetItems, newItem]);

        setFormData({
          category: "",
          description: "",
          estimated_cost: "",
          actual_cost: "",
          paid: false,
          notes: "",
        });
      })
      .catch((error) => setError(error.message));
  }

  function handleTogglePaid(item) {
    fetch(`/api/budget-items/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        paid: !item.paid,
      }),
    })
      .then((res) => {
        return res.text().then((text) => {
          const data = text ? JSON.parse(text) : {};

          if (res.ok) {
            return data;
          }

          throw new Error(data.error || "Could not update budget item.");
        });
      })
      .then((updatedItem) => {
        const updatedItems = budgetItems.map((item) => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          }

          return item;
        });

        setBudgetItems(updatedItems);
      })
      .catch((error) => setError(error.message));
  }

  function handleDelete(id) {
    fetch(`/api/budget-items/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          const remainingItems = budgetItems.filter((item) => item.id !== id);
          setBudgetItems(remainingItems);
          return;
        }

        throw new Error("Could not delete budget item.");
      })
      .catch((error) => setError(error.message));
  }

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

  return (
    <main>
      <h1>Budget Tracker</h1>

      {error ? <p>{error}</p> : null}

      <section>
        <h2>Budget Summary</h2>
        <p>Estimated Total: ${totalEstimated.toLocaleString()}</p>
        <p>Actual Total: ${totalActual.toLocaleString()}</p>
        <p>Paid So Far: ${totalPaid.toLocaleString()}</p>
      </section>

      <section>
        <h2>Add Budget Item</h2>

        <form onSubmit={handleSubmit}>
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
            Description
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Estimated Cost
            <input
              type="number"
              name="estimated_cost"
              value={formData.estimated_cost}
              onChange={handleChange}
            />
          </label>

          <label>
            Actual Cost
            <input
              type="number"
              name="actual_cost"
              value={formData.actual_cost}
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

          <label>
            Paid
            <input
              type="checkbox"
              name="paid"
              checked={formData.paid}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Add Budget Item</button>
        </form>
      </section>

      <section>
        <h2>Budget Items</h2>

        {budgetItems.map((item) => (
          <article key={item.id}>
            <h3>{item.category}</h3>
            <p>{item.description}</p>
            <p>Estimated: ${Number(item.estimated_cost || 0).toLocaleString()}</p>
            <p>Actual: ${Number(item.actual_cost || 0).toLocaleString()}</p>
            <p>Status: {item.paid ? "Paid" : "Not Paid"}</p>
            <p>Notes: {item.notes || "None"}</p>

            <button onClick={() => handleTogglePaid(item)}>
              Mark as {item.paid ? "Not Paid" : "Paid"}
            </button>

            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default BudgetPage;