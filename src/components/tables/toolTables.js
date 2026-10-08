import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Image from "next/image";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolsDrawer from "../drawers/toolsAdd";
import ToolInfoModal from "../modals/toolInfoModal";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import moment from "moment";

function ToolsTable({
  allTools,
  active,
  refreshData,
  handleToolSort,
  toolAscDesc,
  toolLabel,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [toolId, setToolId] = useState("");
  const [item, setItem] = useState();
  const [openFlag, setOpenFLag] = useState(false);
  const [infoModalFlag, setInfoModalFLag] = useState(false);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleOpenItem = (item) => {
    setInfoModalFLag(true);
    setToolId(item.id);
    setItem(item);
  };
  const handleEditItem = (item) => {
    setToolId(item.id);
    setItem(item);
    setOpenFLag(true);
  };
  const editToolHandler = (data, id) => {
    axios
      .patch(`${apiPath.prodPath}/api/allTools/${id}`, data)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to edit",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Editted Successfully",
          });
        }
        refreshData();
      })
      .catch((err) => console.log(err));
  };
  const handleDeleteItem = (item, fileObj) => {
    setToolId(item.id);
    setItem(item);
    const file = JSON.stringify(fileObj);
    Swal.fire({
      icon: "warning",
      title: "Are You Sure?",
      text: "Are you sure you want to delete the Tools data? This action is irreversible.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "orange",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${apiPath.prodPath}/api/allTools/${item.id}`, { file })
          .then((res) => {
            refreshData();
          })
          .catch((err) => console.log(err));
      }
    });
  };
  const dateCalculator = (dateVal, checkedOut) => {
    var date = new Date(dateVal);
    date.setDate(date.getDate() + Number(checkedOut));
    var finalDate =
      date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
    var checkedOutDate = new Date(finalDate);
    var currentDate = new Date();
    var currentDateMS = currentDate.getTime();
    if (checkedOutDate.getTime() < currentDateMS) {
      return true;
    } else {
      return false;
    }
  };
  const addToToolHistory = (oldData) => {
    axios
      .post(`${apiPath.prodPath}/api/toolHistory/addToolHistory`, oldData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <TableContainer sx={{ height: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 30 }}>Actions</TableCell>
              <TableCell
                style={{ width: 80 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Tool Number", toolAscDesc)}
              >
                Tool#
                {toolLabel == "Tool Number" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Tool Number" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              {/* <TableCell
                style={{ width: 250 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Serial No", toolAscDesc)}
              >
                Serial#
                {toolLabel == "Serial No" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Serial No" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell> */}
              <TableCell
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Category", toolAscDesc)}
                style={{ width: 110 }}
              >
                Category
                {toolLabel == "Category" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Category" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell style={{ width: 110 }}>Sub-Category</TableCell>
              <TableCell style={{ width: 110 }}>Brand</TableCell>
              <TableCell style={{ width: 170 }}>Description</TableCell>
              <TableCell style={{ width: 120 }}>Tech Assigned</TableCell>
              {/* <TableCell style={{ width: 120 }}>Type</TableCell> */}
              <TableCell style={{ width: 120 }}>Project</TableCell>
              <TableCell style={{ width: 120 }}>Vehicle</TableCell>
              <TableCell style={{ width: 120 }}>Location</TableCell>
              <TableCell style={{ width: 110 }}>Age</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTools.length == 0 ? (
              <TableRow>
                <TableCell>No Tools Data Found</TableCell>
              </TableRow>
            ) : (
              allTools
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((i) => {
                  return (
                    <TableRow key={i.id}>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Image
                              src={"/menu.png"}
                              width={24}
                              height={25}
                              alt="menu"
                              onClick={() => setItem(i)}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleOpenItem(i)}>
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditItem(i)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteItem(i, i.picture)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell
                        className={
                          i.checkedOut == undefined
                            ? "bg-transparent"
                            : dateCalculator(i.toolTrackDate, i.checkedOut)
                            ? "bg-red-300"
                            : "bg-white"
                        }
                      >
                        {i.toolNumber}
                      </TableCell>
                      {/* <TableCell>{i.serial}</TableCell> */}
                      <TableCell>{i.category}</TableCell>
                      <TableCell>{i.subCategory}</TableCell>
                      <TableCell>{i.brand}</TableCell>
                      <TableCell>{i.toolDescription}</TableCell>
                      <TableCell>{i.techAssigned}</TableCell>
                      {/* <TableCell>{i.projectVehicleFlag}</TableCell> */}
                      <TableCell>{i.job}</TableCell>
                      <TableCell>{i.vehicle}</TableCell>
                      <TableCell>{i.location}</TableCell>
                      <TableCell>
                        {i.purchaseDate == "" ||
                        i.purchaseDate == undefined ||
                        i.purchaseDate == "Invalid date"
                          ? "N/A"
                          : moment(i.purchaseDate).format("MM-DD-YYYY")}
                      </TableCell>
                      {i.id == toolId && openFlag ? (
                        <ToolsDrawer
                          addToToolHistory={addToToolHistory}
                          open={openFlag}
                          onClose={() => setOpenFLag(false)}
                          edit={true}
                          editTool={editToolHandler}
                          id={toolId}
                          data={item}
                        />
                      ) : null}
                      {i.id == toolId && infoModalFlag ? (
                        <ToolInfoModal
                          open={infoModalFlag}
                          item={item}
                          handleClose={() => setInfoModalFLag(false)}
                          refreshData={refreshData}
                        />
                      ) : null}
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 30, 40, 50]}
        component="div"
        count={allTools.length}
        rowsPerPage={rowsPerPage}
        page={page}
        showLastButton={true}
        showFirstButton={true}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default ToolsTable;
