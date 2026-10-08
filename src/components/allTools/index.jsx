"use client";
import Select from "react-select";
import React, { useState, useEffect } from "react";
import "./tools.scss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import AllToolsTable from "../tables/allToolsTable";
import * as XLSX from "xlsx";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AllToolsDrawer from "../drawers/allToolsDrawer";

const filterOpt = [
  { label: "Serial No", value: "serialNo" },
  { label: "Tool No", value: "toolNo" },
  { label: "Description", value: "description" },
  { label: "Tech Assigned", value: "techAssigned" },
  { label: "Location", value: "location" },
  { label: "Job", value: "Job" },
  { label: "Vehicle", value: "Vehicle" },
  { label: "Category", value: "Category" },
];
function AllTools() {
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState({
    label: "Serial No",
    value: "serialNo",
  });

  const [jobOpt, setJobOpt] = useState([]);

  const [vehicleOpt, setVehicleOpt] = useState([]);
  const [categoryOpt, setCategoryOpt] = useState([]);
  const [allTools, setAllTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [toolFlag, setToolFlag] = useState(false);
  const [toolLabel, setToolLabel] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  useEffect(() => {
    setLoading(true);
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
      .get(`${apiPath.prodPath}/api/allTools/`)
      .then((res) => {
        setAllTools(res.data.allTools.filter((i) => i.status == "Active"));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  const handleFilters = (e) => {
    e.preventDefault();
    setLoading(true);
    var url = "";
    if (search == "") {
      return false;
    }
    if (searchFilter.value == "Job") {
      url = `${apiPath.prodPath}/api/allTools/${search.value}&&${searchFilter.value}`;
    } else if (searchFilter.value == "Vehicle") {
      url = `${apiPath.prodPath}/api/allTools/${search.value}&&${searchFilter.value}`;
    } else if (searchFilter.value == "Category") {
      url = `${apiPath.prodPath}/api/allTools/${search.value}&&${searchFilter.value}`;
    } else {
      url = `${apiPath.prodPath}/api/allTools/${search}&&${searchFilter.value}`;
    }

    axios
      .get(url)
      .then((res) => {
        setAllTools(res.data.allTools.filter((i) => i.status == activeTab));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const generateReport = () => {
    var mappedData = [];
    allTools.forEach((i) => {
      mappedData = [
        {
          tool: i.toolNumber,
          category: i.category,
          subCategory: i.subCategory,
          description: i.description,
          techAssigned: i.techAssigned,
          checkedOut: i.checkedOut,
          age:
            daysBetween(i.dueDate) < 0
              ? "Overdue"
              : `${daysBetween(i.dueDate)} Days left`,
          dueDate: moment(i.dueDate).format("MM-DD-YYYY"),
        },
        ...mappedData,
      ];
    });
    try {
      setLoadingFile(true);
      // Create Excel workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils?.json_to_sheet(
        mappedData.sort((a, b) => a.tool.localeCompare(b.tool))
      );
      XLSX.utils.book_append_sheet(workbook, worksheet, "tool track report");
      // Save the workbook as an Excel file
      XLSX.writeFile(workbook, `toolTrackReport.xlsx`);
      setLoadingFile(false);
    } catch (error) {
      setLoadingFile(false);
      console.log("#==================Export Error", error.message);
    }
  };
  function addDays(date, days) {
    if (days == "" || days == undefined || days == "undefined") {
      return "";
    } else {
      const newDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
      return newDate;
    }
  }
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/allTools/`)
      .then((res) => {
        setAllTools(res.data.allTools.filter((i) => i.status == "Active"));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleActive = (status) => {
    setActiveTab(status);
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/allTools/`)
      .then((res) => {
        setAllTools(res.data.allTools.filter((i) => i.status == status));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleCloseDrawer = () => {
    setDrawer(false);
  };
  const addTool = (data, cb = null, serial) => {
    axios
      .patch(
        `${apiPath.prodPath}/api/allTools/findSerial/${
          serial == "" ? "null" : serial
        }`
      )
      .then((res) => {
        if (res.data && res.data.error) {
          Swal.fire({
            icon: "warning",
            text: "Are you sure you want duplicate serial no?",
            showConfirmButton: true,
            showCancelButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              axios
                .post(`${apiPath.prodPath}/api/allTools/addTools`, data)
                .then((res) => {
                  if (res.data && res.data.error) {
                    Swal.fire({
                      icon: "error",
                      title: `Error`,
                      text: res.data.error.message.includes("toolNumber")
                        ? "This tool already exits Please add a different value"
                        : "Error adding tool",
                      confirmButtonColor: "orange",
                    });
                  } else {
                    Swal.fire({
                      icon: "success",
                      text: "Added Successfully",
                    });
                    handleCloseDrawer();
                    refreshData();
                    cb();
                  }
                })
                .catch((err) => console.log(err));
            }
          });
        } else {
          console.log("here in false", res.data.error);
          axios
            .post(`${apiPath.prodPath}/api/allTools/addTools`, data)
            .then((res) => {
              if (res.data && res.data.error) {
                Swal.fire({
                  icon: "error",
                  title: `Error`,
                  text: res.data.error.message.includes("toolNumber")
                    ? "This tool already exits Please add a different value"
                    : "Error adding tool",
                  confirmButtonColor: "orange",
                });
              } else {
                Swal.fire({
                  icon: "success",
                  text: "Added Successfully",
                });
                handleCloseDrawer();
                refreshData();
                cb();
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };
  const handleClear = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/allTools/`)
      .then((res) => {
        setLoading(false);
        setSearch("");
        setAllTools(res.data.allTools.filter((i) => i.status == "Active"));
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleToolSorting = (toolSortLable, toolSortFlag) => {
    if (toolSortLable == "Last Updated") {
      setToolLabel("Last Updated");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated))
          : allTools.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Category") {
      setToolLabel("Category");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.category.localeCompare(b.category))
          : allTools.sort((a, b) => b.category.localeCompare(a.category));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Sub-Category") {
      setToolLabel("Sub-Category");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.subCategory.localeCompare(b.subCategory))
          : allTools.sort((a, b) => b.subCategory.localeCompare(a.subCategory));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Brand") {
      setToolLabel("Brand");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.brand.localeCompare(b.brand))
          : allTools.sort((a, b) => b.brand.localeCompare(a.brand));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Description") {
      setToolLabel("Description");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) =>
              a.toolDescription.localeCompare(b.toolDescription)
            )
          : allTools.sort((a, b) =>
              b.toolDescription.localeCompare(a.toolDescription)
            );
      setAllTools(sortedData);
    }
    if (toolSortLable == "Tech Assigned") {
      setToolLabel("Tech Assigned");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) =>
              a.techAssigned.localeCompare(b.techAssigned)
            )
          : allTools.sort((a, b) =>
              b.techAssigned.localeCompare(a.techAssigned)
            );
      setAllTools(sortedData);
    }
    if (toolSortLable == "Project") {
      setToolLabel("Project");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.job.localeCompare(b.job))
          : allTools.sort((a, b) => b.job.localeCompare(a.job));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Vehicle") {
      setToolLabel("Vehicle");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.vehicle.localeCompare(b.vehicle))
          : allTools.sort((a, b) => b.vehicle.localeCompare(a.vehicle));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Location") {
      setToolLabel("Location");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.location.localeCompare(b.location))
          : allTools.sort((a, b) => b.location.localeCompare(a.location));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Age") {
      setToolLabel("Age");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) =>
              a.purchaseDate.localeCompare(b.purchaseDate)
            )
          : allTools.sort((a, b) =>
              b.purchaseDate.localeCompare(a.purchaseDate)
            );
      setAllTools(sortedData);
    }
    if (toolSortLable == "Due Date") {
      setToolLabel("Due Date");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
          : allTools.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Tool Number") {
      setToolLabel("Tool Number");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.toolNumber.localeCompare(b.toolNumber))
          : allTools.sort((a, b) => b.toolNumber.localeCompare(a.toolNumber));
      setAllTools(sortedData);
    }
    if (toolSortLable == "Checked Out") {
      setToolLabel("Checked Out");
      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.checkedOut - b.checkedOut)
          : allTools.sort((a, b) => b.checkedOut - a.checkedOut);
      setAllTools(sortedData);
    }
    if (toolSortLable == "Category") {
      setToolLabel("Category");

      const sortedData =
        toolSortFlag == false
          ? allTools.sort((a, b) => a.category.localeCompare(b.category))
          : allTools.sort((a, b) => b.category.localeCompare(a.category));
      setAllTools(sortedData);
    }
    setToolFlag(!toolSortFlag);
  };
  function daysBetween(endDate) {
    // The number of milliseconds in one day
    const oneDay = 1000 * 60 * 60 * 24; // 86400000 milliseconds
    const newDate = new Date();
    // Convert both dates to UTC timestamps at midnight
    const date1_UTC = Date.UTC(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate()
    );
    const finalDate = new Date(endDate);
    const date2_UTC = Date.UTC(
      finalDate.getFullYear(),
      finalDate.getMonth(),
      finalDate.getDate()
    );

    // Calculate the difference in milliseconds and convert to days
    // Math.abs() is used to ensure a positive result regardless of date order
    // Math.round() helps handle potential 1-hour shifts due to DST changes correctly
    const differenceMs = Math.abs(date2_UTC - date1_UTC);
    return Math.round(differenceMs / oneDay);
    // var millisecondsPerDay = 24 * 60 * 60 * 1000;
    // return (
    //   Math.round(
    //     (treatAsUTC(endDate) - treatAsUTC(new Date())) / millisecondsPerDay
    //   ) + 1
    // );
  }
  return (
    <>
      <h2 className={`font-semibold text-2xl pt-2 pb-2`}>Tools</h2>
      <form onSubmit={handleFilters} className="w-1/3 flex flex-col">
        <Select
          options={filterOpt}
          value={searchFilter}
          onChange={(e) => {
            setSearchFilter(e);
          }}
          id="tool-select-cus"
        />
        <div className="flex flex-row gap-5">
          {searchFilter == "" ? null : searchFilter.value == "Job" ? (
            <Select
              className="mt-3 w-2/3"
              options={jobOpt}
              placeholder={"Job"}
              onChange={(v) => setSearch(v)}
              id="tool-select-cus-2"
              value={search}
            />
          ) : searchFilter.value == "Vehicle" ? (
            <Select
              className="mt-3 w-2/3 z-32"
              options={vehicleOpt}
              placeholder={"Vehicle"}
              onChange={(v) => setSearch(v)}
              id="tool-select-cus-2"
              value={search}
            />
          ) : searchFilter.value == "Category" ? (
            <Select
              className="mt-3 w-2/3 z-32"
              options={categoryOpt}
              placeholder={"Category"}
              onChange={(v) => setSearch(v)}
              id="tool-select-cus-2"
              value={search}
            />
          ) : (
            <input
              type="text"
              className="p-2 mt-3 w-2/3 cus-filter-inp"
              placeholder={
                searchFilter.value == "serialNo"
                  ? "Serial No"
                  : searchFilter.value == "toolNo"
                  ? "By Tool No"
                  : searchFilter.value == "description"
                  ? "By Description"
                  : searchFilter.value == "techAssigned"
                  ? "By Tech Assigned"
                  : "By Location"
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {searchFilter == "" ? null : (
            <input
              type="submit"
              className="p-2 mt-3 w-1/3 bg-orange-400 cus-search-btn self-center"
              value={"Search"}
            />
          )}
          {searchFilter == "" ? null : (
            <Button
              onClick={(e) => handleClear(e)}
              className="p-2 mt-3 bg-orange-400 text-white self-center rounded-[5px]"
            >
              Clear
            </Button>
          )}
        </div>
      </form>
      <div className="w-full flex flex-row justify-end gap-5">
        <button
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
          onClick={() => setDrawer(true)}
        >
          + Add Tools
        </button>
        <button
          onClick={() => generateReport()}
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
        >
          {loadingFile ? "Processing..." : "Generate Report"}
        </button>
      </div>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger
            onClick={() => handleActive("Active")}
            value="active"
            className="bg-transparent"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            onClick={() => handleActive("Inactive-Broken")}
            value="inactive"
            className="bg-transparent"
          >
            Inactive
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <AllToolsTable
              allTools={allTools}
              active={true}
              refreshData={refreshData}
              handleToolSort={(sortLabel, toolSortFlag) =>
                handleToolSorting(sortLabel, toolSortFlag)
              }
              toolAscDesc={toolFlag}
              toolLabel={toolLabel}
            />
          )}
        </TabsContent>
        <TabsContent value="inactive">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <AllToolsTable
              allTools={allTools}
              active={false}
              refreshData={refreshData}
              toolAscDesc={toolFlag}
              toolLabel={toolLabel}
              handleToolSort={(sortLabel, toolSortFlag) =>
                handleToolSorting(sortLabel, toolSortFlag)
              }
            />
          )}
        </TabsContent>
      </Tabs>
      <AllToolsDrawer
        addTool={addTool}
        open={drawer}
        onClose={handleCloseDrawer}
        edit={false}
      />
    </>
  );
}

export default AllTools;
