"use client";

import { useState } from 'react';

interface TableData {
  headers: string[];
  rows: (string | number)[][];
  title?: string;
}

interface DataTableProps {
  tableData: TableData;
  className?: string;
  sortable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
}

export default function DataTable({ 
  tableData, 
  className = "", 
  sortable = false, 
  searchable = false, 
  pagination = false, 
  itemsPerPage = 10 
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredRows = searchable && searchTerm
    ? tableData.rows.filter(row =>
        row.some(cell => 
          cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : tableData.rows;

  // Sort data
  const sortedRows = sortable && sortColumn !== null
    ? [...filteredRows].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = aVal.toString();
        const bStr = bVal.toString();
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr, 'fa');
        } else {
          return bStr.localeCompare(aStr, 'fa');
        }
      })
    : filteredRows;

  // Paginate data
  const totalPages = Math.ceil(sortedRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = pagination 
    ? sortedRows.slice(startIndex, endIndex)
    : sortedRows;

  const handleSort = (columnIndex: number) => {
    if (!sortable) return;
    
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`my-8 ${className}`}>
      {tableData.title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{tableData.title}</h3>
      )}
      
      {/* Search */}
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="جستجو در جدول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              {tableData.headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${
                    sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(index)}
                >
                  <div className="flex items-center justify-between">
                    <span>{header}</span>
                    {sortable && sortColumn === index && (
                      <span className="ml-2">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            قبلی
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            بعدی
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-2 text-sm text-gray-500 text-center">
        نمایش {startIndex + 1} تا {Math.min(endIndex, sortedRows.length)} از {sortedRows.length} رکورد
      </div>
    </div>
  );
} 