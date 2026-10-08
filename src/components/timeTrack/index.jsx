"use client";
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
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import Select from "react-select";
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
import jsPDF from "jspdf";
import "jspdf-autotable";
import TimeTrackTable from "../tables/timeTrackTable";
import { Skeleton } from "../ui/skeleton";
import TimeTrackDrawer from "../drawers/timeTrackDrawer";
import moment from "moment";
function TimeTrack() {
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobOpt, setJobOpt] = useState(false);
  const [timeTrack, setTimeTrack] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeSpecFlag, setActiveSpecFlag] = useState(true);
  const [currentItem, setCurrentItem] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateFilter, setDateFilter] = useState(false);
  const [dateSearch, setDateSearch] = useState(false);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [searchSelect, setSearchSelect] = useState({
    label: "Employee",
    value: "Employee",
  });
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${apiPath.prodPath}/api/timeTrack/?perPage=${perPage}&&page=${page}&&spectrum=${activeSpecFlag}`
      )
      .then((res) => {
        setTimeTrack(res.data.timeTracks.filter((i) => i.spectrum == true));
        setTotalCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    setLoadingUsers(true);
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const users = res.data.allUsers.map((i) => {
          return { label: i.fullname, value: i.fullname };
        });
        setAllUsers(users);
        setLoadingUsers(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingJobs(false);
        Swal.fire({
          icon: "warning",
          text: "Uneable to load Users",
          confirmButtonColor: "orange",
        });
      });
    axios
      .get(`${apiPath.prodPath}/api/jobNumber/`)
      .then((res) => {
        const jobs = res.data.jobNumbers.map((i) => {
          return {
            label: `${i.jobNumber} - ${i.jobName}`,
            value: `${i.jobNumber} - ${i.jobName}`,
          };
        });
        setJobOpt(jobs);
        setLoadingJobs(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingUsers(false);
        Swal.fire({
          icon: "warning",
          text: "Uneable to load Users",
          confirmButtonColor: "orange",
        });
      });
  }, [dateFilter, dateSearch]);
  const handleCloseDrawer = () => {
    setDrawer(!drawer);
  };
  // const addEmp = (data) => {
  //   axios
  //     .post(`${apiPath.prodPath}/api/users/addUser`, data)
  //     .then((res) => {
  //       if (res.data && res.data.error) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Error",
  //           text: "Error adding employee. The email used is already associated with another employee",
  //           timer: 1500,
  //         });
  //       }
  //       handleCloseDrawer();
  //       refreshData();
  //     })
  //     .catch((err) => console.log(err));
  // };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/timeTrack/?perPage=${20}&page=${1}`)
      .then((res) => {
        setTimeTrack(res.data.timeTracks);
        setTotalCount(res.data.count);
        setActiveSpecFlag(activeSpecFlag);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const getTimeTrackData = (perPageVal, pageVal) => {
    setLoading(true);
    axios
      .get(
        `${apiPath.prodPath}/api/timeTrack/?perPage=${perPageVal}&&page=${pageVal}&&spectrum=${activeSpecFlag}`
      )
      .then((res) => {
        setTimeTrack(
          res.data.timeTracks.filter((i) => i.spectrum == activeSpecFlag)
        );
        setTotalCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getTimeTrackDataByEmp = (perPageVal, pageVal) => {
    setLoading(true);
    axios
      .get(
        `${apiPath.prodPath}/api/timeTrack/${search.value}?perPage=${perPageVal}&page=${pageVal}&spectrum=${activeSpecFlag}`
      )
      .then((res) => {
        setTimeTrack(res.data.timeTrack);
        setTotalCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const getTimeTrackDataByJob = (perPageVal, pageVal) => {
    setLoading(true);
    axios
      .get(
        `${apiPath.prodPath}/api/timeTrack/searchByJob/${search}?perPage=${perPage}&page=${page}&spectrum=${activeSpecFlag}`
      )
      .then((res) => {
        setTimeTrack(res.data.timeTrack);
        setTotalCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const getTimeTrackDataByDate = (perPageVal, pageVal) => {
    if (startDate !== "" && endDate !== "") {
      setLoading(true);
      axios
        .get(
          `${apiPath.prodPath}/api/timeTrack/?startDate=${moment(
            startDate
          ).format("MM-DD-YYYY")}&endDate=${moment(endDate).format(
            "MM-DD-YYYY"
          )}&perPage=${perPageVal}&page=${pageVal}&spectrum=${activeSpecFlag}`
        )
        .then((res) => {
          setTimeTrack(res.data.timeTracks);
          setTotalCount(res.data.count);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      Swal.fire({
        icon: "warning",
        text: "Please Select both start and end Date",
        confirmButtonColor: "orange",
      });
    }
  };
  const handlePagination = (e, pageNew) => {
    if (pageNew == 0) {
      setPage(1);
      if (
        search == "" &&
        dateSearch == false &&
        searchSelect.value == "Employee" &&
        searchSelect.value !== "Job Description"
      ) {
        getTimeTrackData(20, 1);
      }
      if (searchSelect.value == "Employee" && search !== "") {
        getTimeTrackDataByEmp(20, 1);
      }
      if (searchSelect.value == "Job Description") {
        getTimeTrackDataByJob(20, 1);
      }
      if (dateSearch) {
        getTimeTrackDataByDate(20, 1);
      }
    } else {
      setPage(pageNew + 1);
      if (
        search == "" &&
        dateSearch == false &&
        searchSelect.value == "Employee" &&
        searchSelect.value !== "Job Description"
      ) {
        getTimeTrackData(20, pageNew + 1);
      }
      if (searchSelect.value == "Employee" && search !== "") {
        getTimeTrackDataByEmp(20, pageNew + 1);
      }
      if (searchSelect.value == "Job Description") {
        getTimeTrackDataByJob(20, pageNew + 1);
      }
      if (dateSearch) {
        getTimeTrackDataByDate(20, pageNew + 1);
      }
    }
  };
  const handleSearch = (e) => {
    setPerPage(20);
    setPage(1);
    setLoading(true);
    e.preventDefault();
    if (search == "") {
      return false;
    } else {
      var url = "";
      if (searchSelect.value == "Employee") {
        url = `${apiPath.prodPath}/api/timeTrack/${search.value}?perPage=${perPage}&page=${page}&spectrum=${activeSpecFlag}&searchSelect=${searchSelect.value}`;
      } else if (searchSelect.value == "Job Number") {
        url = `${apiPath.prodPath}/api/timeTrack/${search.value}?perPage=${perPage}&page=${page}&spectrum=${activeSpecFlag}&searchSelect=${searchSelect.value}`;
      } else {
        url = `${apiPath.prodPath}/api/timeTrack/searchByJob/${search}?perPage=${perPage}&page=${page}&spectrum=${activeSpecFlag}`;
      }
    }
    axios
      .get(url)
      .then((res) => {
        setTimeTrack(res.data.timeTrack);
        setTotalCount(res.data.count);

        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const handleClear = () => {
    setLoading(true);
    axios
      .get(
        `${
          apiPath.prodPath
        }/api/timeTrack/?perPage=${20}&&page=${1}&&spectrum=${activeSpecFlag}`
      )
      .then((res) => {
        setTimeTrack(
          res.data.timeTracks.filter((i) => i.spectrum == activeSpecFlag)
        );
        setTotalCount(res.data.count);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    setSearch("");
  };
  const editTimeTrackModal = (item) => {
    setCurrentItem(item);
    setDrawer(true);
  };
  // const specTrackData = timeTrack.filter((i) => i.spectrum == true);
  // const noSpecTrackData = timeTrack.filter((i) => i.spectrum == false);
  const editData = (data, id) => {
    axios.patch(`${apiPath.prodPath}/api/timeTrack/${id}`, data).then((res) => {
      if (res.data.error) {
        Swal.fire({
          icon: "error",
          text: "Uneable to edit",
          confirmButtonColor: "orange",
        });
      } else {
        Swal.fire({
          icon: "success",
          text: "Edited Successfully",
          confirmButtonColor: "orange",
          showConfirmButton: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            refreshData();
          }
        });
      }
    });
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "striped",
      html: "#time-track-report",
      styles: { fontSize: 5 },
    });
    doc.save("report.pdf");
    setStartDate("");
    setEndDate("");
  };
  const handleDateSearch = () => {
    if (startDate !== "" && endDate !== "") {
      setLoading(true);
      axios
        .get(
          `${apiPath.prodPath}/api/timeTrack/?startDate=${startDate}&&endDate=${endDate}&&perPage=${perPage}&&page=${page}&&spectrum=${activeSpecFlag}`
        )
        .then((res) => {
          setTimeTrack(res.data.timeTracks);
          setTotalCount(res.data.count);

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      Swal.fire({
        icon: "warning",
        text: "Please Select both start and end Date",
        confirmButtonColor: "orange",
      });
    }
  };
  const handleSpectrumTabs = (flag) => {
    setLoading(true);
    if (search == "") {
      axios
        .get(
          `${apiPath.prodPath}/api/timeTrack/?perPage=20&page=1&spectrum=${flag}`
        )
        .then((res) => {
          setTimeTrack(res.data.timeTracks.filter((i) => i.spectrum == flag));
          setTotalCount(res.data.count);

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      var url = "";
      if (searchSelect.value == "Employee") {
        url = `${apiPath.prodPath}/api/timeTrack/${search.value}?perPage=20&page=1&spectrum=${flag}&searchSelect=Employee`;
      } else {
        url = `${apiPath.prodPath}/api/timeTrack/searchByJob/${search}?perPage=20&page=1&spectrum=${flag}`;
      }
      axios
        .get(url)
        .then((res) => {
          setTimeTrack(res.data.timeTrack.filter((i) => i.spectrum == flag));
          setTotalCount(res.data.count);

          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };
  const dateSearchRes = () => {
    if (startDate !== "" || endDate !== "") {
      setLoading(true);
      axios
        .get(
          `${apiPath.prodPath}/api/timeTrack/?startDate=${
            startDate == "" ? "" : new Date(startDate)
          }&endDate=${
            endDate == "" ? "" : new Date(endDate)
          }&perPage=${perPage}&page=${page}&spectrum=${activeSpecFlag}`
        )
        .then((res) => {
          setTimeTrack(res.data.timeTracks);
          setTotalCount(res.data.count);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      Swal.fire({
        icon: "warning",
        text: "Please Select both start and end Date",
        confirmButtonColor: "orange",
      });
    }
  };
  return (
    <section className={`${poppins.className}`}>
      <div className="flex flex-row justify-between pb-4">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Time Track
        </h2>
        {/* <button
          onClick={() => setDrawer(true)}
          className={`${poppins.className} btn-add`}
        >
          Add Employee
        </button> */}
        {dateFilter ? null : (
          <button
            className="p-2 font-medium bg-orange-400 rounded-xl text-white"
            onClick={() => setDateFilter(true)}
          >
            Time Track Report
          </button>
        )}
      </div>
      <div className="flex flex-row w-4/5 gap-4">
        <div className="w-2/4">
          <Select
            className={`${poppins.className} employee-names`}
            options={[
              { label: "Employee", value: "Employee" },
              { label: "Job Description", value: "Job Description" },
              { label: "Job Number", value: "Job Number" },
            ]}
            placeholder="Select Employee"
            value={searchSelect}
            onChange={(e) => {
              setSearch("");
              setSearchSelect(e);
            }}
          />
        </div>
        <form onSubmit={handleSearch} className="w-2/4 flex flex-row gap-2">
          {searchSelect.value == "Employee" ? (
            <div className="w-4/5">
              {loadingUsers ? (
                <p>Loading...</p>
              ) : (
                <Select
                  className={`${poppins.className} employee-names`}
                  options={allUsers}
                  placeholder="Select Employee"
                  value={search}
                  onChange={(e) => setSearch(e)}
                />
              )}
            </div>
          ) : searchSelect.value == "Job Number" ? (
            <div className="w-4/5">
              {loadingJobs ? (
                <p>Loading...</p>
              ) : (
                <Select
                  className={`${poppins.className} employee-names`}
                  options={jobOpt}
                  placeholder="Select Job#"
                  value={search}
                  onChange={(e) => setSearch(e)}
                />
              )}
            </div>
          ) : (
            <div className="w-4/5">
              <input
                type="text"
                placeholder="Search By job Description"
                value={search}
                className="p-2 border-gray-200 border-2 rounded-xl w-full"
                onChange={(e) => {
                  e.preventDefault();
                  setSearch(e.target.value);
                }}
              />
            </div>
          )}
          <div className="w-1/5 flex flex-row gap-4">
            <input
              className={`${poppins.className} p-2 bg-orange-400 text-white rounded-xl`}
              type="submit"
              value={"Search"}
            />
            {search == "" ? null : (
              <p
                onClick={handleClear}
                className={`${poppins.className} clear-btn`}
                style={{ color: "red" }}
              >
                Clear
              </p>
            )}
          </div>
        </form>
      </div>
      <button
        onClick={() => {
          setDateSearch(true);
          setDateFilter(false);
        }}
        className={`${poppins.className} bg-orange-400 text-white rounded-xl mt-2 mb-2 p-2`}
      >
        Date Filters
      </button>
      {dateSearch ? (
        <div className="flex flex-row flex-wrap bg-white p-4 w-2/4 shadow-md rounded-xl">
          <div className="flex flex-row justify-end p-2 w-full">
            <span
              onClick={() => {
                refreshData();
                setDateSearch(false);
              }}
            >
              &#10005;
            </span>
          </div>
          <div className="flex flex-row w-full gap-4">
            <div className="flex flex-col gap-2 w-2/5">
              <label className={`${poppins.className} font-semibold`}>
                Start Date
              </label>
              <Popover>
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
              </Popover>
            </div>
            <div className="flex flex-col gap-2 w-2/5">
              <label className={`${poppins.className} font-semibold`}>
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    onClick={() => console.log("clicked")}
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      moment(endDate).format("MM-DD-YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 cus-calendar">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col w-1/5 justify-end">
              <button
                className={`${poppins.className} self-end bg-orange-400 p-2 text-white rounded-xl`}
                onClick={dateSearchRes}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* {dateFilter ? (
        <div className="date-filter">
          <div className="close-date">
            <span
              onClick={() => {
                refreshData();
                setDateFilter(false);
              }}
            >
              &#10005;
            </span>
          </div>
          <div className="input-wraps">
            <div className="cus-date-inp">
              <label className={poppins.className}>Start Date</label>
              <DatePicker
                id="datePicker-1"
                selected={startDate}
                onChange={(value) => setStartDate(value)}
              />
            </div>
            <div className="cus-date-inp">
              <label className={poppins.className}>End Date</label>
              <DatePicker
                id="datePicker-1"
                selected={endDate}
                onChange={(value) => setEndDate(value)}
              />
            </div>
            <button className={poppins.className} onClick={handleDateSearch}>
              Search
            </button>
          </div>
          <button onClick={downloadPDF}>Generate Report</button>
        </div>
      ) : null} */}
      <div className="flex flex-row flex-wrap gap-4 mt-4 mb-4">
        {/* <p>table comes here</p> */}
        <span
          onClick={() => {
            setActiveSpecFlag(true);
            handleSpectrumTabs(true);
          }}
          className={`${poppins.className} ${
            activeSpecFlag
              ? "text-orange-400 font-semibold hover:cursor-pointer"
              : "font-semibold hover:cursor-pointer"
          }`}
        >
          Spectrum
        </span>
        <span
          onClick={() => {
            setActiveSpecFlag(false);
            handleSpectrumTabs(false);
          }}
          className={`${poppins.className} ${
            activeSpecFlag == false
              ? "text-orange-400 font-semibold hover:cursor-pointer"
              : "font-semibold hover:cursor-pointer"
          }`}
        >
          Non Spectrum
        </span>
      </div>
      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[300px] w-[500px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <TimeTrackTable
          loading={loading}
          allTimeTrack={timeTrack}
          refreshData={refreshData}
          handleEdit={editTimeTrackModal}
          handlePagination={(e, page) => handlePagination(e, page)}
          totalCount={totalCount}
          page={page}
        />
      )}
      <TimeTrackDrawer
        timeTrackData={currentItem}
        open={drawer}
        onClose={handleCloseDrawer}
        editTimeTrackData={editData}
      />
    </section>
  );
}

export default TimeTrack;
