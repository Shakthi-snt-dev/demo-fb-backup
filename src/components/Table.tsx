import React from 'react';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  stickyHeader?: boolean;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  onEdit,
  onDelete,
  emptyMessage = 'No data available',
  className,
  stickyHeader = true,
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={twMerge('bg-white rounded-2xl shadow-sm border border-[#E0E7F1] p-12', className)}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F8FF] flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-[#4A5568]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-[#4A5568] font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={twMerge('bg-white rounded-2xl shadow-sm border border-[#E0E7F1] overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F8FF] border-b border-[#E0E7F1]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={twMerge(
                    'px-6 py-4 text-left text-xs font-semibold text-[#1A1F36] uppercase tracking-wider',
                    stickyHeader && 'sticky top-0 bg-[#F5F8FF] z-10',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th
                  className={twMerge(
                    'px-6 py-4 text-left text-xs font-semibold text-[#1A1F36] uppercase tracking-wider',
                    stickyHeader && 'sticky top-0 bg-[#F5F8FF] z-10'
                  )}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E7F1]">
            {data.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={twMerge(
                  'transition-colors duration-150',
                  onRowClick && 'cursor-pointer hover:bg-[#F5F8FF]/50 active:bg-[#F5F8FF]'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={twMerge(
                      'px-6 py-4 text-sm text-[#4A5568] whitespace-nowrap',
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item, index)
                      : (item[column.key] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          className="p-2 text-[#007BFF] hover:bg-[#007BFF]/10 rounded-lg transition-colors"
                          aria-label="Edit"
                        >
                          <HiPencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Delete"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

