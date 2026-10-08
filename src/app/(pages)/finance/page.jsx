"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./style.scss";
import { pusherClient } from "@/utils/pusher";
import React, { useState, useEffect } from "react";
import useStore from "@/utils/store/store";
import { useRouter } from "next/navigation";
import InvoiceComp from "@/components/invoice";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { apiPath } from "@/utils/routes";

function Finance() {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [activeInnerTab, setActiveInnerTab] = useState("purchasingOrder");
  const [clients, setClients] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

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
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/clients/?page=1&pageSize=20`)
      .then((res) => {
        setLoading(false);
        setClients(res.data.clients);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleChangePage = (event, newPage) => {
    if (newPage == 0) {
      setPage(1);
    } else {
      setPage(newPage + 1);
    }
    getClients(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
  };
  const getClients = (pageNew) => {
    setLoading(true);
    axios
      .get(
        `${apiPath.prodPath}/api/clients/?page=${
          pageNew == 0 ? 1 : pageNew
        }&pageSize=${pageSize}`
      )
      .then((res) => {
        setAllClients(res.data.clients);
        setTotalCount(res.data.totalCount);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div>
      <Tabs defaultValue="invoice" className="w-full">
        <TabsList className="cus-tab-wrap">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>
        <TabsContent value="invoice">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <InvoiceComp
              allClients={clients}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
            />
          )}
        </TabsContent>
        <TabsContent value="statements">
          <div className="flex flex-row justify-center pt-10">
            <h1 className="font-bold text-4xl text-center">Coming Soon</h1>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Finance;
