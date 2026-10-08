import { Drawer, Skeleton } from "@mui/material";
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
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { format, parseISO } from "date-fns";
function RequestToolHistory({ editTool, edit, addToToolHistory }) {
  const currentUser = useStore((state) => state.user);
  const [category, setCategory] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [techAssigned, setTechAssigned] = useState({
    label: "SHOP",
    value: "SHOP",
  });
  const [toolLoading, setToolLoading] = useState(false);
  const [toolDescriptionOpt, setToolDescriptionOpt] = useState([]);
  const [location, setLocation] = useState("");
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
  const [fileArr, setFileArr] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [checkedOut, setCheckedOut] = useState(30);
  const [status, setStatus] = useState({ label: "Active", value: "Active" });
  const [fileLoader, setFileLoader] = useState(false);
  const [toolNumberOpt, setToolNumberOpt] = useState([]);
  const [oldDataObj, setOldDataObj] = useState("");
  const [toolId, setToolId] = useState("");
  const [projVehFlag, setProjVehFlag] = useState({
    label: "Project",
    value: "Project",
  });
  useEffect(() => {
    dataEntryRefresh();
    axios
      .get(`${apiPath.prodPath}/api/allTools/`)
      .then((res) => {
        const sortedToolNumbers = res.data.allTools
          .map((i) => {
            return {
              label: `${i.toolNumber} - ${i.toolDescription}`,
              value: `${i.toolNumber}`,
            };
          })
          .sort((a, b) => a.value.localeCompare(b.value));
        setToolNumberOpt(sortedToolNumbers);
      })
      .catch((err) => console.log(err));
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
        // if (edit) {
        //   const dataObj =
        //     res.data &&
        //     res.data.subtoolCategorys &&
        //     res.data.subtoolCategorys
        //       .map((i) => ({
        //         label: i.name,
        //         value: i.name,
        //         parentCategory: i.parentCategory,
        //       }))
        //       .filter((i) => i.parentCategory == data.category);
        //   setFilteredCatOpt(
        //     dataObj.sort((a, b) => a.label.localeCompare(b.label))
        //   );
        // } else {
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
        // }
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
  }, [open]);
  // const dateCalculator = (dateVal, checkedOut) => {
  //   var date = new Date(dateVal);
  //   date.setDate(date.getDate() + Number(checkedOut));
  //   var finalDate =
  //     date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
  //   var checkedOutDate = new Date(finalDate);
  //   var currentDate = new Date();
  //   var currentDateMS = currentDate.getTime();
  //   console.log("checkedout time", checkedOutDate.getDate());
  //   console.log("currentDate", currentDate.getDate());
  //   if (checkedOutDate.getTime() < currentDateMS) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };
  const calDueDate = (dateVal, checkedOut) => {
    var date = new Date(dateVal);
    date.setDate(date.getDate() + Number(checkedOut));
    var finalDate =
      date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

    setDueDate(finalDate);
    return finalDate;
  };
  const handleAddTool = (e) => {
    e.preventDefault();
    calDueDate(purchaseDate, checkedOut);
    if (fileArr.length == 0) {
      // Swal.fire({
      //   icon: "warning",
      //   text: "Are you sure you want to save without a picture?",
      //   confirmButtonText: "Yes",
      //   cancelButtonText: "No",
      //   showCancelButton: true,
      //   showConfirmButton: true,
      //   confirmButtonColor: "orange",
      // })
      //.then((result) => {
      //if (result.isConfirmed) {
      const formData = new FormData();

      formData.append("toolNumber", toolNumber.value);
      formData.append("dueDate", calDueDate(purchaseDate, checkedOut));

      formData.append("category", category.value);
      formData.append(
        "toolDescription",
        toolDescription.value == undefined ? "" : toolDescription.value
      );
      formData.append("status", status.value);
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
      formData.append("project", job.value == "" ? "" : job.value);
      formData.append("lastPurchasePrice", lastPurchasePrice);
      formData.append("purchaseDate", format(purchaseDate, "yyyy-MM-dd"));
      formData.append("warrantyExpDate", format(warrantyExpDate, "yyyy-MM-dd"));
      formData.append("files", JSON.stringify(fileArr));
      formData.append("serial", serial);
      formData.append("checkedOut", checkedOut);
      formData.append("newFileFlag", newFileFlag ? "true" : "false");
      formData.append("editFlag", edit ? "true" : "false");

      if (edit) {
        addToToolHistory(oldDataObj);
        editTool(formData, toolId, techAssigned.value, toolNumber.label);
      }
      //}
      //}
      //);
    } else {
      if (edit) {
        const formData = new FormData();

        formData.append("toolNumber", toolNumber.value);
        formData.append("dueDate", calDueDate(purchaseDate, checkedOut));

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
        formData.append("project", job.value == "" ? "" : job.value);
        formData.append("lastPurchasePrice", lastPurchasePrice);
        formData.append(
          "warrantyExpDate",
          format(warrantyExpDate, "yyyy-MM-dd")
        );
        formData.append("purchaseDate", format(purchaseDate, "yyyy-MM-dd"));
        formData.append("checkedOut", checkedOut);
        formData.append("editFlag", "true");
        formData.append("newFileFlag", newFileFlag ? "true" : "false");
        formData.append(
          "oldFiles",
          newFileFlag
            ? Array.isArray(data.picture)
              ? data.picture.length
                ? JSON.stringify(data.picture)
                : []
              : JSON.stringify([data.picture])
            : JSON.stringify([])
        );
        formData.append(
          "files",
          fileArr.length ? JSON.stringify(fileArr) : JSON.stringify([])
        );
        // if (newFileFlag) {
        //   formData.append("newFileFlag", "true");
        //   formData.append("files", JSON.stringify(fileArr));
        //   formData.append(
        //     "oldFiles",
        //     Array.isArray(data.picture)
        //       ? data.picture.length
        //         ? JSON.stringify(data.picture)
        //         : []
        //       : JSON.stringify([data.picture])
        //   );
        // } else {
        //   formData.append("newFileFlag", "false");
        //   formData.append("oldFiles", JSON.stringify([]));
        //   formData.append(
        //     "files",
        //     fileArr.length == 0 ? [] : JSON.stringify(fileArr)
        //   );
        // }
        formData.append("serial", serial);
        // formData.append("newFileFlag", newFileFlag);
        addToToolHistory(oldDataObj);
        editTool(
          formData,
          toolId,
          techAssigned.value,
          toolNumber.value,
          toolDescription.value
        );
      }
    }
  };
  const dataEntryRefresh = () => {
    setCategory("");
    setTechAssigned("");
    setFileArr([]);
    setToolDescription("");
    setCheckedOut(30);
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
    setStatus({ label: "Active", value: "Active" });
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
  const handleDeleteFile = (e, file) => {
    e.preventDefault();
    Swal.fire({
      icon: "warning",
      text: "Are you sure you want to delete this picture. This action is irreversible",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "orange",
    }).then((result) => {
      if (result.isConfirmed) {
        const remainingFiles = fileArr.filter((i) => i !== file);
        setFileArr(remainingFiles);
        const dataObj = {
          edit: edit,
          file: file,
          id: data.id,
          remainingFiles: remainingFiles,
        };
        axios
          .delete(`${apiPath.prodPath}/api/allTools/deletePicture`, {
            data: dataObj,
          })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    });
    // const filteredFileArr = fileArr.filter((i) => i == file);
  };
  const handleUpload = async (e) => {
    setFileLoader(true);
    var checkFileExt = e.target.files[0].name.split(".").pop();
    if (checkFileExt == "heic") {
      var fileReduced = new File(
        [e.target.files[0]],
        `${e.target.files[0].name}`
      );
      const heicFileBlob = fileReduced;
      var pngBlob;
      var file;
      try {
        pngBlob = await heicTo({
          blob: heicFileBlob,
          type: "image/jpeg", // Specify the output format as PNG
          quality: 0.5, // Optional: Adjust quality for PNG if needed, though less common than for JPEG
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
          const formData = new FormData();
          formData.append("files", file);
          axios
            .post(`${apiPath.prodPath}/api/allTools/uploadPicture`, formData)
            .then((res) => {
              setFileArr((prev) => [res.data.file[0], ...prev]);
              setFileLoader(false);
            })
            .catch((error) => console.log(error));
          setPictureUpload(file);
          setPreviewUrl(URL.createObjectURL(file)); // Create URL for thumbnail preview
        } else {
          setPictureUpload("");
          setPreviewUrl("");
        }
      } else {
        if (file) {
          const formData = new FormData();
          formData.append("files", file);
          axios
            .post(`${apiPath.prodPath}/api/allTools/uploadPicture`, formData)
            .then((res) => {
              setFileArr((prev) => [res.data.file[0], ...prev]);
              setFileLoader(false);
            })
            .catch((error) => console.log(error));
          setPictureUpload(file);
          setPreviewUrl(URL.createObjectURL(file)); // Create URL for thumbnail preview
        } else {
          setPictureUpload("");
          setPreviewUrl("");
        }
      }
    } else {
      reduceSize(e.target.files[0], {
        // 0: is maximum compression
        // 1: is no compression
        quality: 0.5,

        // We want a JPEG file
        type: "image/jpeg",
      })
        .then(async (res) => {
          var fileReducedNew = new File([res], `${e.target.files[0].name}`);
          if (edit) {
            setNewFileFlag(true);
            if (fileReducedNew) {
              const formData = new FormData();
              formData.append("files", fileReducedNew);
              axios
                .post(
                  `${apiPath.prodPath}/api/allTools/uploadPicture`,
                  formData
                )
                .then((res) => {
                  setFileArr((prev) => [res.data.file[0], ...prev]);
                  setFileLoader(false);
                })
                .catch((error) => console.log(error));
              setPictureUpload(e.target.files[0]);
              setPreviewUrl(URL.createObjectURL(fileReducedNew)); // Create URL for thumbnail preview
            } else {
              setPictureUpload("");
              setPreviewUrl("");
            }
          } else {
            if (fileReducedNew) {
              const formData = new FormData();
              formData.append("files", fileReducedNew);
              axios
                .post(
                  `${apiPath.prodPath}/api/allTools/uploadPicture`,
                  formData
                )
                .then((res) => {
                  setFileArr((prev) => [res.data.file[0], ...prev]);
                  setFileLoader(false);
                })
                .catch((error) => console.log(error));
              setPictureUpload(e.target.files[0]);
              setPreviewUrl(URL.createObjectURL(fileReducedNew)); // Create URL for thumbnail preview
            } else {
              setPictureUpload("");
              setPreviewUrl("");
            }
          }
        })
        .catch((err) => console.log(err));
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
  const reduceSize = async (file, { quality = 1, type = file.type }) => {
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Draw to canvas
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    return await new Promise((resolve) =>
      canvas.toBlob(resolve, type, quality)
    );
  };
  const handleToolNumber = (e) => {
    setToolNumber(e);
    setToolLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/allTools/${e.value}&&toolNo`)
      .then((res) => {
        const resObj = res.data.allTools[0];
        setToolId(resObj.id);
        const oldData = {
          category: resObj.category,
          brand: resObj.brand,
          techAssigned: resObj.techAssigned,
          toolDescription: resObj.toolDescription,
          projectVehicleFlag: resObj.projectVehicleFlag,
          job: resObj.job,
          vehicle: resObj.vehicle,
          location: resObj.location,
          subCategory: resObj.subCategory,
          employee: resObj.employee,
          project: resObj.project,
          lastPurchasePrice: resObj.lastPurchasePrice,
          serial: resObj.serial,
          toolNumber: resObj.toolNumber,
          purchaseDate:
            resObj.purchaseDate == ""
              ? format(new Date(), "yyyy-MM-dd")
              : format(resObj.purchaseDate, "yyyy-MM-dd"),
          warrantyExpDate: format(resObj.warrantyExpDate, "yyyy-MM-dd"),
          status: resObj.status,
          picture: resObj.picture,
          checkedOut: resObj.checkedOut,
          dueDate: calDueDate(resObj.purchaseDate, resObj.checkedOut),
        };
        setOldDataObj(oldData);
        setCategory({ label: resObj.category, value: resObj.category });
        setSubCategory({
          label: resObj.subCategory,
          value: resObj.subCategory,
        });
        setToolDescription({
          label: resObj.toolDescription,
          value: resObj.toolDescription,
        });
        setBrand({ label: resObj.brand, value: resObj.brand });

        // setTechAssigned({
        //   label: resObj.techAssigned,
        //   value: resObj.techAssigned,
        // });
        // setProjVehFlag({
        //   label: resObj.projectVehicleFlag,
        //   value: resObj.projectVehicleFlag,
        // });
        // setJob(
        //   resObj.job == "" ? "" : { label: resObj.job, value: resObj.job }
        // );
        // setVehicle(
        //   resObj.vehicle == ""
        //     ? ""
        //     : { label: resObj.vehicle, value: resObj.vehicle }
        // );
        // setEmployee({ label: resObj.employee, value: resObj.employee });
        setStatus({ label: resObj.status, value: resObj.status });
        setLocation(resObj.location);
        setSerial(resObj.serial);
        setPurchaseDate(
          resObj.purchaseDate == ""
            ? format(new Date(), "yyyy-MM-dd")
            : format(resObj.purchaseDate, "yyyy-MM-dd")
        );
        setCheckedOut(resObj.checkedOut);
        setLastPurchasePrice(resObj.lastPurchasePrice);
        setWarrantyExpDate(format(resObj.warrantyExpDate, "yyyy-MM-dd"));
        if (Array.isArray(resObj.picture)) {
          setFileArr(resObj.picture);
        }
        if (!Array.isArray(resObj.picture) && resObj.picture !== undefined) {
          const arr = [];
          arr.push(resObj.picture);
          setFileArr(arr);
        }
        setPictureUpload(
          resObj.picture !== undefined ? resObj.picture : undefined
        );
        setPreviewUrl(
          resObj.picture !== undefined ? resObj.picture.fileUrl : ""
        );
        setOldFile(resObj.picture !== undefined ? resObj.picture : undefined);
        axios
          .get(`${apiPath.prodPath}/api/subtoolCategory/`)
          .then((resp) => {
            const dataObj =
              resp.data &&
              resp.data.subtoolCategorys &&
              resp.data.subtoolCategorys
                .map((i) => ({
                  label: i.name,
                  value: i.name,
                  parentCategory: i.parentCategory,
                }))
                .filter((i) => i.parentCategory == resObj.category);
            setFilteredCatOpt(
              dataObj.sort((a, b) => a.label.localeCompare(b.label))
            );
          })
          .catch((err) => console.log(err));
        axios
          .get(`${apiPath.prodPath}/api/toolDescription/`)
          .then((resp) => {
            const dataObj =
              resp.data &&
              resp.data.toolDescription &&
              resp.data.toolDescription
                .map((i) => ({
                  label: i.name,
                  value: i.name,
                  parentCategory: i.parentCategory,
                  subCategory: i.parentSubCategory,
                }))
                .filter((i) => i.subCategory == resObj.subCategory);
            setToolDescriptionOpt(
              dataObj.sort((a, b) => a.label.localeCompare(b.label))
            );
          })
          .catch((err) => console.log(err));
        setToolLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setToolLoading(false);
      });
  };
  return (
    <>
      <div className="w-full flex flex-col p-10">
        {toolLoading ? (
          <p>Loading...</p>
        ) : (
          <form
            className="flex flex-row gap-5 flex-wrap w-full mt-9"
            onSubmit={handleAddTool}
          >
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Tool #</label>
              <Select
                className="z-[61]"
                options={toolNumberOpt}
                onChange={handleToolNumber}
                id="tool-select-1"
                value={toolNumber}
                required={true}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2 display-none">
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
            <div className="flex flex-col w-1/4 gap-2 display-none">
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
            <div className="flex flex-col w-1/4 gap-2 display-none">
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
            <div className="flex flex-col w-1/4 gap-2 display-none">
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
            <div className="flex flex-col w-1/4 gap-2 display-none">
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
            {/* <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Description</label>
            <input
              className="p-2 cus-tool-form"
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div> */}
            <div className="flex flex-col w-1/4 gap-2 display-none">
              <label className="font-semibold">Serial #</label>
              <input
                className="p-2 cus-tool-form"
                type="text"
                onChange={(e) => setSerial(e.target.value)}
                value={serial}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2 display-none">
              <label className="font-semibold">Purchase Date</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="p-2 cus-tool-form"
                required={true}
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
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Checked Out</label>
              <input
                className="p-2 cus-tool-form"
                type="number"
                min={0}
                onChange={(e) => setCheckedOut(e.target.value)}
                value={checkedOut}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2 dollar display-none">
              <label className="font-semibold">Last Purchase Price</label>
              <input
                className="p-2 pl-4 cus-tool-form"
                type="text"
                placeholder="$"
                onChange={handlePurchaseAmount}
                value={lastPurchasePrice}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2 display-none">
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
                required={true}
              />
              {warrantyExpDate !== "" ? (
                <p
                  onClick={() => setWarrantyExpDate("")}
                  className="clear-value"
                >
                  Clear
                </p>
              ) : null}
            </div>
            <div className="flex flex-col w-full gap-2 display-none">
              <label className="font-semibold">Picture</label>
              <input
                name="files"
                className="p-2 cus-tool-form"
                type="file"
                onChange={handleUpload}
                accept="image/png,image/jpeg,image/heic, .heic"
              />
              {/* {pictureUpload == "" ? null : (
              <img
                src={previewUrl}
                style={{ width: "30%" }}
                alt="Preview Not Available"
              />
            )} */}
              {fileLoader ? (
                <Skeleton width={200} />
              ) : fileArr.length ? (
                <div className="flex flex-row w-full gap-2">
                  {fileArr.map((i) => {
                    return (
                      <div key={i.fileUrl}>
                        <div className="flex flex-col w-[100px] gap-2 p-2 shadow-md">
                          <button
                            className=" self-end font-semibold hover:cursor-pointer"
                            onClick={(e) => handleDeleteFile(e, i)}
                          >
                            <DeleteIcon className="text-red-500" />
                          </button>
                          <img
                            src={i.fileUrl}
                            // style={{ width: "30%" }}
                            alt="Preview Not Available"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="flex flex-row gap-5 justify-end w-full mt-10">
              <input
                className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
                type="submit"
                value={"Approve"}
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default RequestToolHistory;
