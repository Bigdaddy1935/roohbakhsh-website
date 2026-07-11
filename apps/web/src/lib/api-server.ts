const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";

/** فراخوانی GET سمت سرور برای مسیرهای عمومی — بدون احراز هویت، فقط برای generateMetadata و fetch اولیه. */
export async function serverGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
