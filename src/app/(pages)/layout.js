"use client";
// import localFont from "next/font/local";
import { Poppins } from "next/font/google";
// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppSidebar } from "@/components/sidebar/index";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { pusherClient } from "@/utils/pusher";
import useStore from "@/utils/store/store";
import "@/utils/auth";
import useAuthReady from "@/utils/store/useAuthReady";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const poppins = Poppins({
  style: ["normal"],
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function PageLayout({ children }) {
  const user = useStore((state) => state.user);
  const token = useStore((state) => state.token);
  const logout = useStore((state) => state.logout);
  const sidebarFlag = useStore((state) => state.sidebarFlag);
  const authReady = useAuthReady();

  const router = useRouter();
  // Decide only after the saved login has loaded; before that the store
  // reports user/token as null even for a logged-in user.
  useEffect(() => {
    if (authReady && !token) {
      router.replace("/login");
    }
  }, [authReady, token]);
  useEffect(() => {
    if (user !== undefined && user !== null && user.id !== undefined) {
      pusherClient.subscribe(user.id);
      const handleUpdatedChat = (updatedChat) => {};
      pusherClient.bind("update-chat", handleUpdatedChat);
      return () => {
        if (user !== undefined && user !== null && user.id !== undefined) {
          pusherClient.unsubscribe(user.id);
          pusherClient.unbind("update-chat", handleUpdatedChat);
        }
      };
    }
  }, [user]);
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <div className={`${poppins.className} antialiased`}>
      <main className="flex flex-row flex-nowrap">
        <section className={`${sidebarFlag ? "w-[70px]" : "w-1/6"} `}>
          <SidebarProvider>
            <AppSidebar>
              <SidebarTrigger />
            </AppSidebar>
          </SidebarProvider>
        </section>
        <section className="w-full pr-20 pl-20 pt-1 pb-1 overflow-hidden">
          <nav className="flex flex-row justify-end w-full rounded-full p-3 mt-3 mb-3 shadow-md gap-x-10 cus-nav">
            <Link href={"/task"}>
              <Image src={"/task.png"} width={32} height={32} alt="Tasks" />
            </Link>
            <Link href={"/chat"}>
              <Image src={"/chat.png"} width={32} height={32} alt="Chat" />
            </Link>
            <Link href={"/notification"}>
              <Image
                src={"/bell.png"}
                width={32}
                height={32}
                alt="Notification"
              />
            </Link>
            <Link href={"/settings"}>
              <Image
                src={"/settings.png"}
                width={32}
                height={32}
                alt="Settings"
              />
            </Link>
            <Avatar>
              <DropdownMenu className={`${poppins.className}`}>
                <DropdownMenuTrigger>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {user && user !== null && user.fullname !== undefined
                      ? user.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join(".")
                      : "U"}
                  </AvatarFallback>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Avatar>
          </nav>
          {/* Pages mount only once the real user is known, so their own
              first render and effects never see a null user on refresh. */}
          {authReady && token ? children : null}
        </section>
      </main>
    </div>
  );
}
