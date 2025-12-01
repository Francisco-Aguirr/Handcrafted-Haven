import { getServerSession, type Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import UserDashboard from "./UserDashboard";
import ArtisanDashboard from "./ArtisanDashboard";
import AdminDashboard from "./AdminDashboard";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as Session | null;

  if (!session) redirect("/login");

  const role = session.user.role;

  if (session.user.role === "admin") {
  return <AdminDashboard />;
}

  if (role === "artisan") return <ArtisanDashboard user={session.user} />;
  return <UserDashboard user={session.user} />;
}

