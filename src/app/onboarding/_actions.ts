'use server'

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { api } from "~/trpc/server";

export const completeOnboarding = async () => {
  const { userId } = await auth()
  const user = await currentUser();

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {

    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })

    const response = await api.users.create({
      clerkUserId: userId,
      email: user?.primaryEmailAddress?.emailAddress  ?? "",
      name: user?.fullName ?? "",
    });


    console.log("User metadata updated, onboard complete")
    return { message: res.publicMetadata }
  } catch (err) {
    return { error: 'There was an error updating the user metadata.' }
  }
}