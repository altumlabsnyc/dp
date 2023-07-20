import { useEffect, useState } from "react";
import Popup from "./Popup";

export default function EditableCell({ cell, updateData }) {
  const [value, setValue] = useState(cell.getValue());
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  // If the initialValue is different from the current value
  // The cell is getting edited
  useEffect(() => {
    setValue(cell.getValue());
  }, [cell.getValue()]);

  if (cell.column.id === "actions") {
    return <p>test</p>;
  }

  return (
    <div className="w-full">
      <Popup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        cell={cell}
        updateData={updateData}
      />
      <button
        className="text-center bg-transparent w-full"
        onClick={handleClick}
      >
        {value}
      </button>
    </div>
  );
}
