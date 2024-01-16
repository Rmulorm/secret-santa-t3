"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export function TopBarUserSection() {
  const { isSignedIn } = useUser();

  return (
    <div>
      {!isSignedIn && <SignInButton />}
      {isSignedIn && <UserButton />}
    </div>
  );
}
