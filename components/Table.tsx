"use client";

import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { mutate } from "swr";
import Spinner from "./Spinner";
import AddMoleculeForm from "./Table/AddMoleculeForm";

// create a custom type for the table data
export type RowData = Database["public"]["Tables"]["molecule"]["Row"];
// type ColumnData = ColumnDef<RowData, keyof RowData>

const fetcher = async (url: string) => {
  const supabase = createClientComponentClient<Database>();
  const { data, error } = await supabase.from("molecule").select("*");

  if (error) throw error;

  return data;
};

const EditableCell = ({ cell, updateData }) => {
  // We need to keep and update the state of the cell.
  const [originalValue] = useState(cell.getValue());
  const [value, setValue] = useState(cell.getValue());

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    if (originalValue !== value) {
      updateData(cell.row.index, cell.column.id, value);
    }
  };

  // If the initialValue is different from the current value
  // The cell is getting edited
  useEffect(() => {
    setValue(cell.getValue());
  }, [cell.getValue()]);

  return (
    <div className="">
      <input
        className="text-center bg-transparent"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

const Table: React.FC = () => {
  const supabase = createClientComponentClient<Database>();

  const { data: tableData, error } = useSWR("/api/molecule", fetcher);
  const [loading, setLoading] = useState(false);

  // const fetchTableData = async () => {
  //   const { data, error } = await supabase.from("molecule").select("*");

  //   console.log(data, error);

  //   if (error) {
  //     console.error(error);
  //   } else {
  //     setTableData(data);
  //   }
  // };

  // useEffect(() => {
  //   fetchTableData();
  // }, []);

  // const [tableData, setTableData] = useState<RowData[]>([]);

  // const columnHelper = createColumnHelper<ColumnData>();

  let columns = [
    {
      id: "name",
      accessorFn: (row: RowData) => `${row.name}`,
    },
    {
      id: "external_id",
      accessorFn: (row: RowData) => `${row.external_id}`,
    },
    // {
    //   id: "id",
    //   accessorFn: (row: RowData) => `${row.id}`,
    // },
    {
      id: "smiles",
      accessorFn: (row: RowData) => `${row.smiles}`,
    },
    {
      id: "spectrum",
      accessorFn: (row: RowData) => `${row.spectrum}`,
    },
  ];

  const table = useReactTable({
    data: tableData || [],
    columns: columns,
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
    // Optimistically update the local data
    mutate("/api/molecule", [...tableData, newMolecule], false);

    // Insert new molecule into the database
    const { data, error } = await supabase.from("molecule").insert(newMolecule);

    if (error) {
      toast.error(error.message);
      // If the insert failed, roll back the optimistic update
      mutate("/api/molecule");
    } else {
      toast.success("Molecule added successfully");
      // If the insert was successful, update the local data with the server data
      mutate("/api/molecule", (oldData) => [...oldData, data?.[0]], false);
    }

    setLoading(false);
  };

  return (
    <div className="p-2">
      <Toaster />
      {loading && (
        <div className="absolute top-2 right-2">
          <Spinner />
        </div>
      )}
      <AddMoleculeForm addMolecule={addMolecule} />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="border border-gray-300" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border border-gray-300 p-3">
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
                <td key={cell.id} className="border border-gray-300">
                  <EditableCell cell={cell} updateData={updateData} />
                  {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
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
