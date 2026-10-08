"use client";
import "./style.scss";
import { pusherClient } from "@/utils/pusher";
import React, { useState, useEffect } from "react";
import useStore from "@/utils/store/store";
import { useRouter } from "next/navigation";

import BadgeComp from "@/components/badge";
function Badges() {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [activeInnerTab, setActiveInnerTab] = useState("purchasingOrder");
  const [clients, setClients] = useState("");
  const [loading, setLoading] = useState(false);
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
      <BadgeComp />
    </div>
  );
}

export default Badges;
