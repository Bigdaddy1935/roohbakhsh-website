"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import {
  RiHeartLine, RiHeartFill,
  RiBookReadLine, RiArticleLine, RiPlayCircleLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { FavoritesPageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useFavorites, useToggleFavorite } from "@/hooks/queries/use-favorites";
import type { FavoriteItem } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "المفضلة",
    subtitle: "جميع العناصر التي أضفتها إلى المفضلة",
    empty: "لا توجد عناصر في المفضلة",
    emptyHint: "اضغط على أيقونة القلب في أي دورة أو مقالة لإضافتها",
    removed: "تمت الإزالة من المفضلة",
    types: { course: "دورة", article: "مقالة", lesson: "درس" } as Record<FavoriteItem["type"], string>,
  },
  ur: {
    title: "پسندیدہ",
    subtitle: "آپ کے تمام پسندیدہ آئٹمز",
    empty: "پسندیدہ میں کچھ نہیں",
    emptyHint: "کسی بھی کورس یا مقالے پر دل کا آئیکن دبا کر یہاں شامل کریں",
    removed: "پسندیدہ سے ہٹا دیا",
    types: { course: "کورس", article: "مقالہ", lesson: "سبق" } as Record<FavoriteItem["type"], string>,
  },
};

const TYPE_CONFIG: Record<FavoriteItem["type"], { Icon: React.ElementType; bg: string; color: string }> = {
  course:  { Icon: RiPlayCircleLine, bg: "bg-blue-50",   color: "text-blue-500"   },
  article: { Icon: RiArticleLine,    bg: "bg-amber-50",  color: "text-amber-500"  },
  lesson:  { Icon: RiBookReadLine,   bg: "bg-purple-50", color: "text-purple-500" },
};

function hrefFor(item: FavoriteItem): string {
  if (item.type === "course") return `/courses/${item.slug}`;
  if (item.type === "article") return `/articles/${item.slug}`;
  return `/courses/${item.courseSlug}/lessons/${item.id}`;
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
    <div className="bg-white p-4 sm:p-5 lg:rounded-2xl lg:p-7 min-h-full">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--ink)]">{ui.title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{ui.subtitle}</p>
      </div>

      {isLoading ? (
        <FavoritesPageSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-y-4">
          <div className="size-20 rounded-2xl bg-rose-50 flex items-center justify-center">
            <RiHeartLine size={36} className="text-rose-400" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[var(--ink)]">{ui.empty}</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">{ui.emptyHint}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-1.5">
          {items.map((item) => {
            const cfg = TYPE_CONFIG[item.type];
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center gap-x-3 sm:gap-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className={`size-11 sm:size-12 shrink-0 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                  <cfg.Icon size={22} className={cfg.color} />
                </div>
                <Link href={hrefFor(item)} className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--ink)] line-clamp-1 group-hover:text-[var(--brand)] transition-colors">
                    {item.title[locale]}
                  </p>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color} mt-1 inline-block`}>
                    {ui.types[item.type]}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  disabled={toggleFavorite.isPending}
                  className="shrink-0 size-9 rounded-lg flex items-center justify-center text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RiDeleteBin6Line size={17} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
