import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import ToolRequestTable from "../tables/toolRequestTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolReturnTable from "../tables/toolReturnTable";
import Select from "react-select";

const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function ToolReturn({ module, toolNumber }) {
  // const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [toolReturn, setToolReturn] = useState([]);
  const [jobOpt, setJobOpt] = useState([]);
  const [search, setSearch] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolReturn/`)
      .then((res) => {
        const sorted = res.data.toolReturns.sort((a, b) => a.date - b.date);
        setToolReturn(sorted);
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
  }, [refreshFlag]);

  const refreshData = () => {
    setRefreshFlag(!refreshFlag);
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolReturn/`)
      .then((res) => {
        const sorted = res.data.toolReturns.sort((a, b) => a.date - b.date);
        setToolReturn(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(`${apiPath.prodPath}/api/toolReturn/`)
      .then((res) => {
        const sorted = res.data.toolReturns.sort((a, b) => a.date - b.date);
        var searchArr = [];
        res.data.toolReturns.forEach((el) => {
          el.toolRequest.forEach((innEl) => {
            if (innEl.jobNumber == search.value) {
              searchArr.push(el);
            }
          });
        });
        setToolReturn(searchArr);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleClear = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolReturn/`)
      .then((res) => {
        const sorted = res.data.toolReturns.sort((a, b) => a.date - b.date);
        setToolReturn(sorted);
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
          Tool Returns
        </h2>
      </div>
      <form onSubmit={handleSearch} className="flex flex-row pt-5 pb-5 gap-4">
        <div className="w-[250px] flex flex-col gap-2">
          <Select
            options={jobOpt}
            value={search}
            onChange={(v) => setSearch(v)}
            placeholder="Search By Job#"
            className="z-50"
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="submit"
            value={"Search"}
            className="p-2 bg-orange-400 text-white font-semibold rounded-[8px]"
          />
        </div>
        {search == "" ? null : (
          <div className="flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                setSearch("");
                handleClear();
              }}
              className="p-2 bg-orange-400 text-white font-semibold rounded-[8px]"
            >
              Clear
            </button>
          </div>
        )}
      </form>
      <Tabs defaultValue="Pending" className="w-full">
        <TabsList className="cus-tab-wrap">
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Assigned To">Assigned To</TabsTrigger>
          <TabsTrigger value="Picked Up">Pick Up</TabsTrigger>
          <TabsTrigger value="Complete">Complete</TabsTrigger>
        </TabsList>
        <TabsContent value="Pending">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolReturnTable
              loading={loading}
              toolReturn={toolReturn.filter((i) => i.returnFlag == "Pending")}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Picked Up">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolReturnTable
              loading={loading}
              toolReturn={toolReturn.filter((i) => i.returnFlag == "Picked Up")}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Assigned To">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolReturnTable
              loading={loading}
              toolReturn={toolReturn.filter(
                (i) => i.returnFlag == "Assigned To"
              )}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Complete">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolReturnTable
              loading={loading}
              toolReturn={toolReturn.filter((i) => i.returnFlag == "Completed")}
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

export default ToolReturn;
