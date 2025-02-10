"use client";

import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { redirect } from "next/navigation"; // Import the useClerk hook
import {useRouter} from "next/navigation";
import styles from "~/styles/notes.module.css"

export function LogoutButton() {
  // Destructure signOut from useClerk
  const { signOut } = useClerk();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call signOut with a redirectUrl to send the user to the homepage after sign out
      router.push("/");
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} className={styles.button} disabled={isLoading}>
      {isLoading ? "Logging Out..." : "Log Out"}
    </button>
  );
}
