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
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
var columns = [
  { field: "toolNumber", headerName: "Tool Number", width: 300 },
  {
    field: "note",
    headerName: "Note",
    width: 250,
  },
];
function TransferSetForPickUp({
  open,
  onClose,
  requestId,
  refreshData,
  refreshFlag,
  item,
}) {
  const [toolArr, setToolArr] = useState([]);
  const [allTools, setAllTools] = useState([]);
  const [toolTransferArr, setToolTransferArr] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/allTools`)
      .then((res) => {
        setAllTools(res.data.allTools);
      })
      .catch((err) => console.log(err));
    console.log("####", item);
    setToolTransferArr(
      item.toolTransfer.filter((i) => i.returnFlag == "Assign Transfer To")
    );
  }, [open, refreshFlag]);
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
  //               `${apiPath.prodPath}/api/toolRequest/toolApproval/${requestId}`,
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
  const handleReturn = (e) => {
    e.preventDefault();
    var filteredToolsFromReq = [];
    toolArr.forEach((el) => {
      filteredToolsFromReq.push(
        item.toolTransfer.find((inner) => inner.id == el)
      );
    });
    // var toolShop = [];
    toolArr.forEach((el) => {
      item.toolTransfer.forEach((innerEl) => {
        if (el == innerEl.id) {
          innerEl.returnFlag = "Transfer By";
        }
      });
    });
    // filteredToolsFromReq.forEach((el) => {
    //   el.returnFlag = "Transfer By";
    // });

    // console.log("@#@#@#@#", toolShop);
    // const updatedToolsFromReq = filteredToolsFromReq.map((i) => {
    //   return { returnFlag: true, ...i };
    // });
    axios
      .patch(
        `${apiPath.prodPath}/api/toolTransfer/setPickupAssignee/${item.id}`,
        {
          toolTransfer: item.toolTransfer,
        }
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    const returnFlag = { returnFlag: "Transfer By" };

    if (
      item.toolTransfer.filter((i) => i.returnFlag == "Assign Transfer To")
        .length
    ) {
      refreshData();
    } else {
      axios
        .patch(
          `${apiPath.prodPath}/api/toolTransfer/handlePickupFlag/${item.id}`,
          returnFlag
        )
        .then((res) => {
          refreshData();
        })
        .catch((err) => console.log(err));
    }
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
            <h1 className="text-3xl font-semibold">Set For Pick Up</h1>
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
        </div>
        {toolArr.length ? (
          <button
            className="p-2 mt-2 mb-4 font-medium bg-orange-400 rounded-xl text-white"
            onClick={handleReturn}
          >
            Set For Transfer By
          </button>
        ) : null}
        <Paper
          sx={{ width: "100%", overflow: "hidden", bgcolor: "transparent" }}
        >
          <DataGrid
            rows={toolTransferArr.filter(
              (i) => i.returnFlag == "Assign Transfer To"
            )}
            columns={columns}
            checkboxSelection
            sx={{ border: 0 }}
            onRowSelectionModelChange={handleCheckboxes}
          />
        </Paper>
      </div>
    </Modal>
  );
}

export default TransferSetForPickUp;
