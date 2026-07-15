"use client";

import { Table, Skeleton, Pagination } from "@heroui/react";
import { RiInboxLine } from "react-icons/ri";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  minWidth?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  if (!isLoading && data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-4 py-20 bg-white rounded-[20px] border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
          <RiInboxLine size={32} className="text-gray-300" />
        </div>
        <p className="text-sm text-gray-400">موردی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <Table.ScrollContainer className="overflow-x-auto">
          <Table.Content className="min-w-[900px]">
            <Table.Header>
              {columns.map((col, idx) => (
                <Table.Column
                  key={col.key}
                  isRowHeader={idx === 0}
                  className={`text-sm font-bold text-[var(--ink)] py-4 ${col.key === "actions" ? "text-center" : "text-right"}`}
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                >
                  {col.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Row key={i}>
                    {columns.map((col) => (
                      <Table.Cell key={col.key} className={`whitespace-nowrap ${col.key === "actions" ? "text-center" : "text-right"}`}>
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                data.map((row, i) => (
                  <Table.Row key={i}>
                    {columns.map((col) => (
                      <Table.Cell key={col.key} className={`whitespace-nowrap ${col.key === "actions" ? "text-center" : "text-right"}`}>
                        {col.key === "actions" ? (
                          <div className="flex justify-center">
                            {col.render
                              ? col.render(row)
                              : String((row as Record<string, unknown>)[col.key] ?? "-")}
                          </div>
                        ) : col.render ? (
                          col.render(row)
                        ) : (
                          String((row as Record<string, unknown>)[col.key] ?? "-")
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>


      {totalPages > 1 && (
        <Pagination className="w-full">
          <Pagination.Summary>صفحه {page} از {totalPages}</Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous isDisabled={page <= 1} onPress={() => onPageChange(page - 1)}>
                <Pagination.NextIcon />
                <span>قبلی</span>
              </Pagination.Previous>
            </Pagination.Item>
            {(() => {
              const pages: (number | "ellipsis")[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 3) pages.push("ellipsis");
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (page < totalPages - 2) pages.push("ellipsis");
                pages.push(totalPages);
              }
              return pages.map((p, i) =>
                p === "ellipsis" ? (
                  <Pagination.Item key={`e-${i}`}><Pagination.Ellipsis /></Pagination.Item>
                ) : (
                  <Pagination.Item key={p}>
                    <Pagination.Link isActive={p === page} onPress={() => onPageChange(p as number)}>{p}</Pagination.Link>
                  </Pagination.Item>
                )
              );
            })()}
            <Pagination.Item>
              <Pagination.Next isDisabled={page >= totalPages} onPress={() => onPageChange(page + 1)}>
                <span>بعدی</span>
                <Pagination.PreviousIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      )}
    </div>
  );
}
