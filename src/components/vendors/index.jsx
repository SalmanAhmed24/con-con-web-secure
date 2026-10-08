"use client";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import Select from "react-select";
import VendorDrawer from "../drawers/vendorDrawer";
import VendorTable from "../tables/vendorTable";

const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
function VendorComp() {
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allVendors, setAllVendors] = useState([]);
  const [vendorFlag, setVendorFlag] = useState(false);
  const [vendorLabel, setVendorLabel] = useState("");

  const [search, setSearch] = useState("");
  const [vendorCatOpt, setVendorCatOpt] = useState([]);
  const [searchOpt, setSearchOpt] = useState([
    { label: "Vendor Name", value: "Vendor Name" },
    { label: "Vendor Category", value: "Vendor Category" },
  ]);
  const [vendorSearch, setVendorSearch] = useState("");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/vendor/`)
      .then((res) => {
        setAllVendors(res.data.vendors);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    axios
      .get(`${apiPath.prodPath}/api/vendorCategory`)
      .then((res) => {
        // const sortedCat = res.data.vendorCategorys
        //   .map((i) => {
        //     return { label: i.name, value: i.name };
        //   })
        //   .sort((a, b) => a.label.localeComapre(b.label));
        setVendorCatOpt(
          res.data.vendorCategorys.map((i) => {
            return {
              label: i.name,
              value: i.name,
            };
          }),
        );
      })
      .catch((err) => console.log(err));
  }, []);
  const handleCloseDrawer = () => {
    setDrawer(!drawer);
  };
  const addVendor = (data) => {
    axios
      .post(`${apiPath.prodPath}/api/vendor/addVendor`, data)
      .then((res) => {
        handleCloseDrawer();
        refreshData();
      })
      .catch((err) => console.log(err));
  };
  const handleSorting = (toolSortLable, toolSortFlag) => {
    if (toolSortLable == "Name") {
      setVendorLabel("Name");
      const sortedData =
        toolSortFlag == false
          ? allVendors.sort((a, b) => a.name.localeCompare(b.name))
          : allVendors.sort((a, b) => b.name.localeCompare(a.name));
      setAllVendors(sortedData);
    }
    if (toolSortLable == "Vendor Category") {
      setVendorLabel("Vendor Category");
      const sortedData =
        toolSortFlag == false
          ? allVendors.sort((a, b) =>
              a.vendorCategory.localeCompare(b.vendorCategory),
            )
          : allVendors.sort((a, b) =>
              b.vendorCategory.localeCompare(a.vendorCategory),
            );
      setAllVendors(sortedData);
    }
    if (toolSortLable == "Company Name") {
      setVendorLabel("Company Name");
      const sortedData =
        toolSortFlag == false
          ? allVendors.sort((a, b) =>
              a.companyName.localeCompare(b.companyName),
            )
          : allVendors.sort((a, b) =>
              b.companyName.localeCompare(a.companyName),
            );
      setAllVendors(sortedData);
    }
    setVendorFlag(!vendorFlag);
  };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/vendor/`)
      .then((res) => {
        setAllVendors(res.data.vendors);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleVendorSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/vendor/`)
      .then((res) => {
        var filteredData;
        if (search.value == "Vendor Category") {
          filteredData = res.data.vendors.filter(
            (i) => i.vendorCategory == vendorSearch.value,
          );
        } else if (search.value == "Vendor Name") {
          filteredData = res.data.vendors.filter((i) => i.name == vendorSearch);
        }
        setAllVendors(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleClear = () => {
    setVendorSearch("");
    refreshData();
  };
  const handleSyncTo = (e) => {
    e.preventDefault();
    axios
      .post(`${apiPath.prodPath}/api/vendorSheets/addDataToSheet/`)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to Sync the data",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Synced Successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: "Unable to Sync the data",
        });
      });
  };
  return (
    <section className={`${poppins.className} employee-wrap`}>
      <div className="flex flex-row justify-end gap-4 pb-5">
        <button
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
          onClick={handleSyncTo}
        >
          Sync to Google
        </button>
      </div>

      <div className="flex flex-row justify-between pb-5">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Vendors
        </h2>
        <button
          onClick={() => setDrawer(true)}
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
        >
          + Add Vendors
        </button>
      </div>
      <div className="flex flex-col pb-2 gap-2">
        <Select
          className="w-[300px] z-50"
          options={searchOpt}
          placeholder="Search By"
          value={search}
          onChange={(v) => {
            setVendorSearch("");
            setSearch(v);
          }}
        />

        {search.value == "Vendor Category" ? (
          <form className="flex flex-row gap-2" onSubmit={handleVendorSearch}>
            <Select
              className="w-[300px] z-20"
              options={vendorCatOpt}
              placeholder="Search By Vendor Category"
              value={vendorSearch}
              onChange={(v) => setVendorSearch(v)}
            />
            <div className="flex flex-row gap-2">
              <input
                type="submit"
                className="p-2 bg-orange-400 font-semibold text-white hover:cursor-pointer"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleClear();
                }}
                className="p-2 bg-orange-400 font-semibold text-white hover:cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        ) : search.value == "Vendor Name" ? (
          <form className="flex flex-row gap-2" onSubmit={handleVendorSearch}>
            <input
              type="text"
              className="w-[300px] p-2 border-[1px] rounded-[10px]"
              placeholder="Search By Vendor Name"
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
            />
            <div className="flex flex-row gap-2">
              <input
                type="submit"
                className="p-2 rounded-[10px] bg-orange-400 font-semibold text-white hover:cursor-pointer"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleClear();
                }}
                className="p-2 rounded-[10px] bg-orange-400 font-semibold text-white hover:cursor-pointer"
              >
                Clear
              </button>
            </div>
          </form>
        ) : null}
      </div>
      <div className="table-wrap">
        <VendorTable
          loading={loading}
          allVendors={allVendors}
          refreshData={refreshData}
          vendorFlag={vendorFlag}
          vendorLabel={vendorLabel}
          handleSort={(sortLabel, sortFlag) =>
            handleSorting(sortLabel, sortFlag)
          }
        />
      </div>
      {loading ? null : (
        <VendorDrawer
          addVendor={addVendor}
          open={drawer}
          onClose={handleCloseDrawer}
          edit={false}
          allVendors={allVendors}
        />
      )}
    </section>
  );
}

export default VendorComp;
