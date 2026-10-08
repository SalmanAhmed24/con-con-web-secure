import { Drawer } from "@mui/material";
import { Poppins } from "next/font/google";
import "./style.scss";
import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import Image from "next/image";
import Select from "react-select";

const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
function NeedTagDrawer({
  refreshData,
  addBadge,
  open,
  onClose,
  edit,
  editData,
  editBadge,
}) {
  const [badge, setBadge] = useState("");
  const [badgeStatus, setBadgeStatus] = useState([]);
  const [badgeType, setBadgeType] = useState([]);
  const [employee, setEmployee] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateIssued, setDateIssued] = useState();
  const [sponsored, setSponsored] = useState("");
  const [escorting, setEscorting] = useState("");
  const [expDate, setExpDate] = useState("");
  const [badgeStatusOpt, setBadgeStatusOpt] = useState([]);
  const [badgeTypeOpt, setBadgeTypeOpt] = useState([]);
  const [generalContractorOpt, setGeneralContractorOpt] = useState([]);
  const [generalContractor, setGeneralContractor] = useState();
  const [employeeOpt, setEmployeeOpt] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const sorted = res.data.allUsers
          .map((i) => {
            return {
              label: i.fullname,
              value: i.fullname,
              email: i.email,
              phone: i.personalPhone,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setEmployeeOpt(sorted);
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/badgeType/`)
      .then((res) => {
        const sorted = res.data.BadgeTypes.map((i) => {
          return { label: i.name, value: i.name };
        }).sort((a, b) => a.label.localeCompare(b.label));
        setBadgeTypeOpt(sorted);
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/badgeStatus/`)
      .then((res) => {
        const sorted = res.data.BadgeStatus.map((i) => {
          return { label: i.name, value: i.name };
        }).sort((a, b) => a.label.localeCompare(b.label));
        setBadgeStatusOpt(sorted);
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/generalContract/`)
      .then((res) => {
        const sorted = res.data.generalContracts
          .map((i) => {
            return { label: i.companyName, value: i.companyName };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setGeneralContractorOpt(sorted);
      })
      .catch((err) => console.log(err));
    if (edit) {
      setBadge(editData.badge);
      setBadgeStatus({
        label: editData.badgeStatus,
        value: editData.badgeStatus,
      });
      setBadgeType({ label: editData.badgeType, value: editData.badgeType });
      setEmployee({ label: editData.employee, value: editData.employee });
      setEmail(editData.email);
      setPhone(editData.phone);
      setDateIssued(moment(editData.dateIssued).format("YYYY-MM-DD"));
      setSponsored(
        edit.sponsored == undefined
          ? ""
          : {
              label: editData.sponsored,
              value: editData.sponsored,
            },
      );
      setEscorting(
        editData.escorting == undefined
          ? ""
          : {
              label: editData.escorting,
              value: editData.escorting,
            },
      );
      setGeneralContractor({
        label: editData.generalContractor,
        value: editData.generalContractor,
      });
      setExpDate(moment(editData.expDate).format("YYYY-MM-DD"));
    }
  }, [open]);
  const handleAdd = (e) => {
    e.preventDefault();
    const data = {
      badge,
      badgeStatus: badgeStatus.value,
      badgeType: badgeType.value,
      employee: employee.value,
      phone,
      email,
      dateIssued,
      sponsored: sponsored.value,
      generalContractor:
        sponsored.value == "Yes" ? generalContractor.value : "",
      expDate,
      escorting: escorting.value,
    };

    if (edit) {
      editBadge(data);
      onClose();
    } else {
      addBadge(data);
      onClose();
      dataEntryRefresh();
    }
  };
  const dataEntryRefresh = () => {
    setEmployee("");
    setBadge("");
    setBadgeType("");
    setBadgeStatus("");
    setPhone("");
    setEmail("");
    setDateIssued("");
    setEscorting("");
    setSponsored("");
    setGeneralContractor("");
    setExpDate("");
  };
  const handleEmp = (e) => {
    setEmployee(e);
    setEmail(e.email);
    setPhone(e.phone);
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
          {edit ? "Edit" : "Add Badge"}
        </h1>
        <form
          onSubmit={handleAdd}
          className="flex flex-row gap-5 flex-wrap w-full mt-9"
        >
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Badge#</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => {
                setBadge(e.target.value);
              }}
              className="p-2 cus-tool-form"
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Badge Status</label>
            <Select
              options={badgeStatusOpt}
              onChange={(e) => setBadgeStatus(e)}
              value={badgeStatus}
              styles={{ zIndex: "45" }}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Badge Type</label>
            <Select
              options={badgeTypeOpt}
              onChange={(e) => setBadgeType(e)}
              value={badgeType}
              styles={{ zIndex: "44" }}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Employee</label>
            <Select
              options={employeeOpt}
              onChange={(e) => handleEmp(e)}
              value={employee}
              styles={{ zIndex: "41" }}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              className="p-2 cus-tool-form"
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="p-2 cus-tool-form"
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Date Issued</label>
            <input
              type="date"
              value={dateIssued}
              onChange={(e) => {
                setDateIssued(e.target.value);
              }}
              className="p-2 cus-tool-form"
            />
            {dateIssued !== "" ? (
              <p onClick={() => setDateIssued("")} className="clear-value">
                Clear
              </p>
            ) : null}
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Sponsored</label>
            <Select
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              onChange={(e) => setSponsored(e)}
              value={sponsored}
              styles={{ zIndex: "40" }}
              required={true}
            />
          </div>
          {sponsored !== "" && sponsored.value == "Yes" ? (
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">General Contractor</label>
              <Select
                options={generalContractorOpt}
                onChange={(e) => setGeneralContractor(e)}
                value={generalContractor}
                styles={{ zIndex: "43" }}
              />
            </div>
          ) : null}
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Escorting</label>
            <Select
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              onChange={(e) => setEscorting(e)}
              value={escorting}
              styles={{ zIndex: "40" }}
              required={true}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Expiration Date</label>
            <input
              type="date"
              value={expDate}
              onChange={(e) => {
                setExpDate(e.target.value);
              }}
              className="p-2 cus-tool-form"
            />
            {expDate !== "" ? (
              <p onClick={() => setExpDate("")} className="clear-value">
                Clear
              </p>
            ) : null}
          </div>
          <div className="flex flex-row gap-5 justify-end w-full mt-10">
            <input
              className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
              type="submit"
              value={edit ? "Save" : "Add Badge"}
            />
            {edit ? (
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

export default NeedTagDrawer;
