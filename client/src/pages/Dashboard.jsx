function Dashboard({ user }) {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.username}.</p>
    </main>
  );
}

export default Dashboard;