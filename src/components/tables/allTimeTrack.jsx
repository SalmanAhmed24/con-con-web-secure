import { apiPath } from "@/utils/routes";
import {
  TableContainer,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import { Poppins } from "next/font/google";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import Swal from "sweetalert2";
import useStore from "@/utils/store/store";
import TimeTrackInfo from "../modals/timeTrackInfoModal";
import TimeTrackEdit from "../modals/timeTrackEdit";
import Select from "react-select";

const poppins = Poppins({
  style: ["normal"],
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
function AllTimeTrackTable() {
  const [loader, setLoader] = useState(false);
  const [allTimeTrack, setAllTimeTrack] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [timeTrackId, setTimeTrackId] = useState("");
  const [infoModal, setInfoModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState("");
  const [empOpt, setEmpOpt] = useState([]);
  const [employee, setEmployee] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [jobNo, setJobNo] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const openInfoDrawer = (i) => {
    setTimeTrackId(i.id);
    setEditData(i);
    setInfoModal(true);
  };
  const openEmpModal = (data) => {
    setTimeTrackId(data.id);
    setEditData(data);
    setOpenModal(true);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const filteredUser = res.data.allUsers.filter(
          (i) => i.userLabor.length
        );
        const users = res.data.allUsers.map((i) => {
          return { label: i.fullname, value: i.fullname };
        });
        setEmpOpt(users);
        var newMappedArr = [];
        filteredUser.forEach((element) => {
          element.userLabor.forEach((inner) => {
            if (inner.timeEntries.length) {
              inner.timeEntries.forEach((timeEntry) => {
                newMappedArr = [
                  {
                    id: inner._id,
                    fullname: element.fullname,
                    userId: element.id,
                    job: inner.job,
                    shiftStartTime: inner.shiftStartTime,
                    shiftEndTime: inner.shiftEndTime,
                    startDate: inner.startDate,
                    endDate: inner.endDate,
                    manpowerId: inner.manpowerId,
                    checkedIn: timeEntry.checkedIn,
                    checkedOut: timeEntry.checkedOut,
                    date: timeEntry.date,
                    dayName: timeEntry.dayName,
                    lunchTimeEnd: timeEntry.lunchTimeEnd,
                    lunchTimeStart: timeEntry.lunchTimeStart,
                    notes: timeEntry.notes,
                    spectrum:
                      timeEntry.spectrum == undefined
                        ? false
                        : timeEntry.spectrum,
                    reimbursal: timeEntry.reimbursal,
                  },
                  ...newMappedArr,
                ];
              });
            }
          });
        });
        setAllTimeTrack(newMappedArr);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);
  const refreshData = () => {
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const filteredUser = res.data.allUsers.filter(
          (i) => i.userLabor.length
        );
        var newMappedArr = [];
        filteredUser.forEach((element) => {
          element.userLabor.forEach((inner) => {
            if (inner.timeEntries.length) {
              inner.timeEntries.forEach((timeEntry) => {
                newMappedArr = [
                  {
                    id: inner._id,
                    fullname: element.fullname,
                    userId: element.id,
                    job: inner.job,
                    shiftStartTime: inner.shiftStartTime,
                    shiftEndTime: inner.shiftEndTime,
                    startDate: inner.startDate,
                    endDate: inner.endDate,
                    manpowerId: inner.manpowerId,
                    checkedIn: timeEntry.checkedIn,
                    checkedOut: timeEntry.checkedOut,
                    date: timeEntry.date,
                    dayName: timeEntry.dayName,
                    lunchTimeEnd: timeEntry.lunchTimeEnd,
                    lunchTimeStart: timeEntry.lunchTimeStart,
                    notes: timeEntry.notes,
                    spectrum:
                      timeEntry.spectrum == undefined
                        ? false
                        : timeEntry.spectrum,
                    reimbursal: timeEntry.reimbursal,
                  },
                  ...newMappedArr,
                ];
              });
            }
          });
        });
        setAllTimeTrack(newMappedArr);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
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
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const filteredUser = res.data.allUsers.filter(
          (i) => i.userLabor.length
        );
        var newMappedArr = [];
        filteredUser.forEach((element) => {
          element.userLabor.forEach((inner) => {
            if (inner.timeEntries.length) {
              inner.timeEntries.forEach((timeEntry) => {
                newMappedArr = [
                  {
                    id: inner._id,
                    fullname: element.fullname,
                    userId: element.id,
                    job: inner.job,
                    shiftStartTime: inner.shiftStartTime,
                    shiftEndTime: inner.shiftEndTime,
                    startDate: inner.startDate,
                    endDate: inner.endDate,
                    manpowerId: inner.manpowerId,
                    checkedIn: timeEntry.checkedIn,
                    checkedOut: timeEntry.checkedOut,
                    date: timeEntry.date,
                    dayName: timeEntry.dayName,
                    lunchTimeEnd: timeEntry.lunchTimeEnd,
                    lunchTimeStart: timeEntry.lunchTimeStart,
                    notes: timeEntry.notes,
                    spectrum:
                      timeEntry.spectrum == undefined
                        ? false
                        : timeEntry.spectrum,
                    reimbursal: timeEntry.reimbursal,
                  },
                  ...newMappedArr,
                ];
              });
            }
          });
        });
        const filteredValues = newMappedArr
          .filter((i) => i.job == jobNo)
          .filter((i) => i.fullname == employee.value)
          .filter((i) => moment(i.date).format("YYYY-MM-DD") == currentDate);
        setAllTimeTrack(filteredValues);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };
  const handleClear = (e) => {
    e.preventDefault();
    setEmployee("");
    setCurrentDate("");
    setJobNo("");
    refreshData();
  };
  return (
    <>
      <form className="flex flex-row gap-2 w-full mb-5" onSubmit={handleSearch}>
        <div className="w-1/4 flex flex-col gap-2">
          <label className="font-semibold">Job</label>
          <input
            type="text"
            value={jobNo}
            onChange={(e) => setJobNo(e.target.value)}
            placeholder="Enter Job No"
            className="p-2 border-[1px] border-solid border-[#cfcfcf] rounded-[10px]"
            required={true}
          />
        </div>
        <div className="w-1/4 flex flex-col gap-2">
          <label className="font-semibold">Employee</label>
          <Select
            options={empOpt}
            value={employee}
            onChange={(v) => setEmployee(v)}
            placeholder={"Select Employee"}
            id="emp-filter-z"
            required={true}
          />
        </div>
        <div className="w-1/4 flex flex-col gap-2">
          <label className="font-semibold">Current Date</label>
          <input
            type="date"
            className="p-2 border-[1px] border-solid border-[#cfcfcf] rounded-[10px]"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            required={true}
          />
        </div>
        <div className="w-1/6 flex flex-col justify-end gap-2">
          <div className="flex flex-row gap-2">
            <input
              type="submit"
              className="p-2 self-start bg-orange-400 font-semibold text-white rounded-[10px]"
              value={"Search"}
            />
            {currentDate !== "" && employee !== "" ? (
              <button
                className="p-2 self-start bg-orange-400 font-semibold text-white rounded-[10px]"
                onClick={handleClear}
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      </form>
      <TableContainer sx={{ height: 650 }}>
        <Table stickyHeader style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 100 }}>Actions</TableCell>
              <TableCell style={{ minWidth: 200 }}>Name</TableCell>
              <TableCell style={{ minWidth: 100 }}>Job</TableCell>
              <TableCell style={{ minWidth: 120 }}>Start Date</TableCell>
              <TableCell style={{ minWidth: 120 }}>End Date</TableCell>
              <TableCell style={{ minWidth: 100 }}>Shift Start</TableCell>
              <TableCell style={{ minWidth: 100 }}>Shift End</TableCell>
              <TableCell style={{ minWidth: 120 }}>Current Date</TableCell>
              <TableCell style={{ minWidth: 100 }}>Day</TableCell>
              <TableCell style={{ minWidth: 200 }}>Checked In</TableCell>
              <TableCell style={{ minWidth: 200 }}>Lunch Time Start</TableCell>
              <TableCell style={{ minWidth: 200 }}>Lunch Time End</TableCell>
              <TableCell style={{ minWidth: 200 }}>Checked Out</TableCell>
              <TableCell style={{ minWidth: 200 }}>Notes</TableCell>
              <TableCell style={{ minWidth: 200 }}>Spectrum</TableCell>
              <TableCell style={{ minWidth: 100 }}>Reimbursal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loader ? (
              <TableRow>Loading....</TableRow>
            ) : (
              allTimeTrack
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((i, ind) => {
                  return (
                    <TableRow key={`${i.id}-${ind}`}>
                      <TableCell style={{ position: "relative" }}>
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
                            <DropdownMenuItem onClick={() => openInfoDrawer(i)}>
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEmpModal(i)}>
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {i.fullname}
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>{i.job}</TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        {moment(i.startDate).format("MM-DD-YYYY")}
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        {moment(i.endDate).format("MM-DD-YYYY")}
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        {tConvert(i.shiftStartTime)}
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        {tConvert(i.shiftEndTime)}
                      </TableCell>
                      <TableCell style={{ minWidth: 120 }}>
                        {moment(i.date).format("MM-DD-YYYY")}
                      </TableCell>

                      <TableCell style={{ minWidth: 100 }}>
                        {i.dayName}
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {i.checkedIn !== ""
                          ? tConvert(i.checkedIn)
                          : "Not Entered"}
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {i.lunchTimeStart !== ""
                          ? tConvert(i.lunchTimeStart)
                          : "Not Entered"}
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {i.lunchTimeEnd !== ""
                          ? tConvert(i.lunchTimeEnd)
                          : "Not Entered"}
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {i.checkedOut !== ""
                          ? tConvert(i.checkedOut)
                          : "Not Entered"}
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>{i.notes}</TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        {i.spectrum == false ? "false" : "true"}
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        Reimbursal
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
          {infoModal ? (
            <TimeTrackInfo
              open={infoModal}
              onClose={() => setInfoModal(false)}
              item={editData}
            />
          ) : null}
          {openModal ? (
            <TimeTrackEdit
              open={openModal}
              onClose={() => setOpenModal(false)}
              item={editData}
              refreshData={refreshData}
            />
          ) : null}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={allTimeTrack.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default AllTimeTrackTable;
