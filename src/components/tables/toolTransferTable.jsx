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
import ReturnToolModal from "../modals/returnToolModal";
import SetForPickUp from "../modals/setForPickupModal";
import TransferAssignPickUpModal from "../modals/toolTransferAssignPickup";
import TransferSetForPickUp from "../modals/transferSetPickup";
import TransferComplete from "../modals/transferComplete";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
export default function ToolTransferTable({
  toolTransfer,
  loading,
  refreshRequestData,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [returnModal, setReturnModal] = useState(false);
  const [assignPickUp, setAssignPickUp] = useState(false);
  const [toolTransferId, setToolTransferId] = useState(false);
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
    setToolTransferId(id);
    setReturnModal(true);
  };
  const handlePickUpModal = (e, id) => {
    e.preventDefault();
    setToolTransferId(id);
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
        <th style="width:250px">Job Pickup</th>
        <th style="width:250px">Job Destination</th>
        <th style="width:250px">Vehicle Pickup</th>
        <th style="width:250px">Vehicle Destination</th>
        <th style="width:300px">Tool Request</th>
        <th style="width:80px">Status</th>
      </tr>
      </thead>
      <tbody>
      ${toolTransfer.map((i) => {
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
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolTransfer.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                Job # ${inner.jobPickup}
                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolTransfer.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                Job # ${inner.jobDestination}
                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolTransfer.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                Job # ${inner.vehiclePickup}
                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolTransfer.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                Job # ${inner.vehicleDestination}
                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolTransfer.map(
              (inner) => {
                return `<div key={${inner.id}}>
                                Job # ${inner.vehiclePickup}
                              </div>`;
              }
            )}</td>
            <td style="width:250px;border: 1px solid black;padding: 10px;text-align: left;">${i.toolTransfer.map(
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
    setToolTransferId(id);
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
        sx={{ width: "100%", bgcolor: "transparent" }}
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
          <TableContainer sx={{ height: 600, overflow: "scroll" }}>
            <Table id="tool-return" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 70 }}>Date</TableCell>
                  <TableCell style={{ width: 70 }}>Time</TableCell>
                  {/* <TableCell style={{ width: 110 }}>
                    Person Requested
                  </TableCell> */}
                  <TableCell style={{ width: 150 }}>Person Requested</TableCell>
                  <TableCell style={{ width: 150 }}>Tool Request</TableCell>
                  <TableCell style={{ width: 110 }}>Job Pickup</TableCell>
                  <TableCell style={{ width: 110 }}>Job Destination</TableCell>
                  <TableCell style={{ width: 110 }}>Vehicle Pickup</TableCell>
                  <TableCell style={{ width: 110 }}>
                    Vehicle Destination
                  </TableCell>
                  <TableCell style={{ width: 110 }}>Notes</TableCell>
                  <TableCell style={{ width: 110 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolTransfer.length == 0 ? (
                  <TableRow>
                    <TableCell className="w-[200px]">
                      No Tool Return Found
                    </TableCell>
                  </TableRow>
                ) : (
                  toolTransfer
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((i) => {
                      return (
                        <TableRow key={i.id}>
                          <TableCell>{convertDate(i.date)}</TableCell>
                          <TableCell>{i.time}</TableCell>
                          {/* <TableCell style={{ width: 110 }}>
                            {i.user}
                          </TableCell> */}
                          <TableCell>{i.user}</TableCell>
                          <TableCell>
                            {i.toolTransfer.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  tool# {inner.toolNumber}{" "}
                                  {inner.assignedTo == "" ? (
                                    "is unassigned"
                                  ) : (
                                    <p>
                                      assigned for pickup to{" "}
                                      <strong>{inner.assignedTo}</strong>
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell>
                            {i.toolTransfer.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.jobPickup == ""
                                    ? "N/A"
                                    : inner.jobPickup}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell>
                            {i.toolTransfer.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.jobDestination == ""
                                    ? "N/A"
                                    : inner.jobDestination}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell>
                            {i.toolTransfer.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.vehiclePickup == ""
                                    ? "N/A"
                                    : inner.vehiclePickup}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell>
                            {i.toolTransfer.map((inner) => {
                              return (
                                <div key={inner.id}>
                                  {inner.vehicleDestination == ""
                                    ? "N/A"
                                    : inner.vehicleDestination}
                                </div>
                              );
                            })}
                          </TableCell>
                          <TableCell>
                            {i.toolTransfer.map((inner) => {
                              return <div key={inner.id}>{inner.note}</div>;
                            })}
                          </TableCell>
                          <TableCell>
                            {i.returnFlag == "Pending" ? (
                              <button
                                onClick={(e) => {
                                  handlePickUpModal(e, i.id);
                                }}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                Approve
                              </button>
                            ) : i.returnFlag == "Assign Transfer To" ? (
                              <button
                                onClick={(e) => setPickUp(e, i.id)}
                                className="bg-orange-400 p-2 rounded-[5px] text-white font-semibold"
                              >
                                For Transfer By
                              </button>
                            ) : i.returnFlag == "Transfer By" ? (
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
                          {assignPickUp && toolTransferId == i.id ? (
                            <TransferAssignPickUpModal
                              onClose={() => setAssignPickUp(false)}
                              open={assignPickUp}
                              refreshData={refreshData}
                              refreshFlag={refreshFlag}
                              toolTransferId={i.id}
                              item={i}
                            />
                          ) : null}
                          {returnModal && toolTransferId == i.id ? (
                            <TransferComplete
                              onClose={() => setReturnModal(false)}
                              open={returnModal}
                              refreshData={refreshData}
                              refreshFlag={refreshFlag}
                              toolTransferId={i.id}
                              item={i}
                            />
                          ) : null}
                          {pickUpSetModal && toolTransferId == i.id ? (
                            <TransferSetForPickUp
                              onClose={() => setPickUpSetModal(false)}
                              open={pickUpSetModal}
                              refreshData={refreshData}
                              refreshFlag={refreshFlag}
                              toolTransferId={i.id}
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
          count={toolTransfer.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
