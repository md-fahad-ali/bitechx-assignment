import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const store = await cookies();
  const token = store.get("auth_token")?.value;
  if (!token) {
    redirect("/auth/login");
  }
  redirect("/products");
}
