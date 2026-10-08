import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["300", "500"],
  style: ["normal"],
  subsets: ["latin"],
});
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { EditIcon } from "lucide-react";
import ReimbursalModal from "../modals/timeTrackModal";
import { format, parseISO } from "date-fns";
function TimeTrackTable({
  allTimeTrack,
  loading,
  deleteData,
  handleEdit,
  handlePagination,
  totalCount,
  page,
}) {
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [openFlag, setOpenFlag] = useState(false);
  const [history, setHistory] = useState([]);
  const [id, setId] = useState("");
  const [modalFlag, setModalFlag] = useState(false);
  const [modalData, setModalData] = useState([]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };
  const handleReimModal = (id, reim) => {
    setModalData(reim);
    setId(id);
    setModalFlag(!modalFlag);
  };
  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }
  function isValidMMDDYYYY(dateString) {
    console.log("here in check for date", dateString);
    // 1. First, check for the pattern using a regular expression.
    // This regex accepts MM-DD-YYYY or MM/DD/YYYY formats
    const dateformat =
      /^(0[1-9]|1[0-2])[-\/](0[1-9]|[12][0-9]|3[01])[-\/]\d{4}$/;

    if (!dateString || !dateString.match(dateformat)) {
      return false;
    } else {
      return true;
    }
  }
  const handleDateCheck = (dateAdded, date) => {
    var cDate = new Date(date);
    const dateFormatCheck = isValidMMDDYYYY(dateAdded);
    console.log("this is dateformat check", dateFormatCheck);
    if (dateFormatCheck == false) {
      console.log("in false", dateAdded);
      const customDate =
        dateAdded == "" || dateAdded == "Invalid date" || dateAdded == undefined
          ? new Date()
          : new Date(dateAdded);
      console.log("this is custom date");
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };

      // 'en-US' locale typically formats as MM/DD/YYYY
      const formattedDateWithSlashes = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(customDate);

      // To get hyphens instead of slashes (MM-DD-YYYY)
      const formattedDateWithHyphens = formattedDateWithSlashes.replace(
        /\//g,
        "-"
      );
      // 'en-US' locale typically formats as MM/DD/YYYY
      const formattedCDateWithSlashes = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(cDate);

      // To get hyphens instead of slashes (MM-DD-YYYY)
      const formattedCDateWithHyphens = formattedCDateWithSlashes.replace(
        /\//g,
        "-"
      );

      // const dateFormat = format(date, "MM-dd-yyyy");
      if (formattedCDateWithHyphens == formattedDateWithHyphens) {
        return true;
      } else {
        return false;
      }
    } else {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      // 'en-US' locale typically formats as MM/DD/YYYY
      const formattedCDateWithSlashes = new Intl.DateTimeFormat(
        "en-US",
        options
      ).format(cDate);

      // To get hyphens instead of slashes (MM-DD-YYYY)
      const formattedCDateWithHyphens = formattedCDateWithSlashes.replace(
        /\//g,
        "-"
      );
      if (dateAdded == formattedCDateWithHyphens) {
        return true;
      } else {
        return false;
      }
    }
  };
  return loading ? (
    <p className={poppins.className}>Loading...</p>
  ) : (
    <section>
      <TableContainer className={poppins.className} sx={{ maxHeight: 550 }}>
        <Table stickyHeader aria-label="sticky table" id="time-track-report">
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              <TableCell style={{ minWidth: 180 }}>Employee</TableCell>
              <TableCell style={{ minWidth: 120 }}>Date</TableCell>
              <TableCell style={{ minWidth: 80 }}>Time</TableCell>
              <TableCell style={{ minWidth: 120 }}>Date Added</TableCell>
              <TableCell style={{ minWidth: 120 }}>Time Added</TableCell>
              <TableCell style={{ minWidth: 150 }}>Job #</TableCell>
              <TableCell style={{ minWidth: 150 }}>Job Description</TableCell>
              <TableCell style={{ minWidth: 80 }}>No of Hours</TableCell>
              <TableCell style={{ minWidth: 110 }}>Labor Type</TableCell>
              <TableCell style={{ minWidth: 80 }}>Lunch Min</TableCell>
              <TableCell style={{ minWidth: 150 }}>Lunch Timings</TableCell>
              <TableCell style={{ minWidth: 80 }}>Spectrum</TableCell>
              <TableCell style={{ minWidth: 150 }}>Notes</TableCell>
              <TableCell style={{ minWidth: 120 }}>User</TableCell>
              <TableCell style={{ minWidth: 80 }}>Reimbursal Flag</TableCell>
              <TableCell style={{ minWidth: 120 }}>Reimbursals</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <p>Loading....</p>
          ) : (
            <TableBody>
              {allTimeTrack && allTimeTrack.length ? (
                allTimeTrack
                  .sort((a, b) => b.date - a.date)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row._id}
                        className={
                          handleDateCheck(row.dateAdded, row.date)
                            ? "bg-white"
                            : "bg-red-200"
                        }
                      >
                        <TableCell>
                          <div className="action-wrap">
                            <EditIcon
                              onClick={() => handleEdit(row)}
                              className="text-orange-400 hover:cursor-pointer"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-2">
                            {row.timeTrackFlag ? (
                              <div className="w-[10px] h-[10px] rounded-[50px] bg-green-400"></div>
                            ) : null}
                            <p>{row.employee}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {moment(row.date).format("MM-DD-YYYY")}
                        </TableCell>
                        <TableCell>{`${tConvert(row.startTime)} to ${tConvert(
                          row.endTime
                        )}`}</TableCell>
                        <TableCell>
                          {row.dateAdded == undefined
                            ? "N/A"
                            : moment(row.dateAdded).format("MM-DD-YYYY")}
                        </TableCell>
                        <TableCell>
                          {row.timeAdded == undefined ? "N/A" : row.timeAdded}
                        </TableCell>
                        <TableCell>{row.jobNumber}</TableCell>
                        <TableCell>{row.jobDescription}</TableCell>
                        <TableCell>{row.hours}</TableCell>
                        <TableCell>{row.laborType}</TableCell>

                        <TableCell>
                          {row.lunch == false ? "No" : "Yes"}
                        </TableCell>
                        <TableCell>
                          {row.lunch
                            ? row.lunchTime == undefined
                              ? "No mins added"
                              : `${row.lunchTime} mins`
                            : "none"}
                        </TableCell>
                        <TableCell>
                          {row.spectrum == false ? "No" : "Yes"}
                        </TableCell>
                        <TableCell>{row.notes}</TableCell>
                        <TableCell>{row.user}</TableCell>
                        <TableCell>
                          {row.reimbursalFlag == "reimbursal"
                            ? "true"
                            : "false"}
                        </TableCell>
                        <TableCell>
                          {row.reimbursal && row.reimbursal.length > 0 ? (
                            <button
                              className="bg-orange-400 text-white rounded-xl p-2 font-semibold"
                              onClick={() =>
                                handleReimModal(row.id, row.reimbursal)
                              }
                            >
                              View
                            </button>
                          ) : (
                            "none"
                          )}
                        </TableCell>
                        {modalFlag && id == row._id ? (
                          <ReimbursalModal
                            openFlag={modalFlag}
                            data={modalData}
                            handleClose={() => setModalFlag(false)}
                          />
                        ) : null}
                      </TableRow>
                    );
                  })
              ) : (
                <p>No Data Found</p>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20]}
        component="div"
        rowsPerPage={rowsPerPage}
        count={totalCount}
        page={page == 0 ? 1 : page - 1}
        onPageChange={handlePagination}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showLastButton={true}
        showFirstButton={true}
      />
    </section>
  );
}

export default TimeTrackTable;
