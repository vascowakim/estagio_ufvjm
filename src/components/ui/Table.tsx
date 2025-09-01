import React from 'react'
import { clsx } from 'clsx'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

interface Column<T> {
  key: keyof T | string
  title: string
  sortable?: boolean
  width?: string
  render?: (value: any, record: T, index: number) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  emptyMessage?: string
  className?: string
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onSort,
  sortKey,
  sortDirection,
  emptyMessage = 'Nenhum dado encontrado',
  className
}: TableProps<T>) {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return
    
    const key = column.key as string
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    onSort(key, newDirection)
  }
  
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null
    
    const key = column.key as string
    const isActive = sortKey === key
    
    if (!isActive) {
      return <div className="w-4 h-4" />
    }
    
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4" />
      : <ChevronDownIcon className="w-4 h-4" />
  }
  
  return (
    <div className={clsx('overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg', className)}>
      <table className="min-w-full divide-y divide-secondary-300">
        <thead className="bg-secondary-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={clsx(
                  'px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider',
                  column.sortable && 'cursor-pointer hover:bg-secondary-100',
                  column.width && `w-${column.width}`
                )}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-secondary-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
                <p className="mt-2 text-sm text-secondary-500">Carregando...</p>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <p className="text-sm text-secondary-500">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((record, recordIndex) => (
              <tr key={recordIndex} className="hover:bg-secondary-50">
                {columns.map((column, columnIndex) => {
                  const value = record[column.key as keyof T]
                  const content = column.render 
                    ? column.render(value, record, recordIndex)
                    : value
                  
                  return (
                    <td
                      key={columnIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900"
                    >
                      {content}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
