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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TagoutDrawer from "../drawers/tagoutDrawer";
import RequestApproval from "../modals/requestApproval";
import ReturnToolModal from "../modals/returnToolModal";
import AssignPickUpModal from "../modals/assignPickUpModal";
import SetForPickUp from "../modals/setForPickupModal";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
export default function ToolReturnTable({
  toolReturn,
  loading,
  refreshRequestData,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [returnModal, setReturnModal] = useState(false);
  const [assignPickUp, setAssignPickUp] = useState(false);
  const [returnId, setReturnId] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [pickUpSetModal, setPickUpSetModal] = useState(false);
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
  const refreshData = () => {
    refreshRequestData();
    setRefreshFlag(false);
    setReturnModal(true);
  };
  const handleReturnModal = (e, id) => {
    e.preventDefault();
    setReturnId(id);
    setReturnModal(true);
  };
  const handlePickUpModal = (e, id) => {
    e.preventDefault();
    setReturnId(id);
    setAssignPickUp(true);
  };
  const convertDate = (date) => {
    let datePart = date.split("T")[0]; // "2026-02-20"

    // Split year, month, day
    let [year, month, day] = datePart.split("-");

    let formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
  };
  const generatePdf = async (final) => {
    let mywindow = window.open("", "PRINT", "height=1400,width=1400,top=0");
    mywindow.document.write(
      `<table style="border-collapse: collapse;width: 100%;">
      <thead>
      <tr>
        <th style="width:200px">Date</th>
        <th style="width:80px">Time</th>
        <th style="width:250px">Person Requested</th>
        <th style="width:250px">Project/Vehicle</th>
        <th style="width:250px">Job #</th>
        <th style="width:250px">Vehicle #</th>
        <th style="width:300px">Tool Request</th>
        <th style="width:80px">Status</th>
      </tr>
      </thead>
      <tbody>
      ${toolReturn.map((i) => {
        return `<tr key={${
          i.id
        }} style="border: 1px solid black;padding: 10px;text-align: left;">
            <td style="width:200px;border: 1px solid black;padding: 10px;text-align: left;">${convertDate(
              i.date
            )}</td>
            <td style="width:100px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.time
            }</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.user
            }</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolRequest.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                ${
                                  inner.projectVehicleFlag == undefined
                                    ? "N/A"
                                    : inner.projectVehicleFlag
                                }
                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolRequest.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                Job # ${
                                  inner.jobNumber == "" ||
                                  inner.jobNumber == undefined
                                    ? "N/A"
                                    : inner.jobNumber
                                }
                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolRequest.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                                                Vehicle # ${
                                                                  inner.vehicle ==
                                                                    "" ||
                                                                  inner.vehicle ==
                                                                    undefined
                                                                    ? "N/A"
                                                                    : inner.vehicle
                                                                }

                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolRequest.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                tool# ${inner.toolNumber}
                                ${
                                  inner.assignedTo == ""
                                    ? "is unassigned"
                                    : `assigned for pickup to ${inner.assignedTo}`
                                }
                              </div>`;
              }
            )}</td>
            <td style="width:100px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.returnFlag
            }</td>

          </tr>`;
      })}
      </tbody>
</table>`
    );
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  };
  const setPickUp = (e, id) => {
    e.preventDefault();
    setReturnId(id);
    setPickUpSetModal(true);
  };
  return (
    <>
      <div className="flex flex-row justify-end pt-5 pb-5">
        <button
          onClick={(e) => {
            e.preventDefault();
            generatePdf();
          }}
          className="bg-orange-400 text-white font-semibold p-2 rounded-[8px]"
        >
          Download Report
        </button>
      </div>
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
            <Table id="tool-return" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 50 }}>Date</TableCell>
                  <TableCell style={{ minWidth: 50 }}>Time</TableCell>
                  <TableCell style={{ minWidth: 110 }}>
                    Person Requested
                  </TableCell>
                  <TableCell style={{ minWidth: 110 }}>
                    Project / Vehicle
                  </TableCell>
                  <TableCell style={{ minWidth: 110 }}>Job #</TableCell>
                  <TableCell style={{ minWidth: 110 }}>Vehicle</TableCell>
                  <TableCell style={{ minWidth: 110 }}>Location</TableCell>
                  <TableCell style={{ minWidth: 110 }}>Tool Request</TableCell>
                  <TableCell style={{ minWidth: 110 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolReturn.length == 0 ? (
                  <TableRow>
                    <TableCell className="w-[200px]">
                      No Tool Return Found
                    </TableCell>
                  </TableRow>
                ) : (
                  toolReturn
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((i) => {
                      return (
                        <TableRow key={i.id}>
                          <TableCell style={{ minWidth: 50 }}>
                            {convertDate(i.date)}
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }}>
                            {i.time}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.user}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.toolRequest.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.projectVehicleFlag}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.toolRequest.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.jobNumber == "" ||
                                  inner.jobNumber == undefined
                                    ? "N/A"
                                    : `Job # ${inner.jobNumber}`}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.toolRequest.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.vehicle == "" ||
                                  inner.vehicle == undefined
                                    ? "N/A"
                                    : `Vehicle # ${inner.vehicle}`}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.toolRequest.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.location == "" ||
                                  inner.location == undefined
                                    ? "N/A"
                                    : `${inner.location}`}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.toolRequest.map((inner) => {
                              return (
                                <div
                                  key={inner.id}
                                  className={`${
                                    inner.broken
                                      ? "bg-red-100"
                                      : "bg-transparent"
                                  }`}
                                >
                                  tool# {inner.toolNumber}{" "}
                                  {inner.assignedTo == ""
                                    ? "is unassigned"
                                    : `assigned for pickup to ${inner.assignedTo}`}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.returnFlag == "Pending" ? (
                              <button
                                onClick={(e) => {
                                  handlePickUpModal(e, i.id);
                                }}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                Assign To Pick Up
                              </button>
                            ) : i.returnFlag == "Assigned To" ? (
                              <button
                                onClick={(e) => setPickUp(e, i.id)}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                Set For Pick Up
                              </button>
                            ) : i.returnFlag == "Picked Up" ? (
                              <button
                                onClick={(e) => handleReturnModal(e, i.id)}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                Complete
                              </button>
                            ) : (
                              "Complete"
                            )}
                          </TableCell>
                          {assignPickUp && returnId == i.id ? (
                            <AssignPickUpModal
                              onClose={() => setAssignPickUp(false)}
                              open={assignPickUp}
                              refreshData={refreshData}
                              refreshFlag={refreshFlag}
                              returnId={i.id}
                              item={i}
                            />
                          ) : null}
                          {returnModal && returnId == i.id ? (
                            <ReturnToolModal
                              onClose={() => setReturnModal(false)}
                              open={returnModal}
                              refreshData={refreshData}
                              refreshFlag={refreshFlag}
                              returnId={i.id}
                              item={i}
                            />
                          ) : null}
                          {pickUpSetModal && returnId == i.id ? (
                            <SetForPickUp
                              onClose={() => setPickUpSetModal(false)}
                              open={pickUpSetModal}
                              refreshData={refreshData}
                              refreshFlag={refreshFlag}
                              returnId={i.id}
                              item={i}
                            />
                          ) : null}
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[20, 30, 40, 50]}
          component="div"
          count={toolReturn.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
