import React, { useState, useEffect } from "react";

export default function EditableCell({ cell, updateData }) {
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
  
    if (cell.column.id === "actions") {
      return <p>test</p>;
    }
  
    return (
      <div className="w-full p-2">
        <input
          className="text-center bg-transparent w-full"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    );
  };