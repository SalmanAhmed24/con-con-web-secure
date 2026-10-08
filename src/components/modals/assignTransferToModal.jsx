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
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";

var columns = [{ field: "toolNumber", headerName: "Tool Number", width: 300 }];
function AssignTransferTo({
  open,
  onClose,
  toolTransferId,
  refreshData,
  refreshFlag,
  item,
}) {
  const [toolArr, setToolArr] = useState([]);
  const [userOpt, setUserOpt] = useState([]);
  const [user, setUser] = useState("");
  useEffect(() => {
    axios.get(`${apiPath.prodPath}/api/users/`).then((res) => {
      const sortedUser = res.data.allUsers
        .map((i) => {
          return { label: i.fullname, value: i.fullname };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
      setUserOpt(sortedUser);
    });
  }, []);

  //   const addToToolHistory = (oldData) => {
  //     axios
  //       .post(`${apiPath.prodPath}/api/toolHistory/addToolHistory`, oldData)
  //       .then((res) => {
  //         console.log(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //   };
  //   const editToolHandler = (data, id) => {
  //     axios
  //       .patch(`${apiPath.prodPath}/api/allTools/editTool/${id}`, data)
  //       .then((res) => {
  //         if (res.data.error) {
  //           Swal.fire({
  //             icon: "error",
  //             text: "Unable to edit",
  //           });
  //         } else {
  //           Swal.fire({
  //             icon: "success",
  //             text: "Editted Successfully",
  //           });
  //           const approval = { approval: true };
  //           axios
  //             .patch(
  //               `${apiPath.prodPath}/api/toolRequest/toolApproval/${toolTransferId}`,
  //               approval
  //             )
  //             .then((res) => {
  //               console.log(res);
  //               refreshData();
  //             })
  //             .catch((err) => console.log(err));
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   };
  const handleCheckboxes = (value) => {
    setToolArr(value);
  };

  const handlePickUp = (e) => {
    e.preventDefault();
    var updatedToolReq = [];
    var remainigToolReq = [];
    toolArr.forEach((el) => {
      item.toolTransfer.forEach((inner) => {
        if (el == inner.id) {
          inner.assignedTo = user.value;
          inner.returnFlag = "Assign To Transfer";
        }
      });
    });
    axios
      .patch(
        `${apiPath.prodPath}/api/toolReturn/setPickupAssignee/${toolTransferId}`,
        { toolRequest: item.toolTransfer },
      )
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to assign for Pickup",
          });
        } else {
          if (
            item.toolTransfer.filter((i) => i.returnFlag == "Pending").length ==
            0
          ) {
            axios
              .patch(
                `${apiPath.prodPath}/api/toolReturn/handleAssignedFlag/${toolTransferId}`,
                { assignedTo: true },
              )
              .then((res) => {
                if (res.data.error) {
                  Swal.fire({
                    icon: "error",
                    text: "Error Occurred",
                  });
                } else {
                  Swal.fire({
                    icon: "success",
                    title: "All tools assigned for PickUp",
                  });
                  refreshData();
                }
              });
          } else {
            refreshData();
          }
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
            <h1 className="text-3xl font-semibold">Assign PickUp</h1>
          </Button>

          <div className="flex flex-row gap-2 flex-wrap pt-5 pb-5">
            <div className="w-[200px] flex flex-col gap-2">
              <label className="text-orange-400 font-semibold">Date</label>
              <label className="text-black">
                {format(item.date, "MM-dd-yyyy")}
              </label>
            </div>
            <div className="w-[200px] flex flex-col gap-2">
              <label className="text-orange-400 font-semibold">Time</label>
              <label className="text-black">{item.time}</label>
            </div>
            <div className="w-[200px] flex flex-col gap-2">
              <label className="text-orange-400 font-semibold">
                Person Requested
              </label>
              <label className="text-black">{item.user}</label>
            </div>
          </div>
          {toolArr.length ? (
            <form
              onSubmit={handlePickUp}
              className="flex flex-row gap-4 pt-2 pb-2"
            >
              <Select
                className="w-[300px]"
                options={userOpt}
                value={user}
                onChange={(e) => setUser(e)}
                placeholder="Select User"
              />
              <input
                type="submit"
                className="bg-orange-400 text-white font-semibold rounded-[8px] p-2"
                value={"Assign PickUp"}
              />
            </form>
          ) : null}
          <Paper
            sx={{ width: "100%", overflow: "hidden", bgcolor: "transparent" }}
          >
            <DataGrid
              rows={item.toolTransfer.filter((i) => i.returnFlag == "Pending")}
              columns={columns}
              checkboxSelection
              sx={{ border: 0 }}
              onRowSelectionModelChange={handleCheckboxes}
            />
          </Paper>
        </div>
      </div>
    </Modal>
  );
}

export default AssignTransferTo;
