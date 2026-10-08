"use client";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import Select from "react-select";
import "./style.scss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
import { Skeleton } from "@/components/ui/skeleton";
import ServiceDrawer from "../drawers/serviceTicketDrawer";
import ServiceTable from "../tables/serviceTicketTable";
import useStore from "@/utils/store/store";

function ServicesComp() {
  const currentUser = useStore((state) => state.user);
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [salesTaxValue, setSalesTaxValue] = useState();
  const [activeLinks, setActiveLinks] = useState("Open Ticket");
  const [loaderOuter, setLoaderOuter] = useState(false);
  const [employeeOpt, setEmployeeOpt] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [searchInp, setSearchInp] = useState([]);
  const [searchFlag, setSearchFlag] = useState(false);
  const [sFilter, setSFilter] = useState({
    label: "Employee",
    value: "Employee",
  });
  const [toolFlag, setToolFlag] = useState(false);
  const [toolLabel, setToolLabel] = useState("");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/service/`)
      .then((res) => {
        setAllServices(res.data.services);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    axios.get(`${apiPath.prodPath}/api/globalTax/`).then((res) => {
      setSalesTaxValue(res.data.globalTaxs[0].taxValue);
      setLoading(false);
    });
    axios.get(`${apiPath.prodPath}/api/users/`).then((res) => {
      const empArr = res.data.allUsers.map((i) => {
        return { label: i.fullname, value: i.fullname };
      });
      setEmployeeOpt(empArr);
      setLoading(false);
    });
  }, []);
  const handleCloseDrawer = () => {
    setDrawer(!drawer);
  };
  const addServices = (data) => {
    setLoaderOuter(true);
    axios
      .post(`${apiPath.prodPath}/api/service/addService`, data)
      .then((res) => {
        handleCloseDrawer();
        refreshData();
        setLoaderOuter(false);
      })
      .catch((err) => console.log(err));
  };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/service/`)
      .then((res) => {
        setAllServices(res.data.services);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearch = (e) => {
    // setSearchFlag(true);
    e.preventDefault();
    setLoading(true);
    // const filteredResults = allServices.filter(
    //   (i) => i.createdBy == employee.value,
    // );
    // setAllServices(filteredResults);
    let url = "";
    if (sFilter.value == "Employee") {
      url = `${apiPath.prodPath}/api/service/searchService/?filterName=Employee&&search=${employee.value}`;
    }
    if (sFilter.value == "Customer") {
      url = `${apiPath.prodPath}/api/service/searchService/?filterName=Customer&&search=${searchInp}`;
    }
    if (sFilter.value == "Service Number") {
      url = `${apiPath.prodPath}/api/service/searchService/?filterName=ServiceNo&&search=${searchInp}`;
    }
    if (sFilter.value == "Telephone") {
      url = `${apiPath.prodPath}/api/service/searchService/?filterName=Telephone&&search=${searchInp}`;
    }
    if (sFilter.value == "Email") {
      url = `${apiPath.prodPath}/api/service/searchService/?filterName=Email&&search=${searchInp}`;
    }
    if (sFilter.value == "Date Of Order") {
      url = `${apiPath.prodPath}/api/service/searchService/?filterName=DateOrder&&search=${searchInp}`;
    }
    if (sFilter.value == "Contact Name") {
      url = `${apiPath.prodPath}/api/service/searchService/?filterName=ContactName&&search=${searchInp}`;
    }
    axios.get(url).then((res) => {
      setAllServices(res.data.services);
      setLoading(false);
    });
  };
  const handleClear = () => {
    setEmployee("");
    setSearchInp("");
    setSearchFlag(false);
    refreshData();
  };
  const sFilterOpt = [
    { label: "Customer", value: "Customer" },
    { label: "Date Of Order", value: "Date Of Order" },
    { label: "Service Number", value: "Service Number" },
    { label: "Contact Name", value: "Contact Name" },
    { label: "Telephone", value: "Telephone" },
    { label: "Email", value: "Email" },
    { label: "Assigned To", value: "Employee" },
  ];
  const handleToolSorting = (toolSortLable, toolSortFlag) => {
    if (toolSortLable == "Customer") {
      setToolLabel("Customer");
      const sortedData =
        toolSortFlag == false
          ? allServices.sort((a, b) => a.to.localeCompare(b.to))
          : allServices.sort((a, b) => b.to.localeCompare(a.to));
      setAllServices(sortedData);
    }
    if (toolSortLable == "Date Of Order") {
      setToolLabel("Date Of Order");
      const sortedData =
        toolSortFlag == false
          ? allServices.sort((a, b) =>
              a.dateOfOrder.localeCompare(b.dateOfOrder)
            )
          : allServices.sort((a, b) =>
              b.dateOfOrder.localeCompare(a.dateOfOrder)
            );
      setAllServices(sortedData);
    }
    if (toolSortLable == "Contact Name") {
      setToolLabel("Contact Name");
      const sortedData =
        toolSortFlag == false
          ? allServices.sort((a, b) =>
              a.contactName.localeCompare(b.contactName)
            )
          : allServices.sort((a, b) =>
              b.contactName.localeCompare(a.contactName)
            );
      setAllServices(sortedData);
    }
    if (toolSortLable == "Assigned To") {
      setToolLabel("Assigned To");
      const sortedData =
        toolSortFlag == false
          ? allServices.sort((a, b) => a.assignedTo.localeCompare(b.assignedTo))
          : allServices.sort((a, b) =>
              b.assignedTo.localeCompare(a.assignedTo)
            );
      setAllServices(sortedData);
    }
    setToolFlag(!toolSortFlag);
  };
  return (
    <section className={`${poppins.className} employee-wrap`}>
      <div className="flex flex-row justify-between pb-5">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Service Tickets
        </h2>
      </div>
      <div className="flex flex-row w-fuu">
        <form
          onSubmit={handleSearch}
          className="flex flex-row gap-4 w-1/2 justify-start"
        >
          <Select
            placeholder="Search By"
            value={sFilter}
            options={sFilterOpt}
            onChange={(v) => {
              setSFilter(v);
              setSearchInp("");
              setEmployee("");
            }}
            className="w-[200px]"
            id="search-service-ticket"
          />
          {sFilter.value == "Employee" ? (
            <Select
              placeholder="Search Assigned To"
              value={employee}
              options={employeeOpt}
              onChange={(v) => setEmployee(v)}
              id="search-service-ticket"
              className="w-[300px]"
            />
          ) : sFilter.value == "Customer" ? (
            <input
              value={searchInp}
              placeholder="Search By Customer"
              className="border-[#cfcfcf] border-[1px] rounded-[8px] pl-2 pr-2 w-[300px]"
              onChange={(e) => setSearchInp(e.target.value)}
            />
          ) : sFilter.value == "Service Number" ? (
            <input
              value={searchInp}
              placeholder="Search By Service Number"
              className="border-[#cfcfcf] border-[1px] rounded-[8px] pl-2 pr-2 w-[300px]"
              onChange={(e) => setSearchInp(e.target.value)}
            />
          ) : sFilter.value == "Telephone" ? (
            <input
              value={searchInp}
              placeholder="Search By Telephone"
              className="border-[#cfcfcf] border-[1px] rounded-[8px] pl-2 pr-2 w-[300px]"
              onChange={(e) => setSearchInp(e.target.value)}
            />
          ) : sFilter.value == "Email" ? (
            <input
              value={searchInp}
              placeholder="Search By Email"
              className="border-[#cfcfcf] border-[1px] rounded-[8px] pl-2 pr-2 w-[300px]"
              onChange={(e) => setSearchInp(e.target.value)}
            />
          ) : sFilter.value == "Date Of Order" ? (
            <input
              value={searchInp}
              placeholder="Search By Date Of Order"
              className="border-[#cfcfcf] border-[1px] rounded-[8px] pl-2 pr-2 w-[300px]"
              onChange={(e) => setSearchInp(e.target.value)}
            />
          ) : sFilter.value == "Contact Name" ? (
            <input
              value={searchInp}
              placeholder="Search By Contact Name"
              className="border-[#cfcfcf] border-[1px] rounded-[8px] pl-2 pr-2 w-[300px]"
              onChange={(e) => setSearchInp(e.target.value)}
            />
          ) : null}
          <div className="flex flex-row gap-3">
            <input
              type="submit"
              className=" bg-orange-400 text-white p-2 rounded-xl"
              value={"Search"}
            />
            {searchInp !== "" || employee !== "" ? (
              <button
                className="bg-orange-400 text-white p-2 rounded-xl"
                onClick={handleClear}
              >
                Clear
              </button>
            ) : null}
          </div>
        </form>
        <div className="flex flex-row justify-end w-1/2">
          <button
            onClick={() => setDrawer(true)}
            className="self-end p-2 font-medium bg-orange-400 rounded-xl text-white"
          >
            + Add Service Ticket
          </button>
        </div>
      </div>
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="to be assigned" className="bg-transparent">
            To Be Assigned
          </TabsTrigger>
          <TabsTrigger value="open" className="bg-transparent">
            Open Ticket
          </TabsTrigger>
          <TabsTrigger value="unbilled" className="bg-transparent">
            Unbilled
          </TabsTrigger>
          <TabsTrigger value="billed" className="bg-transparent">
            Billed
          </TabsTrigger>
          <TabsTrigger value="deleted" className="bg-transparent">
            Deleted Tickets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <ServiceTable
              loading={loading}
              allServices={allServices
                .filter((i) => i.deleteFlag == false)
                .filter((i) => i.ticketStatus == "Open Ticket")}
              refreshData={refreshData}
              currentUser={currentUser}
              salesTaxValue={salesTaxValue}
              toolAscDesc={toolFlag}
              toolLabel={toolLabel}
              handleToolSort={(sortLabel, toolSortFlag) =>
                handleToolSorting(sortLabel, toolSortFlag)
              }
            />
          )}
        </TabsContent>
        <TabsContent value="unbilled">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <ServiceTable
              loading={loading}
              allServices={allServices
                .filter((i) => i.deleteFlag == false)
                .filter((i) => i.ticketStatus == "Unbilled")}
              refreshData={refreshData}
              currentUser={currentUser}
              salesTaxValue={salesTaxValue}
              toolAscDesc={toolFlag}
              toolLabel={toolLabel}
              handleToolSort={(sortLabel, toolSortFlag) =>
                handleToolSorting(sortLabel, toolSortFlag)
              }
            />
          )}
        </TabsContent>
        <TabsContent value="billed">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <ServiceTable
              loading={loading}
              allServices={allServices
                .filter((i) => i.deleteFlag == false)
                .filter((i) => i.ticketStatus == "Billed")}
              refreshData={refreshData}
              currentUser={currentUser}
              salesTaxValue={salesTaxValue}
              toolAscDesc={toolFlag}
              toolLabel={toolLabel}
              handleToolSort={(sortLabel, toolSortFlag) =>
                handleToolSorting(sortLabel, toolSortFlag)
              }
            />
          )}
        </TabsContent>
        <TabsContent value="to be assigned">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <ServiceTable
              loading={loading}
              allServices={allServices
                .filter((i) => i.deleteFlag == false)
                .filter((i) => i.ticketStatus == "To Be Assigned")}
              refreshData={refreshData}
              currentUser={currentUser}
              salesTaxValue={salesTaxValue}
              tabActive={"to be assigned"}
              toolAscDesc={toolFlag}
              toolLabel={toolLabel}
              handleToolSort={(sortLabel, toolSortFlag) =>
                handleToolSorting(sortLabel, toolSortFlag)
              }
            />
          )}
        </TabsContent>
        <TabsContent value="deleted">
          {loading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-[500px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <ServiceTable
              loading={loading}
              allServices={allServices.filter((i) => i.deleteFlag == true)}
              refreshData={refreshData}
              currentUser={currentUser}
              salesTaxValue={salesTaxValue}
              tabActive={"deleted"}
              toolAscDesc={toolFlag}
              toolLabel={toolLabel}
              handleToolSort={(sortLabel, toolSortFlag) =>
                handleToolSorting(sortLabel, toolSortFlag)
              }
            />
          )}
        </TabsContent>
      </Tabs>
      {loading ? null : drawer ? (
        <ServiceDrawer
          addServices={addServices}
          open={drawer}
          onClose={handleCloseDrawer}
          edit={false}
          allServices={allServices}
          currentUser={currentUser}
          salesTaxValue={salesTaxValue}
          loaderOuter={loaderOuter}
        />
      ) : null}
    </section>
  );
}

export default ServicesComp;
