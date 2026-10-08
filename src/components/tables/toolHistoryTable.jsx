import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Poppins } from "next/font/google";
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Swal from "sweetalert2";
import moment from "moment";
import { format, parseISO } from "date-fns";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TagoutDrawer from "../drawers/tagoutDrawer";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
export default function ToolHistoryTable({
  toolHistory,
  loading,
  handleToolSort,
  toolAscDesc,
  toolLabel,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [actionFlag, setActionFlag] = useState(false);
  const [toolHistoryId, setToolHistoryId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [infoModal, setInfoModal] = useState(false);
  const [item, setItem] = useState();
  useEffect(() => {
    setPage(0);
  }, [loading]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const openEmpModal = (data) => {
    setToolHistoryId(data.id);
    setEditData(data);
    setOpenModal(true);
  };
  const openInfoDrawer = () => {
    setInfoModal(!infoModal);
    setActionFlag(false);
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

  //   // Calculate the difference in milliseconds and take the absolute value
  //   const difference_ms = Math.abs(date1_ms - date2_ms);

  //   // Convert back to days and round the result to handle Daylight Saving Time (DST)
  //   const dayCount = Math.round(difference_ms / ONE_DAY) + 1;
  //   if (dayCount < 0) {
  //     return `Overdue`;
  //   } else {
  //     return `Days left ${dayCount}`;
  //   }
  //   return Math.round(difference_ms / ONE_DAY) + 1;
  // };
  // const toolHistory =
  //   toolHistory.length == 0
  //     ? []
  //     : toolHistory.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  return (
    <Paper
      className={poppins.className}
      sx={{ width: "100%", overflow: "hidden", bgcolor: "transparent" }}
    >
      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[300px] w-[500px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <TableContainer sx={{ height: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ minWidth: 180 }}
                  className="hover:cursor-pointer"
                  onClick={() => handleToolSort("Last Updated", toolAscDesc)}
                >
                  Last Updated
                  {toolLabel == "Last Updated" && toolAscDesc == false ? (
                    <ArrowUpwardIcon className="text-[20px]" />
                  ) : toolLabel == "Last Updated" && toolAscDesc ? (
                    <ArrowDownwardIcon className="text-[20px]" />
                  ) : null}
                </TableCell>
                <TableCell
                  style={{ minWidth: 100 }}
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
                <TableCell
                  style={{ minWidth: 110 }}
                  className="hover:cursor-pointer"
                  onClick={() => handleToolSort("Category", toolAscDesc)}
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
              {toolHistory.length == 0 ? (
                <TableRow>
                  <TableCell className="w-[200px]">
                    No Tool History Found
                  </TableCell>
                </TableRow>
              ) : (
                toolHistory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((i) => {
                    return (
                      <TableRow key={i.id}>
                        <TableCell>
                          {moment(i.lastUpdated).format("MM-DD-YYYY hh:mm a")}
                        </TableCell>
                        <TableCell>{i.toolNumber}</TableCell>
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
                      </TableRow>
                    );
                  })
              )}
            </TableBody>

            {/* {infoModal ? (
              <ToolInfo
                open={infoModal}
                onClose={openInfoDrawer}
                item={item}
                refreshData={refreshData}
              />
            ) : null} */}
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[20, 30, 40, 50]}
        component="div"
        count={toolHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
