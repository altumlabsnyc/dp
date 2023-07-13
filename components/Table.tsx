'use client'

import React, { useEffect, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// create a custom type for the table data
type RowData = Database['public']['Tables']['molecule']['Row']
// type ColumnData = ColumnDef<RowData, keyof RowData>

const Table: React.FC = () => {
  const supabase = createClientComponentClient<Database>();

  const fetchTableData = async () => {
    const { data, error } = await supabase.from('molecule').select('*');

    console.log(data, error)
    
    if (error) {
      console.error(error);
    } else {
      setTableData(data);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const [tableData, setTableData] = useState<RowData[]>([]);

  // const columnHelper = createColumnHelper<ColumnData>();

  let columns = [
    {
      id: 'external_id',
      accessorFn: (row: RowData) => `${row.external_id}`,
    },
    {
      id: 'id',
      accessorFn: (row: RowData) => `${row.id}`,
    },
    {
      id: 'name',
      accessorFn: (row: RowData) => `${row.name}`,
    },
    {
      id: 'smiles',
      accessorFn: (row: RowData) => `${row.smiles}`,
    },
    {
      id: 'spectrum',
      accessorFn: (row: RowData) => `${row.spectrum}`,
    }
  ]


  const table = useReactTable({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="border border-gray-300" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='border border-gray-300 p-3'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  </div>
  );
};

export default Table;
