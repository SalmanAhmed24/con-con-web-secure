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
import DeliverToModal from "../modals/deliverToModal";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
export default function ToolRequestTable({
  toolRequest,
  loading,
  refreshRequestData,
  tabValue,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [approveModal, setApproveModal] = useState(false);
  const [deliverModal, setDeliverModal] = useState(false);
  const [requestId, setRequestId] = useState(false);
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
  };
  const handleApproveDrawer = (e, id) => {
    e.preventDefault();
    setRequestId(id);
    setApproveModal(true);
  };
  const handleSetToDeliverDrawer = (e, id) => {
    e.preventDefault();
    setRequestId(id);
    setDeliverModal(true);
  };
  const handleSetToDeliver = (id, deliverTo) => {
    const approval = {
      approval: "Set To Deliver",
      deliverTo: deliverTo,
    };
    axios
      .patch(`${apiPath.prodPath}/api/toolRequest/changeStatus/${id}`, approval)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to Set To Deliver",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Status changed to Set To Deliver",
          });
          refreshData();
        }
      });
    //   .catch((err) => console.log(err));
  };
  const handleMarkAsComplete = (id) => {
    const approval = {
      approval: "Complete",
    };
    axios
      .patch(`${apiPath.prodPath}/api/toolRequest/changeStatus/${id}`, approval)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to Mark As Complete",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Status changed to Complete",
          });
          refreshData();
        }
      })
      .catch((err) => console.log(err));
  };
  const generatePdf = async (final) => {
    let mywindow = window.open("", "PRINT", "height=1400,width=2400,top=0");
    mywindow.document.write(
      `<table style="border-collapse: collapse;width: 100%;">
      <thead>
      <tr>
        <th style="width:200px">Date</th>
        <th style="width:80px">Time</th>
        <th style="width:250px">Tool #</th>
        <th style="width:250px">Tool Request</th>
        <th style="width:250px">Person Requested</th>
        <th style="width:250px">Assigned To</th>
        <th style="width:250px">Delivered To</th>
        <th style="width:80px">Status</th>
        <th style="width:150px">Project/Vehicle</th>
        <th style="width:150px">Project</th>
        <th style="width:150px">Vehicle</th>
        <th style="width:50px">No of Days</th>
      </tr>
      </thead>
      <tbody>
      ${toolRequest.map((i) => {
        return `<tr key={${
          i.id
        }} style="border: 1px solid black;padding: 10px;text-align: left;">
            <td style="width:200px;border: 1px solid black;padding: 10px;text-align: left;">${convertDate(
              i.date
            )}</td>
            <td style="width:80px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.time
            }</td>
              <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">
                ${i.toolNumber}
              </td>
            
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.toolRequest
            }</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.user
            }</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.assignedTo
            }</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.deliverTo
            }</td>
            
            <td style="width:80px;border: 1px solid black;padding: 10px;text-align: left;">${
              i.approval
            }</td>
              <td style="width:150px;border: 1px solid black;padding: 10px;text-align: left;">${
                i.projectVehicleFlag
              }</td>
              <td style="width:150px;border: 1px solid black;padding: 10px;text-align: left;">${
                i.projectDescription
              }</td>
              <td style="width:150px;border: 1px solid black;padding: 10px;text-align: left;">${
                i.vehicleDescription
              }</td>
              <td style="width:50px;border: 1px solid black;padding: 10px;text-align: left;">${
                i.noOfDays
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
  const convertDate = (date) => {
    let parts = date.split("-"); // ["2026", "02", "23"]
    let formattedDate = parts[1] + "-" + parts[2] + "-" + parts[0];
    return formattedDate;
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
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 120 }}>Date</TableCell>
                  <TableCell style={{ minWidth: 100 }}>Time</TableCell>
                  <TableCell style={{ minWidth: 110 }}>
                    Person Requested
                  </TableCell>
                  {tabValue == "Pending" ? null : (
                    <TableCell style={{ minWidth: 110 }}>Assigned To</TableCell>
                  )}
                  {tabValue == "Pending" ? null : (
                    <TableCell style={{ minWidth: 150 }}>Tool #</TableCell>
                  )}
                  {tabValue == "Pending" || tabValue == "Assigned To" ? null : (
                    <TableCell style={{ minWidth: 110 }}>Deliver To</TableCell>
                  )}
                  <TableCell style={{ minWidth: 110 }}>Tool Request</TableCell>
                  <TableCell style={{ minWidth: 110 }}>
                    Project / Vehicle
                  </TableCell>
                  <TableCell style={{ minWidth: 50 }}>No of Days</TableCell>
                  <TableCell style={{ minWidth: 150 }}>
                    Date Needed By
                  </TableCell>
                  <TableCell style={{ minWidth: 110 }}>Project #</TableCell>
                  <TableCell style={{ minWidth: 110 }}>Vehicle #</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Approval</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolRequest.length == 0 ? (
                  <TableRow>
                    <TableCell className="w-[200px]">
                      No Tool Request Found
                    </TableCell>
                  </TableRow>
                ) : (
                  toolRequest
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((i) => {
                      return (
                        <TableRow key={i.id}>
                          <TableCell style={{ minWidth: 120 }}>
                            {convertDate(i.date)}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.time}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.user}
                          </TableCell>
                          {tabValue == "Pending" ? null : (
                            <TableCell style={{ minWidth: 110 }}>
                              {i.assignedTo}
                            </TableCell>
                          )}
                          {tabValue == "Pending" ? null : (
                            <TableCell style={{ minWidth: 150 }}>
                              {i.toolNumber == "" || i.toolNumber == undefined
                                ? "N/A"
                                : i.toolNumber}
                            </TableCell>
                          )}
                          {tabValue == "Pending" ||
                          tabValue == "Assigned To" ? null : (
                            <TableCell style={{ minWidth: 110 }}>
                              {i.deliverTo == "" ? "N/A" : i.deliverTo}
                            </TableCell>
                          )}
                          <TableCell style={{ minWidth: 110 }}>
                            {i.toolRequest}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.projectVehicleFlag}
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }}>
                            {i.projectVehicleFlag == "Project"
                              ? i.noOfDays
                              : "N/A"}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.dateNeededBy == undefined
                              ? "N/A"
                              : convertDate(i.dateNeededBy)}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.projectVehicleFlag == "Project"
                              ? i.projectDescription
                              : "N/A"}
                          </TableCell>
                          <TableCell style={{ minWidth: 110 }}>
                            {i.projectVehicleFlag == "Vehicle"
                              ? i.vehicleDescription
                              : "N/A"}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.approval == "Pending" ? (
                              <button
                                onClick={(e) => handleApproveDrawer(e, i.id)}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                Assigned To
                              </button>
                            ) : i.approval == "Assigned To" ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  // handleSetToDeliver(i.id);
                                  handleSetToDeliverDrawer(e, i.id);
                                }}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                Set To Deliver
                              </button>
                            ) : i.approval == "Set To Deliver" ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleMarkAsComplete(i.id);
                                }}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                Mark as Complete
                              </button>
                            ) : (
                              "Complete"
                            )}
                          </TableCell>
                          {approveModal && requestId == i.id ? (
                            <RequestApproval
                              onClose={() => setApproveModal(false)}
                              open={approveModal}
                              refreshData={refreshData}
                              requestId={i.id}
                              item={i}
                            />
                          ) : null}
                          {deliverModal && requestId == i.id ? (
                            <DeliverToModal
                              onClose={() => setDeliverModal(false)}
                              open={deliverModal}
                              refreshData={refreshData}
                              requestId={i.id}
                              handleSetToDeliver={(id, deliverTo) =>
                                handleSetToDeliver(id, deliverTo)
                              }
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
          count={toolRequest.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
