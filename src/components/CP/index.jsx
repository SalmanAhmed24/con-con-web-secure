"use client";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPath } from "@/utils/routes";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import Swal from "sweetalert2";

import { FileUploader } from "react-drag-drop-files";
import CertifiedPayTable from "../tables/certifiedPayTable";
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
const fileTypes = ["JPG", "PNG", "GIF", "PDF"];
function CPComponent({ item }) {
  const [active, setActive] = useState(false);
  const [CP, setCP] = useState(false);
  const [generalContractor, setGeneralContractor] = useState("");
  const [gncOpt, setGncOpt] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [frequency, setFrequency] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [allCP, setAllCP] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [oldFiles, setOldFiles] = useState("");
  const [newFileFlag, setNewFileFlag] = useState(false);
  const [fileName, setFileNames] = useState([]);
  const [editFlag, setEditFlag] = useState(false);
  const [jobName, setJobName] = useState(item.jobName);
  const [jobNumber, setJobNumber] = useState(item.jobNumber);
  const [CPId, setCPId] = useState(item.jobNumber);

  useEffect(() => {
    console.log("this is item", item);
    axios
      .get(`${apiPath.prodPath}/api/generalContract`)
      .then((res) => {
        setGncOpt(
          res.data.generalContracts.map((i) => ({
            label: i.companyName,
            value: i.companyName,
          })),
        );
      })
      .catch((err) => console.log(err));
    setLoader(true);

    axios
      .get(`${apiPath.prodPath}/api/certifiedPay`)
      .then((res) => {
        setAllCP(res.data.certifiedPays);
        setLoader(false);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleActive = (e) => {
    setActive(e.target.checked);
  };
  const handleCP = (e) => {
    setCP(e.target.checked);
  };
  const handleCPForm = (e) => {
    e.preventDefault();

    if (editFlag && newFileFlag) {
      const formData = new FormData();
      formData.append("CP", CP);
      formData.append("active", active);
      formData.append(
        "generalContractor",
        generalContractor == "" ? "" : generalContractor.value,
      );
      formData.append("frequency", frequency == "" ? "" : frequency.value);
      formData.append("startDate", startDate);
      formData.append("jobName", item.jobName);
      formData.append("jobNumber", item.jobNumber);
      formData.append("address", address);
      formData.append("contact", contact);
      formData.append("deliveryMethod", deliveryMethod);
      formData.append("oldFiles", JSON.stringify(oldFiles));
      formData.append("newFileFlag", newFileFlag);
      for (let i = 0; i < fileUpload.length; i++) {
        formData.append("files", fileUpload[i]);
      }
      axios({
        method: "patch",
        url: `${apiPath.prodPath}/api/certifiedPay/${CPId}`,
        data: formData,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (res.data.error) {
            Swal.fire({
              icon: "error",
              text: "Unable to Edit",
            });
          } else {
            Swal.fire({
              icon: "success",
              text: "Edited Successfully",
            });
            refreshData();
            dataEntryRefresh();
          }
          // onClose();
        })
        .catch((err) => console.log(err));
    } else if (editFlag && newFileFlag == false) {
      const formData = new FormData();
      formData.append("CP", CP);
      formData.append("active", active);
      formData.append(
        "generalContractor",
        generalContractor == "" ? "" : generalContractor.value,
      );
      formData.append("frequency", frequency == "" ? "" : frequency.value);
      formData.append("startDate", startDate);
      formData.append("jobName", item.jobName);
      formData.append("jobNumber", item.jobNumber);
      formData.append("address", address);
      formData.append("contact", contact);
      formData.append("deliveryMethod", deliveryMethod);
      formData.append("newFileFlag", newFileFlag);
      formData.append("editFlag", editFlag);
      formData.append("oldFiles", JSON.stringify(oldFiles));
      axios({
        method: "patch",
        url: `${apiPath.prodPath}/api/certifiedPay/${CPId}`,
        data: formData,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (res.data.error) {
            Swal.fire({
              icon: "error",
              text: "Unable to Edit",
            });
          } else {
            Swal.fire({
              icon: "success",
              text: "Edited Successfully",
            });
            refreshData();
            dataEntryRefresh();
            // dataEntryRefresh();
            // onClose();
          }
        })
        .catch((err) => console.log(err));
    } else {
      const formData = new FormData();
      formData.append("CP", CP);
      formData.append("active", active);
      formData.append(
        "generalContractor",
        generalContractor == "" ? "" : generalContractor.value,
      );
      formData.append("frequency", frequency == "" ? "" : frequency.value);
      formData.append("startDate", startDate);
      formData.append("jobName", item.jobName);
      formData.append("jobNumber", item.jobNumber);
      formData.append("address", address);
      formData.append("contact", contact);
      formData.append("deliveryMethod", deliveryMethod); // formData.append("files", fileUpload);
      for (let i = 0; i < fileUpload.length; i++) {
        formData.append("files", fileUpload[i]);
      }
      axios({
        method: "post",
        url: `${apiPath.prodPath}/api/certifiedPay/addCertifiedPay`,
        data: formData,
        withCredentials: false,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          if (res.data.error) {
            Swal.fire({
              icon: "error",
              text: `${res.data.message}`,
              confirmButtonColor: "orange",
            });
          } else {
            Swal.fire({
              icon: "success",
              text: "Added Successfully",
            });
            refreshData();
            dataEntryRefresh();
            // onClose();
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const dataEntryRefresh = () => {
    setActive(false);
    setCP(false);
    setAddress("");
    setContact("");
    setDeliveryMethod("");
    setEditFlag(false);
    setFileNames("");
    setGeneralContractor("");
    setFrequency("");
    setStartDate("");
  };
  const refreshData = () => {
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/certifiedPay`)
      .then((res) => {
        setAllCP(res.data.certifiedPays);
        setLoader(false);
      })
      .catch((err) => console.log(err));
  };
  const fileHandler = (newfiles) => {
    setFileNames([]);
    setNewFileFlag(true);
    setFileUpload(newfiles);
    Object.values(newfiles).forEach((val) => {
      setFileNames((prevVal) => [val.name, ...prevVal]);
    });
  };
  const getEditData = (data, id) => {
    setCPId(id);
    setFileNames([]);
    setCP(data.CP);
    setActive(data.active);
    setGeneralContractor({
      label: data.generalContractor,
      value: data.generalContractor,
    });
    setFrequency({ label: data.frequency, value: data.frequency });
    setAddress(data.address);
    setContact(data.contact);
    setJobName(data.jobName);
    setJobNumber(data.jobNumber);
    setDeliveryMethod(data.deliveryMethod);
    setEditFlag(true);
    setStartDate(data.startDate);
    setFileUpload(data.attachments);
    setOldFiles(data.attachments.length ? data.attachments : []);
    Object.values(data.attachments).forEach((val) => {
      setFileNames((prevVal) => [val.filename, ...prevVal]);
    });
  };
  console.log("these are fileNames", fileName);
  return (
    <section className={`${poppins.className} employee-wrap`}>
      <form className="flex flex-col pb-5" onSubmit={handleCPForm}>
        <div className="flex flex-row gap-2 w-full">
          <div className="flex flex-col w-[100px] gap-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={active}
                  onChange={handleActive}
                  inputProps={{ "aria-label": "controlled" }}
                  value={"Active"}
                />
              }
              label="Active"
            />
          </div>
          <div className="flex flex-col w-[100px] gap-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={CP}
                  onChange={handleCP}
                  inputProps={{ "aria-label": "controlled" }}
                  value={"CP"}
                />
              }
              label="CP"
            />
          </div>
        </div>
        {CP ? (
          <div className="flex flex-row flex-wrap pt-2 gap-2 w-full">
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">General Contractor</label>
              <Select
                options={gncOpt}
                onChange={(v) => setGeneralContractor(v)}
                id="job-select-3"
                value={generalContractor}
                className={poppins.className}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Job Name</label>
              <input
                type="text"
                value={jobName}
                disabled={true}
                className={`${poppins.className} p-2 cus-tool-form`}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Job#</label>
              <input
                type="text"
                value={jobNumber}
                disabled={true}
                className={`${poppins.className} p-2 cus-tool-form`}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(d) => setStartDate(d.target.value)}
                className={`${poppins.className} p-2 cus-tool-form`}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`${poppins.className} p-2 cus-tool-form`}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Contact</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`${poppins.className} p-2 cus-tool-form`}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Frequency</label>
              <Select
                options={[
                  { label: "Weekly", value: "Weekly" },
                  { label: "Monthly", value: "Monthly" },
                ]}
                onChange={(v) => setFrequency(v)}
                id="job-select-3"
                value={frequency}
                className={poppins.className}
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label className="font-semibold">Delivery Method</label>
              <textarea
                rows={5}
                type="text"
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className={`${poppins.className} p-2 cus-tool-form`}
              />
            </div>
            <div className="single-inp">
              <label className="font-semibold">Files</label>
              <FileUploader
                multiple={true}
                handleChange={fileHandler}
                name="files"
                types={fileTypes}
                required={fileUpload == null ? true : false}
                fileOrFiles={fileUpload}
              />
              {editFlag == false && fileName.length
                ? fileName.map((inner, index) => {
                    return <p key={index}>{inner}</p>;
                  })
                : null}
              {editFlag == true && newFileFlag && fileName.length
                ? fileName.map((inner, index) => {
                    return <p key={index}>{inner}</p>;
                  })
                : null}
              {oldFiles.length && editFlag && newFileFlag == false
                ? oldFiles.map((i, ind) => (
                    <p
                      key={`${i.filename}${i.ind}`}
                      style={{ fontSize: "14px" }}
                    >
                      {i.filename}
                    </p>
                  ))
                : null}
            </div>
            <div className="flex flex-col w-full gap-2 justify-start">
              <input
                type="submit"
                value={editFlag ? "Save" : "Add CP"}
                className={`${poppins.className} p-2 bg-orange-400 text-white rounded-[5px] font-semibold self-start hover:cursor-pointer`}
              />
            </div>
          </div>
        ) : null}
      </form>
      {loader ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[300px] w-[500px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <CertifiedPayTable
          certifiedPay={allCP}
          loading={loader}
          refreshData={refreshData}
          getEditData={(data, id) => getEditData(data, id)}
        />
      )}
    </section>
  );
}

export default CPComponent;
