import { apiPath } from "@/utils/routes";
import { Skeleton } from "@mui/material";
import axios from "axios";
import { Poppins } from "next/font/google";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ToolPartTable from "../tables/toolPartTable";

const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
const ToolPart = ({ toolNumber }) => {
  const [partNo, setPartNo] = useState("");
  const [description, setDescription] = useState("");
  const [allToolPart, setAllToolPart] = useState([]);
  const [loader, setLoader] = useState(false);
  const [edit, setEdit] = useState(false);
  const [toolPartId, setToolPartId] = useState("");
  useEffect(() => {
    getToolParts();
  }, []);
  const setEditData = (partNo, description, dataId) => {
    setPartNo(partNo);
    setDescription(description);
    setEdit(true);
    setToolPartId(dataId);
  };
  const handleAddTool = (e) => {
    e.preventDefault();
    const dataObj = {
      partNo,
      description,
      toolNumber,
    };
    if (edit) {
      axios
        .patch(`${apiPath.prodPath}/api/toolPart/${toolPartId}`, dataObj)
        .then((res) => {
          if (res.data.error) {
            Swal.fire({
              icon: "error",
              text: "Cannot edit the tool part please try again",
            });
          } else {
            Swal.fire({
              icon: "success",
              text: "Edited Successfully",
            });
            getToolParts();
            resetValues();
          }
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .post(`${apiPath.prodPath}/api/toolPart/addToolPart`, dataObj)
        .then((res) => {
          if (res.data.error) {
            Swal.fire({
              icon: "error",
              text: "Cannot add the tool part please try again",
            });
          } else {
            Swal.fire({
              icon: "success",
              text: "Added Successfully",
            });
            getToolParts();
            resetValues();
          }
        })
        .catch((error) => console.log(error));
    }
  };
  const resetValues = () => {
    setPartNo("");
    setDescription("");
    setToolPartId("");
  };
  const getToolParts = () => {
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/toolPart/?toolNumber=${toolNumber}`)
      .then((res) => {
        setAllToolPart(res.data.toolParts);
        setLoader(false);
      })
      .catch((err) => console.log(err));
  };
  return (
    <section className="p-2 flex flex-col w-full">
      <div className="pb-5">
        <h2 className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}>
          Parts / Items
        </h2>
        <form
          onSubmit={handleAddTool}
          className="p-5 shadow-md flex flex-row gap-3"
        >
          <div className="w-[200px] flex flex-col gap-2">
            <label className="font-semibold">Part No</label>
            <input
              type="text"
              className="p-2 border-[1px] border-gray-200 rounded-[8px]"
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
              placeholder="Part No"
            />
          </div>
          <div className="w-[300px] flex flex-col gap-2">
            <label className="font-semibold">Description</label>
            <input
              type="text"
              className="p-2 border-[1px] border-gray-200 rounded-[8px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="flex flex-col gap-2 justify-end">
            <input
              type="submit"
              className="p-2 rounded-[8px] font-semibold text-white bg-orange-400"
              value={edit ? "Save" : "Add"}
            />
          </div>
        </form>
        {loader ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[500px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <ToolPartTable
            allToolPart={allToolPart}
            refreshData={getToolParts}
            callEdit={setEditData}
          />
        )}
      </div>
    </section>
  );
};
export default ToolPart;
