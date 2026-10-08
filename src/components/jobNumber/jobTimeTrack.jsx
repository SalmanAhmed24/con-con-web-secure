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
const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
function JobTimeTrack({ jobNumber, jobName }) {
  const [jobTimeTrack, setJobTimeTrack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  console.log("##$$$$$");
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/timeTrack/`)
      .then((res) => {
        setLoading(false);
        const filteredData = res.data.timeTracks.filter(
          (i) => i.jobNumber == `${jobNumber} - ${jobName}`
        );
        setJobTimeTrack(filteredData);
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
                  <TableCell style={{ minWidth: 150 }}>Job Number</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Employee</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Date Added</TableCell>
                  <TableCell style={{ minWidth: 100 }}>Start Time</TableCell>
                  <TableCell style={{ minWidth: 100 }}>End Time</TableCell>
                  <TableCell style={{ minWidth: 80 }}>Hours</TableCell>
                  <TableCell style={{ minWidth: 180 }}>
                    Job Description
                  </TableCell>
                  <TableCell style={{ minWidth: 120 }}>Labor Type</TableCell>
                  <TableCell style={{ minWidth: 80 }}>Lunch</TableCell>
                  <TableCell style={{ minWidth: 80 }}>Spectrum</TableCell>
                  <TableCell style={{ minWidth: 150 }}>User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobTimeTrack.length == 0 ? (
                  <TableRow>
                    <p className={poppins.className}>No Data Found</p>
                  </TableRow>
                ) : (
                  jobTimeTrack
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((i) => {
                      return (
                        <TableRow key={i.id}>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.jobNumber}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.employee}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.dateAdded}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.startTime}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.endTime}
                          </TableCell>
                          <TableCell style={{ minWidth: 80 }}>
                            {i.hours}
                          </TableCell>
                          <TableCell style={{ minWidth: 180 }}>
                            {i.jobDescription}
                          </TableCell>
                          <TableCell style={{ minWidth: 120 }}>
                            {i.laborType}
                          </TableCell>
                          <TableCell style={{ minWidth: 80 }}>
                            {i.lunch}
                          </TableCell>
                          <TableCell style={{ minWidth: 80 }}>
                            {i.spectrum}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.user}
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
          count={jobTimeTrack.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </section>
  );
}

export default JobTimeTrack;
