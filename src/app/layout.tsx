import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { CLIENT_TOKEN_STORAGE_KEY } from "@/constants";
import { getCurrentUser } from "@/api/user";
import UserStoreInitializer from "@/store/initilizer/userStoreInitilizer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Synergy Dashboard",
  description: "Synergy  Dashboard For Managing KRA & KPI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user] = await Promise.all([checkUserLoggedIn()]);
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <UserStoreInitializer
          isAuthenticated={user?.isAuthenticated ?? false}
          user={user?.user ?? null}
        />
        <Toaster />
        {children}
      </body>
    </html>
  );
}

async function checkUserLoggedIn() {
  try {
    const token = (await cookies()).get(CLIENT_TOKEN_STORAGE_KEY);

    if (!token?.value) return { isAuthenticated: false, user: null };

    const user = await getCurrentUser(token.value);
    // console.log(user, "user found");
    if (user?.data) {
      return { isAuthenticated: true, user: user.data };
    }
  } catch (error) {
    console.log("Error in checkUserLoggedIn=>", error);
  }
  return { isAuthenticated: false, user: null };
}
