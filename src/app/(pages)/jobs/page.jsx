"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./style.scss";
import Tools from "@/components/tools";
import { pusherClient } from "@/utils/pusher";
import React, { useState, useEffect } from "react";
import useStore from "@/utils/store/store";
import { useRouter } from "next/navigation";
import PurchasingOrder from "@/components/purchasingOrder";
import StorageLocationComp from "@/components/storageLocation";
import VendorComp from "@/components/vendors";
import Overstock from "@/components/overstock";
import JobNumber from "@/components/jobNumber";
import Job from "@/components/jobComp";
import ServicesComp from "@/components/serviceTickets";
import JobTicketComp from "@/components/jobTickets";

function List() {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [activeInnerTab, setActiveInnerTab] = useState("purchasingOrder");
  useEffect(() => {
    if (user == null) {
      router.push("/login");
    }
    if (user !== undefined && user !== null && user.id !== undefined) {
      pusherClient.subscribe(user.id);
      const handleUpdatedChat = (updatedChat) => {
        // setAllChats((allChats) =>
        //   allChats.map((chat) => {
        //     if (chat._id === updatedChat.id) {
        //       return { ...chat, messages: updatedChat.messages };
        //     } else {
        //       return chat;
        //     }
        //   })
        // );
      };
      pusherClient.bind("update-chat", handleUpdatedChat);
      return () => {
        if (user !== undefined && user !== null && user.id !== undefined) {
          pusherClient.unsubscribe(user.id);
          pusherClient.unbind("update-chat", handleUpdatedChat);
        }
      };
    }
  }, [user, activeInnerTab]);
  return (
    <div>
      <Tabs defaultValue="serviceTickets" className="w-full">
        <TabsList className="cus-tab-wrap">
          <TabsTrigger value="serviceTickets">Service Tickets</TabsTrigger>
          <TabsTrigger value="jobTickets">Job Tickets</TabsTrigger>
          <TabsTrigger value="jobNumber">Job Numbers</TabsTrigger>
          <TabsTrigger value="serviceNumbers">Service Numbers</TabsTrigger>
          <TabsTrigger value="jobs">Jobs +</TabsTrigger>
        </TabsList>
        <TabsContent value="serviceTickets">
          <ServicesComp />
        </TabsContent>
        <TabsContent value="jobTickets">
          <JobTicketComp />
        </TabsContent>
        <TabsContent value="jobNumber">
          <JobNumber />
        </TabsContent>
        <TabsContent value="serviceNumbers">
          <div className="flex flex-row justify-center pt-10">
            <h1 className="font-bold text-4xl text-center">Coming Soon</h1>
          </div>
        </TabsContent>
        <TabsContent value="jobs">
          <Job />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default List;
