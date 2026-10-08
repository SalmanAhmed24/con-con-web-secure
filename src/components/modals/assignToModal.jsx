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
function AssignToModal({
  open,
  onClose,
  serviceId,
  refreshData,
  selectedService,
}) {
  const [empOpt, setEmpOpt] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    setUser();
  }, [open]);
  const handleForm = (e) => {
    e.preventDefault();
    const dataObj = {
      assignedTo: assignedTo.value == undefined ? "" : assignedTo.value,
      ticketStatus: ticketStatus.value == undefined ? "" : ticketStatus.value,
    };
    var url = "";
    if (selectedService == "job ticket") {
      url = `${apiPath.prodPath}/api/jobTicket/setAssignTo/${serviceId}`;
    } else {
      url = `${apiPath.prodPath}/api/service/setAssignTo/${serviceId}`;
    }
    axios
      .patch(url, dataObj)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: `${
              selectedService == "job ticket"
                ? "Cannot Assign User to Job Ticket"
                : "Cannot Assign User to Service Ticket"
            }`,
            confirmButtonColor: "orange",
          });
        } else {
          refreshData();
          onClose();
          Swal.fire({
            icon: "success",
            text: `${
              selectedService == "job ticket"
                ? "Assigned User to Job Ticket"
                : "Assigned User to Service Ticket"
            }`,
            confirmButtonColor: "orange",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const setUser = async () => {
    setLoader(true);
    await axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const sorted = res.data.allUsers
          .sort((a, b) => a.fullname.localeCompare(b.fullname))
          .map((i) => {
            return { label: i.fullname, value: i.fullname };
          });
        setEmpOpt(sorted);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };
  const ticketStatusOpt = [
    { label: "Open Ticket", value: "Open Ticket" },
    { label: "Unbilled", value: "Unbilled" },
    { label: "Billed", value: "Billed" },
  ];
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-row justify-center self-center w-full"
    >
      <div className="bg-white w-1/3 h-350 p-10 border-none">
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Assign Modal</h1>
          </Button>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleForm}>
          {loader ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Assigned To</label>
              <Select
                options={empOpt}
                value={assignedTo}
                onChange={(v) => setAssignedTo(v)}
                required={true}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Ticket Status</label>
            <Select
              options={ticketStatusOpt}
              value={ticketStatus}
              onChange={(v) => setTicketStatus(v)}
              required={true}
            />
          </div>
          <div className="flex flex-row justify-start">
            <input
              type="submit"
              value={"Assign"}
              className="rounded-[10px] bg-orange-400 font-semibold text-white p-2"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AssignToModal;
