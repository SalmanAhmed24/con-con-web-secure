"use client";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";

import ManpowerTable from "../tables/manpowerTable";
import ManpowerAssignTable from "../tables/manpowerAssignTable";
import ManpowerEmpTable from "../tables/manpowerEmpTable";
import ForemanTable from "../tables/foremanTable";
import HeadsUpTable from "../tables/headsUpTable";
import HeadsUpEmpTable from "../tables/headsUpEmpTable";
import ManpowerDrawer from "../drawers/manpowerDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import Select from "react-select";
import LaborTimeTrackTable from "../tables/laborTimeTrackTable";
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
function ManpowerComp({ user }) {
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upperFilterFlag, setUpperFilterFlag] = useState(false);
  const [allManpower, setAllManpower] = useState([]);
  const [activeTab, setActiveTab] = useState("Jobs");
  const [allUsers, setAllUsers] = useState([]);
  const [superVal, setSuperVal] = useState("LSU");
  const [filterValue, setFilterValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterOpt, setFilterOpt] = useState({
    label: "Job Number",
    value: "Job Number",
  });
  const [lfJobName, setLfJobName] = useState("");
  useEffect(() => {
    // if (user && user.userType == "superintendent") {
    //   setActiveTab("To Be Assigned");
    // }
    if (user !== null && user.userType !== null && user.userType == "foreman") {
      setActiveTab("Daily Jobs");
    }
    if (
      user !== null &&
      user.userType !== null &&
      user.userType == "heads up"
    ) {
      setActiveTab("Heads Up Jobs");
      const el = document.querySelectorAll(".links-wrap");
      const anEl = document.querySelectorAll(".labor-wrap");
      if (el[0] !== undefined) {
        el[0].style.width = "0px";
        el[0].style.minWidth = "0px";
      }
      if (anEl[0] !== undefined) {
        anEl[0].style.width = "100%";
        // anEl[0].style.minWidth = "0px";
      }
    }
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/manpower/`)
      .then((res) => {
        setAllManpower(res.data.manpowers);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    if (
      user !== null &&
      user.userType !== null &&
      user.userType == "heads up"
    ) {
      setLoading(true);
      axios
        .get(`${apiPath.prodPath}/api/users/`)
        .then((res) => {
          const userArr = res.data.allUsers.map((i) => {
            return {
              fullname: i.fullname,
              userLabor: i.userLabor,
              userType: i.userType,
            };
          });
          setAllUsers(userArr);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
    const headsupInterval = setInterval(() => {
      if (
        user !== null &&
        user.userType !== null &&
        user.userType == "heads up"
      ) {
        dataRefreshInterval();
        manpowerDataRefresh();
      }
    }, 60000);
    return () => {
      clearInterval(headsupInterval);
      if (
        user !== null &&
        user.userType !== null &&
        user.userType == "heads up"
      ) {
        const el = document.querySelectorAll(".links-wrap");
        const anEl = document.querySelectorAll(".labor-wrap");
        if (el[0] !== undefined) {
          el[0].style.width = "15%";
          el[0].style.minWidth = "250px";
        }
        if (anEl[0] !== undefined) {
          anEl[0].style.width = "85%";
          // anEl[0].style.minWidth = "0px";
        }
      }
    };
  }, []);
  const dataRefreshInterval = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const userArr = res.data.allUsers.map((i) => {
          return {
            fullname: i.fullname,
            userLabor: i.userLabor,
            userType: i.userType,
          };
        });
        setAllUsers(userArr);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const handleSearchForm = (e) => {
    e.preventDefault();
    if (filterOpt.value == "Job Number") {
      setLoading(true);
      axios
        .get(`${apiPath.prodPath}/api/manpower/searchByJob/${filterValue}`)
        .then((res) => {
          setAllManpower(res.data.manpowers);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
    if (filterOpt.value == "PM") {
      setLoading(true);
      axios
        .get(`${apiPath.prodPath}/api/manpower/searchByPM/${filterValue}`)
        .then((res) => {
          setAllManpower(res.data.manpowers);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
    if (filterOpt.value == "Date") {
      setLoading(true);
      axios
        .get(
          `${apiPath.prodPath}/api/manpower/searchByDate/?startDate=${startDate}&&endDate=${endDate}`
        )
        .then((res) => {
          setAllManpower(res.data.manpowers);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };
  const manpowerDataRefresh = () => {
    setFilterValue("");
    setStartDate("");
    setEndDate("");
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/manpower/`)
      .then((res) => {
        setAllManpower(res.data.manpowers);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleCloseDrawer = () => {
    setDrawer(!drawer);
  };
  const addManpower = (data) => {
    axios
      .post(`${apiPath.prodPath}/api/manpower/addManpower`, data)
      .then((res) => {
        handleCloseDrawer();
        refreshData();
      })
      .catch((err) => console.log(err));
  };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/manpower/`)
      .then((res) => {
        setAllManpower(res.data.manpowers);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleLFSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/manpower/`)
      .then((res) => {
        const searchedData = res.data.manpowers.filter(
          (i) => i.job == lfJobName
        );
        setAllManpower(searchedData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleRemUpperFiler = (flag) => {
    setUpperFilterFlag(flag);
  };
  return (user !== null &&
    user.userType !== null &&
    user.userType == "superintendent") ||
    (user !== null && user.userType !== null && user.userType == "admin") ? (
    <section className={`${poppins.className} labor-wrap`}>
      <div className="flex flex-row gap-4 pb-2 pt-2">
        <span
          onClick={(e) => {
            e.preventDefault();
            setLfJobName("");
            refreshData();
            setSuperVal("LSU");
            setActiveTab("Jobs");
          }}
          className={
            superVal == "LSU"
              ? "text-orange-400 font-semibold hover:cursor-pointer"
              : "simpleTab hover:cursor-pointer"
          }
        >
          Labor - SuperUser
        </span>
        <span
          onClick={(e) => {
            e.preventDefault();
            setLfJobName("");
            refreshData();
            setSuperVal("LS");
            setActiveTab("To Be Assigned");
          }}
          className={
            superVal == "LS"
              ? "text-orange-400 font-semibold hover:cursor-pointer"
              : "simpleTab hover:cursor-pointer"
          }
        >
          Labor-Superintendent
        </span>
        <span
          onClick={(e) => {
            e.preventDefault();
            setLfJobName("");
            refreshData();
            setSuperVal("LF");
            setActiveTab("Daily Jobs");
          }}
          className={
            superVal == "LF"
              ? "text-orange-400 font-semibold hover:cursor-pointer"
              : "simpleTab hover:cursor-pointer"
          }
        >
          Labor-Foreman
        </span>
        <span
          onClick={(e) => {
            e.preventDefault();
            setLfJobName("");
            refreshData();
            setSuperVal("LT");
            setActiveTab("History");
          }}
          className={
            superVal == "LT"
              ? "text-orange-400 font-semibold hover:cursor-pointer"
              : "simpleTab hover:cursor-pointer"
          }
        >
          Labor-TimeTrack
        </span>
      </div>
      <div className="flex flex-row justify-between pt-2 pb-2">
        {superVal == "LSU" ? (
          <h2 className={`${poppins.className} text-2xl font-bold`}>
            Labor - SuperUser
          </h2>
        ) : null}
        {superVal == "LS" ? (
          <h2 className={`${poppins.className} text-2xl font-bold`}>
            Labor-Superintendent
          </h2>
        ) : null}
        {superVal == "LF" ? (
          <h2 className={`${poppins.className} text-2xl font-bold`}>
            Labor-Foreman
          </h2>
        ) : null}
        {superVal == "LSU" ? (
          <button
            onClick={() => setDrawer(true)}
            className={`${poppins.className} p-2 bg-orange-400 text-white font-semibold rounded-xl`}
          >
            + Request Employees
          </button>
        ) : null}
      </div>
      <div className="flex flex-row gap-4 pt-2 pb-2">
        {superVal == "LS" ? (
          <span
            onClick={() => {
              setActiveTab("To Be Assigned");
            }}
            className={
              activeTab == "To Be Assigned"
                ? "text-orange-400 font-semibold hover:cursor-pointer"
                : "simpleTab hover:cursor-pointer"
            }
          >
            To Be Assigned
          </span>
        ) : null}
        {superVal == "LSU" ? (
          <>
            <span
              onClick={() => {
                setActiveTab("Jobs");
              }}
              className={
                activeTab == "Jobs"
                  ? "text-orange-400 font-semibold hover:cursor-pointer"
                  : "simpleTab hover:cursor-pointer"
              }
            >
              Jobs
            </span>
            <span
              onClick={() => {
                setActiveTab("Employees");
              }}
              className={
                activeTab == "Employees"
                  ? "text-orange-400 font-semibold hover:cursor-pointer"
                  : "simpleTab hover:cursor-pointer"
              }
            >
              Employees
            </span>
          </>
        ) : null}
        {superVal == "LS" ? (
          <span
            onClick={() => {
              setActiveTab("Employees");
            }}
            className={
              activeTab == "Employees"
                ? "text-orange-400 font-semibold hover:cursor-pointer"
                : "simpleTab hover:cursor-pointer"
            }
          >
            Employees
          </span>
        ) : null}
        {superVal == "LF" ? (
          <span
            onClick={() => {
              setActiveTab("Daily Jobs");
            }}
            className={
              activeTab == "Daily Jobs"
                ? "text-orange-400 font-semibold hover:cursor-pointer"
                : "simpleTab hover:cursor-pointer"
            }
          >
            Daily Jobs
          </span>
        ) : null}
      </div>
      {user !== null &&
      user.userType !== null &&
      user.userType == "admin" &&
      superVal == "LSU" ? (
        <form
          onSubmit={handleSearchForm}
          className="pt-2 pb-2 flex flex-col gap-5 w-1/3"
        >
          <Select
            options={[
              { label: "Job Number", value: "Job Number" },
              { label: "Date", value: "Date" },
              { label: "PM", value: "PM" },
            ]}
            value={filterOpt}
            id="filter-labor"
            onChange={(v) => setFilterOpt(v)}
          />
          <div className="flex flex-row gap-4">
            {filterOpt.value == "Job Number" ? (
              <input
                type="text"
                onChange={(e) => setFilterValue(e.target.value)}
                value={filterValue}
                placeholder="Search By Job Numnber"
                required={true}
                className="w-[300px] p-2 border-solid border-[1px] border-[#cfcfcf] rounded-[5px]"
              />
            ) : null}
            {filterOpt.value == "PM" ? (
              <input
                type="text"
                onChange={(e) => setFilterValue(e.target.value)}
                value={filterValue}
                placeholder="Search By PM"
                required={true}
                className="w-[300px] p-2 border-solid border-[1px] border-[#cfcfcf] rounded-[5px]"
              />
            ) : null}
            {filterOpt.value == "Date" ? (
              <div className="flex flex-row gap-5">
                <div className="flex flex-col gap-5">
                  <label>Start Date</label>
                  <input
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                    value={startDate}
                    className="p-2 border-[1px] border-solid border-[#cfcfcf] rounded-[5px]"
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <label>End Date</label>
                  <input
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                    value={endDate}
                    className="p-2 border-[1px] border-solid border-[#cfcfcf] rounded-[5px]"
                  />
                </div>
              </div>
            ) : null}
            <input
              type="submit"
              className="p-2 rounded-[10px] bg-orange-400 text-white font-semibold self-end"
              value={"Search"}
            />
            {filterValue !== "" || startDate !== "" || endDate !== "" ? (
              <p
                className="p-2 self-end bg-orange-400 text-white rounded-[10px] font-semibold hover:cursor-pointer"
                onClick={manpowerDataRefresh}
              >
                Clear
              </p>
            ) : null}
          </div>
        </form>
      ) : null}
      {user !== null &&
      user.userType !== null &&
      user.userType == "admin" &&
      superVal == "LF" ? (
        <form onSubmit={handleLFSearch}>
          <div className="flex flex-row gap-2 pb-2">
            <div className="w-[300px]">
              <input
                placeholder="Search By Job"
                type="text"
                className="w-[300px] p-2 border-[1px] border-[#cfcfcf] rounded-[10px]"
                value={lfJobName}
                onChange={(e) => setLfJobName(e.target.value)}
              />
            </div>
            <div className="flex w-[200px] gap-2">
              <input
                type="submit"
                value={"Search"}
                className="bg-orange-400 text-white font-semibold rounded-[10px] hover:cursor-pointer p-2"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLfJobName("");
                  refreshData();
                }}
                className="bg-orange-400 text-white font-semibold rounded-[10px] hover:cursor-pointer p-2"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      ) : null}
      {activeTab == "To Be Assigned" ? (
        loading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[500px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <ManpowerAssignTable
              loading={loading}
              allManpower={allManpower}
              refreshData={refreshData}
            />
          </div>
        )
      ) : null}
      {activeTab == "Jobs" && superVal == "LSU" ? (
        loading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[500px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <ManpowerTable
              loading={loading}
              allManpower={allManpower}
              refreshData={refreshData}
            />
          </div>
        )
      ) : null}
      {superVal == "LF" && activeTab == "Daily Jobs" ? (
        <ForemanTable
          loading={loading}
          allManpower={allManpower}
          refreshData={refreshData}
        />
      ) : null}
      {superVal == "LT" &&
      activeTab == "History" &&
      upperFilterFlag == false ? (
        <form onSubmit={handleLFSearch}>
          <div className="flex flex-row gap-2 pb-2">
            <div className="w-[300px]">
              <input
                placeholder="Search By Job"
                type="text"
                className="w-[300px] p-2 border-[1px] border-[#cfcfcf] rounded-[10px]"
                value={lfJobName}
                onChange={(e) => setLfJobName(e.target.value)}
              />
            </div>
            <div className="flex w-[200px] gap-2">
              <input
                type="submit"
                value={"Search"}
                className="bg-orange-400 text-white font-semibold rounded-[10px] hover:cursor-pointer p-2"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLfJobName("");
                  refreshData();
                }}
                className="bg-orange-400 text-white font-semibold rounded-[10px] hover:cursor-pointer p-2"
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      ) : null}
      {superVal == "LT" && activeTab == "History" ? (
        <LaborTimeTrackTable
          loading={loading}
          allManpower={allManpower}
          refreshData={refreshData}
          hideUpperFilter={handleRemUpperFiler}
        />
      ) : null}

      {activeTab == "Employees" ? <ManpowerEmpTable /> : null}
      <ManpowerDrawer
        addManpower={addManpower}
        open={drawer}
        onClose={handleCloseDrawer}
      />
    </section>
  ) : (
    <section className={`${poppins.className} labor-wrap`}>
      <div className="flex flex-row justify-between">
        {(user !== null && user.userType == "admin") ||
        (user !== null && user.userType == "project manager") ? (
          <h2 className={`${poppins.className} text-2xl font-bold`}>
            Labor - SuperUser
          </h2>
        ) : null}
        {/* {user && user.userType == "superintendent" ? (
          <h2 className={poppins.className}>Labor-Superintendent</h2>
        ) : null} */}
        {user !== null && user.userType == "foreman" ? (
          <h2 className={`${poppins.className} text-2xl font-bold`}>
            Labor-Foreman
          </h2>
        ) : null}
        {activeTab == "Heads Up Jobs" &&
        user !== null &&
        user.userType == "heads up" &&
        loading == false ? (
          <>
            <h1 className={`${poppins.className} text-2xl font-bold`}>
              Labor-HUD-Jobs
            </h1>
          </>
        ) : null}
        {activeTab == "Heads Up Employees" &&
        user !== null &&
        user.userType == "heads up" ? (
          <>
            <h1 className={`${poppins.className} text-2xl font-bold`}>
              Labor-HUD-Employees
            </h1>
          </>
        ) : null}
        {(user !== null && user.userType == "admin") ||
        (user !== null && user.userType == "project manager") ? (
          <button
            onClick={() => setDrawer(true)}
            className={`${poppins.className} p-2 bg-orange-400 text-white font-semibold rounded-xl`}
          >
            + Request Employees
          </button>
        ) : null}
      </div>
      <div className="flex flex-row gap-4 pt-2 pb-2">
        {/* {user && user.userType == "superintendent" ? (
          <span
            onClick={() => {
              setActiveTab("To Be Assigned");
            }}
            className={
              activeTab == "To Be Assigned" ? "text-orange-400 font-semibold hover:cursor-pointer"
                : "simpleTab hover:cursor-pointer"
            }
          >
            To Be Assigned
          </span>
        ) : null} */}
        {(user !== null && user.userType == "admin") ||
        (user !== null && user.userType == "project manager") ? (
          <>
            <span
              onClick={() => {
                setActiveTab("Jobs");
              }}
              className={
                activeTab == "Jobs"
                  ? "text-orange-400 font-semibold hover:cursor-pointer"
                  : "simpleTab hover:cursor-pointer"
              }
            >
              Jobs
            </span>
            <span
              onClick={() => {
                setActiveTab("Employees");
              }}
              className={
                activeTab == "Employees"
                  ? "text-orange-400 font-semibold hover:cursor-pointer"
                  : "simpleTab hover:cursor-pointer"
              }
            >
              Employees
            </span>
          </>
        ) : null}
        {user !== null && user.userType == "heads up" ? (
          <>
            <span
              onClick={() => {
                setActiveTab("Heads Up Jobs");
              }}
              className={
                activeTab == "Heads Up Jobs"
                  ? "text-orange-400 font-semibold hover:cursor-pointer"
                  : "simpleTab hover:cursor-pointer"
              }
            >
              Jobs
            </span>
            <span
              onClick={() => {
                setActiveTab("Heads Up Employees");
              }}
              className={
                activeTab == "Heads Up Employees"
                  ? "text-orange-400 font-semibold hover:cursor-pointer"
                  : "simpleTab hover:cursor-pointer"
              }
            >
              Employees
            </span>
          </>
        ) : null}
        {/* {user && user.userType == "superintendent" ? (
          <span
            onClick={() => {
              setActiveTab("Employees");
            }}
            className={activeTab == "Employees" ? "text-orange-400 font-semibold hover:cursor-pointer"
                : "simpleTab hover:cursor-pointer"}
          >
            Employees
          </span>
        ) : null} */}
        {user !== null && user.userType == "foreman" ? (
          <span
            onClick={() => {
              setActiveTab("Daily Jobs");
            }}
            className={
              activeTab == "Daily Jobs"
                ? "text-orange-400 font-semibold hover:cursor-pointer"
                : "simpleTab hover:cursor-pointer"
            }
          >
            Daily Jobs
          </span>
        ) : null}
      </div>
      {activeTab == "To Be Assigned" ? (
        loading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[500px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <ManpowerAssignTable
              loading={loading}
              allManpower={allManpower}
              refreshData={refreshData}
            />
          </div>
        )
      ) : null}
      {(activeTab == "Jobs" && user !== null && user.userType == "admin") ||
      (user !== null && user.userType == "project manager") ? (
        loading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[500px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <ManpowerTable
              loading={loading}
              allManpower={allManpower}
              refreshData={refreshData}
            />
          </div>
        )
      ) : null}
      {user !== null &&
      user.userType == "foreman" &&
      activeTab == "Daily Jobs" ? (
        <ForemanTable
          loading={loading}
          allManpower={allManpower}
          refreshData={refreshData}
        />
      ) : null}
      {activeTab == "Employees" ? <ManpowerEmpTable /> : null}
      {activeTab == "Heads Up Jobs" &&
      user !== null &&
      user.userType == "heads up" &&
      loading == false &&
      allUsers.length ? (
        <>
          <HeadsUpTable allManpower={allManpower} allUsers={allUsers} />
        </>
      ) : null}
      {activeTab == "Heads Up Employees" &&
      user !== null &&
      user.userType == "heads up" ? (
        <>
          <HeadsUpEmpTable allManpower={allManpower} allUsers={allUsers} />
        </>
      ) : null}
      <ManpowerDrawer
        addManpower={addManpower}
        open={drawer}
        onClose={handleCloseDrawer}
      />
    </section>
  );
}

export default ManpowerComp;
