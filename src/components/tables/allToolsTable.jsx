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
import ToolInfoModal from "../modals/toolInfoModal";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import moment from "moment";
import AllToolsDrawer from "../drawers/allToolsDrawer";
import { format, parseISO } from "date-fns";

function AllToolsTable({
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
      .patch(`${apiPath.prodPath}/api/allTools/editTool/${id}`, data)
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
  const handleDeleteItem = (item, fileArr) => {
    setToolId(item.id);
    setItem(item);
    const file = JSON.stringify(fileArr);
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
  function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }

  function daysBetween(endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (
      Math.round(
        (treatAsUTC(endDate) - treatAsUTC(new Date())) / millisecondsPerDay
      ) + 1
    );
  }
  // const handleDaysLeft = (dueDate) => {
  //   const ONE_DAY = 1000 * 60 * 60 * 24;

  //   // Convert both dates to milliseconds
  //   const date1_ms = new Date(dueDate).getTime();
  //   const date2_ms = new Date().getTime();

  //   console.log("this is due date in time", date1_ms);
  //   console.log("this is current date in time", date2_ms);
  //   // Calculate the difference in milliseconds and take the absolute value
  //   const difference_ms = Math.abs(date1_ms - date2_ms);
  //   console.log("this is difference", difference_ms);
  //   // Convert back to days and round the result to handle Daylight Saving Time (DST)
  //   const dayCount = Math.round(difference_ms / ONE_DAY) + 1;

  //   if (dayCount < 0) {
  //     return `Overdue`;
  //   } else {
  //     return `Days left ${dayCount}`;
  //   }
  //   return Math.round(difference_ms / ONE_DAY) + 1;
  // };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", bgcolor: "transparent" }}>
      <TableContainer sx={{ height: 500 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 30 }}>Actions</TableCell>
              <TableCell
                style={{ minWidth: 80 }}
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
                style={{ minWidth: 250 }}
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
                style={{ minWidth: 170 }}
              >
                Category
                {toolLabel == "Category" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Category" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Sub-Category", toolAscDesc)}
                style={{ minWidth: 150 }}
              >
                Sub-Category
                {toolLabel == "Sub-Category" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Sub-Category" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                style={{ minWidth: 110 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Brand", toolAscDesc)}
              >
                Brand
                {toolLabel == "Brand" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Brand" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                style={{ minWidth: 170 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Description", toolAscDesc)}
              >
                Description
                {toolLabel == "Description" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Description" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                style={{ minWidth: 180 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Tech Assigned", toolAscDesc)}
              >
                Tech Assigned
                {toolLabel == "Tech Assigned" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Tech Assigned" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              {/* <TableCell style={{ minWidth: 120 }}>Type</TableCell> */}
              <TableCell
                style={{ minWidth: 120 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Project", toolAscDesc)}
              >
                Project
                {toolLabel == "Project" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Project" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                style={{ minWidth: 120 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Vehicle", toolAscDesc)}
              >
                Vehicle
                {toolLabel == "Vehicle" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Vehicle" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                style={{ minWidth: 120 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Location", toolAscDesc)}
              >
                Location
                {toolLabel == "Location" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Location" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                style={{ minWidth: 170 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Checked Out", toolAscDesc)}
              >
                Checked Out
                {toolLabel == "Checked Out" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Checked Out" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell style={{ minWidth: 170 }}>Days Left</TableCell>
              <TableCell
                style={{ minWidth: 170 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Age", toolAscDesc)}
              >
                Age
                {toolLabel == "Age" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Age" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
              <TableCell
                style={{ minWidth: 170 }}
                className="hover:cursor-pointer"
                onClick={() => handleToolSort("Due Date", toolAscDesc)}
              >
                Due Date
                {toolLabel == "Due Date" && toolAscDesc == false ? (
                  <ArrowUpwardIcon className="text-[20px]" />
                ) : toolLabel == "Due Date" && toolAscDesc ? (
                  <ArrowDownwardIcon className="text-[20px]" />
                ) : null}
              </TableCell>
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
                      <TableCell>{i.checkedOut}</TableCell>
                      <TableCell>
                        {daysBetween(i.dueDate) < 0
                          ? "Overdue"
                          : `${daysBetween(i.dueDate)} Days left`}
                      </TableCell>
                      {/* <TableCell>
                        {i.purchaseDate == "" ||
                        i.purchaseDate == undefined ||
                        i.purchaseDate == "Invalid date"
                          ? "N/A"
                          : moment(i.purchaseDate).format("MM-DD-YYYY")}
                      </TableCell> */}
                      <TableCell>
                        {i.purchaseDate == "" ||
                        i.purchaseDate == undefined ||
                        i.purchaseDate == "Invalid date"
                          ? "N/A"
                          : format(i.purchaseDate, "MM-dd-yyyy")}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {i.dueDate == "" ||
                        i.dueDate == undefined ||
                        i.dueDate == "Invalid date"
                          ? "N/A"
                          : format(i.dueDate, "MM-dd-yyyy")}
                      </TableCell>
                      {i.id == toolId && openFlag ? (
                        <AllToolsDrawer
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
    </Paper>
  );
}

export default AllToolsTable;
