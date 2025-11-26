import { getServerSession, type Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as Session | null;

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-12 mt-6">
      <h1 className="text-3xl font-bold">Welcome {session.user.name}</h1>
      <p>Your role is: {session.user.role}</p>
    </div>
  );
}
