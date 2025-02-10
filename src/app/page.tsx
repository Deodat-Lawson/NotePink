"use client";

import Link from "next/link";
import React from 'react';

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import { ClerkProvider, SignUpButton } from "@clerk/nextjs";

const styles = {
  container: "min-h-screen bg-white flex flex-col items-center justify-center px-4",
  contentWrapper: "max-w-3xl w-full text-center space-y-8",
  title: "text-5xl font-bold text-pink-600 mb-4",
  description: "text-xl text-gray-600 mb-8 max-w-2xl mx-auto",
  button: "bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg shadow-lg hover:shadow-xl",
};

const HomePage = () => {

  return (
    <ClerkProvider>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.title}>
            NotePink
          </h1>
          <p className={styles.description}>
            Capture your thoughts, organize your ideas, and boost your productivity with our elegant and intuitive
            notetaking solution. Experience the perfect blend of simplicity and power.
          </p>
          <SignUpButton>
            <button className={styles.button}>
              GET STARTED
            </button>
          </SignUpButton>
        </div>
      </div>


    </ClerkProvider>

  );
};

export default HomePage;
