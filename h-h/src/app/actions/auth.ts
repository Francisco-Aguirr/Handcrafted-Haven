// src/app/actions/auth.ts
"use server";

import postgres from "postgres";
import bcrypt from "bcryptjs";

type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  phone?: string;
  avatarUrl?: string | null;
};

export type RegisterResult = {
  success: boolean;
  errors: Record<string, string>;
  userId?: string;
};

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// ---------------------------
// Validation helpers
// ---------------------------
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterInput(input: RegisterInput) {
  const errors: Record<string, string> = {};

  if (!input.firstName || input.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }

  if (!input.lastName || input.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  }

  if (!input.email || !validateEmail(input.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!input.password || input.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (input.password !== input.confirm) {
    errors.confirm = "Passwords do not match.";
  }

  if (!input.phone || input.phone.trim().length < 6) {
    errors.phone = "Please enter a valid phone number.";
  }

  return errors;
}

// ---------------------------
// Main server logic
// ---------------------------
export async function registerUserServer(
  input: RegisterInput
): Promise<RegisterResult> {
  const errors = validateRegisterInput(input);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const email = input.email.trim().toLowerCase();

  try {
    return await sql.begin(async (sqlTx) => {
      const existing = await sqlTx`
        SELECT id FROM users WHERE email = ${email} LIMIT 1
      `;
      if (existing.length > 0) {
        return { success: false, errors: { email: "Email is already registered." } };
      }

      const passwordHash = await bcrypt.hash(input.password, 10);

      const inserted = await sqlTx`
        INSERT INTO users (first_name, last_name, email, password_hash, phone, role, avatar_url)
        VALUES (
          ${input.firstName.trim()},
          ${input.lastName.trim()},
          ${email},
          ${passwordHash},
          ${input.phone ?? null},
          'user',
          ${input.avatarUrl ?? null}
        )
        RETURNING id
      `;

      if (!inserted || inserted.length === 0) {
        return { success: false, errors: { _general: "Failed to create user." } };
      }

      return {
        success: true,
        errors: {},
        userId: inserted[0].id as string,
      };
    });
  } catch (err: any) {
    console.error("registerUserServer error:", err);

    if (err?.code === "23505") {
      return { success: false, errors: { email: "Email already exists." } };
    }
    
    return { success: false, errors: { _general: "Internal server error." } };
  }
}

// ---------------------------
// Server Action (useActionState)
// ---------------------------
export async function registerUserAction(
  prevState: RegisterResult,
  formData: FormData
): Promise<RegisterResult> {
  const input: RegisterInput = {
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
    phone: String(formData.get("phone") ?? "").trim(),
    avatarUrl: null, // future expansion
  };

  return await registerUserServer(input);
}

