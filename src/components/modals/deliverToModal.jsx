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
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { format, parseISO } from "date-fns";

var columns = [{ field: "toolNumber", headerName: "Tool Number", width: 200 }];
function DeliverToModal({
  open,
  onClose,
  handleSetToDeliver,
  requestId,
  refreshData,
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

  const handleDeliverTo = (e) => {
    e.preventDefault();
    handleSetToDeliver(requestId, user.value);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-row justify-center self-center w-full overflow-y-auto"
    >
      <div className="bg-white w-1/3 h-[400px] p-10 border-none overflow-y-auto">
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Assign Deliver To</h1>
          </Button>
          <form
            onSubmit={handleDeliverTo}
            className="pt-10 flex flex-col gap-4 pb-2"
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
              className="bg-orange-400 text-white font-semibold rounded-[8px] p-2 self-start"
              value={"Assign DeliverTo"}
            />
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default DeliverToModal;
