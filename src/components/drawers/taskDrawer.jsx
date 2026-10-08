import { Drawer } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import "./style.scss";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Select from "react-select";
import moment from "moment";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
import Swal from "sweetalert2";
import Image from "next/image";
function TaskDrawer({
  open,
  onClose,
  addTask,
  id,
  edit,
  data,
  loggedInUser,
  editTask,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dueDate, setDueDate] = useState("");
  const [taskCategoryOpt, setTaskCategoryOpt] = useState([]);
  const [taskCategory, setTaskCategory] = useState("");
  const [taskStatusOpt, setTaskStatusOpt] = useState([]);
  const [taskStatus, setTaskStatus] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [assignedToOpt, setAssignedToOpt] = useState([]);
  const [selectedModule, setSelectedModule] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [allEmp, setAllEmp] = useState([]);
  const [allJob, setAllJob] = useState([]);
  const [adminTask, setAdminTask] = useState(false);
  const [allTools, setAllTools] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [emp, setEmp] = useState([]);
  const [job, setJob] = useState([]);
  const [tool, setTool] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [taskPriority, setTaskPriority] = useState("");
  const [taskPriorityOpt, setTaskPriorityOpt] = useState("");
  const [user, setUser] = useState(loggedInUser ? loggedInUser.fullname : "");
  const [jobNumberOpt, setJobNumberOpt] = useState([]);
  const [tagTaskOpt, setTagTaskOpt] = useState([]);
  const [tags, setTags] = useState([]);
  const [jobNumber, setJobNumber] = useState("");
  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/clients/?page=1&pageSize=50`)
      .then((res) => {
        setAllClients(
          res.data.clients.map((inner) => {
            return {
              label: inner.customerName,
              value: inner.customerName,
              selectedModule: "Clients",
              id: inner.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/jobNumber/`)
      .then((res) => {
        setJobNumberOpt(
          res.data.jobNumbers
            .map((inner) => {
              return {
                label: `${inner.jobNumber} - ${inner.jobName}`,
                value: `${inner.jobNumber} - ${inner.jobName}`,
                selectedModule: "Jobs",
                id: inner.id,
              };
            })
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/tagTask/`)
      .then((res) => {
        setTagTaskOpt(
          res.data.taskTags
            .map((inner) => {
              return {
                label: inner.name,
                value: inner.name,
              };
            })
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/job/`)
      .then((res) => {
        setAllJob(
          res.data.jobs
            .map((inner) => {
              return {
                label: `${inner.jobId} - ${inner.jobType}`,
                value: `${inner.jobId} - ${inner.jobType}`,
              };
            })
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/devices/`)
      .then((res) => {
        setAllDevices(
          res.data.devices.map((inner) => {
            return {
              label: inner.make,
              value: inner.make,
              selectedModule: "Devices",
              id: inner.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        setAllEmp(
          res.data.allUsers.map((inner) => {
            return {
              label: inner.fullname,
              value: inner.fullname,
              selectedModule: "Employees",
              id: inner.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${apiPath.prodPath}/api/job/`)
      .then((res) => {
        setAllJob(
          res.data.jobs.map((inner) => {
            return {
              label: inner.jobId,
              value: inner.jobId,
              selectedModule: "Jobs",
              id: inner.id,
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
        setAllTools(
          res.data.allTools.map((inner) => {
            return {
              label: inner.toolNumber,
              value: inner.toolNumber,
              selectedModule: "Tools",
              id: inner.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${apiPath.prodPath}/api/vehicles/`)
      .then((res) => {
        setAllVehicles(
          res.data.vehicles.map((inner) => {
            return {
              label: inner.vehicleNo,
              value: inner.vehicleNo,
              selectedModule: "Vehicles",
              id: inner.id,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${apiPath.prodPath}/api/taskCategory`)
      .then((res) => {
        setTaskCategoryOpt(
          res.data.taskCategory
            .map((i) => {
              return { label: i.name, value: i.name };
            })
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/taskStatus`)
      .then((res) => {
        setTaskStatusOpt(
          res.data.taskStatus.map((i) => {
            return { label: i.name, value: i.name };
          })
        );
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/taskPriority`)
      .then((res) => {
        setTaskPriorityOpt(
          res.data.taskPriority.map((i) => {
            return { label: i.name, value: i.name };
          })
        );
      })
      .catch((err) => console.log(err));
    axios
      .get(`${apiPath.prodPath}/api/users`)
      .then((res) => {
        setAssignedToOpt(
          res.data.allUsers.map((i) => {
            return { label: i.fullname, value: i.fullname, email: i.email };
          })
        );
      })
      .catch((err) => console.log(err));
    if (edit) {
      setCurrentDate(new Date(data.currentDate));
      setDueDate(
        data.dueDate == "" ? "" : moment(data.dueDate).format("yyyy-MM-DD")
      );
      setUser(data.user);
      setTaskPriority({ label: data.taskPriority, value: data.taskPriority });
      setJobNumber(
        data.jobNumber == ""
          ? ""
          : { label: data.jobNumber, value: data.jobNumber }
      );
      setDescription(data.description);
      setTaskCategory({ label: data.taskCategory, value: data.taskCategory });
      setTaskStatus({ label: data.taskStatus, value: data.taskStatus });
      setAssignedTo(
        data.assignedTo.map((i) => {
          return { label: i.fullname, value: i.fullname, email: i.email };
        })
      );
      setTags(
        data.tags && data.tags.length
          ? data.tags.map((i) => {
              return { label: i.tagName, value: i.tagName };
            })
          : []
      );
      setAdminTask(data.adminTask);
      setSelectedModule(
        data.selectedModule.map((i) => {
          return { label: i, value: i };
        })
      );
      data.selectedModule.forEach((element) => {
        if (element == "Clients") {
          if (data.moduleArr.filter((i) => i !== null).length) {
            let arr = [];
            data.moduleArr.forEach((outer) => {
              if (outer.length) {
                outer.forEach((inner) => {
                  if (inner.selectedModule == "Clients") {
                    arr = [inner, ...arr];
                  }
                });
              } else {
                arr = [outer, ...arr];
              }
            });
            setClients(arr);
          } else {
            setClients("");
          }
        }
        if (element == "Devices") {
          if (data.moduleArr.filter((i) => i !== null).length) {
            let arr = [];
            data.moduleArr.forEach((outer) => {
              if (outer.length) {
                outer.forEach((inner) => {
                  if (inner.selectedModule == "Devices") {
                    arr = [inner, ...arr];
                  }
                });
              } else {
                arr = [outer, ...arr];
              }
            });
            setDevices(arr);
          } else {
            setDevices("");
          }
        }
        if (element == "Employees") {
          if (data.moduleArr.filter((i) => i !== null).length) {
            let arr = [];
            data.moduleArr.forEach((outer) => {
              if (outer.length) {
                outer.forEach((inner) => {
                  if (inner.selectedModule == "Employees") {
                    arr = [inner, ...arr];
                  }
                });
              } else {
                arr = [outer, ...arr];
              }
            });
            setEmp(arr);
          } else {
            setEmp("");
          }
        }
        if (element == "Jobs") {
          if (data.moduleArr.filter((i) => i !== null).length) {
            let arr = [];
            data.moduleArr.forEach((outer) => {
              if (outer.length) {
                outer.forEach((inner) => {
                  if (inner.selectedModule == "Jobs") {
                    arr = [inner, ...arr];
                  }
                });
              } else {
                arr = [outer, ...arr];
              }
            });
            setJob(arr);
          } else {
            setJob("");
          }
        }
        if (element == "Tools") {
          if (data.moduleArr.filter((i) => i !== null).length) {
            let arr = [];
            data.moduleArr.forEach((outer) => {
              if (outer.length) {
                outer.forEach((inner) => {
                  if (inner.selectedModule == "Tools") {
                    arr = [inner, ...arr];
                  }
                });
              } else {
                arr = [outer, ...arr];
              }
            });
            setTool(arr);
          } else {
            setTool("");
          }
        }
        if (element == "Vehicles") {
          if (data.moduleArr.filter((i) => i !== null).length) {
            let arr = [];
            data.moduleArr.forEach((outer) => {
              if (outer.length) {
                outer.forEach((inner) => {
                  if (inner.selectedModule == "Vehicles") {
                    arr = [inner, ...arr];
                  }
                });
              } else {
                arr = [outer, ...arr];
              }
            });
            setVehicle(arr);
          } else {
            setVehicle("");
          }
        }
      });
    }
  }, [open]);
  const handleInputChange = (value) => {
    if (value.length > 1) {
      axios
        .get(`${apiPath.prodPath}/api/clients/${value}`)
        .then((res) => {
          const arrNew = res.data.clients
            .sort((a, b) => a.customerName.localeCompare(b.customerName))
            .map((i) => {
              return {
                label: i.customerName,
                value: i.customerName,
                selectedModule: "Clients",
                id: i.id,
              };
            });
          setAllClients(arrNew);
        })
        .catch((err) => console.log(err));
    } else if (value.length == 0) {
      setClientsRef();
    }
  };
  const setClientsRef = async () => {
    await axios
      .get(`${apiPath.prodPath}/api/clients/?page=1&pageSize=50`)
      .then((res) => {
        const sorted = res.data.clients
          .sort((a, b) => a.customerName.localeCompare(b.customerName))
          .map((i) => {
            return {
              label: i.customerName,
              value: i.customerName,
              selectedModule: "Clients",
              id: i.id,
            };
          });
        setAllClients(sorted);
      });
  };
  function validatePhoneNumber(input_str) {
    const re = /^[0-9-]+$/;
    return re.test(input_str);
  }
  const validatePhone = (phone) => {
    const flagPhone = validatePhoneNumber(phone);
    if (flagPhone) {
      setPhoneNo(phone);
    }
  };
  const handleAdminTask = (e) => {
    setAdminTask(e.target.checked);
  };
  const handleAddDevice = (e) => {
    e.preventDefault();
    const dataObj = {
      currentDate,
      user,
      taskCategory: taskCategory.value,
      dueDate,
      description,
      jobNumber:
        jobNumber == ""
          ? ""
          : jobNumber.value == undefined
          ? ""
          : jobNumber.value,
      updated: edit ? (taskStatus.value !== "Completed" ? true : false) : false,
      taskStatus: taskStatus.value,
      taskPriority: taskPriority.value,
      assignedTo: assignedTo.map((i) => {
        return { fullname: i.label, email: i.email };
      }),
      selectedModule: selectedModule.length
        ? selectedModule.map((i) => {
            return i.value;
          })
        : [],
      moduleArr: selectedModule.length
        ? selectedModule.map((item) => {
            if (item.label == "Devices") {
              return devices;
            }
            if (item.label == "Clients") {
              return clients;
            }
            if (item.label == "Employees") {
              return emp;
            }
            if (item.label == "Jobs") {
              return job;
            }
            if (item.label == "Tools") {
              return tool;
            }
            if (item.label == "Vehicles") {
              return vehicle;
            }
          })
        : [],
      adminTask: adminTask,
      tags: tags.map((item) => {
        return { tagName: item.value };
      }),
    };
    if (edit) {
      var assignedToUsers = [];
      assignedToOpt.forEach((item) => {
        dataObj.assignedTo.forEach((el) => {
          if (el.fullname == item.label) {
            assignedToUsers = [
              ...assignedToUsers,
              { fullname: item.label, email: item.email },
            ];
          }
        });
      });
      editTask(dataObj, id, assignedToUsers);
      dataEntryRefresh();
    } else {
      var assignedToUsers = [];
      assignedToOpt.forEach((item) => {
        dataObj.assignedTo.forEach((el) => {
          if (el.fullname == item.label) {
            assignedToUsers = [
              ...assignedToUsers,
              { fullname: item.label, email: item.email },
            ];
          }
        });
      });

      addTask(dataObj, (id = null), assignedToUsers);
      dataEntryRefresh();
    }
  };
  const dataEntryRefresh = () => {
    setTaskCategory("");
    setDueDate("");
    setJobNumber("");
    setDescription("");
    setTaskStatus("");
    setAssignedTo([]);
    setSelectedModule("");
    setDevices("");
    setClients("");
    setEmp("");
    setJob("");
    setVehicle("");
    setTool("");
    setTaskPriority("");
  };
  const selectedModuleOpt = [
    { label: "Clients", value: "Clients" },
    { label: "Devices", value: "Devices" },
    { label: "Employees", value: "Employees" },
    { label: "Jobs", value: "Jobs" },
    { label: "Tools", value: "Tools" },
    { label: "Vehicles", value: "Vehicles" },
  ];
  const handleModuleSelection = (value) => {
    setSelectedModule(value);
  };
  const handleTaskStatus = (value) => {
    if (edit) {
      if (value.value == "Completed") {
        if (data.subTasks.length > 0) {
          const checkArr = data.subTasks.map((el) => {
            if (el.taskStatus == "Completed") {
              return true;
            } else {
              return false;
            }
          });
          if (checkArr.filter((i) => i == true).length == 0) {
            Swal.fire({
              icon: "error",
              text: "Cannot mark the main Task Completed if sub Tasks are still pending",

              confirmButtonColor: "orange",
            });
          } else {
            setTaskStatus(value);
          }
        } else {
          setTaskStatus(value);
        }
      } else {
        setTaskStatus(value);
      }
    } else {
      setTaskStatus(value);
    }
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
          </span>{" "}
          {edit ? "Edit Task" : "Add Task"}
        </h1>
        <form
          onSubmit={handleAddDevice}
          className="flex flex-row gap-5 flex-wrap w-full mt-9"
        >
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Current Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => console.log("clicked")}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !currentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {currentDate ? (
                    moment(currentDate).format("MM-DD-YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 cus-calendar">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => setCurrentDate(date)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">User</label>
            <input
              className="p-2 cus-tool-form"
              type="text"
              value={user}
              disabled
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Task Category</label>
            <Select
              className={poppins.className}
              id="task-id-cus-2"
              options={taskCategoryOpt}
              value={taskCategory}
              onChange={(value) => setTaskCategory(value)}
              isDisabled={
                edit ? (data.taskStatus == "Completed" ? true : false) : false
              }
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Due Date</label>
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button
                  onClick={() => console.log("clicked")}
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    moment(dueDate).format("MM-DD-YYYY")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 cus-calendar">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => setDueDate(date)}
                />
              </PopoverContent>
            </Popover> */}
            <input
              type="date"
              value={dueDate}
              className="border-[1px] border-[#dfdfdf] rounded-[8px] p-2"
              onChange={(e) => setDueDate(e.target.value)}
            />
            {dueDate !== "" ? (
              <p onClick={() => setDueDate("")} className="clear-value">
                Clear
              </p>
            ) : null}
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Job Number</label>
            <Select
              className={poppins.className}
              id="task-id-cus-4"
              options={jobNumberOpt}
              value={jobNumber}
              onChange={(value) => setJobNumber(value)}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2" style={{ width: "100%" }}>
            <label className="font-semibold">Description</label>
            <textarea
              type="text"
              rows={3}
              cols={12}
              className="p-2 cus-tool-form"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={
                edit ? (data.taskStatus == "Completed" ? true : false) : false
              }
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Task Status</label>
            <Select
              className={poppins.className}
              id="task-id-cus-4"
              options={taskStatusOpt}
              value={taskStatus}
              onChange={(value) => {
                handleTaskStatus(value);
              }}
              isDisabled={
                edit ? (data.taskStatus == "Completed" ? true : false) : false
              }
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Task Priority</label>
            <Select
              className={poppins.className}
              id="task-id-cus-5"
              options={taskPriorityOpt}
              value={taskPriority}
              onChange={(v) => setTaskPriority(v)}
              isDisabled={
                edit ? (data.taskStatus == "Completed" ? true : false) : false
              }
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2" style={{ width: "100%" }}>
            <label className="font-semibold">Assigned To</label>
            <Select
              isMulti
              id="task-id-cus-6"
              value={assignedTo}
              className={poppins.className}
              options={assignedToOpt}
              onChange={(v) => setAssignedTo(v)}
              isDisabled={
                edit ? (data.taskStatus == "Completed" ? true : false) : false
              }
            />
          </div>

          <div className="flex flex-col w-1/4 gap-2" style={{ width: "100%" }}>
            <label className="font-semibold">Module</label>
            <Select
              className={poppins.className}
              id="task-id-cus-7"
              options={selectedModuleOpt}
              value={selectedModule}
              isMulti={true}
              onChange={handleModuleSelection}
              isDisabled={
                edit ? (data.taskStatus == "Completed" ? true : false) : false
              }
            />
          </div>
          {selectedModule.length
            ? selectedModule
                .filter((i) => i.label == "Devices")
                .map((i) => {
                  return (
                    <div key={i} className="flex flex-col w-1/4 gap-2">
                      <label className="font-semibold">{i.label}</label>
                      <Select
                        isMulti={true}
                        className={poppins.className}
                        options={allDevices}
                        id="task-id-cus-8"
                        value={devices}
                        onChange={(value) => setDevices(value)}
                        isDisabled={
                          edit
                            ? data.taskStatus == "Completed"
                              ? true
                              : false
                            : false
                        }
                      />
                    </div>
                  );
                })
            : null}
          {selectedModule.length
            ? selectedModule
                .filter((i) => i.label == "Clients")
                .map((i) => {
                  return (
                    <div key={i} className="flex flex-col w-1/4 gap-2">
                      <label className="font-semibold">{i.label}</label>
                      <Select
                        className={poppins.className}
                        id="task-id-cus-9"
                        isMulti={true}
                        onInputChange={handleInputChange}
                        options={allClients}
                        value={clients}
                        onChange={(value) => setClients(value)}
                        isDisabled={
                          edit
                            ? data.taskStatus == "Completed"
                              ? true
                              : false
                            : false
                        }
                      />
                    </div>
                  );
                })
            : null}
          {selectedModule.length
            ? selectedModule
                .filter((i) => i.label == "Employees")
                .map((i) => {
                  return (
                    <div key={i} className="flex flex-col w-1/4 gap-2">
                      <label className="font-semibold">{i.label}</label>
                      <Select
                        className={poppins.className}
                        id="task-id-cus-10"
                        isMulti={true}
                        options={allEmp}
                        value={emp}
                        onChange={(value) => setEmp(value)}
                        isDisabled={
                          edit
                            ? data.taskStatus == "Completed"
                              ? true
                              : false
                            : false
                        }
                      />
                    </div>
                  );
                })
            : null}
          {selectedModule.length
            ? selectedModule
                .filter((i) => i.label == "Jobs")
                .map((i) => {
                  return (
                    <div key={i} className="flex flex-col w-1/4 gap-2">
                      <label className="font-semibold">{i.label}</label>
                      <Select
                        className={poppins.className}
                        id="task-id-cus-11"
                        isMulti={true}
                        options={jobNumberOpt}
                        value={job}
                        onChange={(value) => setJob(value)}
                        isDisabled={
                          edit
                            ? data.taskStatus == "Completed"
                              ? true
                              : false
                            : false
                        }
                      />
                    </div>
                  );
                })
            : null}
          {selectedModule.length
            ? selectedModule
                .filter((i) => i.label == "Tools")
                .map((i) => {
                  return (
                    <div key={i} className="flex flex-col w-1/4 gap-2">
                      <label className="font-semibold">{i.label}</label>
                      <Select
                        className={poppins.className}
                        id="task-id-cus-12"
                        isMulti={true}
                        options={allTools}
                        value={tool}
                        onChange={(value) => setTool(value)}
                        isDisabled={
                          edit
                            ? data.taskStatus == "Completed"
                              ? true
                              : false
                            : false
                        }
                      />
                    </div>
                  );
                })
            : null}
          {selectedModule.length
            ? selectedModule
                .filter((i) => i.label == "Vehicles")
                .map((i) => {
                  return (
                    <div key={i} className="flex flex-col w-1/4 gap-2">
                      <label className="font-semibold">{i.label}</label>
                      <Select
                        className={poppins.className}
                        id="task-id-cus-13"
                        isMulti={true}
                        options={allVehicles}
                        value={vehicle}
                        onChange={(value) => setVehicle(value)}
                        isDisabled={
                          edit
                            ? data.taskStatus == "Completed"
                              ? true
                              : false
                            : false
                        }
                      />
                    </div>
                  );
                })
            : null}
          <div className="flex flex-col w-1/4 gap-2" style={{ width: "100%" }}>
            <div className="flex flex-col w-1/4 gap-2">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={adminTask}
                    onChange={handleAdminTask}
                    inputProps={{ "aria-label": "controlled" }}
                    value={"Admin Task"}
                  />
                }
                label="Admin Task"
              />
            </div>
          </div>
          <div className="flex flex-col w-1/4 gap-2" style={{ width: "100%" }}>
            <label className="font-semibold">Task Tags</label>
            <Select
              isMulti
              id="task-id-cus-6"
              value={tags}
              className={poppins.className}
              options={tagTaskOpt}
              onChange={(v) => setTags(v)}
            />
          </div>
          <div className="flex flex-row justify-end w-full mt-10">
            <input
              className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
              type="submit"
              value={edit ? "Edit Task" : "Add Task"}
              disabled={
                edit ? (data.taskStatus == "Completed" ? true : false) : false
              }
            />
          </div>
        </form>
      </div>
    </Drawer>
  );
}

export default TaskDrawer;
