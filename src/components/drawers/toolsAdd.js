import { Drawer } from "@mui/material";
import React, { useState, useEffect } from "react";
import { heicTo } from "heic-to";
// import { DatePicker } from "react-rainbow-components";
import "./style.scss";
// import { useSelector } from "react-redux";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Select from "react-select";
import Swal from "sweetalert2";
import Image from "next/image";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import moment from "moment";
import useStore from "@/utils/store/store";

function ToolsDrawer({
  open,
  onClose,
  addTool,
  editTool,
  id,
  edit,
  data,
  addToToolHistory,
}) {
  const currentUser = useStore((state) => state.user);
  const [category, setCategory] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [techAssigned, setTechAssigned] = useState({
    label: "SHOP",
    value: "SHOP",
  });
  const [toolDescriptionOpt, setToolDescriptionOpt] = useState([]);

  const [location, setLocation] = useState("Shop");
  const [categoryOpt, setCategoryOpt] = useState("");
  const [subCatLoader, setSubCatLoader] = useState(false);
  const [toolDescLoader, setToolDescLoader] = useState(false);
  // const [allSubCatOpt, setAllSubCatOpt] = useState("");
  const [techAssignOpt, setTechAssignOpt] = useState("");
  const [subCatOpt, setSubCatOpt] = useState("");
  const [filteredCatOpt, setFilteredCatOpt] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [employee, setEmployee] = useState("");
  const [project, setProject] = useState("Shop");
  const [lastPurchasePrice, setLastPurchasePrice] = useState("");
  const [pictureUpload, setPictureUpload] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [toolNumber, setToolNumber] = useState("");
  const [serial, setSerial] = useState("");
  const [newFileFlag, setNewFileFlag] = useState(false);
  const [oldFile, setOldFile] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyExpDate, setWarrantyExpDate] = useState("");
  const [brandOpt, setBrandOpt] = useState([]);
  const [brand, setBrand] = useState([]);
  const [job, setJob] = useState();
  const [jobOpt, setJobOpt] = useState([]);
  const [vehicle, setVehicle] = useState();
  const [vehicleOpt, setVehicleOpt] = useState([]);
  const [status, setStatus] = useState({ label: "Active", value: "Active" });
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
      .get(`${apiPath.prodPath}/api/toolDescription/`)
      .then((res) => {
        const sorted = res.data.toolDescription
          .map((i) => {
            return {
              label: i.name,
              value: i.name,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setToolDescriptionOpt(sorted);
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
      .get(`${apiPath.prodPath}/api/toolCategory/`)
      .then((res) => {
        const mapped = res.data.toolCategory.map((i) => ({
          label: i.name,
          value: i.name,
        }));
        const filteredMap = mapped.filter((i) => i.label !== "");
        setCategoryOpt(
          filteredMap.sort((a, b) => a.label.localeCompare(b.label))
        );
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/brand/`)
      .then((res) => {
        const mapped = res.data.brands.map((i) => ({
          label: i.name,
          value: i.name,
        }));
        const filteredMap = mapped.filter((i) => i.label !== "");
        setBrandOpt(filteredMap.sort((a, b) => a.label.localeCompare(b.label)));
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/subtoolCategory/`)
      .then((res) => {
        if (edit) {
          const dataObj =
            res.data &&
            res.data.subtoolCategorys &&
            res.data.subtoolCategorys
              .map((i) => ({
                label: i.name,
                value: i.name,
                parentCategory: i.parentCategory,
              }))
              .filter((i) => i.parentCategory == data.category);
          setFilteredCatOpt(
            dataObj.sort((a, b) => a.label.localeCompare(b.label))
          );
        } else {
          const data =
            res.data &&
            res.data.subtoolCategorys &&
            res.data.subtoolCategorys
              .map((i) => ({
                label: i.name,
                value: i.name,
                parentCategory: i.parentCategory,
              }))
              .sort((a, b) =>
                a.label.localeCompare(b.label, undefined, { numeric: true })
              );
          setFilteredCatOpt(data);
        }
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        setTechAssignOpt(
          res.data.allUsers
            .map((i) => ({
              label: i.fullname,
              value: i.fullname,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
          // .filter((i) => i.userType == "foreman")
        );
      })
      .catch((err) => console.log(err));
    setEmployee({
      label:
        currentUser !== null &&
        currentUser.fullname !== undefined &&
        currentUser.fullname,
      value:
        currentUser !== null &&
        currentUser.fullname !== undefined &&
        currentUser.fullname,
    });
    if (edit) {
      setCategory({ label: data.category, value: data.category });
      setToolDescription({
        label: data.toolDescription,
        value: data.toolDescription,
      });
      setProjVehFlag({
        label: data.projectVehicleFlag,
        value: data.projectVehicleFlag,
      });
      setJob(
        data.projectVehicleFlag == "Project"
          ? { label: data.job, value: data.job }
          : ""
      );
      setVehicle(
        data.projectVehicleFlag == "Vehicle"
          ? { label: data.vehicle, value: data.vehicle }
          : ""
      );
      setStatus({ label: data.status, value: data.status });
      setTechAssigned({ label: data.techAssigned, value: data.techAssigned });
      setLocation(data.location);
      setSubCategory({ label: data.subCategory, value: data.subCategory });
      setEmployee({ label: data.employee, value: data.employee });
      setProject(data.project);
      setPictureUpload(data.picture !== undefined ? data.picture : undefined);
      setPreviewUrl(data.picture !== undefined ? data.picture.fileUrl : "");
      setOldFile(data.picture !== undefined ? data.picture : undefined);
      setToolNumber(data.toolNumber);
      setBrand({ label: data.brand, value: data.brand });
      setPurchaseDate(
        data.purchaseDate == undefined || data.purchaseDate == "undefined"
          ? ""
          : moment(data.purchaseDate).format("yyyy-MM-DD")
      );
      setWarrantyExpDate(
        data.warrantyExpDate == undefined || data.warrantyExpDate == "undefined"
          ? ""
          : moment(data.warrantyExpDate).format("yyyy-MM-DD")
      );
      setSerial(data.serial);
      setLastPurchasePrice(data.lastPurchasePrice);
    }
  }, [open]);
  const handleAddTool = (e) => {
    e.preventDefault();
    var oldData = "";
    if (edit) {
      var oldData = {
        category: data.category,
        brand: data.brand,
        techAssigned: data.techAssigned,
        toolDescription: data.toolDescription,
        projectVehicleFlag: data.projectVehicleFlag,
        job: data.job,
        vehicle: data.vehicle,
        location: data.location,
        subCategory: data.subCategory,
        employee: data.employee,
        project: data.project,
        lastPurchasePrice: data.lastPurchasePrice,
        serial: data.serial,
        toolNumber: data.toolNumber,
        purchaseDate: data.purchaseDate,
        warrantyExpDate: data.warrantyExpDate,
        status: data.status,
        picture: data.picture,
      };
    }
    if (pictureUpload == "" || pictureUpload == undefined) {
      Swal.fire({
        icon: "warning",
        text: "Are you sure you want to save without a picture?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "orange",
      }).then((result) => {
        if (result.isConfirmed) {
          if (edit) {
            const formData = new FormData();
            formData.append("toolNumber", toolNumber);
            formData.append("category", category.value);
            formData.append(
              "toolDescription",
              toolDescription.value == undefined ? "" : toolDescription.value
            );
            formData.append("techAssigned", techAssigned.value);
            formData.append("projectVehicleFlag", projVehFlag.value);
            formData.append(
              "job",
              projVehFlag.value == "Project" ? job.value : ""
            );
            formData.append(
              "vehicle",
              projVehFlag.value == "Vehicle" ? vehicle.value : ""
            );
            formData.append("location", location);
            formData.append("subCategory", subCategory.value);
            formData.append("employee", employee.value);
            formData.append("project", project);
            formData.append("lastPurchasePrice", lastPurchasePrice);
            formData.append("purchaseDate", purchaseDate);
            formData.append("warrantyExpDate", warrantyExpDate);
            formData.append("status", status.value);
            formData.append("brand", brand.value);
            formData.append("editFlag", "true");
            if (newFileFlag) {
              formData.append("files", pictureUpload);
              formData.append(
                "oldFiles",
                oldFile == undefined ? undefined : JSON.stringify(oldFile)
              );
            } else {
              formData.append(
                "pictureObj",
                pictureUpload == undefined
                  ? undefined
                  : JSON.stringify(pictureUpload)
              );
            }
            formData.append("serial", serial);
            formData.append("newFileFlag", newFileFlag);
            if (toolNumber !== data.toolNumber) {
              Swal.fire({
                icon: "warning",
                text: "Are you sure you want to change the tool #",
                confirmButtonAriaLabel: "Yes",
                cancelButtonAriaLabel: "No",
                confirmButtonColor: "orange",
              }).then((result) => {
                if (result.isConfirmed) {
                  // addToToolHistory(oldData)
                  editTool(formData, id);
                }
              });
            } else {
              // addToToolHistory(oldData)
              editTool(formData, id);
            }
          } else {
            const formData = new FormData();
            formData.append("toolNumber", toolNumber);
            formData.append("category", category.value);
            formData.append(
              "toolDescription",
              toolDescription.value == undefined ? "" : toolDescription.value
            );
            formData.append("status", status.value);
            formData.append("techAssigned", techAssigned.value);
            formData.append("projectVehicleFlag", projVehFlag.value);

            formData.append(
              "job",
              projVehFlag.value == "Project" ? job.value : ""
            );
            formData.append(
              "vehicle",
              projVehFlag.value == "Vehicle" ? vehicle.value : ""
            );
            formData.append("location", location);
            formData.append("subCategory", subCategory.value);
            formData.append("employee", employee.value);
            formData.append("brand", brand.value);
            formData.append("project", project);
            formData.append("lastPurchasePrice", lastPurchasePrice);
            formData.append("purchaseDate", purchaseDate);
            formData.append("warrantyExpDate", warrantyExpDate);
            formData.append("files", pictureUpload);
            formData.append("serial", serial);
            formData.append("newFileFlag", newFileFlag);
            addTool(formData, dataEntryRefresh, serial);
          }
        }
      });
    } else {
      if (edit) {
        const formData = new FormData();
        formData.append("toolNumber", toolNumber);
        formData.append("category", category.value);
        formData.append(
          "toolDescription",
          toolDescription.value == undefined ? "" : toolDescription.value
        );
        formData.append("techAssigned", techAssigned.value);
        formData.append("projectVehicleFlag", projVehFlag.value);

        formData.append("job", projVehFlag.value == "Project" ? job.value : "");
        formData.append(
          "vehicle",
          projVehFlag.value == "Vehicle" ? vehicle.value : ""
        );
        formData.append("status", status.value);
        formData.append("location", location);
        formData.append("subCategory", subCategory.value);
        formData.append("employee", employee.value);
        formData.append("brand", brand.value);
        formData.append("project", project);
        formData.append("lastPurchasePrice", lastPurchasePrice);
        formData.append("warrantyExpDate", warrantyExpDate);
        formData.append("purchaseDate", purchaseDate);
        formData.append("editFlag", "true");
        if (newFileFlag) {
          formData.append("files", pictureUpload);
          formData.append(
            "oldFiles",
            oldFile == undefined ? undefined : JSON.stringify(oldFile)
          );
        } else {
          formData.append(
            "pictureObj",
            pictureUpload == undefined
              ? undefined
              : JSON.stringify(pictureUpload)
          );
        }
        formData.append("serial", serial);
        formData.append("newFileFlag", newFileFlag);
        if (toolNumber !== data.toolNumber) {
          Swal.fire({
            icon: "warning",
            text: "Are you sure you want to change the tool #",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "orange",
          }).then((result) => {
            if (result.isConfirmed) {
              // addToToolHistory(oldData)
              editTool(formData, id);
            }
          });
        } else {
          // addToToolHistory(oldData)
          editTool(formData, id);
        }
      } else {
        const formData = new FormData();
        formData.append("toolNumber", toolNumber);
        formData.append("category", category.value);
        formData.append(
          "toolDescription",
          toolDescription.value == undefined ? "" : toolDescription.value
        );
        formData.append("techAssigned", techAssigned.value);
        formData.append("projectVehicleFlag", projVehFlag.value);

        formData.append("job", projVehFlag.value == "Project" ? job.value : "");
        formData.append(
          "vehicle",
          projVehFlag.value == "Vehicle" ? vehicle.value : ""
        );
        formData.append("location", location);
        formData.append("subCategory", subCategory.value);
        formData.append("employee", employee.value);
        formData.append("brand", brand.value);
        formData.append("project", project);
        formData.append("lastPurchasePrice", lastPurchasePrice);
        formData.append("purchaseDate", purchaseDate);
        formData.append("warrantyExpDate", warrantyExpDate);
        formData.append("files", pictureUpload);
        formData.append("serial", serial);
        formData.append("status", status.value);
        formData.append("newFileFlag", newFileFlag);
        addTool(formData, dataEntryRefresh, serial);
      }
    }
  };
  const dataEntryRefresh = () => {
    setCategory("");
    toolDescription("");
    setTechAssigned("");
    setEmployee("");
    setLastPurchasePrice("");
    setSubCategory("");
    setPictureUpload("");
    setToolNumber("");
    setProject("");
    setSerial("");
    setPurchaseDate("");
    setWarrantyExpDate("");
    setBrand("");
    setStatus("");
    setJob("");
    setVehicle("");
    setProjVehFlag({ label: "Project", value: "Project" });
  };
  const categoryHandler = (e) => {
    setSubCategory("");
    setToolDescription("");
    setSubCatLoader(true);
    setCategory(e);
    axios
      .get(`${apiPath.prodPath}/api/subtoolCategory/`)
      .then((res) => {
        const dataObj =
          res.data &&
          res.data.subtoolCategorys &&
          res.data.subtoolCategorys
            .map((i) => ({
              label: i.name,
              value: i.name,
              parentCategory: i.parentCategory,
            }))
            .sort((a, b) =>
              a.label.localeCompare(b.label, undefined, { numeric: true })
            );
        let filteredSubOpt;

        filteredSubOpt = dataObj.filter((i) => i.parentCategory == e.value);
        setFilteredCatOpt(filteredSubOpt);
        setSubCatLoader(false);
        // setSubCatOpt(data);
      })
      .catch((err) => {
        setSubCatLoader(true);
        console.log(err);
      });
  };
  const techAssignedHandler = (e) => {
    setTechAssigned(e);
  };
  const handleUpload = async (e) => {
    const filePath = e.target.files[0].name;
    const extension = filePath.split(".").pop();
    if (extension == "heic") {
      const heicFileBlob = e.target.files[0];
      var pngBlob;
      var file;
      try {
        pngBlob = await heicTo({
          blob: heicFileBlob,
          type: "image/jpeg", // Specify the output format as PNG
          quality: 0.8, // Optional: Adjust quality for PNG if needed, though less common than for JPEG
        });

        // 'pngBlob' now contains the converted PNG image data as a Blob
        // You can then use this Blob to display the image, upload it, etc.
        pngBlob.name = e.target.files[0].name;
        file = new File([pngBlob], `${e.target.files[0].name}`);
      } catch (error) {
        console.error("Error converting HEIC to PNG:", error);
      }
      if (edit) {
        setNewFileFlag(true);
        if (file) {
          setPictureUpload(file);
          setPreviewUrl(URL.createObjectURL(file)); // Create URL for thumbnail preview
        } else {
          setPictureUpload("");
          setPreviewUrl("");
        }
      } else {
        if (file) {
          setPictureUpload(file);
          setPreviewUrl(URL.createObjectURL(file)); // Create URL for thumbnail preview
        } else {
          setPictureUpload("");
          setPreviewUrl("");
        }
      }
    } else {
      if (edit) {
        setNewFileFlag(true);
        if (e.target.files[0]) {
          setPictureUpload(e.target.files[0]);
          setPreviewUrl(URL.createObjectURL(e.target.files[0])); // Create URL for thumbnail preview
        } else {
          setPictureUpload("");
          setPreviewUrl("");
        }
      } else {
        if (e.target.files[0]) {
          setPictureUpload(e.target.files[0]);
          setPreviewUrl(URL.createObjectURL(e.target.files[0])); // Create URL for thumbnail preview
        } else {
          setPictureUpload("");
          setPreviewUrl("");
        }
      }
    }
  };
  const handleDigitCheck = (e) => {
    if (e.target.value.length <= 6) {
      setToolNumber(e.target.value);
    }
  };
  const handlePurchaseAmount = (e) => {
    const regex = /^\$?[0-9]+\.?[0-9]?[0-9]?$/;

    if (regex.test(e.target.value)) {
      setLastPurchasePrice(e.target.value);
    } else {
      // If invalid, remove the last entered character to keep the input valid
      setLastPurchasePrice(e.target.value.slice(0, -1));
    }
  };
  const handleToolDescFilter = (e) => {
    setSubCategory(e);
    setToolDescLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/toolDescription/`)
      .then((res) => {
        const sorted = res.data.toolDescription
          .filter((i) => i.parentSubCategory == e.value)
          .map((i) => {
            return {
              label: i.name,
              value: i.name,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setToolDescriptionOpt(sorted);
        setToolDescLoader(false);
      })
      .catch((err) => {
        setToolDescLoader(false);
        console.log(err);
      });
  };
  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={onClose}
      className="tools-drawer"
    >
      <div className="w-full flex flex-col p-10">
        <h1 className="flex flex-row gap-x-3 font-bold text-2xl">
          <span
            onClick={() => onClose()}
            className="flex flex-col justify-center align-middle"
          >
            <Image src={"/back.png"} width={12} height={21} alt="Back" />
          </span>{" "}
          {edit ? "Edit Tool" : "Add A Tool"}
        </h1>
        <form
          className="flex flex-row gap-5 flex-wrap w-full mt-9"
          onSubmit={handleAddTool}
        >
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Tool #</label>
            <input
              value={toolNumber}
              className="p-2 cus-tool-form"
              type="number"
              onChange={handleDigitCheck}
              required={true}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Category</label>
            <Select
              className="z-[60]"
              options={categoryOpt}
              onChange={categoryHandler}
              id="tool-select-1"
              value={category}
              required={true}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Tools</label>
            {subCatLoader ? (
              <p>Loading...</p>
            ) : (
              <Select
                className="z-[59]"
                id="tool-select-2"
                options={filteredCatOpt}
                onChange={(e) => {
                  handleToolDescFilter(e);
                }}
                value={subCategory}
                required={true}
                isDisabled={category.value == undefined ? true : false}
              />
            )}
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Tool Description</label>
            {toolDescLoader ? (
              <p>Loading...</p>
            ) : (
              <Select
                className="z-[58]"
                id="tool-select-2"
                options={toolDescriptionOpt}
                onChange={(e) => {
                  setToolDescription(e);
                }}
                value={toolDescription}
                required={true}
                isDisabled={subCategory.value == undefined ? true : false}
              />
            )}
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Brand</label>
            <Select
              className="z-[57]"
              id="tool-select-2"
              options={brandOpt}
              onChange={(e) => setBrand(e)}
              value={brand}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Tech Assigned</label>
            <Select
              className="z-[56]"
              options={techAssignOpt}
              onChange={techAssignedHandler}
              id="tool-select-3"
              value={techAssigned}
              required={true}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Project / Vehicle / Shop</label>
            <Select
              className="z-[55]"
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
                className="z-50"
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
                className="z-[49]"
                options={vehicleOpt}
                onChange={(v) => setVehicle(v)}
                id="tool-select-3"
                value={vehicle}
                required={true}
              />
            </div>
          ) : null}
          {/* <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Location</label>
            <input
              value={location}
              className="p-2 cus-tool-form"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div> */}
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Entered By</label>
            <Select
              className="z-[48]"
              options={techAssignOpt}
              onChange={(e) => setEmployee(e)}
              value={employee}
              isDisabled={true}
              id="tool-select-4"
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Status</label>
            <Select
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive-Broken", value: "Inactive-Broken" },
              ]}
              className="z-[47]"
              onChange={(e) => setStatus(e)}
              value={status}
              id="tool-select-5"
              required={true}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Location</label>
            <input
              className="p-2 cus-tool-form"
              type="text"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Serial #</label>
            <input
              className="p-2 cus-tool-form"
              type="text"
              onChange={(e) => setSerial(e.target.value)}
              value={serial}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Purchase Date</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="p-2 cus-tool-form"
            />
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => console.log("clicked")}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !purchaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {purchaseDate ? (
                    moment(purchaseDate).format("MM-DD-YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 cus-calendar">
                <Calendar
                  mode="single"
                  selected={purchaseDate}
                  onSelect={(date) => setPurchaseDate(date)}
                />
              </PopoverContent>
            </Popover> */}
            {purchaseDate !== "" ? (
              <p onClick={() => setPurchaseDate("")} className="clear-value">
                Clear
              </p>
            ) : null}
          </div>
          <div className="flex flex-col w-1/4 gap-2 dollar">
            <label className="font-semibold">Last Purchase Price</label>
            <input
              className="p-2 pl-4 cus-tool-form"
              type="text"
              placeholder="$"
              onChange={handlePurchaseAmount}
              value={lastPurchasePrice}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Warranty Exp Date</label>
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => console.log("clicked")}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !warrantyExpDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {warrantyExpDate ? (
                    moment(warrantyExpDate).format("MM-DD-YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 cus-calendar">
                <Calendar
                  mode="single"
                  selected={warrantyExpDate}
                  onSelect={(date) => setWarrantyExpDate(date)}
                />
              </PopoverContent>
            </Popover> */}
            <input
              type="date"
              value={warrantyExpDate}
              onChange={(e) => {
                setWarrantyExpDate(e.target.value);
              }}
              className="p-2 cus-tool-form"
            />
            {warrantyExpDate !== "" ? (
              <p onClick={() => setWarrantyExpDate("")} className="clear-value">
                Clear
              </p>
            ) : null}
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Picture</label>
            <input
              name="files"
              className="p-2 cus-tool-form"
              type="file"
              onChange={handleUpload}
              accept="image/png,image/jpeg,image/heic, .heic"
            />
            {pictureUpload == "" ? null : (
              <img
                src={previewUrl}
                style={{ width: "30%" }}
                alt="Preview Not Available"
              />
            )}
          </div>
          <div className="flex flex-row gap-5 justify-end w-full mt-10">
            <input
              className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
              type="submit"
              value={"Save"}
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

export default ToolsDrawer;
