// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import Table from "@/components/Table";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import dynamic from "next/dynamic";
const MoleculeStructure = dynamic(
  () => import("@/components/MoleculeStructure"),
  { ssr: false }
);

export default async function ProtectedRoute() {
  // "use server";
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  }

  // const signOut = async () => {
  //   "use server";
  //   const supabase = createServerActionClient({ cookies });
  //   // const supabase = createClientComponentClient();
  //   await supabase.auth.signOut();
  //   redirect("/login");
  // };

  if (!user.email || user.email.split("@")[1] !== "altumlabs.co") {
    // sign out the user and redirect to the login page
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center dark:text-white w-full">
      {/* <button
        onClick={signOut}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover dark:bg-gray-500"
      >
        Sign out
      </button> */}
      <div className="py-4 relative w-full">
        <Link
          href="/"
          className="absolute top-2 right-2 bg-foreground py-1 px-6 rounded-lg font-mono text-sm text-background"
        >
          {"<"} Home
        </Link>
      </div>

      <Table />
    </div>
  );
}
