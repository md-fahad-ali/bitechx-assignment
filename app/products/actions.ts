"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";


export async function updateProductAction(formData: FormData) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    return { ok: false, error: "Unauthorized" } as const;
  }

  try {
    const id = String(formData.get("id") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const price = Number(formData.get("price"));
    const categoryId = String(formData.get("categoryId") || "").trim();

    if (!id) return { ok: false, error: "Product ID is required" } as const;

    const images = image ? [image] : [];
    const body = { name, description, images, price, categoryId };

    const base = process.env.NEXT_API_BASE;
    
    if (!base) {
      console.error("NEXT_API_BASE environment variable is not set");
      return { ok: false, error: "NEXT_API_BASE environment variable is not configured" } as const;
    }

    console.log("Updating product:", { id, base, body });

    const res = await fetch(`${base}/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("Update failed:", res.status, t);
      return { ok: false, error: t || "Failed to update" } as const;
    }

    revalidatePath("/products");
    const data = await res.json();
    return { ok: true, data } as const;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    console.error("Update error:", e);
    return { ok: false, error: msg } as const;
  }
}

export async function createProductAction(formData: FormData) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    return { ok: false, error: "Unauthorized" } as const;
  }

  try {
    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const price = Number(formData.get("price"));
    const categoryId = String(formData.get("categoryId") || "").trim();

    const images = image ? [image] : [];

    const body = { name, description, images, price, categoryId };

    const base = process.env.NEXT_API_BASE;
    if (!base) {
      return { ok: false, error: "NEXT_API_BASE environment variable is not configured" } as const;
    }
    
    const res = await fetch(`${base}/products`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const t = await res.text();
      return { ok: false, error: t || "Failed to create" } as const;
    }

    revalidatePath("/products");
    const data = await res.json();
    return { ok: true, data } as const;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return { ok: false, error: msg } as const;
  }
}

export async function deleteProductAction(formData: FormData) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    return { ok: false, error: "Unauthorized" } as const;
  }

  try {
    const productId = String(formData.get("productId") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    
    if (!productId) {
      return { ok: false, error: "Product ID is required" } as const;
    }

    const base = process.env.NEXT_API_BASE;
    
    if (!base) {
      return { ok: false, error: "NEXT_API_BASE environment variable is not configured" } as const;
    }
    
    console.log('Attempting to delete product:', name);

    // According to API docs, DELETE requires a JSON body with product data
    const body = JSON.stringify({ name, description });

    // Construct the curl command for logging (including body)
    const curlCommand = `curl -X DELETE "${base}/products/${productId}" -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '${body}'`;
    console.log('Delete API Request as curl:', curlCommand);
    
    const res = await fetch(`${base}/products/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body,
    });

    const rawText = await res.text();
    let parsed: unknown = null;
    try { parsed = rawText ? JSON.parse(rawText) : null; } catch {}

    if (!res.ok) {
      console.error('Delete failed:', res.status, rawText);
      return { ok: false, error: rawText || "Failed to delete" } as const;
    }

    console.log('Delete success:', res.status, parsed ?? rawText);
    revalidatePath("/products");
    return { ok: true } as const;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    console.error('Delete error:', e);
    return { ok: false, error: msg } as const;
  }
}
