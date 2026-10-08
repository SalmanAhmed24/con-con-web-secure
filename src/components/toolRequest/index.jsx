import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import ToolRequestTable from "../tables/toolRequestTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Select from "react-select";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function ToolRequest({ module, toolNumber }) {
  // const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [toolRequest, setToolRequest] = useState([]);
  const [searchFormVal, setSearchFormVal] = useState({
    label: "Name",
    value: "name",
  });
  const [jobOpt, setJobOpt] = useState([]);
  const [vehicleOpt, setVehicleOpt] = useState([]);
  const [userOpt, setUserOpt] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolRequest/`)
      .then((res) => {
        const sorted = res.data.toolRequests.sort((a, b) => a.date - b.date);
        setToolRequest(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    axios
      .get(`${apiPath.prodPath}/api/jobNumber/`)
      .then((res) => {
        const sorted = res.data.jobNumbers
          .map((i) => {
            return {
              label: `${i.jobNumber} - ${i.jobName}`,
              value: `${i.jobNumber} - ${i.jobName}`,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setJobOpt(sorted);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/vehicles/`)
      .then((res) => {
        const sorted = res.data.vehicles
          .map((i) => {
            return {
              label: i.vehicleNo,
              value: i.vehicleNo,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setVehicleOpt(sorted);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const sorted = res.data.allUsers
          .map((i) => {
            return {
              label: i.fullname,
              value: i.fullname,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));
        setUserOpt(sorted);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshFlag]);
  const handleClear = (e) => {
    e.preventDefault();
    setSearch("");
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolRequest/`)
      .then((res) => {
        const sorted = res.data.toolRequests.sort((a, b) => a.date - b.date);
        setToolRequest(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const refreshData = () => {
    setRefreshFlag(!refreshFlag);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    var sortedVal;
    axios
      .get(`${apiPath.prodPath}/api/toolRequest/`)
      .then((res) => {
        if (searchFormVal.value == "name") {
          sortedVal = res.data.toolRequests
            .filter((i) => i.user == search.value)
            .sort((a, b) => a.date - b.date);
        }
        if (searchFormVal.value == "project") {
          sortedVal = res.data.toolRequests
            .filter((i) => i.projectDescription == search.value)
            .sort((a, b) => a.date - b.date);
        }
        if (searchFormVal.value == "vehicle") {
          sortedVal = res.data.toolRequests
            .filter((i) => i.vehicleDescription == search.value)
            .sort((a, b) => a.date - b.date);
        }
        setToolRequest(sortedVal);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <section className="main-table-wrap">
      <div className="flex flex-row justify-between pb-5">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Tool Requests
        </h2>
      </div>
      <div>
        <form onSubmit={handleSearch} className="flex flex-row gap-4">
          <div className="flex flex-col gap-2 w-[250px]">
            <Select
              className="z-[50]"
              options={[
                { label: "By Name", value: "name" },
                { label: "By Project", value: "project" },
                { label: "By Vehicle", value: "vehicle" },
              ]}
              value={searchFormVal}
              onChange={(e) => setSearchFormVal(e)}
              placeholder="Search By"
            />
          </div>
          <div className="flex flex-col gap-2 w-[250px]">
            <Select
              className="z-[50]"
              options={
                searchFormVal.value == "name"
                  ? userOpt
                  : searchFormVal.value == "project"
                  ? jobOpt
                  : vehicleOpt
              }
              value={search}
              onChange={(e) => setSearch(e)}
              placeholder={`Search By ${
                searchFormVal.value == "name"
                  ? "Name"
                  : searchFormVal.value == "project"
                  ? "Project"
                  : "Vehicle"
              }`}
            />
          </div>
          <div className="flex flex-row gap-2">
            <input
              className="bg-orange-400 rounded-[6px] text-white font-semibold p-2"
              type="submit"
              value={"Search"}
            />
            {search == "" ? null : (
              <button
                onClick={handleClear}
                className="bg-orange-400 rounded-[6px] text-white font-semibold p-2"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
      <Tabs defaultValue="Pending" className="w-full">
        <TabsList className="cus-tab-wrap">
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Assigned To">Assigned To</TabsTrigger>
          <TabsTrigger value="Set To Deliver">Deliver To</TabsTrigger>
          <TabsTrigger value="Complete">Complete</TabsTrigger>
        </TabsList>
        <TabsContent value="Pending">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolRequestTable
              loading={loading}
              tabValue={"Pending"}
              toolRequest={toolRequest.filter((i) => i.approval == "Pending")}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Assigned To">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolRequestTable
              loading={loading}
              tabValue={"Assigned To"}
              toolRequest={toolRequest.filter(
                (i) => i.approval == "Assigned To"
              )}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Set To Deliver">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolRequestTable
              loading={loading}
              tabValue={"Set To Deliver"}
              toolRequest={toolRequest.filter(
                (i) => i.approval == "Set To Deliver"
              )}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Complete">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolRequestTable
              loading={loading}
              tabValue={"Complete"}
              toolRequest={toolRequest.filter((i) => i.approval == "Complete")}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
      </Tabs>
      {/* <div className="table-wrap">
        {loading == true ? (
          <p>Loading....</p>
        ) : (
          <ToolRequestTable
            loading={loading}
            toolRequest={toolRequest}
            refreshRequestData={refreshData}
          />
        )}
      </div> */}
    </section>
  );
}

export default ToolRequest;
