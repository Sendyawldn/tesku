"use server";

import { cookies } from "next/headers";

export async function getMyTestHistory() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tesku_user_token")?.value;

  if (!token) return [];

  try {
    const res = await fetch("http://localhost:3001/sessions/my-history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    return [];
  }
}
