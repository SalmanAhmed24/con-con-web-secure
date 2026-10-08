"use client";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";
import "./style.scss";
import moment from "moment";
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
import { format, parseISO } from "date-fns";

function JobToolTrack({ jobNumber, jobName }) {
  const [jobToolTrack, setjobToolTrack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  console.log("##$$$$$");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/toolHistory/`)
      .then((res) => {
        setLoading(false);
        const filteredData = res.data.toolHistory.filter(
          (i) => i.job == `${jobNumber} - ${jobName}`
        );
        setjobToolTrack(filteredData);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
  return (
    <section className={`${poppins.className} w-full`}>
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
                  <TableCell style={{ minWidth: 180 }}>Last Updated</TableCell>
                  <TableCell style={{ minWidth: 100 }}>Tool#</TableCell>
                  <TableCell style={{ minWidth: 110 }}>Category</TableCell>
                  <TableCell className="hover:cursor-pointer">
                    Sub-Category
                  </TableCell>
                  <TableCell style={{ minWidth: 110 }}>Brand</TableCell>
                  <TableCell style={{ minWidth: 170 }}>Description</TableCell>
                  <TableCell style={{ minWidth: 180 }}>Tech Assigned</TableCell>
                  {/* <TableCell style={{ minWidth: 120 }}>Type</TableCell> */}
                  <TableCell style={{ minWidth: 120 }}>Project</TableCell>
                  <TableCell style={{ minWidth: 120 }}>Vehicle</TableCell>
                  <TableCell style={{ minWidth: 120 }}>Location</TableCell>
                  <TableCell style={{ minWidth: 170 }}>Checked Out</TableCell>
                  <TableCell style={{ minWidth: 170 }}>Days Left</TableCell>
                  <TableCell style={{ minWidth: 170 }}>Age</TableCell>
                  <TableCell style={{ minWidth: 170 }}>Due Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobToolTrack.length == 0 ? (
                  <TableRow>
                    <p className={poppins.className}>No Data Found</p>
                  </TableRow>
                ) : (
                  jobToolTrack
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
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[20, 30, 40, 50]}
          component="div"
          count={jobToolTrack.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </section>
  );
}

export default JobToolTrack;
