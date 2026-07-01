"use client";

import { Table, Skeleton, Pagination } from "@heroui/react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
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
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <Table.ScrollContainer className="overflow-x-auto">
          <Table.Content>
            <Table.Header>
              {columns.map((col, idx) => (
                <Table.Column key={col.key} isRowHeader={idx === 0}>{col.label}</Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Row key={i}>
                    {columns.map((col) => (
                      <Table.Cell key={col.key}>
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : data.length === 0 ? (
                <Table.Row>
                  {columns.map((col, idx) => (
                    <Table.Cell key={col.key}>
                      {idx === 0 ? (
                        <span className="text-gray-400 text-sm">موردی یافت نشد</span>
                      ) : null}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ) : (
                data.map((row, i) => (
                  <Table.Row key={i}>
                    {columns.map((col) => (
                      <Table.Cell key={col.key}>
                        {col.render
                          ? col.render(row)
                          : String((row as Record<string, unknown>)[col.key] ?? "-")}
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
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>صفحه {page} از {totalPages}</span>
          <Pagination>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  onClick={() => onPageChange(page - 1)}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
                >
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Pagination.Item key={i}>
                  <Pagination.Link
                    isActive={page === i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  onClick={() => onPageChange(page + 1)}
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
                >
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}
