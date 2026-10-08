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
import axios, { all } from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import Select from "react-select";
import BadgeDrawer from "../drawers/badgeDrawer";
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
import { Skeleton } from "../ui/skeleton";
import moment from "moment";
import BadgeTable from "../tables/badgesTable";
function BadgeComp() {
  const [openFlag, setOpenFlag] = useState(false);
  const [loader, setLoader] = useState(false);
  const [allBadges, setAllBadges] = useState([]);
  const [badgeTypeOpt, setBadgeOpt] = useState([]);
  const [empOpt, setEmpOpt] = useState([]);
  const [generalConOpt, setGeneralConOpt] = useState([]);
  const [search, setSearch] = useState("");
  const [filterVal, setFilterVal] = useState({
    label: "Employee",
    value: "Employee",
  });
  useEffect(() => {
    loadBadges();
    loadBadgeType();
    loadEmployee();
    loadGeneralCon();
  }, []);
  const addBadgeHandler = (data) => {
    axios
      .post(`${apiPath.prodPath}/api/badge/addBadge`, data)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Error Adding Badge",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Added Successfully",
          });
          refreshData();
        }
      })
      .catch((err) => console.log(err));
  };
  const loadBadges = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${apiPath.prodPath}/api/badge`);

      setAllBadges(response.data.badges);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
      throw error;
    }
  };
  const loadEmployee = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${apiPath.prodPath}/api/users/`);
      const filtered = response.data.allUsers
        .map((i) => {
          return { label: i.fullname, value: i.fullname };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
      setEmpOpt(filtered);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
      throw error;
    }
  };
  const loadBadgeType = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${apiPath.prodPath}/api/badgeType/`);
      const sorted = response.data.BadgeTypes.map((i) => {
        return {
          label: i.name,
          value: i.name,
        };
      }).sort((a, b) => a.label.localeCompare(b.label));
      setBadgeOpt(sorted);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
      throw error;
    }
  };
  const loadGeneralCon = async () => {
    setLoader(true);
    try {
      const response = await axios.get(
        `${apiPath.prodPath}/api/generalContract/`,
      );
      const sorted = response.data.generalContracts
        .map((i) => {
          return { label: i.companyName, value: i.companyName };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
      setGeneralConOpt(sorted);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
      throw error;
    }
  };
  const refreshData = async () => {
    setLoader(true);
    try {
      const response = await axios.get(`${apiPath.prodPath}/api/badge`);

      setAllBadges(response.data.badges);
      setLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoader(false);
      throw error;
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    var url = "";
    if (filterVal.value == "Badge Type" || filterVal.value == "Employee") {
      url = `${apiPath.prodPath}/api/badge/searchBadge/?field=${filterVal.value}&&search=${search.value}`;
    }
    if (filterVal.value == "Expiration") {
      url = `${apiPath.prodPath}/api/badge/searchBadge/?field=${filterVal.value}&&search=${search}`;
    }
    axios
      .get(url)
      .then((res) => {
        setAllBadges(res.data.badges);
      })
      .catch((err) => console.log(err));
  };
  const handleClear = () => {
    refreshData();
    setSearch("");
  };
  return (
    <section className={`${poppins.className}`}>
      <div className="flex flex-row justify-between">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Badges
        </h2>
        <button
          onClick={() => setOpenFlag(true)}
          className="p-2 bg-orange-400 rounded-[5px] text-white font-semibold"
        >
          + Add Badge
        </button>
      </div>
      <div className="flex flex-col pt-2 pb-2">
        <Select
          className="w-[200px] z-50"
          options={[
            { label: "Expiration", value: "Expiration" },
            { label: "Employee", value: "Employee" },
            { label: "Badge Type", value: "Badge Type" },
          ]}
          value={filterVal}
          onChange={(v) => setFilterVal(v)}
        />
        <form onSubmit={handleSearch} className="flex flex-row gap-5 pt-2">
          {filterVal.value == "Expiration" ? (
            <input
              type="date"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[200px] border-[1px] border-[#cfcfcf] p-2 rounded-[8px]"
            />
          ) : (
            <Select
              className="w-[400px] z-40"
              options={
                filterVal.value == "Badge Type"
                  ? badgeTypeOpt
                  : filterVal.value == "Employee"
                    ? empOpt
                    : []
              }
              value={search}
              onChange={(v) => setSearch(v)}
              placeholder={
                filterVal.value == "Badge Type"
                  ? "Search By Badge Type"
                  : filterVal.value == "Employee"
                    ? "Search By Employee"
                    : "Search By"
              }
            />
          )}
          <input
            type="submit"
            value={`Search`}
            className="bg-orange-400 p-2 font-semibold text-white rounded-[8px]"
          />
          {search == "" ? null : (
            <button
              onClick={handleClear}
              className="bg-orange-400 p-2 font-semibold text-white rounded-[8px]"
            >
              Clear
            </button>
          )}
        </form>
      </div>
      {loader ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[300px] w-[500px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <BadgeTable
          refreshData={refreshData}
          allBadges={allBadges}
          loading={loader}
        />
      )}
      <BadgeDrawer
        addBadge={addBadgeHandler}
        open={openFlag}
        onClose={() => setOpenFlag(false)}
      />
    </section>
  );
}

export default BadgeComp;
