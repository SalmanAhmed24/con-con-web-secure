import { Drawer } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import "./style.scss";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Select from "react-select";
import moment from "moment";
import Swal from "sweetalert2";
import Image from "next/image";
import useStore from "@/utils/store/store";

const poppins = Poppins({
  weight: ["300", "500"],
  style: ["normal"],
  subsets: ["latin"],
});
function ToolTrackDrawer({ open, onClose, refreshData, editFlag, editData }) {
  const user = useStore((state) => state.user);

  const [toolNoOpt, setToolNoOpt] = useState([]);
  const [toolNo, setToolNo] = useState("");
  const [techAssigned, setTechAssigned] = useState("");
  const [techAssignedOpt, setTechAssignedOpt] = useState([]);
  const [checkedOutOpt, setCheckedOutOpt] = useState([]);
  const [checkedOut, setCheckedOut] = useState({ label: "14", value: "14" });
  const [job, setJob] = useState("");
  const [jobOpt, setJobOpt] = useState([]);
  const [vehicle, setVehicle] = useState();
  const [vehicleOpt, setVehicleOpt] = useState([]);
  const [fileUpload, setFileUpload] = useState("");
  const [oldFile, setOldFile] = useState("");
  const [newFileFlag, setNewFileFlag] = useState(false);
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [projVehFlag, setProjVehFlag] = useState({
    label: "Project",
    value: "Project",
  });
  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/jobNumber/`)
      .then((res) => {
        const sortedJobNumbers = res.data.jobNumbers
          .map((i) => {
            return {
              label: `${i.jobNumber} - ${i.jobName}`,
              value: `${i.jobNumber} - ${i.jobName}`,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setJobOpt(sortedJobNumbers);
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/vehicles/`)
      .then((res) => {
        setVehicleOpt(
          res.data.vehicles.map((inner) => {
            return {
              label: inner.vehicleNo,
              value: inner.vehicleNo,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/tools/`)
      .then((res) => {
        const options =
          res.data &&
          res.data.allTools.map((i) => {
            return { label: i.toolNumber, value: i.toolNumber };
          });
        const sortedOpt = options.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setToolNoOpt(sortedOpt);
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/checkedOut/`)
      .then((res) => {
        const options =
          res.data &&
          res.data.checkedOut.map((i) => {
            return { label: i.name, value: i.name };
          });
        const sortedOpt = options.sort((a, b) => a - b);
        setCheckedOutOpt(sortedOpt);
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const options =
          res.data &&
          res.data.allUsers.map((i) => {
            return { label: i.fullname, value: i.fullname };
          });
        const userSortedOpt = options.sort((a, b) =>
          a.label.localeCompare(b.label)
        );
        setTechAssignedOpt(userSortedOpt);
      })
      .catch((err) => console.log(err));
    if (editFlag) {
      setToolNo({ label: editData.toolNumber, value: editData.toolNumber });
      setTechAssigned({
        label: editData.techAssigned,
        value: editData.techAssigned,
      });
      setCheckedOut({ label: editData.checkedOut, value: editData.checkedOut });
      setProjVehFlag({
        label: editData.projectVehicleFlag,
        value: editData.projectVehicleFlag,
      });
      setJob(
        editData.projectVehicleFlag == "Project"
          ? { label: editData.job, value: editData.job }
          : ""
      );
      setVehicle(
        editData.projectVehicleFlag == "Vehicle"
          ? { label: editData.vehicle, value: editData.vehicle }
          : ""
      );
      setNote(editData.note);
      setLocation(editData.location);
      setFileUpload(editData.file !== undefined ? editData.file : undefined);
      setOldFile(editData.file !== undefined ? editData.file : undefined);
    }
  }, [open]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editFlag) {
      const formData = new FormData();
      formData.append("toolNumber", toolNo.value);
      formData.append("techAssigned", techAssigned.value);
      formData.append("location", location);

      formData.append("date", moment(new Date()).format("MM-DD-YYYY"));
      formData.append("time", moment(new Date()).format("hh-mm A"));
      formData.append("user", user.fullname);
      formData.append("note", note);
      formData.append("checkedOut", checkedOut == "" ? "" : checkedOut.value);
      formData.append("editFlag", "true");
      formData.append("projectVehicleFlag", projVehFlag.value);

      formData.append("job", projVehFlag.value == "Project" ? job.value : "");
      formData.append(
        "vehicle",
        projVehFlag.value == "Vehicle" ? vehicle.value : ""
      );
      if (newFileFlag) {
        formData.append("files", fileUpload);
        formData.append(
          "oldFiles",
          oldFile == undefined ? undefined : JSON.stringify(oldFile)
        );
      } else {
        formData.append(
          "files",
          fileUpload == undefined ? undefined : JSON.stringify(fileUpload)
        );
      }
      formData.append("newFileFlag", newFileFlag);
      axios
        .patch(
          `${apiPath.prodPath}/api/toolTrack/editToolTrack/${editData._id}`,
          formData
        )
        .then((res) => {
          if (res.data.error) {
            Swal.fire({
              icon: "error",
              text: "Uneable to edit data",
              confirmButtonColor: "orange",
            });
          }
          if (res.data.error == false) {
            Swal.fire({
              icon: "success",
              text: "Editted Successfully",
              confirmButtonColor: "orange",
            });
            refreshData();
            resetValues();
            onClose();
          }
        })
        .catch((err) => console.log(err));
    } else {
      const formData = new FormData();
      formData.append("toolNumber", toolNo.value);
      formData.append("techAssigned", techAssigned.value);
      formData.append("files", fileUpload);
      formData.append("location", location);

      formData.append("date", moment(new Date()).format("MM-DD-YYYY"));
      formData.append("time", moment(new Date()).format("hh-mm A"));
      formData.append("user", user.fullname);
      formData.append("note", note);
      formData.append("projectVehicleFlag", projVehFlag.value);

      formData.append("job", projVehFlag.value == "Project" ? job.value : "");
      formData.append(
        "vehicle",
        projVehFlag.value == "Vehicle" ? vehicle.value : ""
      );
      formData.append("checkedOut", checkedOut == "" ? "" : checkedOut.value);
      axios
        .post(`${apiPath.prodPath}/api/toolTrack/addToolTrack/`, formData)
        .then((res) => {
          if (res.data && res.data.error) {
            Swal.fire({
              icon: "error",
              text: "Error adding Tool Track data please try again",
              showConfirmButton: true,
              confirmButtonText: "OK",
              confirmButtonColor: "orange",
            });
          }
          Swal.fire({
            icon: "success",
            text: "Tool track data added successfully.",
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonColor: "orange",
          }).then((result) => {
            if (result.isConfirmed) {
              refreshData();
              resetValues();
              onClose();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const handleFile = (e) => {
    if (editFlag) {
      setNewFileFlag(true);
      setFileUpload(e.target.files[0]);
    } else {
      setFileUpload(e.target.files[0]);
    }
  };
  const resetValues = () => {
    setFileUpload("");
    setJob("");
    setTechAssigned("");
    setToolNo("");
    setNote("");
    setLocation("");
    setCheckedOut("");
    setNewFileFlag(false);
    setOldFile("");
  };
  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={onClose}
      className="tools-drawer"
    >
      <div className={`${poppins.className} w-full flex flex-col p-10`}>
        <h1 className="flex flex-row gap-x-3 font-bold text-2xl">
          <span
            onClick={() => onClose()}
            className="flex flex-col justify-center align-middle"
          >
            <Image src={"/back.png"} width={12} height={21} alt="Back" />
          </span>
          {editFlag ? "Edit Tool Track" : "Add Tool Track"}
        </h1>
        {/* <div className="top">
          <h1>Add Tool Track</h1>
          <p onClick={onClose}>&#10005;</p>
        </div> */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-row gap-5 flex-wrap w-full mt-9"
        >
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Tool #</label>
            <Select
              options={toolNoOpt}
              onChange={(e) => setToolNo(e)}
              id="tool-track-select-1"
              value={toolNo}
              required={true}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Assigned To</label>
            <Select
              options={techAssignedOpt}
              onChange={(e) => setTechAssigned(e)}
              id="tool-track-select-2"
              value={techAssigned}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Location</label>
            <input
              type="text"
              className="p-2 cus-tool-form"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Checked Out For</label>
            <Select
              options={checkedOutOpt}
              onChange={(e) => setCheckedOut(e)}
              id="tool-track-select-3"
              value={checkedOut}
              required={true}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Project / Vehicle / Shop</label>
            <Select
              options={[
                { label: "Project", value: "Project" },
                { label: "Vehicle", value: "Vehicle" },
                { label: "Shop", value: "Shop" },
              ]}
              onChange={(v) => {
                setJob("");
                setVehicle("");
                setProjVehFlag(v);
              }}
              id="tool-select-3"
              value={projVehFlag}
              required={true}
            />
          </div>
          {projVehFlag.value == "Project" ? (
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Project</label>
              <Select
                options={jobOpt}
                onChange={(v) => setJob(v)}
                id="tool-select-3"
                value={job}
                required={true}
              />
            </div>
          ) : null}
          {projVehFlag.value == "Vehicle" ? (
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Vehicle</label>
              <Select
                options={vehicleOpt}
                onChange={(v) => setVehicle(v)}
                id="tool-select-3"
                value={vehicle}
                required={true}
              />
            </div>
          ) : null}
          {/* <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Job</label>
            <input
              type="text"
              className="p-2 cus-tool-form"
              onChange={(e) => setJob(e.target.value)}
              value={job}
            />
          </div> */}
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Note</label>
            <input
              type="text"
              className="p-2 cus-tool-form"
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Picture</label>
            <input type="file" onChange={handleFile} name="files" />
            {editFlag && fileUpload !== undefined ? (
              <img src={fileUpload.fileUrl} style={{ width: "30%" }} />
            ) : null}
          </div>
          <div className="flex flex-row gap-5 justify-end w-full mt-10">
            <input
              className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
              type="submit"
              value={editFlag ? "Save" : "Add Tools"}
            />
            {editFlag ? (
              <button
                className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </Drawer>
  );
}

export default ToolTrackDrawer;
