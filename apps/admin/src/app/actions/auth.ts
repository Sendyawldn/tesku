"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || "Invalid credentials" };
    }

    const data = await res.json();
    
    if (data.access_token) {
      // Set HTTP-only cookie with the JWT token
      const cookieStore = await cookies();
      cookieStore.set("tesku_admin_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
      
      // We don't redirect here, we return success so the client component can redirect
      // Doing redirect() in a try-catch server action sometimes throws an error NEXT_REDIRECT
      return { success: true };
    }
  } catch (error) {
    console.error("Login action error:", error);
    return { error: "An unexpected error occurred while connecting to the server" };
  }
  
  return { error: "Unknown error" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("tesku_admin_token");
  redirect("/login");
}
