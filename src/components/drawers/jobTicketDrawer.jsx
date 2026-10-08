import { Drawer } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PicFileService from "../jobTickets/picFile";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Select from "react-select";
import moment from "moment";
// import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import ServiceAttachmentTable from "../tables/serviceFileAttachments";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
function JobTicketDrawer({
  open,
  onClose,
  addJobTicket,
  editJobTicket,
  id,
  edit,
  data,
  allServices,
  currentUser,
  salesTaxValue,
  loaderOuter,
}) {
  const [dateOfOrder, setDateOfOrder] = useState(
    moment(new Date()).format("YYYY-MM-DD"),
  );
  const [contactName, setContactName] = useState("");
  const [tel, setTel] = useState("");
  const [createdBy, setcreatedBy] = useState(
    currentUser !== null || currentUser !== undefined
      ? currentUser.fullname
      : "",
  );
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [assignedToOpt, setAssignedToOpt] = useState([]);
  const [customerOrderNo, setCustomerOrderNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dateAdded, setDateAdded] = useState("");
  const [timeAdded, setTimeAdded] = useState("");
  const [terms, setTerms] = useState("");
  const [termsOpt, setTermsOpt] = useState("");
  const [laborArr, setLaborArr] = useState([]);
  const [materialArr, setMaterialArr] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [manualId, setManualId] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [jobNumberOpt, setJobNumberOpt] = useState("");
  const [ticketStatus, setTicketStatus] = useState({
    label: "To Be Assigned",
    value: "To Be Assigned",
  });
  const [email, setEmail] = useState("");
  const [attachmentArr, setAttachmentArr] = useState([]);
  const [formData, setFormData] = useState([]);
  const [fileUpload, setFileUpload] = useState([]);
  const [note, setNote] = useState("");
  const [dateArr, setDateArr] = useState([]);

  useEffect(() => {
    setUser();
    setTermsOptArr();
    setJobNumberOptArr();
    if (edit == false) {
      axios.get(`${apiPath.prodPath}/api/jobTicket/`).then((res) => {
        if (res.data.jobTicket.length == 0) {
          setTicketId(`J-${moment(new Date()).format("YYYY")}-1`);
        } else {
          const lastData = res.data.jobTicket[res.data.jobTicket.length - 1];
          const lastDataTicketID = lastData.ticketId;
          const lastNumber = lastDataTicketID.split("-")[2];
          const beforeLast = lastDataTicketID.split("-").slice(0, 2).join("-");
          const updatedCount = parseInt(lastNumber) + 1;
          const modifiedJobId = `${beforeLast}-${updatedCount}`;
          console.log("this is lastDataTicketId", lastDataTicketID);
          console.log("this is last Number", lastNumber);
          console.log("this is before last", beforeLast);
          console.log("this is modifiedJobId", modifiedJobId);

          setTicketId(modifiedJobId);
        }
      });
    }
    if (edit) {
      setDateAdded(data.dateAdded == undefined ? "" : data.dateAdded);
      setDateAdded(data.timeAdded == undefined ? "" : data.timeAdded);
      setTicketId(data.ticketId);
      setManualId(data.manualId);
      setEmail(data.email);
      setTicketStatus(
        data.ticketStatus == undefined
          ? ""
          : { label: data.ticketStatus, value: data.ticketStatus },
      );

      setJobNumber(
        data.jobNumber == undefined
          ? ""
          : { label: data.jobNumber, value: data.jobNumber },
      );
      setDateOfOrder(
        data.dateOfOrder == "" ||
          data.dateOfOrder == "Invalid date" ||
          data.dateOfOrder == undefined
          ? ""
          : moment(data.dateOfOrder).format("YYYY-MM-DD"),
      );
      setContactName(data.contactName);
      setTel(data.tel);
      setcreatedBy(data.createdBy);
      setAssignedBy({ label: data.assignedBy, value: data.assignedBy });
      setAssignedTo({ label: data.assignedTo, value: data.assignedTo });
      setStartDate(
        data.startDate == "" ||
          data.startDate == "Invalid date" ||
          data.startDate == undefined
          ? ""
          : moment(data.startDate).format("YYYY-MM-DD"),
      );
      setJobLocation(data.jobLocation);
      setDateArr(
        data.dateArr == undefined
          ? []
          : data.dateArr.map((i) => {
              i.id = i._id;
              return i;
            }),
      );
    }
  }, [open]);

  const setUser = async () => {
    await axios.get(`${apiPath.prodPath}/api/users/`).then((res) => {
      const sorted = res.data.allUsers
        .sort((a, b) => a.fullname.localeCompare(b.fullname))
        .map((i) => {
          return { label: i.fullname, value: i.fullname };
        });
      setAssignedToOpt(sorted);
    });
  };
  const setJobNumberOptArr = async () => {
    await axios.get(`${apiPath.prodPath}/api/jobNumber/`).then((res) => {
      const sorted = res.data.jobNumbers
        .map((i) => {
          return {
            label: `${i.jobNumber}-${i.jobName}`,
            value: `${i.jobNumber}-${i.jobName}`,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
      setJobNumberOpt(sorted);
    });
  };
  const setTermsOptArr = async () => {
    await axios.get(`${apiPath.prodPath}/api/term/`).then((res) => {
      const sorted = res.data.terms
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((i) => {
          return { label: i.name, value: i.name };
        });
      setTermsOpt(sorted);
    });
  };
  const handleAddTicketDateData = () => {};
  const handleadd = (e) => {
    e.preventDefault();
    handleAddTicketDateData();
    var taxCal;

    if (edit) {
      const formData = new FormData();
      formData.append("ticketId", ticketId);
      formData.append("manualId", manualId);
      formData.append("jobNumber", jobNumber.value);
      formData.append("ticketStatus", ticketStatus.value);
      formData.append(
        "dateOfOrder",
        dateOfOrder == "" ? "" : moment(dateOfOrder).format("MM/DD/YYYY"),
      );
      formData.append("contactName", contactName);
      formData.append("tel", tel);
      formData.append("email", email);
      formData.append("createdBy", createdBy);
      formData.append("assignedBy", assignedBy.value);
      formData.append(
        "assignedTo",
        ticketStatus.value == "To Be Assigned"
          ? ""
          : assignedTo.value == undefined
            ? ""
            : assignedTo.value,
      );
      formData.append(
        "startDate",
        startDate == "" ? "" : moment(startDate).format("MM/DD/YYYY"),
      );
      formData.append("jobLocation", jobLocation);
      // formData.append("laborArr", JSON.stringify(laborArr));
      // formData.append("materialArr", JSON.stringify(materialArr));
      formData.append("dateArr", JSON.stringify(dateArr));
      editJobTicket(formData);
    } else {
      const formData = new FormData();
      formData.append("ticketId", ticketId);
      formData.append("manualId", manualId);

      formData.append("jobNumber", jobNumber.value);
      formData.append("ticketStatus", ticketStatus.value);
      formData.append(
        "dateOfOrder",
        dateOfOrder == "" ? "" : moment(dateOfOrder).format("MM/DD/YYYY"),
      );
      formData.append("contactName", contactName);
      formData.append("tel", tel);
      formData.append("email", email);
      formData.append("createdBy", createdBy);
      formData.append("assignedBy", assignedBy.value);
      formData.append(
        "assignedTo",
        ticketStatus.value == "To Be Assigned"
          ? ""
          : assignedTo.value == undefined
            ? ""
            : assignedTo.value,
      );
      formData.append(
        "startDate",
        startDate == "" ? "" : moment(startDate).format("MM/DD/YYYY"),
      );
      formData.append("jobLocation", jobLocation);
      // formData.append("laborArr", JSON.stringify(laborArr));
      // formData.append("materialArr", JSON.stringify(materialArr));
      formData.append("dateArr", JSON.stringify(dateArr));

      formData.append("note", note);
      for (let i = 0; i < fileUpload.length; i++) {
        formData.append("files", fileUpload[i]);
      }
      formData.append("date", moment(new Date()).format("MM-DD-YYYY"));
      formData.append("time", moment(new Date()).format("hh:mm A"));
      formData.append("user", currentUser && currentUser.fullName);
      addJobTicket(formData);
    }
  };
  const handleLaborInp = (e, id) => {
    const result = laborArr.map((el) => {
      if (el.id == id) {
        const value = e.target.value;
        el.laborHours = value;
      }
      return el;
    });
    setLaborArr(result);
  };
  const handleEmpInp = (e, id) => {
    const result = laborArr.map((el) => {
      if (el.id == id) {
        el.employee = e.value;
      }
      return el;
    });
    setLaborArr(result);
  };

  const handleLaborDateInp = (e, id) => {
    const result = laborArr.map((el) => {
      if (el.id == id) {
        el.date = e.target.value;
      }
      return el;
    });
    setLaborArr(result);
  };

  const handleMaterialDescInp = (e, id) => {
    const result = materialArr.map((el) => {
      if (el.id == id) {
        el.description = e.target.value;
      }
      return el;
    });
    setMaterialArr(result);
  };

  const handleDateArr = (e) => {
    e.preventDefault();
    console.log("clicked");
    const obj = {
      dateId: uuidv4(),
      date: "",
      description: "",
      laborArr: [],
      materialArr: [],
      attachmentArr: [],
    };
    setDateArr((prev) => {
      return [obj, ...prev];
    });
  };
  const handleLaborArr = () => {
    const obj = {
      id: uuidv4(),
      employee: "",
      laborHours: "",
      date: "",
    };
    setLaborArr((prev) => {
      return [obj, ...prev];
    });
  };
  const handleLaborArrInner = (e, id) => {
    e.preventDefault();
    const obj = {
      id: uuidv4(),
      employee: "",
      laborHours: "",
      date: "",
    };
    const result = dateArr.map((el) => {
      if (el.dateId == id) {
        if (el.laborArr.length) {
          el.laborArr = [obj, ...el.laborArr];
        } else {
          el.laborArr = [obj];
        }
      }
      return el;
    });
    setDateArr(result);
  };
  const handleMaterialInp = (e, id) => {
    const result = materialArr.map((el) => {
      if (el.id == id) {
        const value = e.target.value;
        el.materialQuantity = value;
      }
      // if (edit) {
      //   el.amount = el.materialQuantity * el.rate;
      // }
      return el;
    });
    setMaterialArr(result);
  };
  const handleMaterialInnerInp = (dateMain, e, id) => {
    console.log("this is dateMain", dateMain);
    const alteredMain = dateMain.materialArr.map((inner) => {
      if (inner.id == id) {
        inner.materialQuantity = e.target.value;
      }
      return inner;
    });
    dateMain.materialArr = alteredMain;
    console.log("mappedMain", dateMain);
    const filteredDateArr = dateArr.filter((i) => i.dateId !== dateMain.dateId);
    const finalArr = [dateMain, ...filteredDateArr];
    console.log("finalArr", finalArr);
    setDateArr(finalArr);
  };
  const handleMaterialInnerDesc = (dateMain, e, id) => {
    console.log("this is dateMain", dateMain);
    const alteredMain = dateMain.materialArr.map((inner) => {
      if (inner.id == id) {
        inner.description = e.target.value;
      }
      return inner;
    });
    dateMain.materialArr = alteredMain;
    console.log("mappedMain", dateMain);
    const filteredDateArr = dateArr.filter((i) => i.dateId !== dateMain.dateId);
    const finalArr = [dateMain, ...filteredDateArr];
    console.log("finalArr", finalArr);
    setDateArr(finalArr);
  };
  const handleLaborInnerHours = (dateMain, e, id) => {
    const alteredMain = dateMain.laborArr.map((inner) => {
      if (inner.id == id) {
        inner.laborHours = e.target.value;
      }
      return inner;
    });
    dateMain.laborArr = alteredMain;
    const filteredDateArr = dateArr.filter((i) => i.dateId !== dateMain.dateId);
    const finalArr = [dateMain, ...filteredDateArr];
    setDateArr(finalArr);
  };
  const handleLaborInnerDates = (dateMain, e, id) => {
    const alteredMain = dateMain.laborArr.map((inner) => {
      if (inner.id == id) {
        inner.date = e.target.value;
      }
      return inner;
    });
    dateMain.laborArr = alteredMain;
    const filteredDateArr = dateArr.filter((i) => i.dateId !== dateMain.dateId);
    const finalArr = [dateMain, ...filteredDateArr];
    setDateArr(finalArr);
  };
  const handleLaborInnerEmp = (dateMain, e, id) => {
    console.log("this is dateMain", dateMain);
    const alteredMain = dateMain.laborArr.map((inner) => {
      if (inner.id == id) {
        console.log("this employee", e);
        inner.employee = e.value;
      }
      return inner;
    });
    dateMain.laborArr = alteredMain;
    const filteredDateArr = dateArr.filter((i) => i.dateId !== dateMain.dateId);
    const finalArr = [dateMain, ...filteredDateArr];
    setDateArr(finalArr);
  };
  const handleInnerDates = (e, id) => {
    const result = dateArr.map((el) => {
      if (el.dateId == id) {
        const value = e.target.value;
        el.date = value;
      }
      return el;
    });
    setDateArr(result);
  };
  const handleInnerDesc = (e, id) => {
    const result = dateArr.map((el) => {
      if (el.dateId == id) {
        const value = e.target.value;
        el.description = value;
      }
      return el;
    });
    setDateArr(result);
  };

  const handleTicketId = (e) => {
    setTicketId(e.target.value);
  };
  const handleMaterialArr = () => {
    const obj = {
      id: uuidv4(),
      materialQuantity: "",
      description: "",
    };
    setMaterialArr((prev) => {
      return [obj, ...prev];
    });
  };
  const handleMaterialInnerArr = (e, id) => {
    e.preventDefault();
    const obj = {
      id: uuidv4(),
      materialQuantity: "",
      description: "",
    };
    const result = dateArr.map((el) => {
      if (el.dateId == id) {
        if (el.materialArr.length) {
          el.materialArr = [obj, ...el.materialArr];
        } else {
          el.materialArr = [obj];
        }
      }
      return el;
    });
    setDateArr(result);
  };
  const handleRemoveEl = (i) => {
    const filteredArr = laborArr.filter((el) => el.id !== i.id);
    setLaborArr(filteredArr);
  };
  const handleMaterialRemoveEl = (i) => {
    const filteredArr = materialArr.filter((el) => el.id !== i.id);
    setMaterialArr(filteredArr);
  };
  const handleLaborInnerRemoveEl = (e, dateMain, id) => {
    e.preventDefault();
    console.log("this is dateMain", dateMain);
    const currentDateMin = dateMain.laborArr.filter((el) => el.id !== id);
    const alteredDateArr = dateArr.map((inner) => {
      if (inner.dateId == dateMain.dateId) {
        inner.laborArr = currentDateMin;
      }
      return inner;
    });
    console.log("##$$$$", alteredDateArr);
    setDateArr(alteredDateArr);
  };
  const handleMaterialInnerRemoveEl = (e, dateMain, i) => {
    e.preventDefault();
    console.log("this is dateMain", dateMain);
    const currentDateMin = dateMain.materialArr.filter((el) => el.id !== i);
    const alteredDateArr = dateArr.map((inner) => {
      if (inner.dateId == dateMain.dateId) {
        inner.materialArr = currentDateMin;
      }
      return inner;
    });
    console.log("##$$$$", alteredDateArr);
    setDateArr(alteredDateArr);
  };
  const ticketStatusOpt = [
    { label: "To Be Assigned", value: "To Be Assigned" },
    { label: "Open Ticket", value: "Open Ticket" },
    { label: "Unbilled", value: "Unbilled" },
    { label: "Billed", value: "Billed" },
  ];

  const deleteAttachment = (item) => {
    const filteredData = attachmentArr.filter((i) => i.fileId !== item.fileId);
    setAttachmentArr(filteredData);
  };
  const fileHandler = (e) => {
    setFileUpload(e.target.files);
  };
  const handleAttachments = () => {
    var fileArr = [];
    for (const file of fileUpload) {
      fileArr.push(file);
      // Perform other operations with each `file`
    }
    const dataObj = [
      {
        fileId: uuidv4(),
        note: note,
        files: fileArr,
        date: moment(new Date()).format("MM-DD-YYYY"),
        time: moment(new Date()).format("hh:mm A"),
      },
    ];
    setAttachmentArr(dataObj);
  };
  return (
    <Drawer
      anchor={"right"}
      open={open}
      //   onClose={onClose}
      className="tools-drawer"
    >
      <div className={`${poppins.className} w-full flex flex-col p-10`}>
        <h1 className="flex flex-row gap-x-3 font-bold text-2xl">
          <span
            onClick={() => onClose()}
            className="flex flex-col justify-center align-middle"
          >
            <Image src={"/back.png"} width={12} height={21} alt="Back" />
          </span>{" "}
          {edit ? "Edit Job Ticket" : "Add Job Ticket"}
        </h1>
        <form className="flex flex-row gap-5 flex-wrap w-full mt-9">
          <Accordion
            defaultExpanded
            sx={{ width: "100% !important", margin: "0 !important" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Basic Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-row gap-5 flex-wrap w-full">
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Ticket ID</label>
                  <input
                    className="p-2 cus-tool-form"
                    type="text"
                    value={ticketId}
                    onChange={handleTicketId}
                    required={true}
                    disabled={true}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Customer PO</label>
                  <input
                    className="p-2 cus-tool-form"
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    required={true}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Job Number</label>
                  <Select
                    id="ser-ticket-1"
                    options={jobNumberOpt}
                    onChange={(v) => setJobNumber(v)}
                    value={jobNumber}
                    required={true}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Ticket Status</label>
                  <Select
                    id="ser-ticket-1"
                    options={ticketStatusOpt}
                    onChange={(v) => setTicketStatus(v)}
                    value={ticketStatus}
                    required={true}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Date Of Order</label>
                  {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => console.log("clicked")}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateOfOrder && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfOrder ? (
                    moment(dateOfOrder).format("MM-DD-YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 cus-calendar">
                <Calendar
                  mode="single"
                  selected={dateOfOrder}
                  onSelect={(date) => setDateOfOrder(date)}
                />
              </PopoverContent>
            </Popover> */}
                  <input
                    type="date"
                    value={dateOfOrder}
                    onChange={(e) => {
                      setDateOfOrder(e.target.value);
                    }}
                    className="p-2 cus-tool-form"
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Contact Name</label>
                  <input
                    type="text"
                    value={contactName}
                    className="p-2 cus-tool-form"
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Tel#</label>
                  <input
                    type="text"
                    className="p-2 cus-tool-form"
                    value={tel}
                    // onChange={(e) => handleTel(e)}
                    onChange={(e) => setTel(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Email</label>
                  <input
                    type="email"
                    className="p-2 cus-tool-form"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Created By</label>
                  <input
                    type="text"
                    className="p-2 cus-tool-form"
                    value={createdBy}
                    disabled={true}
                    //   onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Assigned By</label>
                  <Select
                    id="ser-ticket-1"
                    options={assignedToOpt}
                    onChange={(v) => setAssignedBy(v)}
                    value={assignedBy}
                  />
                </div>
                {ticketStatus.value == "To Be Assigned" ? null : (
                  <div className="flex flex-col w-1/4 gap-2">
                    <label className="font-semibold">Assigned To</label>
                    <Select
                      id="ser-ticket-2"
                      options={assignedToOpt}
                      onChange={(v) => setAssignedTo(v)}
                      value={assignedTo}
                    />
                  </div>
                )}
                {/* <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Customer Order No</label>
            <input
              className="p-2 cus-tool-form"
              type="text"
              value={customerOrderNo}
              onChange={(e) => setCustomerOrderNo(e.target.value)}
            />
          </div> */}
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Start Date</label>
                  {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => console.log("clicked")}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    moment(startDate).format("MM-DD-YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 cus-calendar">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => setStartDate(date)}
                />
              </PopoverContent>
            </Popover> */}
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}
                    className="p-2 cus-tool-form"
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Job Location</label>
                  <input
                    className="p-2 cus-tool-form"
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          {/* <Accordion sx={{ width: "100% !important", margin: "0 !important" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography component="span">Job Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-row gap-5 flex-wrap w-full">
                <div className="flex flex-col w-full gap-2">
                  <label className="font-semibold">Job Description</label>
                  <textarea
                    rows={7}
                    className="p-2 cus-tool-form"
                    cols={5}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </AccordionDetails>
          </Accordion> */}
          {/* <Accordion sx={{ width: "100% !important", margin: "0 !important" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography component="span">Labor</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-row gap-5 flex-wrap w-full">
                <div
                  className="flex flex-col w-1/4 gap-2"
                  style={{ width: "100%" }}
                >
                  <p
                    className="bg-orange-400 p-2 rounded-xl text-white self-start hover:cursor-pointer"
                    onClick={() => handleLaborArr()}
                  >
                    &#10011; Labor
                  </p>
                  
                </div>
                {laborArr.length
                  ? laborArr.map((i) => {
                      return (
                        <div key={i.id} className="flex flex-row gap-2">
                          <div className="flex flex-col w-[400px] gap-2">
                            <label className="font-semibold">Employee</label>
                            <Select
                              className="z-[50]"
                              id="emp-job"
                              options={assignedToOpt}
                              value={{ label: i.employee, value: i.employee }}
                              onChange={(e) =>
                                handleEmpInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col w-1/4 gap-2">
                            <label className="font-semibold">
                              Labors Hours
                            </label>
                            <input
                              type="text"
                              className="p-2 cus-tool-form"
                              value={i.laborHours}
                              onChange={(e) =>
                                handleLaborInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                            />
                          </div>
                          
                          <div className="flex flex-col w-1/4 gap-2">
                            <label className="font-semibold">Date</label>
                            <input
                              type="date"
                              value={i.date}
                              onChange={(e) => {
                                handleLaborDateInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                );
                              }}
                              className="p-2 cus-tool-form"
                            />
                            
                          </div>
                          
                          {laborArr.length > 0 ? (
                            <span
                              className="minus hover:cursor-pointer"
                              style={{ fontSize: "32px" }}
                              onClick={() => handleRemoveEl(i)}
                            >
                              &#9866;
                            </span>
                          ) : null}
                        </div>
                      );
                    })
                  : null}
              </div>
            </AccordionDetails>
          </Accordion> */}
          {/* <Accordion sx={{ width: "100% !important", margin: "0 !important" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <Typography component="span">Material</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-row gap-5 flex-wrap w-full">
                <div
                  className="flex flex-col w-1/4 gap-2"
                  style={{ width: "100%" }}
                >
                  <p
                    className="bg-orange-400 text-white p-2 rounded-xl self-start hover:cursor-pointer"
                    onClick={() => handleMaterialArr()}
                  >
                    &#10011; Material
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {materialArr.length
                    ? materialArr.map((i) => {
                        return (
                          <div key={i.id} className="flex flex-row gap-2">
                            <div className="flex flex-col w-1/2 gap-2">
                              <label className="font-semibold">
                                Materials Quantity
                              </label>
                              <input
                                type="text"
                                className="p-2 cus-tool-form"
                                value={i.materialQuantity}
                                onChange={(e) => handleMaterialInp(e, i.id)}
                              />
                            </div>
                            <div className="flex flex-col w-[400px] gap-2">
                              <label className="font-semibold">
                                Description
                              </label>
                              <input
                                type="text"
                                className="p-2 cus-tool-form"
                                value={i.description}
                                onChange={(e) =>
                                  handleMaterialDescInp(
                                    e,
                                    i.id == undefined ? i._id : i.id
                                  )
                                }
                              />
                            </div>
                            {materialArr.length > 0 ? (
                              <span
                                className="minus"
                                style={{ fontSize: "32px" }}
                                onClick={() => handleMaterialRemoveEl(i)}
                              >
                                &#9866;
                              </span>
                            ) : null}
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </AccordionDetails>
          </Accordion> */}
        </form>
        <div className="pt-5">
          <Accordion sx={{ width: "100% !important", margin: "0 !important" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              <Typography component="span">Attachments</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-row gap-5 flex-wrap w-full">
                {edit ? (
                  <div className="flex flex-col gap-3 w-full">
                    <PicFileService
                      jobTicketId={data.id}
                      attachments={data.attachments}
                    />
                  </div>
                ) : (
                  <div className="flex flex-row gap-3">
                    <div className="flex flex-col w-1/3">
                      <label className="font-semibold">Files</label>
                      <input
                        type="file"
                        className={`${poppins.className} p-2 cus-tool-form`}
                        onChange={fileHandler}
                        multiple
                        name="files"
                        required={true}
                      />
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="font-semibold">Notes</label>
                      <input
                        type="text"
                        value={note}
                        className={`${poppins.className} p-2 cus-tool-form`}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                    {attachmentArr.length ? null : (
                      <div className="flex flex-col w-1/3">
                        <button
                          className={`${poppins.className} p-3 bg-orange-400 text-white font-semibold rounded-xl self-end`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAttachments();
                          }}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {edit ? null : (
                  <ServiceAttachmentTable
                    attachments={attachmentArr}
                    deleteAttachment={deleteAttachment}
                  />
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <button
          className="bg-orange-400 text-white font-semibold rounded-[5px] w-[100px] self-start pt-2 pb-2 mt-4 mb-2"
          onClick={handleDateArr}
        >
          Add A Date
        </button>
        {dateArr.length
          ? dateArr.map((inner, index) => {
              return (
                <div
                  key={inner.dateId}
                  className="w-full flex flex-row gap-2 flex-wrap mt-2 mb-2 border-b-[2px] border-[#dfdfdf] pb-2"
                >
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold">Date</label>
                    <input
                      type="date"
                      value={inner.date}
                      onChange={(e) => {
                        e.preventDefault();
                        handleInnerDates(e, inner.dateId);
                      }}
                      className="border-[#cfcfcf] border-[1px] rounded-[5px] w-[200px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label className="font-semibold">Daily Description</label>
                    <textarea
                      type="text"
                      rows={5}
                      value={inner.description}
                      onChange={(e) => {
                        e.preventDefault();
                        handleInnerDesc(e, inner.dateId);
                      }}
                      className="border-[#cfcfcf] border-[1px] p-2 rounded-[5px] w-full"
                    />
                  </div>
                  <div className="flex flex-row gap-5 flex-wrap w-full">
                    <div
                      className="flex flex-col w-1/4 gap-2"
                      style={{ width: "100%" }}
                    >
                      <p
                        className="bg-orange-400 text-white p-2 rounded-xl self-start hover:cursor-pointer"
                        onClick={(e) => handleMaterialInnerArr(e, inner.dateId)}
                      >
                        &#10011; Material
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {inner.materialArr.length
                        ? inner.materialArr.map((i) => {
                            return (
                              <div key={i.id} className="flex flex-row gap-2">
                                <div className="flex flex-col w-1/2 gap-2">
                                  <label className="font-semibold">
                                    Materials Quantity
                                  </label>
                                  <input
                                    type="text"
                                    className="p-2 cus-tool-form"
                                    value={i.materialQuantity}
                                    onChange={(e) =>
                                      handleMaterialInnerInp(inner, e, i.id)
                                    }
                                  />
                                </div>

                                <div className="flex flex-col w-[400px] gap-2">
                                  <label className="font-semibold">
                                    Description
                                  </label>
                                  <input
                                    type="text"
                                    className="p-2 cus-tool-form"
                                    value={i.description}
                                    onChange={(e) =>
                                      handleMaterialInnerDesc(inner, e, i.id)
                                    }
                                  />
                                </div>

                                {inner.materialArr.length > 0 ? (
                                  <span
                                    className="minus"
                                    style={{ fontSize: "32px" }}
                                    onClick={(e) =>
                                      handleMaterialInnerRemoveEl(
                                        e,
                                        inner,
                                        i.id,
                                      )
                                    }
                                  >
                                    &#9866;
                                  </span>
                                ) : null}
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </div>
                  <div className="flex flex-row gap-5 flex-wrap w-full">
                    <div
                      className="flex flex-col w-1/4 gap-2"
                      style={{ width: "100%" }}
                    >
                      <p
                        className="bg-orange-400 p-2 rounded-xl text-white self-start hover:cursor-pointer"
                        onClick={(e) => handleLaborArrInner(e, inner.dateId)}
                      >
                        &#10011; Labor
                      </p>
                    </div>
                    {inner.laborArr.length
                      ? inner.laborArr.map((i) => {
                          return (
                            <div key={i.id} className="flex flex-row gap-2">
                              <div className="flex flex-col w-[400px] gap-2">
                                <label className="font-semibold">
                                  Employee
                                </label>
                                <Select
                                  className="z-[50]"
                                  id="emp-job"
                                  options={assignedToOpt}
                                  value={{
                                    label: i.employee,
                                    value: i.employee,
                                  }}
                                  onChange={(e) =>
                                    handleLaborInnerEmp(inner, e, i.id)
                                  }
                                />
                              </div>
                              <div className="flex flex-col w-1/4 gap-2">
                                <label className="font-semibold">
                                  Labors Hours
                                </label>
                                <input
                                  type="text"
                                  className="p-2 cus-tool-form"
                                  value={i.laborHours}
                                  onChange={(e) =>
                                    handleLaborInnerHours(inner, e, i.id)
                                  }
                                />
                              </div>

                              <div className="flex flex-col w-1/4 gap-2">
                                <label className="font-semibold">Date</label>
                                <input
                                  type="date"
                                  value={i.date}
                                  onChange={(e) =>
                                    handleLaborInnerDates(inner, e, i.id)
                                  }
                                  className="p-2 cus-tool-form"
                                />
                              </div>

                              {inner.laborArr.length > 0 ? (
                                <span
                                  className="minus hover:cursor-pointer"
                                  style={{ fontSize: "32px" }}
                                  onClick={(e) =>
                                    handleLaborInnerRemoveEl(e, inner, i.id)
                                  }
                                >
                                  &#9866;
                                </span>
                              ) : null}
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              );
            })
          : null}
        <div className="flex flex-row gap-5 justify-end w-full mt-10">
          <button
            className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
            onClick={(e) => {
              handleadd(e);
            }}
          >
            {loaderOuter ? "Saving..." : edit ? "Save" : "Add Ticket"}
          </button>
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
      </div>
    </Drawer>
  );
}

export default JobTicketDrawer;
