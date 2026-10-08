import { Drawer } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import "./style.scss";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Select from "react-select";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function ServiceDrawer({
  open,
  onClose,
  addServices,
  editService,
  id,
  edit,
  data,
  allServices,
  currentUser,
  salesTaxValue,
  loaderOuter,
}) {
  const [to, setTo] = useState("");
  const [toOpt, setToOpt] = useState([]);
  const [dateOfOrder, setDateOfOrder] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [contactName, setContactName] = useState("");
  const [tel, setTel] = useState("");
  const [createdBy, setcreatedBy] = useState(
    currentUser !== null || currentUser !== undefined
      ? currentUser.fullname
      : ""
  );
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedToOpt, setAssignedToOpt] = useState([]);
  const [customerOrderNo, setCustomerOrderNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [jobName, setJobName] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [terms, setTerms] = useState("");
  const [termsOpt, setTermsOpt] = useState("");
  const [description, setDescription] = useState("");
  const [laborArr, setLaborArr] = useState([]);
  const [materialArr, setMaterialArr] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [manualId, setManualId] = useState("");
  const [ticketStatus, setTicketStatus] = useState({
    label: "To Be Assigned",
    value: "To Be Assigned",
  });
  const [email, setEmail] = useState("");
  // const [taxStatus, setTaxStatus] = useState("");
  // const [newFileFlag, setNewFileFlag] = useState(false);
  // const [oldFiles, setOldFiles] = useState("");
  // const [fileUpload, setFileUpload] = useState("");
  // const filterColors = (inputValue) => {
  //   var arrNew;
  //   axios
  //     .get(`${apiPath.prodPath}/api/clients/${inputValue}`)
  //     .then((res) => {
  //       arrNew = res.data.clients.map((i) => {
  //         return { label: i.customerName, value: i.customerName };
  //       });
  //       // .filter((i) =>
  //       //   i.label.toLowerCase().includes(inputValue.toLowerCase())
  //       // );

  //       return arrNew;
  //     })
  //     .catch((err) => console.log(err));
  // };
  const handleInputChange = (value) => {
    if (value.length > 1) {
      axios
        .get(`${apiPath.prodPath}/api/clients/${value}`)
        .then((res) => {
          const arrNew = res.data.clients.map((i) => {
            return { label: i.customerName, value: i.customerName };
          });
          setToOpt(arrNew);
        })
        .catch((err) => console.log(err));
    } else if (value.length == 0) {
      setClients();
    }
  };
  useEffect(() => {
    console.log("edit flag", edit);
    setClients();
    setUser();
    setTermsOptArr();
    // if (edit == false) {
    //   axios.get(`${apiPath.prodPath}/api/service/`).then((res) => {
    //     if (res.data.services.length == 0) {
    //       setTicketId(`J-${moment(new Date()).format("YYYY")}-1`);
    //     } else {
    //       const lastData = res.data.services[res.data.services.length - 1];
    //       const lastDataTicketID = lastData.ticketId;
    //       const lastNumber = lastDataTicketID.split("-")[2];
    //       const beforeLast = lastDataTicketID.split("-").slice(0, 2).join("-");
    //       const updatedCount =
    //         lastNumber == undefined ? "1" : parseInt(lastNumber) + 1;
    //       const modifiedJobId = `${beforeLast}-${updatedCount}`;
    //       console.log("this is lastDataTicketId", lastDataTicketID);
    //       console.log("this is last Number", lastNumber);
    //       console.log("this is before last", beforeLast);
    //       console.log("this is modifiedJobId", modifiedJobId);

    //       setTicketId(modifiedJobId);
    //     }
    //   });
    // }
    if (edit == false) {
      axios.get(`${apiPath.prodPath}/api/service/`).then((res) => {
        if (res.data.services.length == 0) {
          setTicketId(`${moment(new Date()).format("YYYY")}-1`);
        } else {
          const lastData = res.data.services[res.data.services.length - 1];
          const lastDataTicketID = lastData.ticketId;
          const modifiedTicketId = lastDataTicketID
            .replace(`${moment(new Date()).format("YYYY")}-`, "")
            .replace("NaN", "1");
          const modifiedCount = Number(modifiedTicketId) + 1;
          setTicketId(`${moment(new Date()).format("YYYY")}-${modifiedCount}`);
        }
      });
    }
    if (edit) {
      console.log("####", data);

      setTicketId(data.ticketId);
      setEmail(data.email);
      setTicketStatus(
        data.ticketStatus == undefined
          ? ""
          : { label: data.ticketStatus, value: data.ticketStatus }
      );
      // setTaxStatus(
      //   data.taxStatus == undefined
      //     ? ""
      //     : { label: data.taxStatus, value: data.taxStatus }
      // );
      setManualId(data.manualId == undefined ? "" : data.manualId);
      setTo(data.to == undefined ? "" : { label: data.to, value: data.to });
      setDateOfOrder(
        data.dateOfOrder == "" ||
          data.dateOfOrder == "Invalid date" ||
          data.dateOfOrder == undefined
          ? ""
          : moment(data.dateOfOrder).format("YYYY-MM-DD")
      );
      setContactName(data.contactName);
      setTel(data.tel);
      setcreatedBy(data.createdBy);
      setAssignedTo({ label: data.assignedTo, value: data.assignedTo });
      setCustomerOrderNo(data.customerOrderNo);
      setStartDate(
        data.startDate == "" ||
          data.startDate == "Invalid date" ||
          data.startDate == undefined
          ? ""
          : moment(data.startDate).format("YYYY-MM-DD")
      );
      setJobName(data.jobName);
      setJobLocation(data.jobLocation);
      setInvoiceDate(
        data.invoiceDate == "" ||
          data.invoiceDate == "Invalid date" ||
          data.invoiceDate == undefined
          ? ""
          : moment(data.invoiceDate).format("YYYY-MM-DD")
      );
      setTerms({ label: data.terms, value: data.terms });
      setDescription(data.description);
      setLaborArr(
        data.laborArr == undefined
          ? []
          : data.laborArr.map((i) => {
              i.id = i._id;
              return i;
            })
      );
      setMaterialArr(
        data.materialArr == undefined
          ? []
          : data.materialArr.map((i) => {
              i.id = i._id;
              return i;
            })
      );
    }
  }, [open]);
  const setClients = async () => {
    await axios
      .get(`${apiPath.prodPath}/api/clients/?page=1&pageSize=50`)
      .then((res) => {
        const sorted = res.data.clients
          .sort((a, b) => a.customerName.localeCompare(b.customerName))
          .map((i) => {
            return { label: i.customerName, value: i.customerName };
          });
        setToOpt(sorted);
      });
  };
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
  const handleadd = (e) => {
    e.preventDefault();
    // var subTotal=0;
    var taxCal;
    var subTotalWithTax;
    var subTotalWithTaxL = 0;
    var subTotalWithTaxM = 0;
    // subTotal =
    //   (laborArr.length ? laborArr.reduce((a, s) => a + s.amount, 0) : 0) +
    //   (materialArr.length ? materialArr.reduce((a, s) => a + s.amount, 0) : 0);
    if (laborArr.length) {
      laborArr.forEach((el) => {
        if (el.taxStatus == "Yes") {
          const taxC = (el.amount * salesTaxValue) / 100;
          subTotalWithTaxL = el.amount + taxC + subTotalWithTaxL;
        } else {
          subTotalWithTaxL = subTotalWithTaxL + el.amount;
        }
      });
    }
    if (materialArr.length) {
      materialArr.forEach((el) => {
        if (el.taxStatus == "Yes") {
          const taxC = (el.amount * salesTaxValue) / 100;
          subTotalWithTaxM = el.amount + taxC + subTotalWithTaxM;
        } else {
          subTotalWithTaxM = subTotalWithTaxM + el.amount;
        }
      });
    }
    subTotalWithTax = subTotalWithTaxL + subTotalWithTaxM;
    console.log("subTotal with individual tax", subTotalWithTax);

    if (edit) {
      const formData = new FormData();
      formData.append("ticketId", ticketId);
      formData.append("manualId", manualId);
      formData.append("ticketStatus", ticketStatus.value);
      formData.append("to", to.value == undefined ? "" : to.value);
      formData.append(
        "dateOfOrder",
        dateOfOrder == "" ? "" : moment(dateOfOrder).format("MM/DD/YYYY")
      );
      formData.append("contactName", contactName);
      formData.append("tel", tel);
      formData.append("email", email);
      formData.append("createdBy", createdBy);
      formData.append(
        "assignedTo",
        ticketStatus.value == "To Be Assigned"
          ? ""
          : assignedTo.value == undefined
          ? ""
          : assignedTo.value
      );
      formData.append("customerOrderNo", customerOrderNo);
      formData.append(
        "startDate",
        startDate == "" ? "" : moment(startDate).format("MM/DD/YYYY")
      );
      formData.append("jobName", jobName);
      formData.append("jobLocation", jobLocation);
      formData.append(
        "invoiceDate",
        invoiceDate == "" ? "" : moment(invoiceDate).format("MM/DD/YYYY")
      );
      formData.append("terms", terms.value);
      formData.append("description", description);
      formData.append("laborArr", JSON.stringify(laborArr));
      formData.append("totalLabor", laborArr.length ? subTotalWithTaxL : 0);
      formData.append("materialArr", JSON.stringify(materialArr));
      formData.append(
        "totalMaterail",
        materialArr.length ? subTotalWithTaxM : 0
      );
      formData.append("total", subTotalWithTax);
      if (data.payments && data.payments.length < 0) {
        formData.append("remaining", subTotalWithTax);
      } else {
        formData.append("remaining", data.remaining);
      }
      editService(formData);
    } else {
      const formData = new FormData();
      formData.append("ticketId", ticketId);
      formData.append("manualId", manualId);
      formData.append("ticketStatus", ticketStatus.value);
      formData.append("to", to.value == undefined ? "" : to.value);
      formData.append(
        "dateOfOrder",
        dateOfOrder == "" ? "" : moment(dateOfOrder).format("MM/DD/YYYY")
      );
      formData.append("contactName", contactName);
      formData.append("tel", tel);
      formData.append("email", email);
      formData.append("createdBy", createdBy);
      formData.append(
        "assignedTo",
        ticketStatus.value == "To Be Assigned"
          ? ""
          : assignedTo.value == undefined
          ? ""
          : assignedTo.value
      );

      formData.append("customerOrderNo", customerOrderNo);
      formData.append(
        "startDate",
        startDate == "" ? "" : moment(startDate).format("MM/DD/YYYY")
      );
      formData.append("jobName", jobName);
      formData.append("jobLocation", jobLocation);
      formData.append(
        "invoiceDate",
        invoiceDate == "" ? "" : moment(invoiceDate).format("MM/DD/YYYY")
      );
      formData.append("terms", terms.value);
      formData.append("description", description);
      formData.append("laborArr", JSON.stringify(laborArr));
      formData.append("totalLabor", laborArr.length ? subTotalWithTaxL : 0);
      formData.append("materialArr", JSON.stringify(materialArr));
      formData.append(
        "totalMaterail",
        materialArr.length ? subTotalWithTaxM : 0
      );
      formData.append("total", subTotalWithTax);
      addServices(formData);
    }
  };
  const handleLaborInp = (e, id) => {
    const result = laborArr.map((el) => {
      if (el.id == id) {
        if (el.rate !== "") {
          el.laborHours = e.target.value;
          el.amount = el.laborHours * el.rate;
        } else {
          el.laborHours = e.target.value;
        }
      }
      if (edit) {
        el.amount = el.laborHours * el.rate;
      }
      return el;
    });
    setLaborArr(result);
  };
  const handleDateInp = (e, id) => {
    const result = laborArr.map((el) => {
      if (el.id == id) {
        el.date = e.target.value;
      }
      return el;
    });
    setLaborArr(result);
  };
  const handleUserInp = (e, id) => {
    const result = laborArr.map((el) => {
      if (el.id == id) {
        el.employee = e.value;
      }
      return el;
    });
    setLaborArr(result);
  };
  const handleUpload = (e) => {
    if (edit) {
      setNewFileFlag(true);
      setFileUpload(e.target.files);
    } else {
      setFileUpload(e.target.files);
    }
  };
  const handleLaborDescInp = (e, id) => {
    console.log("id", id);
    console.log("el", e);
    const result = laborArr.map((el) => {
      if (el.id == id) {
        el.description = e.target.value;
      }
      return el;
    });
    setLaborArr(result);
  };
  const handleTaxLaborStatus = (e, id) => {
    console.log("id", id);
    console.log("el", e);
    const result = laborArr.map((el) => {
      if (el.id == id) {
        el.taxStatus = e.value;
      }
      return el;
    });
    setLaborArr(result);
  };
  const handleMaterialDescInp = (e, id) => {
    console.log("id", id);
    console.log("el", e);
    const result = materialArr.map((el) => {
      if (el.id == id) {
        el.description = e.target.value;
      }
      return el;
    });
    setMaterialArr(result);
  };
  const handleTaxMaterialStatus = (e, id) => {
    console.log("id", id);
    console.log("el", e);
    const result = materialArr.map((el) => {
      if (el.id == id) {
        el.taxStatus = e.value;
      }
      return el;
    });
    setMaterialArr(result);
  };
  const handleHourInp = (e, id) => {
    const result = laborArr.map((el) => {
      if (el.id == id) {
        el.rate = e.target.value;
        el.amount = el.laborHours * el.rate;
      }
      return el;
    });
    setLaborArr(result);
  };
  const handleLaborArr = () => {
    const obj = {
      id: uuidv4(),
      date: "",
      employee: "",
      laborHours: "",
      rate: 0,
      amount: 0,
      description: "",
      taxStatus: "",
    };
    setLaborArr((prev) => {
      return [obj, ...prev];
    });
  };
  const handleMaterialInp = (e, id) => {
    const result = materialArr.map((el) => {
      if (el.id == id) {
        if (el.rate !== "") {
          el.materialQuantity = e.target.value;
          el.amount = el.materialQuantity * el.rate;
        } else {
          el.materialQuantity = e.target.value;
        }
      }
      if (edit) {
        el.amount = el.materialQuantity * el.rate;
      }
      return el;
    });
    setMaterialArr(result);
  };
  const handleMaterialHourInp = (e, id) => {
    const result = materialArr.map((el) => {
      if (el.id == id) {
        el.rate = e.target.value;
        el.amount = el.materialQuantity * el.rate;
      }
      return el;
    });
    setMaterialArr(result);
  };
  const handleTicketId = (e) => {
    setTicketId(e.target.value);
  };
  const handleMaterialArr = () => {
    const obj = {
      id: uuidv4(),
      materialQuantity: "",
      rate: 0,
      amount: 0,
      description: "",
      taxStatus: "",
    };
    setMaterialArr((prev) => {
      return [obj, ...prev];
    });
  };
  const handleRemoveEl = (i) => {
    const filteredArr = laborArr.filter((el) => el.id !== i.id);
    setLaborArr(filteredArr);
  };
  const handleMaterialRemoveEl = (i) => {
    const filteredArr = materialArr.filter((el) => el.id !== i.id);
    setMaterialArr(filteredArr);
  };
  const ticketStatusOpt = [
    { label: "To Be Assigned", value: "To Be Assigned" },
    { label: "Open Ticket", value: "Open Ticket" },
    { label: "Unbilled", value: "Unbilled" },
    { label: "Billed", value: "Billed" },
  ];
  const formatDate = (dateString) => {
    // return new Intl.DateTimeFormat("en-US", {
    //   timeZone: "UTC",
    //   day: "2-digit",
    //   month: "short",
    //   year: "numeric",
    // }).format(new Date(dateString));
    const date = new Date(dateString);

    const formattedDate = date.toISOString().split("T")[0];
    console.log(formattedDate);
    return formattedDate;
  };
  return (
    <Drawer
      anchor={"right"}
      open={open}
      //   onClose={onClose}
      className="service-ticket-drawer"
    >
      <div
        className={`${poppins.className} w-full flex flex-col p-10 overflow-auto`}
      >
        <h1 className="flex flex-row gap-x-3 font-bold text-2xl">
          <span
            onClick={() => onClose()}
            className="flex flex-col justify-center align-middle"
          >
            <Image src={"/back.png"} width={12} height={21} alt="Back" />
          </span>{" "}
          {edit ? "Edit Service Ticket" : "Add Service Ticket"}
        </h1>
        <form onSubmit={handleadd} className="flex flex-col mt-9">
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
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
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
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Service Number</label>
                  <input
                    type="text"
                    value={manualId}
                    className="p-2 cus-tool-form"
                    onChange={(e) => setManualId(e.target.value)}
                    required={true}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Customers</label>
                  <Select
                    id="ser-ticket-2"
                    options={toOpt}
                    onChange={(v) => setTo(v)}
                    value={to}
                    required={true}
                    onInputChange={handleInputChange}
                    placeholder={"Search Customer"}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
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
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Ticket Status</label>
                  <Select
                    id="ser-ticket-1"
                    options={ticketStatusOpt}
                    onChange={(v) => setTicketStatus(v)}
                    value={ticketStatus}
                    required={true}
                  />
                </div>

                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Contact Name</label>
                  <input
                    type="text"
                    value={contactName}
                    className="p-2 cus-tool-form"
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Tel#</label>
                  <input
                    type="text"
                    className="p-2 cus-tool-form"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Email</label>
                  <input
                    type="email"
                    className="p-2 cus-tool-form"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Customer Order No</label>
                  <input
                    className="p-2 cus-tool-form"
                    type="text"
                    value={customerOrderNo}
                    onChange={(e) => setCustomerOrderNo(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Created By</label>
                  <input
                    type="text"
                    className="p-2 cus-tool-form"
                    value={createdBy}
                    disabled={true}
                    //   onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                {ticketStatus.value == "To Be Assigned" ? null : (
                  <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                    <label className="font-semibold">Assigned To</label>
                    <Select
                      id="ser-ticket-2"
                      options={assignedToOpt}
                      onChange={(v) => setAssignedTo(v)}
                      value={assignedTo}
                    />
                  </div>
                )}
                {/* <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
            <label className="font-semibold">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              className="p-2 cus-tool-form"
            />
          </div> */}
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Job Name</label>
                  <input
                    className="p-2 cus-tool-form"
                    type="text"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Job Location</label>
                  <input
                    className="p-2 cus-tool-form"
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                  <label className="font-semibold">Invoice Date</label>
                  {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => console.log("clicked")}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !invoiceDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {invoiceDate ? (
                    moment(invoiceDate).format("MM-DD-YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 cus-calendar">
                <Calendar
                  mode="single"
                  selected={invoiceDate}
                  onSelect={(date) => setInvoiceDate(date)}
                />
              </PopoverContent>
            </Popover> */}
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => {
                      setInvoiceDate(e.target.value);
                    }}
                    className="p-2 cus-tool-form"
                  />
                </div>
                {/* <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
            <label className="font-semibold">Terms</label>
            <Select
              id="ser-ticket-6"
              options={termsOpt}
              onChange={(v) => setTerms(v)}
              value={terms}
            />
          </div> */}
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ width: "100% !important", margin: "0 !important" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography component="span">Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-row gap-5 flex-wrap w-full">
                <div className="flex flex-col mobile-responsive-full w-full gap-2">
                  <label className="font-semibold">Description Of Work</label>
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
          </Accordion>
          <Accordion sx={{ width: "100% !important", margin: "0 !important" }}>
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
                  className="flex flex-col mobile-responsive-full w-1/4 gap-2"
                  style={{ width: "100%" }}
                >
                  <p
                    className="bg-orange-400 p-2 rounded-xl text-white self-start hover:cursor-pointer"
                    onClick={() => handleLaborArr()}
                  >
                    &#10011; Labor
                  </p>
                  <p style={{ marginTop: "10px", fontWeight: "600" }}>
                    total labor :${" "}
                    {laborArr.length == 0
                      ? "0"
                      : laborArr.length == 1
                      ? laborArr.map((i) => i.amount)
                      : laborArr.reduce(
                          (a, s) => Number(a) + Number(s.amount),
                          0
                        )}
                  </p>
                </div>
                {laborArr.length
                  ? laborArr.map((i) => {
                      return (
                        <div
                          key={i.id}
                          className="flex flex-row gap-2 flex-wrap w-full"
                        >
                          <div className="flex flex-col mobile-responsive-full w-[200px] gap-2">
                            <label className="font-semibold">Date</label>
                            <input
                              type="date"
                              className="p-2 cus-tool-form"
                              // value={moment(i.date).format("yyyy-MM-DD")}
                              value={i.date == "" ? "" : formatDate(i.date)}
                              onChange={(e) =>
                                handleDateInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                            <label className="font-semibold">Employee</label>
                            <Select
                              id="ser-ticket-6"
                              options={assignedToOpt}
                              onChange={(e) =>
                                handleUserInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                              value={{ label: i.employee, value: i.employee }}
                            />
                          </div>
                          <div className="flex flex-col mobile-responsive-full w-[200px] gap-2">
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
                          <div className="flex flex-col mobile-responsive-full w-[200px] gap-2">
                            <label className="font-semibold">Rate</label>
                            <input
                              type="text"
                              className="p-2 cus-tool-form"
                              value={i.rate}
                              onChange={(e) =>
                                handleHourInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col mobile-responsive-full w-[200px] gap-2">
                            <label className="font-semibold">Amount($)</label>
                            <input
                              type="text"
                              className="p-2 cus-tool-form"
                              value={i.amount}
                              disabled={true}
                              onChange={(e) =>
                                handleAmountInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col mobile-responsive-full w-[200px] gap-2">
                            <label className="font-semibold">Tax Status</label>
                            <Select
                              id="ser-ticket-7"
                              options={[
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                              ]}
                              onChange={(v) =>
                                handleTaxLaborStatus(
                                  v,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                              value={{ label: i.taxStatus, value: i.taxStatus }}
                            />
                          </div>
                          <div className="flex flex-col mobile-responsive-full w-[90%] gap-2">
                            <label className="font-semibold">Description</label>
                            <input
                              type="text"
                              className="p-2 cus-tool-form"
                              value={i.description}
                              onChange={(e) =>
                                handleLaborDescInp(
                                  e,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                            />
                          </div>

                          {laborArr.length > 0 ? (
                            <span
                              className="minus hover:cursor-pointer"
                              style={{ fontSize: "22px" }}
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
          </Accordion>
          <Accordion sx={{ width: "100% !important", margin: "0 !important" }}>
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
                  className="flex flex-col mobile-responsive-full w-1/4 gap-2"
                  style={{ width: "100%" }}
                >
                  <p
                    className="bg-orange-400 text-white p-2 rounded-xl self-start hover:cursor-pointer"
                    onClick={() => handleMaterialArr()}
                  >
                    &#10011; Materials
                  </p>
                  <p style={{ marginTop: "10px", fontWeight: "600" }}>
                    total Materials :${" "}
                    {materialArr.length == 0
                      ? "0"
                      : materialArr.length == 1
                      ? materialArr.map((i) => i.amount)
                      : materialArr.reduce(
                          (a, s) => Number(a) + Number(s.amount),
                          0
                        )}
                  </p>
                </div>
                {materialArr.length
                  ? materialArr.map((i) => {
                      return (
                        <div key={i.id} className="flex flex-row gap-2">
                          <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
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
                          <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                            <label className="font-semibold">Rate</label>
                            <input
                              type="text"
                              className="p-2 cus-tool-form"
                              value={i.rate}
                              onChange={(e) => handleMaterialHourInp(e, i.id)}
                            />
                          </div>
                          <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                            <label className="font-semibold">Amount($)</label>
                            <input
                              type="text"
                              className="p-2 cus-tool-form"
                              value={i.amount}
                              disabled={true}
                              onChange={(e) => handleMaterialAmountInp(e, i.id)}
                            />
                          </div>
                          <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                            <label className="font-semibold">Description</label>
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
                          <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
                            <label className="font-semibold">Tax Status</label>
                            <Select
                              id="ser-ticket-7"
                              options={[
                                { label: "Yes", value: "Yes" },
                                { label: "No", value: "No" },
                              ]}
                              onChange={(v) =>
                                handleTaxMaterialStatus(
                                  v,
                                  i.id == undefined ? i._id : i.id
                                )
                              }
                              value={{ label: i.taxStatus, value: i.taxStatus }}
                            />
                          </div>

                          {materialArr.length > 0 ? (
                            <span
                              className="minus hover:cursor-pointer"
                              style={{ fontSize: "22px" }}
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
            </AccordionDetails>
          </Accordion>
          {/* <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
            <label className="font-semibold">Tax Status</label>
            <Select
              id="ser-ticket-7"
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ]}
              onChange={(v) => setTaxStatus(v)}
              value={taxStatus}
            />
          </div> */}

          {/* <div className="flex flex-col mobile-responsive-full w-1/4 gap-2">
            <label className="font-semibold">Attachments</label>
            <input
              name="files"
              className={`${poppins.className} input-cus`}
              type="file"
              multiple={true}
              onChange={handleUpload}
              accept="image/png,image/jpeg"
            />
            {edit &&
            fileUpload &&
            fileUpload !== undefined &&
            newFileFlag == false
              ? fileUpload.map((i, ind) => {
                  return <p key={`${i.filename} ${ind}`}>{i.filename}</p>;
                })
              : null}
          </div> */}
          <div className="flex flex-row justify-end w-full mt-10">
            <input
              className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
              type="submit"
              value={
                loaderOuter ? "Saving..." : edit ? "Edit Ticket" : "Add Ticket"
              }
            />
          </div>
        </form>
      </div>
    </Drawer>
  );
}

export default ServiceDrawer;
