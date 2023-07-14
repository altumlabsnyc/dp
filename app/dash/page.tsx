// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import Table from "@/components/Table";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedRoute() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // This route can only be accessed by authenticated users.
    // Unauthenticated users will be redirected to the `/login` route.
    redirect("/login");
  }

  const signOut = async () => {
    "use server";
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
    redirect("/login");
  };

  if (!user.email || user.email.split("@")[1] !== "altumlabs.co") {
    // sign out the user and redirect to the login page
    redirect("/login");
  }

  console.log("test");

  return (
    <div className="flex flex-col items-center">
      dashboard
      
      <button
        onClick={signOut}
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover dark:bg-gray-100"
      >
        Sign out
      </button>
      <Table />
    </div>
  );
}
