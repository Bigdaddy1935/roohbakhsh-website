"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { RiLoader4Line, RiHeartLine, RiHeartFill, RiBookOpenLine, RiArticleLine, RiPlayCircleLine } from "react-icons/ri";
import { useFavorites, useToggleFavorite } from "@/hooks/queries/use-favorites";
import type { FavoriteItem } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "المفضلة",
    empty: "لا توجد عناصر في المفضلة بعد",
    emptyHint: "اضغط على أيقونة القلب في أي دورة، مقالة أو درس لإضافته هنا",
    removed: "تمت الإزالة من المفضلة",
    course: "دورة",
    article: "مقالة",
    lesson: "درس",
  },
  ur: {
    title: "پسندیدہ",
    empty: "ابھی پسندیدہ میں کچھ نہیں",
    emptyHint: "کسی بھی کورس، مقالے یا سبق پر دل کا آئیکن دبا کر یہاں شامل کریں",
    removed: "پسندیدہ سے ہٹا دیا گیا",
    course: "کورس",
    article: "مقالہ",
    lesson: "سبق",
  },
};

function hrefFor(item: FavoriteItem): string {
  if (item.type === "course") return `/courses/${item.slug}`;
  if (item.type === "article") return `/articles/${item.slug}`;
  return `/courses/${item.courseSlug}/lessons/${item.id}`;
}

function IconFor({ type }: { type: FavoriteItem["type"] }) {
  if (type === "course") return <RiBookOpenLine size={22} />;
  if (type === "article") return <RiArticleLine size={22} />;
  return <RiPlayCircleLine size={22} />;
}

export default function Favorites() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useFavorites({ limit: 50 });
  const toggleFavorite = useToggleFavorite();

  const items = data?.items ?? [];

  function handleRemove(item: FavoriteItem) {
    toggleFavorite.mutate(
      { type: item.type, id: item.id },
      { onSuccess: () => toast.success(ui.removed) },
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
      <h1 className="text-base font-bold text-[var(--ink)] mb-5">{ui.title}</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-y-3 text-gray-400 text-center">
          <RiHeartLine size={48} className="opacity-30" />
          <p className="font-semibold">{ui.empty}</p>
          <p className="text-sm max-w-sm">{ui.emptyHint}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center gap-x-3 rounded-md border border-gray-100 hover:border-gray-300 transition-colors px-4 py-3.5"
            >
              <div className="size-11 shrink-0 rounded-md flex items-center justify-center bg-[var(--brand)]/10 text-[var(--brand)]">
                <IconFor type={item.type} />
              </div>
              <Link href={hrefFor(item)} className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--ink)] line-clamp-1 hover:text-[var(--brand)] transition-colors">
                  {item.title[locale]}
                </p>
                <span className="text-xs text-gray-400">{ui[item.type]}</span>
              </Link>
              <button
                type="button"
                onClick={() => handleRemove(item)}
                disabled={toggleFavorite.isPending}
                className="shrink-0 size-9 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <RiHeartFill size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
