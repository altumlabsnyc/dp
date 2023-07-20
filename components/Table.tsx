"use client";

import { Database } from "@/types/supabase";
import revalidate from "@/utils/revalidate";
import { TrashIcon } from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { mutate } from "swr";
import { v4 as uuidv4 } from "uuid";
import MoleculeStructure from "./MoleculeStructure";
import Spinner, { Size } from "./Spinner";
import AddMoleculeForm from "./Table/AddMoleculeForm";
import TextEditableCell from "./Table/TextEditableCell";
import FilterCell from "./Table/FilterCell";
import FilterColumn from "./Table/FilterColumn";

// create a custom type for the table data
export type RowData = Database["public"]["Tables"]["molecule"]["Row"];
// type ColumnData = ColumnDef<RowData, keyof RowData>

const fetcher = async (url: string) => {
  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase.from("molecule").select("*");

  if (error) throw error;

  return data;
};

const Table: React.FC = () => {
  const supabase = createClientComponentClient<Database>();

  const { data: tableData, error } = useSWR("/api/molecule", fetcher);
  const [loading, setLoading] = useState(false);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const deleteMolecule = async (rowId: string) => {
    setLoading(true);

    if (!tableData) {
      toast.error("No data to delete");
      return;
    }

    // find the row to delete
    const rowIndex = tableData.findIndex((row) => row.id === rowId);

    // Get the molecule to delete
    const moleculeToDelete = tableData[rowIndex];

    // Delete the molecule from the database
    const { data, error } = await supabase
      .from("molecule")
      .delete()
      .eq("id", moleculeToDelete.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Molecule deleted successfully");
    }

    await revalidate("/api/molecule");

    setLoading(false);
  };

  const builder = createColumnHelper<RowData>();

  const columsns2 = [
    builder.accessor("index", {
      id: "index",
      cell: (row: RowData) => (
        <div className="flex h-7 flex-col items-center justify-center">
          <TextEditableCell cell={row} updateData={updateData} />
        </div>
      ),
    }),
    builder.accessor("smiles", {
      id: "smiles",
      cell: (row: RowData) => (
        <div className="flex h-7 flex-col items-center justify-center">
          <MoleculeStructure
            width={25}
            height={25}
            id={uuidv4()}
            structure={row.getValue()}
            svgMode={true}
          />
        </div>
      ),
    }),
    builder.accessor("name", {
      id: "name",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("common_name", {
      id: "common_name",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("molecular_weight", {
      id: "molecular_weight",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("spec_energy", {
      id: "spec_energy",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("m/z", {
      id: "m/z",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("standard_intensity", {
      id: "standard_intensity",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("retention_time", {
      id: "retention_time",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("melting_point", {
      id: "melting_point",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("boiling_point", {
      id: "boiling_point",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("chromatography_type", {
      id: "chromatography_type",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    // builder.accessor("smiles", {
    //   id: "smiles",
    //   cell: (row: RowData) => (
    //     <TextEditableCell cell={row} updateData={updateData} />
    //   ),
    // }),
    builder.accessor("spectrum", {
      id: "spectrum",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.display({
      id: "actions",
      header: "actions",
      cell: (row: RowData) => {
        return (
          <div className="flex justify-around items-center">
            <button
              className="bg-red-200 px-1 py-0.5 rounded-md"
              onClick={() => deleteMolecule(row.cell.row.original.id)}
              disabled={loading}
            >
              {loading ? (
                <Spinner size={Size.xs} />
              ) : (
                <TrashIcon className="h-3 w-3 dark:stroke-black" />
              )}
            </button>
            {/* <button
              className="bg-green-200 px-1 py-0.5 rounded-md"
              onClick={() => deleteMolecule(row.cell.row.original.id)}
              disabled={loading}
            >
              {loading ? (
                <Spinner size={Size.xs} />
              ) : (
                <ArrowTopRightOnSquareIcon className="h-3 w-3 dark:stroke-black" />
              )}
            </button> */}
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: tableData || [],
    columns: columsns2,
    // filterFns: {
    //   fuzzy: fuzzyFilter,
    // },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  if (error) return <div>Error loading data</div>;

  if (!tableData) return <div>Loading...</div>;

  const updateData = async (rowIndex: number, columnId: string, value: any) => {
    setLoading(true);

    // This is a custom function that we supplied to our table instance
    let updatedRow = { ...tableData[rowIndex], [columnId]: value };

    console.log("updated row", updatedRow);

    // Update the local data without revalidation
    mutate(
      "/api/molecule",
      (oldData) => {
        return oldData.map((row: any, index: number) => {
          if (index === rowIndex) {
            return updatedRow; // the updated row data from the server
          }
          return row;
        });
      },
      false
    ); // false to not re-fetch after updating the data

    // Update the database
    const { data, error } = await supabase
      .from("molecule")
      .update(updatedRow)
      .eq("id", updatedRow.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Molecule updated successfully");
    }

    setLoading(false);
  };

  const addMolecule = async (newMolecule: RowData) => {
    setLoading(true);

    // Insert new molecule into the database
    const { data, error } = await supabase.from("molecule").insert(newMolecule);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Molecule added successfully");
    }

    await revalidate("/api/molecule");

    setLoading(false);
  };

  return (
    <div className="p-4 flex flex-col justify-center w-full">
      <Toaster />
      {loading && (
        <div className="absolute top-2 right-2">
          <Spinner size={Size.small} />
        </div>
      )}
      <div className="flex flex-col items-center">
        <AddMoleculeForm addMolecule={addMolecule} loading={loading} />
        <div className="h-1 w-5/6 bg-gray-300 rounded-md mb-4" />
        <div className="my-3 mx-auto">
          <div className="flex items-center gap-2 text-sm font-bold">
            <button
              className="border rounded px-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded px-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded px-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded px-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16 dark:bg-black"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="dark:bg-black"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <FilterCell
          className="p-2 font-lg shadow border border-block text-black"
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Global Search"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className="whitespace-nowrap border border-gray-300"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap border border-gray-300 p-3 dark:text-white"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    <div>
                      <FilterColumn column={header.column} table={table} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap p-0 border border-gray-300 text-center dark:text-white"
                  >
                    {/* <EditableCell cell={cell} updateData={updateData} /> */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
