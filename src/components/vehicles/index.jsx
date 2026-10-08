"use client";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
// import "./style.scss";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import VehicleDrawer from "../drawers/vehicleDrawer";
import VehicleTable from "../tables/vehicleTable";
import Select from "react-select";
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
function Vehicles() {
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]);
  const [activeLinks, setActiveLinks] = useState("Active");
  const [vehicleFlag, setVehicleFlag] = useState(false);
  const [vehicleLabel, setVehicleLabel] = useState("");
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState({
    label: "Vehicle No",
    value: "Vehicle No",
  });
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/vehicles/`)
      .then((res) => {
        const filteredStatus = res.data.vehicles.filter(
          (i) => i.status == activeLinks
        );
        setAllVehicles(filteredStatus);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  const handleCloseDrawer = () => {
    setDrawer(!drawer);
  };
  const addVehicle = (data) => {
    axios
      .post(`${apiPath.prodPath}/api/vehicles/addVehicle`, data)
      .then((res) => {
        handleCloseDrawer();
        Swal.fire({
          icon: "success",
          text: "Added Successfully",
          confirmButtonColor: "orange",
        });
        refreshData();
      })
      .catch((err) => console.log(err));
  };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/vehicles/`)
      .then((res) => {
        const filteredStatus = res.data.vehicles.filter(
          (i) => i.status == activeLinks
        );
        setAllVehicles(filteredStatus);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleLinks = (link) => {
    setActiveLinks(link);
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/vehicles/`)
      .then((res) => {
        const filteredStatus = res.data.vehicles.filter(
          (i) => i.status == link
        );
        setAllVehicles(filteredStatus);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSorting = (vehicleSortLabel, vehicleSortFlag) => {
    if (vehicleSortLabel == "Vehicle #") {
      setVehicleLabel("Vehicle #");
      const sortedData =
        vehicleSortFlag == false
          ? allVehicles.sort(
              (a, b) => Number(a.vehicleNo) - Number(b.vehicleNo)
            )
          : allVehicles.sort(
              (a, b) => Number(b.vehicleNo) - Number(a.vehicleNo)
            );
      setAllVehicles(sortedData);
    }
    if (vehicleSortLabel == "Driver") {
      setVehicleLabel("Driver");
      const sortedData =
        vehicleSortFlag == false
          ? allVehicles.sort((a, b) =>
              a.driverWEXPin.localeCompare(b.driverWEXPin)
            )
          : allVehicles.sort((a, b) =>
              b.driverWEXPin.localeCompare(a.driverWEXPin)
            );
      setAllVehicles(sortedData);
    }
    if (vehicleSortLabel == "Vin#") {
      setVehicleLabel("Vin#");
      const sortedData =
        vehicleSortFlag == false
          ? allVehicles.sort((a, b) => a.vinNo.localeCompare(b.vinNo))
          : allVehicles.sort((a, b) => b.vinNo.localeCompare(a.vinNo));
      setAllVehicles(sortedData);
    }
    if (vehicleSortLabel == "License") {
      setVehicleLabel("License");
      const sortedData =
        vehicleSortFlag == false
          ? allVehicles.sort((a, b) =>
              a.licensePlate.localeCompare(b.licensePlate)
            )
          : allVehicles.sort((a, b) =>
              b.licensePlate.localeCompare(a.licensePlate)
            );
      setAllVehicles(sortedData);
    }
    setVehicleFlag(!vehicleSortFlag);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (filterBy.value == "Vehicle No") {
      setLoading(true);
      axios.get(`${apiPath.prodPath}/api/vehicles/`).then((res) => {
        const searchedData = res.data.vehicles.filter(
          (i) => i.vehicleNo == search
        );
        setAllVehicles(searchedData);
        setLoading(false);
      });
    }
    if (filterBy.value == "Driver/Wex Pin") {
      setLoading(true);
      axios.get(`${apiPath.prodPath}/api/vehicles/`).then((res) => {
        const searchedData = res.data.vehicles.filter(
          (i) => i.driverWEXPin == search
        );
        setAllVehicles(searchedData);
        setLoading(false);
      });
    }
    if (filterBy.value == "Vin No") {
      setLoading(true);
      axios.get(`${apiPath.prodPath}/api/vehicles/`).then((res) => {
        const searchedData = res.data.vehicles.filter((i) => i.vinNo == search);
        setAllVehicles(searchedData);
        setLoading(false);
      });
    }
    if (filterBy.value == "License Plate") {
      setLoading(true);
      axios.get(`${apiPath.prodPath}/api/vehicles/`).then((res) => {
        const searchedData = res.data.vehicles.filter(
          (i) => i.licensePlate == search
        );
        setAllVehicles(searchedData);
        setLoading(false);
      });
    }
  };
  return (
    <section className={`${poppins.className}`}>
      <div className="flex flex-row justify-between pb-5">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Vehicles
        </h2>
        <button
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
          onClick={() => setDrawer(true)}
        >
          Add Vehicle
        </button>
      </div>
      <div className="flex flex-col gap-2 pb-2">
        <Select
          options={[
            { label: "Vehicle No", value: "Vehicle No" },
            { label: "Driver/Wex Pin", value: "Driver/Wex Pin" },
            { label: "Vin No", value: "Vin No" },
            { label: "License Plate", value: "License Plate" },
          ]}
          value={filterBy}
          className="w-[360px] z-50"
          onChange={(v) => {
            setSearch("");
            setFilterBy(v);
          }}
          placeholder="Filter By"
        />
        <form className="flex flex-row gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            className="w-[350px] border-[1px] border-[#cfcfcf] rounded-[10px] p-2"
            value={search}
            placeholder={
              filterBy.value == "Vehicle No"
                ? "Search By Vehicle No"
                : filterBy.value == "Driver/Wex Pin"
                ? "Search By Driver/Wex Pin"
                : filterBy.value == "Vin No"
                ? "Search By Vin No"
                : filterBy.value == "License Plate"
                ? "Search By License Plate"
                : ""
            }
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-row gap-2">
            <input
              type="submit"
              value={"Search"}
              className="bg-orange-400 font-semibold text-white rounded-[10px] p-2"
            />
            {search == "" ? null : (
              <button
                className="bg-orange-400 font-semibold text-white rounded-[10px] p-2"
                onClick={(e) => {
                  e.preventDefault();
                  setSearch("");
                  refreshData();
                }}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="flex flex-row gap-3">
        <span
          className={
            activeLinks == "Active"
              ? `${poppins.className} text-orange-400 border-b-4 border-orange-400 font-semibold hover:cursor-pointer`
              : `${poppins.className} link hover:cursor-pointer`
          }
          onClick={() => handleLinks("Active")}
        >
          Active
        </span>
        <span
          className={
            activeLinks == "Inactive"
              ? `${poppins.className} text-orange-400 border-b-4 border-orange-400 font-semibold hover:cursor-pointer`
              : `${poppins.className} link hover:cursor-pointer`
          }
          onClick={() => handleLinks("Inactive")}
        >
          Inactive
        </span>
      </div>
      <div className="table-wrap">
        <VehicleTable
          loading={loading}
          allVehicles={allVehicles}
          refreshData={refreshData}
          vehicleFlag={vehicleFlag}
          vehicleLabel={vehicleLabel}
          handleSort={(sortLabel, sortFlag) =>
            handleSorting(sortLabel, sortFlag)
          }
        />
      </div>
      <VehicleDrawer
        addVehicle={addVehicle}
        open={drawer}
        onClose={handleCloseDrawer}
      />
    </section>
  );
}

export default Vehicles;
