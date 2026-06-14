import type { Paginated, CourseListItem } from "@roohbakhsh/shared";

// آدرس بک‌اند. لوکال از .env.local خوانده می‌شود، روی سرور آلمان مقدار واقعی.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";

// نمونه‌ی فراخوانی API با تایپ مشترک.
// خروجی Paginated<CourseListItem> دقیقاً همان است که بک‌اند تعهد داده.
export async function getCourses(): Promise<Paginated<CourseListItem>> {
  const res = await fetch(`${API_BASE}/courses`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("failed to load courses");
  return res.json();
}
