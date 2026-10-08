import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import ToolRequestTable from "../tables/toolRequestTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolRequest from "../toolRequest";
import ToolReturn from "../toolReturn";
import ToolTransfer from "../toolTransfer";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function ToolReqRet() {
  return (
    <section className="main-table-wrap">
      <Tabs defaultValue="Tool Request" className="w-full">
        <TabsList className="cus-tab-wrap">
          <TabsTrigger value="Tool Request">Tool Request</TabsTrigger>
          <TabsTrigger value="Tool Return">Tool Return</TabsTrigger>
          <TabsTrigger value="Tool Transfer">Tool Transfer</TabsTrigger>
        </TabsList>
        <TabsContent value="Tool Request">
          <ToolRequest />
        </TabsContent>
        <TabsContent value="Tool Return">
          <ToolReturn />
        </TabsContent>
        <TabsContent value="Tool Transfer">
          <ToolTransfer />
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default ToolReqRet;
