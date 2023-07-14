"use client";

import { Database } from "@/types/supabase";
import revalidate from "@/utils/revalidate";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { mutate } from "swr";
import Spinner, { Size } from "./Spinner";
import AddMoleculeForm from "./Table/AddMoleculeForm";
import TextEditableCell from "./Table/TextEditableCell";

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
    builder.accessor("name", {
      id: "name",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
    builder.accessor("smiles", {
      id: "smiles",
      cell: (row: RowData) => (
        <TextEditableCell cell={row} updateData={updateData} />
      ),
    }),
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
          <div className="flex justify-around items-center py-2">
            <button
              className="bg-red-200 px-2 py-1 rounded-md"
              onClick={() => deleteMolecule(row.cell.row.original.id)}
              disabled={loading}
            >
              {loading ? (
                <Spinner size={Size.xs} />
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
            </button>
            <button
              className="bg-green-200 px-2 py-1 rounded-md"
              onClick={() => deleteMolecule(row.cell.row.original.id)}
              disabled={loading}
            >
              {loading ? (
                <Spinner size={Size.xs} />
              ) : (
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: tableData || [],
    columns: columsns2,
    getCoreRowModel: getCoreRowModel(),
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

    console.log(tableData);

    // Update the database
    const { data, error } = await supabase
      .from("molecule")
      .update(updatedRow)
      .eq("id", updatedRow.id);

    console.log("data", data);
    console.log("error", error);

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
    <div className="p-2 flex flex-col items-center">
      <Toaster />
      {loading && (
        <div className="absolute top-2 right-2">
          <Spinner size={Size.small} />
        </div>
      )}
      <AddMoleculeForm addMolecule={addMolecule} loading={loading} />
      <div className="h-1 w-5/6 bg-gray-300 rounded-md mb-4" />
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="border border-gray-300" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 p-3 dark:text-white">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border border-gray-300 text-center dark:text-white"
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
  );
};

export default Table;
