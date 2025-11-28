export default function AdminDashboard({ user }: { user: any }) {
  return (
    <div className="p-12">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome {user.name}</p>
    </div>
  );
}
