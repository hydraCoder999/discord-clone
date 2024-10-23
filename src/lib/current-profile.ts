import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const CurrentProfile = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};
