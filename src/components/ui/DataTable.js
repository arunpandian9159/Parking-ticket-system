'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Settings2,
  Check,
  X,
  FileText,
  Filter,
  MoreHorizontal,
  Trash2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Checkbox component
const Checkbox = ({ checked, indeterminate, onChange, className, ...props }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 focus:ring-2 cursor-pointer transition-all",
        className
      )}
      {...props}
    />
  );
};

// Dropdown Menu Component
const DropdownMenu = ({ trigger, children, align = 'end' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[180px] rounded-xl bg-white/95 backdrop-blur-xl shadow-xl border border-gray-100 py-2 animate-in fade-in-0 zoom-in-95",
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
  >
    {children}
  </button>
);

// Select Component
const Select = ({ value, onChange, options, placeholder, className }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "h-9 rounded-lg border-2 border-indigo-100 bg-white px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 cursor-pointer transition-all shadow-sm hover:border-indigo-200",
      className
    )}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Button Component
const Button = ({ children, variant = 'default', size = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-gradient-to-r from-violet-500 to-violet-600 text-white hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/25 border-0',
    outline: 'border-2 border-indigo-100 bg-white hover:bg-indigo-50 text-indigo-600 hover:border-indigo-200 shadow-sm',
    ghost: 'hover:bg-gray-100 text-gray-700',
    destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700',
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-11 px-6',
    icon: 'h-9 w-9',
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Badge Component
const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200',
    error: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200',
    info: 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

// Export helpers
const exportToCSV = (data, columns, filename) => {
  const headers = columns.filter(col => col.id !== 'select' && col.id !== 'actions').map(col => col.header || col.id);
  const rows = data.map(row =>
    columns.filter(col => col.id !== 'select' && col.id !== 'actions').map(col => {
      const value = row[col.accessorKey || col.id];
      return typeof value === 'object' ? JSON.stringify(value) : value;
    })
  );

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};

// Main DataTable Component
const DataTable = ({
  data = [],
  columns = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  filterable = true,
  filters = [],
  paginated = true,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  selectable = false,
  onSelectionChange,
  bulkActions = [],
  exportable = true,
  exportFilename = 'export',
  columnToggle = true,
  loading = false,
  emptyMessage = 'No data found',
  emptyDescription = 'Try adjusting your search or filter criteria.',
  emptyIcon: EmptyIcon = FileText,
  onRefresh,
  title,
  description,
  className,
  headerActions,
  getRowId = (row) => row.id,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: defaultPageSize });

  // Add selection column if selectable
  const tableColumns = useMemo(() => {
    if (!selectable) return columns;

    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      ...columns,
    ];
  }, [columns, selectable]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection: selectable,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: paginated ? getPaginationRowModel() : undefined,
    getRowId,
  });

  // Notify parent of selection changes
  React.useEffect(() => {
    if (onSelectionChange && selectable) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, selectable, table]);

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Section */}
      {(title || description || headerActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}

      {/* Glass morphism card wrapper */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Gradient top border */}
        <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-gray-100/50">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Left side - Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-10 w-full sm:w-72 rounded-xl border-2 border-indigo-100 bg-white pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all shadow-sm hover:border-indigo-200"
                  />
                  {globalFilter && (
                    <button
                      onClick={() => setGlobalFilter('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {filterable && filters.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <Filter className="h-4 w-4 text-gray-400" />
                  {filters.map((filter) => (
                    <Select
                      key={filter.id}
                      value={columnFilters.find(f => f.id === filter.id)?.value ?? ''}
                      onChange={(value) => {
                        setColumnFilters(prev => {
                          const existing = prev.filter(f => f.id !== filter.id);
                          if (value) {
                            return [...existing, { id: filter.id, value }];
                          }
                          return existing;
                        });
                      }}
                      options={filter.options}
                      placeholder={filter.placeholder}
                      className="min-w-[140px]"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Actions */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Bulk Actions */}
              {selectable && selectedCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg border border-violet-200">
                  <span className="text-sm font-medium text-violet-700">
                    {selectedCount} selected
                  </span>
                  {bulkActions.map((action) => (
                    <Button
                      key={action.label}
                      variant={action.variant || 'ghost'}
                      size="sm"
                      onClick={() => action.onClick(table.getFilteredSelectedRowModel().rows.map(r => r.original))}
                      className="h-7"
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                  <button
                    onClick={() => table.resetRowSelection()}
                    className="text-violet-600 hover:text-violet-800 ml-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Refresh Button */}
              {onRefresh && (
                <Button variant="outline" size="icon" onClick={onRefresh} disabled={loading}>
                  <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                </Button>
              )}

              {/* Export Button */}
              {exportable && data.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(data, columns, exportFilename)}
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              )}

              {/* Column Visibility Toggle */}
              {columnToggle && (
                <DropdownMenu
                  trigger={
                    <Button variant="outline" size="sm">
                      <Settings2 className="h-4 w-4" />
                      Columns
                    </Button>
                  }
                >
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Toggle Columns
                  </div>
                  {table.getAllColumns().filter(col => col.getCanHide()).map((column) => (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() => column.toggleVisibility(!column.getIsVisible())}
                    >
                      <div className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                        column.getIsVisible() ? "bg-violet-500 border-violet-500" : "border-gray-300"
                      )}>
                        {column.getIsVisible() && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="capitalize">{column.id}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 text-violet-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading data...</p>
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <EmptyIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
              <p className="text-gray-500 text-center max-w-sm">{emptyDescription}</p>
            </div>
          ) : (
            <table className="table w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        className={cn(
                          "px-4 py-3 text-left text-xs font-bold uppercase tracking-wider",
                          header.column.getCanSort() && "cursor-pointer select-none transition-colors"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="text-gray-400">
                              {{
                                asc: <ChevronUp className="h-4 w-4" />,
                                desc: <ChevronDown className="h-4 w-4" />,
                              }[header.column.getIsSorted()] ?? <ChevronsUpDown className="h-4 w-4 opacity-50 text-white/50" />}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-all duration-200 hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-transparent",
                      row.getIsSelected() && "bg-violet-50/70 hover:bg-violet-100/70",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 text-sm text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {paginated && table.getRowModel().rows.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Show:</span>
                <Select
                  value={table.getState().pagination.pageSize.toString()}
                  onChange={(value) => table.setPageSize(Number(value))}
                  options={pageSizeOptions.map(size => ({ value: size.toString(), label: `${size}` }))}
                  className="w-16"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                  const pageIndex = table.getState().pagination.pageIndex;
                  const pageCount = table.getPageCount();
                  let pageNum;
                  if (pageCount <= 5) {
                    pageNum = i;
                  } else if (pageIndex < 3) {
                    pageNum = i;
                  } else if (pageIndex > pageCount - 4) {
                    pageNum = pageCount - 5 + i;
                  } else {
                    pageNum = pageIndex - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => table.setPageIndex(pageNum)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-sm font-medium transition-all",
                        pageNum === pageIndex
                          ? "bg-violet-500 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { DataTable, Button, Badge, Checkbox, Select, DropdownMenu, DropdownMenuItem };

