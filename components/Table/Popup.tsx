import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function Popup({
  isOpen,
  setIsOpen,
  cell,
  updateData,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  cell: any;
  updateData: (rowIndex: number, columnId: string, value: string) => void;
}) {
  console.log(cell.name);

  // We need to keep and update the state of the cell.
  const [originalValue] = useState(cell.getValue());
  const [value, setValue] = useState(cell.getValue());

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setValue(originalValue);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (originalValue !== value) {
      updateData(cell.row.index, cell.column.id, value);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex flex-col items-center w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-2">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Enter new value
                </Dialog.Title>
                <div>
                  <input
                    className="text-center"
                    value={value}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-red-300 rounded text-center px-2 py-1"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-300 rounded text-center px-2 py-1"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
