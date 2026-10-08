import Modal from "@mui/material/Modal";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import JobNumberTopInfo from "../topInfo/jobNumberTopInfo";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import JobTimeTrack from "../jobNumber/jobTimeTrack";
import JobToolTrack from "../jobNumber/jobToolTrack";
import CPComponent from "../CP";
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
function JobNumberInfo({ open, onClose, item, refreshData }) {
  const [activeTab, setActiveTab] = useState("Basic");
  const tabHandler = (e) => {
    setActiveTab(e.target.innerText);
  };
  return (
    <Modal
      anchor={"right"}
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
            <h1 className="text-3xl font-semibold">Open</h1>
          </Button>
        </div>
        <div className="flex flex-row">
          <div className="w-1/2 flex flex-row pb-2 gap-2 border-b-[2px] border-b-gray-200">
            <div className="w-1/2 flex flex-row gap-2">
              <label className="font-semibold">Job Name</label>
              <label className="text-orange-400 underline">
                {item.jobName}
              </label>
            </div>
            <div className="w-1/2 flex flex-row gap-2">
              <label className="font-semibold">Job Number</label>
              <label className="text-orange-400 underline">
                {item.jobNumber}
              </label>
            </div>
          </div>
          <div className="w-1/2 flex flex-row justify-end">
            <button className="bg-orange-400 rounded-[5px] text-white font-semibold p-3">
              Link To Project File
            </button>
          </div>
        </div>
        <Tabs defaultValue="basic" className="w-full pt-2 pb-2">
          <TabsList className="cus-tab-wrap gap-4">
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="basic"
            >
              Basic
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="badges"
            >
              Badges
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="co"
            >
              CO
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="cp"
            >
              CP
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="rfi"
            >
              RFI
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="sov"
            >
              SOV
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="submittals"
            >
              Submittals
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="tools"
            >
              Tools
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="time"
            >
              Time
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="materials"
            >
              Materials
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="notes"
            >
              Notes
            </TabsTrigger>
            <TabsTrigger
              className="border-[1px] border-orange-300 rounded-[5px]"
              value="permits"
            >
              Permits
            </TabsTrigger>
          </TabsList>
          <TabsContent value="basic">
            <JobNumberTopInfo item={item} />
          </TabsContent>
          <TabsContent value="badges">
            <p>Badges</p>
          </TabsContent>
          <TabsContent value="co">
            <p>CO</p>
          </TabsContent>
          <TabsContent value="cp">
            <CPComponent item={item} />
          </TabsContent>
          <TabsContent value="rfi">
            <p>RFI</p>
          </TabsContent>
          <TabsContent value="sov">
            <p>SOV</p>
          </TabsContent>
          <TabsContent value="submittals">
            <p>Submittals</p>
          </TabsContent>
          <TabsContent value="tools">
            <JobToolTrack jobName={item.jobName} jobNumber={item.jobNumber} />
          </TabsContent>
          <TabsContent value="time">
            <JobTimeTrack jobNumber={item.jobNumber} jobName={item.jobName} />
          </TabsContent>
          <TabsContent value="materials">
            <p>Materials</p>
          </TabsContent>
          <TabsContent value="notes">
            <p>Notes</p>
          </TabsContent>
          <TabsContent value="permits">
            <p>Permits</p>
          </TabsContent>
        </Tabs>
        {/* <JobNumberTopInfo item={item} /> */}
      </div>
    </Modal>
  );
}

export default JobNumberInfo;
