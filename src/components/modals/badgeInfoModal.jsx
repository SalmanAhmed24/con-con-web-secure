import { Modal } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import TopInfoService from "../topInfo/serviceTicketTopInfo";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PicFileService from "../jobTickets/picFile";
import { Skeleton } from "@/components/ui/skeleton";
import Payments from "../jobTickets/payments";
import TopInfoJobTicket from "../topInfo/jobTicketTopInfo";
import TopInfoBadge from "../topInfo/badgeTopInfo";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
function BadgeInfoModal({ open, onClose, id, refreshData, item }) {
  const [activeTab, setActiveTab] = useState("Pics / Files");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {}, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-row justify-center align-middle w-full h-full"
    >
      <div
        className="bg-white w-5/6 h-dvh p-10 border-none overflow-y-scroll"
        style={{ alignSelf: "center" }}
      >
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Open - Badge</h1>
          </Button>
        </div>
        <TopInfoBadge data={item} />
      </div>
    </Modal>
  );
}

export default BadgeInfoModal;
