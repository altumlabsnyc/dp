"use client";

import { useForm } from "react-hook-form";
import Spinner, { Size } from "../Spinner";
import { RowData } from "../Table";

interface Props {
  addMolecule: (newMolecule: RowData) => void;
  loading: boolean;
}

export default function AddMoleculeForm({ addMolecule, loading }: Props) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    addMolecule(data);
    reset();
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-center gap-4 justify-center">
        <div>
          <label className="block">Name</label>
          <input
            {...register("name")}
            className="border p-1 w-full !text-black"
          />
        </div>
        <div>
          <label className="block">External ID</label>
          <input
            {...register("external_id")}
            className="border p-1 w-full !text-black"
          />
        </div>
        <div>
          <label className="block">Smiles</label>
          <input
            {...register("smiles")}
            className="border p-1 w-full !text-black"
          />
        </div>
        <div>
          <label className="block">Spectrum</label>
          <input
            {...register("spectrum")}
            className="border p-1 w-full !text-black"
          />
        </div>
        <button
          className="px-3 py-1 bg-gray-200 text-black rounded flex items-center"
          disabled={loading}
        >
          Add Molecule
          {loading && (
            <span className="ml-2">
              <Spinner size={Size.xs} />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
