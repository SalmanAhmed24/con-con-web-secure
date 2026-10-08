import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import StorageLocationDrawer from "../drawers/storageLocationDrawer";
import StorageLocationTable from "../tables/storageLocationTable";

const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function StorageLocationComp() {
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allStorageLocations, setAllStorageLocations] = useState([]);
  const [storageFlag, setStorageFlag] = useState(false);
  const [storageLabel, setStorageLabel] = useState("");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/storageLocation/`)
      .then((res) => {
        const sortedData = res.data.storageLocations.sort((a, b) =>
          a.building.localeCompare(b.building)
        );
        setAllStorageLocations(sortedData);
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
  const addStorageLocations = (data) => {
    axios
      .post(`${apiPath.prodPath}/api/storageLocation/addStorageLocation`, data)
      .then((res) => {
        handleCloseDrawer();
        refreshData();
      })
      .catch((err) => console.log(err));
  };
  const handleSort = (toolSortLable, toolSortFlag) => {
    if (toolSortLable == "Building") {
      setStorageLabel("Building");
      const sortedData =
        toolSortFlag == false
          ? allStorageLocations.sort((a, b) =>
              a.building.localeCompare(b.building)
            )
          : allStorageLocations.sort((a, b) =>
              b.building.localeCompare(a.building)
            );
      setAllStorageLocations(sortedData);
    }
    if (toolSortLable == "Storage Id") {
      setStorageLabel("Storage Id");
      const sortedData =
        toolSortFlag == false
          ? allStorageLocations.sort((a, b) =>
              a.storageId.localeCompare(b.storageId)
            )
          : allStorageLocations.sort((a, b) =>
              b.storageId.localeCompare(a.storageId)
            );
      setAllStorageLocations(sortedData);
    }
    if (toolSortLable == "Notes") {
      setStorageLabel("Notes");
      const sortedData =
        toolSortFlag == false
          ? allStorageLocations.sort((a, b) => a.notes.localeCompare(b.notes))
          : allStorageLocations.sort((a, b) => b.notes.localeCompare(a.notes));
      setAllStorageLocations(sortedData);
    }
    if (toolSortLable == "Description") {
      setStorageLabel("Description");
      const sortedData =
        toolSortFlag == false
          ? allStorageLocations.sort((a, b) =>
              a.description.localeCompare(b.description)
            )
          : allStorageLocations.sort((a, b) =>
              b.description.localeCompare(a.description)
            );
      setAllStorageLocations(sortedData);
    }
    setStorageFlag(!toolSortFlag);
  };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/storageLocation/`)
      .then((res) => {
        setAllStorageLocations(res.data.storageLocations);
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
          Storage Location
        </h2>
        <button
          onClick={() => setDrawer(true)}
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
        >
          + Add Storage Location
        </button>
      </div>
      <div className="table-wrap">
        {loading == true ? (
          <p>Loading....</p>
        ) : (
          <StorageLocationTable
            loading={loading}
            allStorageLocation={allStorageLocations}
            refreshData={refreshData}
            storageAscDesc={storageFlag}
            storageLabel={storageLabel}
            handleSort={(sortLabel, sortFlag) =>
              handleSort(sortLabel, sortFlag)
            }
          />
        )}
      </div>
      <StorageLocationDrawer
        addStorageLocation={addStorageLocations}
        open={drawer}
        onClose={handleCloseDrawer}
        edit={false}
      />
    </section>
  );
}

export default StorageLocationComp;
