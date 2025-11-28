import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Helper for server code / route handlers to get the current session
export async function auth(): Promise<Session | null> {
	try {
		return (await getServerSession(authOptions as any)) as Session | null;
	} catch (err) {
		console.error("auth helper error:", err);
		return null;
	}
}

// Note: client-side helpers like `signIn` / `signOut` come from `next-auth/react`.

