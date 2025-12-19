"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/client";

export default function SyncUserToSupabase() {
  const { user } = useUser();
  const [synced, setSynced] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || synced) return;

    const sync = async () => {
      const userId = user.id;

      // Check if user exists
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (findError) {
        console.error("Error checking for existing user:", findError);
        return;
      }

      if (!existingUser) {
        const { error } = await supabase.from("users").insert({
          user_id: userId,
          email: user.primaryEmailAddress?.emailAddress,
        });

        if (error) {
          console.error("Error inserting user:", error.message);
          return;
        }
      }

      setSynced(true);
      router.push("/onboarding");
    };

    sync();
  }, [user, synced, router]);

  return null;
}
