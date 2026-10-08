// import moment from "moment";

// function TopInfoJobTicket({ item }) {

//   function numberWithCommas(x) {
//     const formatCus = (Math.round(x * 100) / 100).toFixed(2);
//     return formatCus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   }
//   return (
//     <div className="flex flex-row gap-20">
//       <div className="w-1/3 flex flex-col gap-5">
//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Job #</label>
//           <p className="text-end">{item.jobNumber}</p>
//         </div>
//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Date Of Order</label>
//           <p className="text-end">{item.dateOfOrder}</p>
//         </div>
//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Customer PO</label>
//           <p className="text-end">{item.manualId}</p>
//         </div>
//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Contact Name</label>
//           <p className="text-end">{item.contactName}</p>
//         </div>
//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Tel#</label>
//           <p className="text-end">{item.tel}</p>
//         </div>
//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Created By</label>
//           <p className="text-end">{item.createdBy}</p>
//         </div>
//       </div>
//       <div className="w-1/3 flex flex-col gap-5">
//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Assigned To</label>
//           <p className="text-end">{item.assignedTo}</p>
//         </div>

//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Start Date</label>
//           <p className="text-end">{item.startDate}</p>
//         </div>

//         <div className="w-100 flex flex-row justify-between">
//           <label className="font-semibold text-orange-400">Job Location</label>
//           <p className="text-end">{item.jobLocation}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TopInfoJobTicket;
import moment from "moment";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PicFileService from "../jobTickets/picFile";
import Payments from "../jobTickets/payments";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
// import AttachmentModal from "./attachmentsModal";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function TopInfoJobTicket({ data, getData }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  function numberWithCommas(x) {
    const formatCus = (Math.round(x * 100) / 100).toFixed(2);
    return formatCus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  console.log("data", data);
  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Basic Info</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-row flex-wrap gap-20">
            <div className="w-1/3 flex flex-col gap-2">
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Ticket ID
                </label>
                <p className="text-end">{data.ticketId}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Manual ID
                </label>
                <p className="text-end">{data.manualId}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Job Number
                </label>
                <p className="text-end">{data.jobNumber}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Ticket Status
                </label>
                <p className="text-end">{data.ticketStatus}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Date Of Order
                </label>
                <p className="text-end">{data.dateOfOrder}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Contact Name
                </label>
                <p className="text-end">{data.contactName}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">Tel#</label>
                <p className="text-end">{data.tel}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">Email</label>
                <p className="text-end">{data.email}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Created By
                </label>
                <p className="text-end">{data.createdBy}</p>
              </div>
            </div>
            <div className="w-1/3 flex flex-col gap-2">
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Assigned To
                </label>
                <p className="text-end">{data.assignedTo}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Start Date
                </label>
                <p className="text-end">{data.startDate}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Job Location
                </label>
                <p className="text-end">{data.jobLocation}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Assigned By
                </label>
                <p className="text-end">{data.assignedBy}</p>
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-col">
            <label className="font-semibold text-orange-400">Job Work</label>
            <p className="text-start">{data.description}</p>
          </div>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography component="span">Labor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper className={poppins.className} sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ minWidth: 120 }}>Date</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Employee</TableCell>
                    <TableCell style={{ minWidth: 80 }}>Labor Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.laborArr.length == 0 ? (
                    <TableRow>
                      <TableCell className={poppins.className}>
                        No Labor Entries Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.laborArr
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((i) => {
                        return (
                          <TableRow key={i._id}>
                            <TableCell style={{ minWidth: 120 }}>
                              {i.date == null ||
                              i.date == undefined ||
                              i.date == ""
                                ? "N/A"
                                : i.date}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.employee == "" ? "N/A" : i.employee}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.laborHours == "" ? "N/A" : i.laborHours}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[3]}
              component="div"
              count={data.laborArr.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </AccordionDetails>
      </Accordion> */}
      {/* <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography component="span">Material</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper className={poppins.className} sx={{ width: "100%" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ minWidth: 120 }}>
                      Material Quantity
                    </TableCell>

                    <TableCell style={{ minWidth: 150 }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.materialArr.length == 0 ? (
                    <TableRow>
                      <TableCell className={poppins.className}>
                        No Material Entries Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.materialArr
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map((i) => {
                        return (
                          <TableRow key={i._id}>
                            <TableCell style={{ minWidth: 120 }}>
                              {i.materialQuantity == null
                                ? "N/A"
                                : i.materialQuantity}
                            </TableCell>

                            <TableCell style={{ minWidth: 150 }}>
                              {i.description == "" ? "N/A" : i.description}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[3]}
              component="div"
              count={data.materialArr.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </AccordionDetails>
      </Accordion> */}

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          <Typography component="span">Dates</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {data.dateArr.length ? (
            <div className="flex flex-col gap-4">
              {data.dateArr.map((inner, index) => {
                return (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${inner.date}-${index}`}
                      id={`${inner.date}-${index}`}
                    >
                      <Typography component="span">
                        <strong>For Date {inner.date}</strong>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <p>
                        <strong>Daily Description:</strong> {inner.description}
                      </p>
                      <p className="font-semibold pt-2 pb-2">Material</p>
                      <div className="flex flex-col gap-4">
                        <Paper
                          className={poppins.className}
                          sx={{ width: "100%" }}
                        >
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ minWidth: 120 }}>
                                    Material Quantity
                                  </TableCell>

                                  <TableCell style={{ minWidth: 150 }}>
                                    Description
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {inner.materialArr.length == 0 ? (
                                  <TableRow>
                                    <TableCell className={poppins.className}>
                                      No Material Entries Found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  inner.materialArr
                                    .slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage,
                                    )
                                    .map((i) => {
                                      return (
                                        <TableRow key={i._id}>
                                          <TableCell style={{ minWidth: 120 }}>
                                            {i.materialQuantity == null
                                              ? "N/A"
                                              : i.materialQuantity}
                                          </TableCell>

                                          <TableCell style={{ minWidth: 150 }}>
                                            {i.description == ""
                                              ? "N/A"
                                              : i.description}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[3]}
                            component="div"
                            count={inner.laborArr.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </Paper>
                      </div>
                      <p className="font-semibold pt-2 pb-2">Labor</p>
                      <div className="flex flex-col gap-4">
                        <Paper
                          className={poppins.className}
                          sx={{ width: "100%" }}
                        >
                          <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                              <TableHead>
                                <TableRow>
                                  <TableCell style={{ minWidth: 120 }}>
                                    Date
                                  </TableCell>
                                  <TableCell style={{ minWidth: 150 }}>
                                    Employee
                                  </TableCell>
                                  <TableCell style={{ minWidth: 80 }}>
                                    Labor Hours
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {inner.laborArr.length == 0 ? (
                                  <TableRow>
                                    <TableCell className={poppins.className}>
                                      No Labor Entries Found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  inner.laborArr
                                    .slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage,
                                    )
                                    .map((i) => {
                                      return (
                                        <TableRow key={i._id}>
                                          <TableCell style={{ minWidth: 120 }}>
                                            {i.date == null ||
                                            i.date == undefined ||
                                            i.date == ""
                                              ? "N/A"
                                              : i.date}
                                          </TableCell>
                                          <TableCell style={{ minWidth: 150 }}>
                                            {i.employee == ""
                                              ? "N/A"
                                              : i.employee}
                                          </TableCell>
                                          <TableCell style={{ minWidth: 80 }}>
                                            {i.laborHours == ""
                                              ? "N/A"
                                              : i.laborHours}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[3]}
                            component="div"
                            count={inner.laborArr.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </Paper>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </div>
          ) : (
            <p>No Data Found</p>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          <Typography component="span">Pic/Files</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PicFileService
            jobTicketId={data.id}
            attachments={data.attachments}
          />
        </AccordionDetails>
      </Accordion>
      {/* <div className="flex flex-row flex-wrap gap-20">
        <div className="w-1/3 flex flex-col gap-2">
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Ticket ID</label>
            <p className="text-end">{data.ticketId}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Manual ID</label>
            <p className="text-end">{data.manualId}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Customer</label>
            <p className="text-end">{data.to}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">
              Date Of Order
            </label>
            <p className="text-end">{data.dateOfOrder}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">
              Service Number
            </label>
            <p className="text-end">{data.manualId}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">
              Contact Name
            </label>
            <p className="text-end">{data.contactName}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Tel#</label>
            <p className="text-end">{data.tel}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Created By</label>
            <p className="text-end">{data.createdBy}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Remaining</label>
            <p className="text-end">
              $
              {data.remaining == null
                ? "none"
                : numberWithCommas(data.remaining)}
            </p>
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-2">
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Assigned To</label>
            <p className="text-end">{data.assignedTo}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Status</label>
            <p className="text-end">{data.ticketStatus}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">
              Customer Order No
            </label>
            <p className="text-end">{data.customerOrderNo}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Start Date</label>
            <p className="text-end">{data.startDate}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Job Name</label>
            <p className="text-end">{data.jobName}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">
              Job Location
            </label>
            <p className="text-end">{data.jobLocation}</p>
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-2">
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">
              Invoice Date
            </label>
            <p className="text-end">{data.invoiceDate}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Terms</label>
            <p className="text-end">{data.terms}</p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Total Labor</label>
            <p className="text-end">
              $
              {data.totalLabor == null
                ? "none"
                : numberWithCommas(data.totalLabor)}
            </p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">
              Total Material
            </label>
            <p className="text-end">
              $
              {data.totalMaterail == null
                ? "none"
                : numberWithCommas(data.totalMaterail)}
            </p>
          </div>
          <div className="w-100 flex flex-row justify-between">
            <label className="font-semibold text-orange-400">Total</label>
            <p className="text-end">
              ${data.total == null ? "none" : numberWithCommas(data.total)}
            </p>
          </div>
        </div>
        <div className="w-1/3">
          <div className="flex flex-col">
            <label className="font-semibold text-orange-400">Job Work</label>
            <p className="text-start">{data.description}</p>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default TopInfoJobTicket;
