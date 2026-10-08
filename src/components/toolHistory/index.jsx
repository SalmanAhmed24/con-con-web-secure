import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import StorageLocationDrawer from "../drawers/storageLocationDrawer";
import StorageLocationTable from "../tables/storageLocationTable";
import ToolHistoryTable from "../tables/toolHistoryTable";
import Select from "react-select";

const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function ToolHistory({ module, toolNumber }) {
  // const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toolHistory, setToolHistory] = useState([]);
  const [toolFlag, setToolFlag] = useState(false);
  const [toolLabel, setToolLabel] = useState("");
  const [filterVal, setFilterVal] = useState({
    label: "Tool No",
    value: "Tool No",
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolHistory/`)
      .then((res) => {
        if (module == "all tools") {
          setToolHistory(res.data.toolHistory);
          setLoading(false);
        }
        if (module == "individual") {
          const filteredTool = res.data.toolHistory.filter(
            (i) => i.toolNumber == toolNumber
          );
          setToolHistory(filteredTool);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  // const handleCloseDrawer = () => {
  //   setDrawer(!drawer);
  // };
  // const addStorageLocations = (data) => {
  //   axios
  //     .post(`${apiPath.prodPath}/api/storageLocation/addStorageLocation`, data)
  //     .then((res) => {
  //       handleCloseDrawer();
  //       refreshData();
  //     })
  //     .catch((err) => console.log(err));
  // };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolHistory/`)
      .then((res) => {
        if (module == "all tools") {
          setToolHistory(res.data.toolHistory);
          setLoading(false);
        }
        if (module == "individual") {
          const filteredTool = res.data.toolHistory.filter(
            (i) => i.toolNumber == toolNumber
          );
          setToolHistory(filteredTool);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const searchFormHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get(
        `${apiPath.prodPath}/api/toolHistory/searchTool/?search=${search}&&filterVal=${filterVal.value}`
      )
      .then((res) => {
        if (module == "all tools") {
          setToolHistory(res.data.toolHistory);
          setLoading(false);
        }
        if (module == "individual") {
          const filteredTool = res.data.toolHistory.filter(
            (i) => i.toolNumber == toolNumber
          );
          setToolHistory(filteredTool);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleClear = () => {
    setSearch("");
    refreshData();
  };
  const handleToolSorting = (toolSortLable, toolSortFlag) => {
    if (toolSortLable == "Last Updated") {
      setToolLabel("Last Updated");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) =>
              a.lastUpdated.localeCompare(b.lastUpdated)
            )
          : toolHistory.sort((a, b) =>
              b.lastUpdated.localeCompare(a.lastUpdated)
            );
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Category") {
      setToolLabel("Category");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.category.localeCompare(b.category))
          : toolHistory.sort((a, b) => b.category.localeCompare(a.category));
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Sub-Category") {
      setToolLabel("Sub-Category");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) =>
              a.subCategory.localeCompare(b.subCategory)
            )
          : toolHistory.sort((a, b) =>
              b.subCategory.localeCompare(a.subCategory)
            );
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Brand") {
      setToolLabel("Brand");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.brand.localeCompare(b.brand))
          : toolHistory.sort((a, b) => b.brand.localeCompare(a.brand));
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Description") {
      setToolLabel("Description");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) =>
              a.toolDescription.localeCompare(b.toolDescription)
            )
          : toolHistory.sort((a, b) =>
              b.toolDescription.localeCompare(a.toolDescription)
            );
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Tech Assigned") {
      setToolLabel("Tech Assigned");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) =>
              a.techAssigned.localeCompare(b.techAssigned)
            )
          : toolHistory.sort((a, b) =>
              b.techAssigned.localeCompare(a.techAssigned)
            );
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Project") {
      setToolLabel("Project");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.job.localeCompare(b.job))
          : toolHistory.sort((a, b) => b.job.localeCompare(a.job));
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Vehicle") {
      setToolLabel("Vehicle");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.vehicle.localeCompare(b.vehicle))
          : toolHistory.sort((a, b) => b.vehicle.localeCompare(a.vehicle));
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Location") {
      setToolLabel("Location");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.location.localeCompare(b.location))
          : toolHistory.sort((a, b) => b.location.localeCompare(a.location));
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Age") {
      setToolLabel("Age");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) =>
              a.purchaseDate.localeCompare(b.purchaseDate)
            )
          : toolHistory.sort((a, b) =>
              b.purchaseDate.localeCompare(a.purchaseDate)
            );
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Due Date") {
      setToolLabel("Due Date");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
          : toolHistory.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Tool Number") {
      setToolLabel("Tool Number");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.toolNumber.localeCompare(b.toolNumber))
          : toolHistory.sort((a, b) =>
              b.toolNumber.localeCompare(a.toolNumber)
            );
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Checked Out") {
      setToolLabel("Checked Out");
      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.checkedOut - b.checkedOut)
          : toolHistory.sort((a, b) => b.checkedOut - a.checkedOut);
      setToolHistory(sortedData);
    }
    if (toolSortLable == "Category") {
      setToolLabel("Category");

      const sortedData =
        toolSortFlag == false
          ? toolHistory.sort((a, b) => a.category.localeCompare(b.category))
          : toolHistory.sort((a, b) => b.category.localeCompare(a.category));
      setToolHistory(sortedData);
    }
    setToolFlag(!toolSortFlag);
  };
  return (
    <section className="main-table-wrap">
      <div className="flex flex-row justify-between pb-5">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Tool History
        </h2>
        {/* <button
          onClick={() => setDrawer(true)}
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
        >
          + Add Storage Location
        </button> */}
      </div>
      <form
        onSubmit={searchFormHandler}
        className="flex flex-row flex-wrap gap-5 justify-start"
      >
        <div className="flex flex-col self-start w-[300px] mb-4">
          <Select
            className="z-[50]"
            options={[
              { label: "Tool No", value: "Tool No" },
              { label: "Location", value: "Location" },
              { label: "Category", value: "Category" },
              { label: "Sub-Category", value: "Sub-Category" },
              { label: "Brand", value: "Brand" },
              { label: "Description", value: "Description" },
              { label: "Tech Assigned", value: "Tech Assigned" },
              { label: "Project", value: "Project" },
              { label: "Vehicle", value: "Vehicle" },
            ]}
            value={filterVal}
            onChange={(e) => setFilterVal(e)}
            placeholder={`Select`}
          />
        </div>
        <div className="flex flex-col self-start w-[300px] mb-4">
          <input
            type="text"
            className="rounded-[5px] border-gray-400 border-[1px] p-[7px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search By ${filterVal.value}`}
          />
        </div>
        <div className="flex flex-col self-start w-[100px] mb-4">
          <input
            className="rounded-[5px] border-orange-400 border-[1px] bg-orange-400 text-white font-semibold p-[7px]"
            type="submit"
            value={"Search"}
          />
        </div>
        {search !== "" ? (
          <div className="flex flex-col self-start w-[100px] mb-4">
            <button
              onClick={() => handleClear()}
              className="rounded-[5px] border-orange-400 border-[1px] bg-orange-400 text-white font-semibold p-[7px]"
            >
              Clear
            </button>
          </div>
        ) : null}
      </form>
      <div className="table-wrap">
        {loading == true ? (
          <p>Loading....</p>
        ) : (
          <ToolHistoryTable
            loading={loading}
            toolHistory={toolHistory}
            refreshData={refreshData}
            handleToolSort={(sortLabel, toolSortFlag) =>
              handleToolSorting(sortLabel, toolSortFlag)
            }
            toolAscDesc={toolFlag}
            toolLabel={toolLabel}
          />
        )}
      </div>
      {/* <StorageLocationDrawer
        addStorageLocation={addStorageLocations}
        open={drawer}
        onClose={handleCloseDrawer}
        edit={false}
      /> */}
    </section>
  );
}

export default ToolHistory;
