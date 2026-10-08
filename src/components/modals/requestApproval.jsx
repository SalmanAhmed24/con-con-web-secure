import { apiPath } from "@/utils/routes";
import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Modal } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import Select from "react-select";
import Swal from "sweetalert2";
import RequestToolHistory from "../drawers/requestToolHistory";
import { format } from "date-fns";
function RequestApproval({ open, onClose, requestId, refreshData, item }) {
  useEffect(() => {}, [open]);
  const addToToolHistory = (oldData) => {
    axios
      .post(`${apiPath.prodPath}/api/toolHistory/addToolHistory`, oldData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  const editToolHandler = (data, id, techAssigned, toolNumber) => {
    axios
      .patch(`${apiPath.prodPath}/api/allTools/editTool/${id}`, data)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to edit",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Editted Successfully",
          });
          const approval = {
            approval: "Assigned To",
            assignedTo: techAssigned,
          };
          const tool = {
            toolNumber: toolNumber,
          };
          axios
            .patch(
              `${apiPath.prodPath}/api/toolRequest/toolApproval/${requestId}`,
              approval
            )
            .then((res) => {
              console.log(res);
              refreshData();
            })
            .catch((err) => console.log(err));
          axios
            .patch(
              `${apiPath.prodPath}/api/toolRequest/addToolNumber/${requestId}`,
              tool
            )
            .then((res) => {
              console.log(res);
              refreshData();
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-row justify-center self-center w-full overflow-y-auto"
    >
      <div className="bg-white w-2/3 h-dvh p-10 border-none overflow-y-auto">
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Request Approval</h1>
          </Button>
        </div>
        <div className="flex flex-row flex-wrap gap-3">
          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">
              Person Requesting
            </label>
            <p>{item.user}</p>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">Date</label>
            <p>{format(item.date, "MM-dd-yyyy")}</p>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">Time</label>
            <p>{item.time}</p>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">
              Tool Description
            </label>
            <p>{item.toolRequest}</p>
          </div>

          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">
              Project/Vehicle
            </label>
            <p>{item.projectVehicleFlag}</p>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">Project #</label>
            <p>{item.projectDescription}</p>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">Vehicle #</label>
            <p>{item.vehicleDescription}</p>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <label className="text-orange-400 font-semibold">No of Days</label>
            <p>{item.noOfDays}</p>
          </div>
        </div>
        <RequestToolHistory
          edit={true}
          addToToolHistory={addToToolHistory}
          editTool={editToolHandler}
        />
      </div>
    </Modal>
  );
}

export default RequestApproval;
