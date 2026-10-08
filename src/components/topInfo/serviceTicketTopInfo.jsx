import moment from "moment";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PicFileService from "../serviceTickets/picFile";
import Payments from "../serviceTickets/payments";
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
import { format } from "date-fns";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
function TopInfoService({ data, getData }) {
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
  function convertToMMDDYYYY(isoString) {
    console.log("date String in func", isoString);
    // "2026-05-29T00:00:00.000Z"
    //  0123456789...
    const year = isoString.slice(0, 4); // "2026"
    const month = isoString.slice(5, 7); // "05"
    const day = isoString.slice(8, 10); // "29"
    console.log("this is day", day);
    console.log("this is month", month);
    console.log("this is year", year);
    return `${month}/${day}/${year}`;
  }
  function convertToTexasTime(dateString) {
    // Parse MM/DD/YYYY format

    if (
      dateString == "" ||
      dateString == undefined ||
      dateString == "invalid date"
    ) {
      return "N/A";
    }
    var convertedIntoMMDD = "";
    if (dateString.includes(":")) {
      convertedIntoMMDD = convertToMMDDYYYY(dateString);
    } else {
      convertedIntoMMDD = dateString;
    }

    // const [month, day, year] = convertedIntoMMDD.split("/");
    // // Validate parts
    // if (!month || !day || !year) {
    //   throw new Error("Invalid date format. Expected MM/DD/YYYY");
    // }

    // Construct ISO string (assumes UTC input)
    // const isoString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`;
    // const date = new Date(isoString);

    // // Validate the date
    // if (isNaN(date.getTime())) {
    //   throw new Error("Invalid date string provided");
    // }

    // // Texas follows Central Time (America/Chicago):
    // // - CST (UTC-6) in winter (standard time)
    // // - CDT (UTC-5) in summer (daylight saving time)
    // const texasTimeString = date.toLocaleString("en-US", {
    //   timeZone: "America/Chicago",
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    //   hour12: true,
    // });

    return convertedIntoMMDD;
  }
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
                  Customer
                </label>
                <p className="text-end">{data.to}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Date Of Order
                </label>
                <p className="text-end">
                  {convertToTexasTime(data.dateOfOrder)}
                </p>
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
                <label className="font-semibold text-orange-400">
                  Created By
                </label>
                <p className="text-end">{data.createdBy}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Remaining
                </label>
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
                <label className="font-semibold text-orange-400">
                  Assigned To
                </label>
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
                <label className="font-semibold text-orange-400">
                  Start Date
                </label>
                <p className="text-end">{convertToTexasTime(data.startDate)}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Job Name
                </label>
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
                <p className="text-end">
                  {convertToTexasTime(data.invoiceDate)}
                </p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">Terms</label>
                <p className="text-end">{data.terms}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Total Labor
                </label>
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
      <Accordion>
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
                    <TableCell style={{ minWidth: 150 }}>Description</TableCell>
                    <TableCell style={{ minWidth: 80 }}>Amount</TableCell>
                    <TableCell style={{ minWidth: 80 }}>Labor Hours</TableCell>
                    <TableCell style={{ minWidth: 80 }}>Rate</TableCell>
                    <TableCell style={{ minWidth: 80 }}>Tax Status</TableCell>
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
                                : convertToTexasTime(i.date)}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.description}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.amount}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.laborHours}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.rate}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.taxStatus}
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
      </Accordion>
      <Accordion>
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
                    <TableCell style={{ minWidth: 80 }}>Rate</TableCell>
                    <TableCell style={{ minWidth: 80 }}>Amount</TableCell>
                    <TableCell style={{ minWidth: 150 }}>Description</TableCell>
                    <TableCell style={{ minWidth: 80 }}>Tax Status</TableCell>
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
                              {i.materialQuantity}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.rate}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.amount}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.description}
                            </TableCell>
                            <TableCell style={{ minWidth: 80 }}>
                              {i.taxStatus}
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
          <PicFileService serviceId={data.id} attachments={data.attachments} />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6-content"
          id="panel6-header"
        >
          <Typography component="span">Payments</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Payments
            remaining={data.remaining}
            allPayments={data.payments}
            total={data.total}
            refreshData={getData}
            serviceId={data.id}
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

export default TopInfoService;
