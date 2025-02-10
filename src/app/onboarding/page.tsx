"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./_actions";

export default function OnboardingComponent() {
  const { user } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    const runOnboarding = async () => {
      await completeOnboarding();
      await user?.reload();
      router.push("/notes");
    };

    runOnboarding().catch((error) => {console.log(error)});
  }, [user, router]);

  return null;
}
