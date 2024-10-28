import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function
const handleAuth = () => {
  const { userId } = auth();
  console.log(userId);

  if (!userId) throw new Error("Unauthoried");
  return { userId: userId };
};

export const ourFileRouter = {
  serverImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  // For the Messgae File
  messageFile: f(["image", "pdf"], {})
    .middleware(() => handleAuth())
    .onUploadComplete((file) => {
      console.log(file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
