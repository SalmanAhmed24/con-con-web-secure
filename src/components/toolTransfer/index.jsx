import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import ToolRequestTable from "../tables/toolRequestTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolTransferTable from "../tables/toolTransferTable";
import Select from "react-select";

const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function ToolTransfer({ module, toolNumber }) {
  // const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [toolTransfer, setToolTransfer] = useState([]);
  const [jobOpt, setJobOpt] = useState([]);
  const [search, setSearch] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolTransfer/`)
      .then((res) => {
        const sorted = res.data.toolTransfers.sort((a, b) => a.date - b.date);
        setToolTransfer(sorted);
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
      .get(`${apiPath.prodPath}/api/toolTransfer/`)
      .then((res) => {
        const sorted = res.data.toolTransfers.sort((a, b) => a.date - b.date);
        setToolTransfer(sorted);
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
      .get(`${apiPath.prodPath}/api/toolTransfer/`)
      .then((res) => {
        const sorted = res.data.toolTransfers.sort((a, b) => a.date - b.date);
        var searchArr = [];
        res.data.toolTransfers.forEach((el) => {
          el.toolRequest.forEach((innEl) => {
            if (innEl.jobNumber == search.value) {
              searchArr.push(el);
            }
          });
        });
        setToolTransfer(searchArr);
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
      .get(`${apiPath.prodPath}/api/toolTransfer/`)
      .then((res) => {
        const sorted = res.data.toolTransfers.sort((a, b) => a.date - b.date);
        setToolTransfer(sorted);
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
          Tool Transfer
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
          <TabsTrigger value="Assign Transfer To">
            Assign Transfer To
          </TabsTrigger>
          <TabsTrigger value="Transfer By">Transfer By</TabsTrigger>
          <TabsTrigger value="Complete">Complete</TabsTrigger>
        </TabsList>
        <TabsContent value="Pending">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolTransferTable
              loading={loading}
              toolTransfer={toolTransfer.filter(
                (i) => i.returnFlag == "Pending",
              )}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Transfer By">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolTransferTable
              loading={loading}
              toolTransfer={toolTransfer.filter(
                (i) => i.returnFlag == "Transfer By",
              )}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Assign Transfer To">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolTransferTable
              loading={loading}
              toolTransfer={toolTransfer.filter(
                (i) => i.returnFlag == "Assign Transfer To",
              )}
              refreshRequestData={refreshData}
            />
          )}
        </TabsContent>
        <TabsContent value="Complete">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ToolTransferTable
              loading={loading}
              toolTransfer={toolTransfer.filter(
                (i) => i.returnFlag == "Completed",
              )}
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

export default ToolTransfer;
