import { Column, Table } from "@tanstack/react-table";
import FilterCell from "./FilterCell";

export default function FilterColumn({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <FilterCell
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={"Min"}
          className="w-10 border shadow rounded text-black"
        />
        <FilterCell
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={"Max"}
          className="w-10 border shadow rounded text-black"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <FilterCell
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={"Search here"}
        className="w-20 border shadow rounded text-black"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}
