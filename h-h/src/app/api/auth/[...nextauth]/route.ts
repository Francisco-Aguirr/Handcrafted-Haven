import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import postgres from "postgres";
import bcrypt from "bcryptjs";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
  console.log("🟦 authorize() called with:", credentials);

  if (!credentials?.email || !credentials?.password) {
    console.log("❌ Missing credentials");
    return null;
  }

  const rows = await sql`
    SELECT id, email, password_hash, first_name, last_name, role
    FROM users
    WHERE email = ${credentials.email.toLowerCase()}
    LIMIT 1
  `;

  console.log("🟦 Query result:", rows);

  if (rows.length === 0) {
    console.log("❌ User not found");
    return null;
  }

  const user = rows[0];

  const isValidPassword = await bcrypt.compare(
    credentials.password,
    user.password_hash
  );

  console.log("🟦 Password match:", isValidPassword);

  if (!isValidPassword) {
    console.log("❌ Invalid password");
    return null;
  }

  console.log("✅ Login successful:", {
    id: user.id,
    role: user.role,
  });

  return {
    id: user.id,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    role: user.role,
  };
}

    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
