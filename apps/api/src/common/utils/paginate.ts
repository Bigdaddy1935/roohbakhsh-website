import type { Paginated } from "@roohbakhsh/shared";

export function toPaginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): Paginated<T> {
  return {
    items,
    page,
    pageSize: limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
