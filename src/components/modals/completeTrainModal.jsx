import Modal from "@mui/material/Modal";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Poppins } from "next/font/google";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Select from "react-select";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";

const poppins = Poppins({
  weight: ["300", "500"],
  subsets: ["latin"],
  style: ["normal"],
});
function CompleteTrainModal({ open, onClose, trainId, refreshData }) {
  const [assignedToOpt, setAssignedToOpt] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  //   const [dateAssigned, setDateAssigned] = useState("");
  //   const [notes, setNotes] = useState("");
  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const mappedUser = res.data.allUsers
          .map((i) => {
            return { label: i.fullname, value: i.fullname, email: i.email };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setAssignedToOpt(mappedUser);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleAssignForm = (e) => {
    e.preventDefault();
    const mappedAssign = assignedTo.map((i) => {
      return { name: i.value };
    });

    const dataObjStr = JSON.stringify(mappedAssign);
    axios
      .patch(
        `${apiPath.prodPath}/api/trainAssignment/completeTraining/${trainId}`,
        {
          completedUsers: dataObjStr,
        },
      )
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Error Occured",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Marked as Complete",
          });
          onClose();
          refreshData();
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
      className="flex flex-row justify-center align-middle w-full h-full"
    >
      <div className="bg-white w-[700px] h-[500px] p-10 border-none overflow-y-scroll">
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Users Who Watched</h1>
          </Button>
        </div>

        <form onSubmit={handleAssignForm} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 w-[550px]">
            <label className="font-semibold">Users Who Watched</label>
            <Select
              options={assignedToOpt}
              value={assignedTo}
              isMulti={true}
              onChange={(e) => setAssignedTo(e)}
            />
          </div>
          {/* <div className="flex flex-col gap-2 w-[550px]">
            <label className="font-semibold">Date Assigned</label>
            <input
              type="date"
              className="p-2 border-[#cfcfcf] border-[1px] rounded-[5px]"
              value={dateAssigned}
              onChange={(d) => setDateAssigned(d.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-[550px]">
            <label className="font-semibold">Notes</label>
            <input
              type="text"
              className="p-2 border-[#cfcfcf] border-[1px] rounded-[5px]"
              value={notes}
              onChange={(d) => setNotes(d.target.value)}
            />
          </div> */}
          <div className="flex flex-col gap-2 w-[550px]">
            <input
              type="submit"
              className="p-2 self-start bg-orange-400 text-white rounded-[5px]"
              value={"Mark As Complete"}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default CompleteTrainModal;
