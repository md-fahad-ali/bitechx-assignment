"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function authenticate(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return;

  const base = process.env.NEXT_API_BASE as string;
  const res = await fetch(`${base}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    // In a full implementation, you might return errors via Server Actions
    // For now, go back to login
    redirect("/auth/login");
  }

  const data = (await res.json()) as { token?: string };
  const token = data?.token;
  if (token) {
    const jar = await cookies();
    jar.set("auth_token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  redirect("/products");
}
