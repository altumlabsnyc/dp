"use client";

import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useForm } from "react-hook-form";
import { RowData } from "../Table";

interface Props {
  addMolecule: (newMolecule: RowData) => void;
}

export default function AddMoleculeForm({ addMolecule }: Props) {
  const supabase = createClientComponentClient<Database>();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    addMolecule(data);
    reset();
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-5 gap-4">
        <div>
          <label className="block">Name</label>
          <input {...register("name")} className="border p-1 w-full" />
        </div>
        <div>
          <label className="block">External ID</label>
          <input {...register("external_id")} className="border p-1 w-full" />
        </div>
        <div>
          <label className="block">Smiles</label>
          <input {...register("smiles")} className="border p-1 w-full" />
        </div>
        <div>
          <label className="block">Spectrum</label>
          <input {...register("spectrum")} className="border p-1 w-full" />
        </div>
        <div className="flex items-end">
          <button className="px-3 py-1 bg-red-500 text-black rounded">
            Add Molecule
          </button>
        </div>
      </div>
    </form>
  );
}
