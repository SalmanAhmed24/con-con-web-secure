import { apiPath } from "@/utils/routes";
import {
  TableContainer,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import { Poppins } from "next/font/google";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import TimeEntryModal from "./timeEntryModal";
import GroupedModal from "./groupedModal";
import Swal from "sweetalert2";
import useStore from "@/utils/store/store";
import Select from "react-select";

const poppins = Poppins({
  style: ["normal"],
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
function TimeTrackEmpModal({ open, onClose, jobNo, manpowerId, assignedEmp }) {
  const laborFlag = useStore((state) => state.laborRefresh);
  const laborRefreshHandle = useStore((state) => state.laborRefreshHandle);
  const [allUserLabors, setAllUserLabors] = useState([]);
  const [loader, setLoader] = useState(false);
  const [jobName, setJobName] = useState("");
  const [timeEnteryModal, setTimeEnteryModal] = useState(false);
  const [id, setId] = useState("");
  const [groupedModal, setGroupedModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterdData, setFilteredData] = useState("");
  const [filterOpt, setFilterOpt] = useState({
    label: "Employee",
    value: "Employee",
  });
  const [empOpt, setEmpOpt] = useState([]);
  const [filterFlag, setFilterFlag] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  useEffect(() => {
    userLoad();
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/manpowerUsers/${jobNo}`)
      .then((res) => {
        const sortedUserJobs = res.data.allUserLabors.filter(
          (item) =>
            item.userManpower.job == jobNo &&
            item.userManpower.manpowerId == manpowerId
        );
        // setAllUserLabors(sortedUserJobs);
        var newMappedArr = [];
        sortedUserJobs.forEach((element) => {
          if (element.userManpower.timeEntries.length) {
            element.userManpower.timeEntries.forEach((innerEl) => {
              newMappedArr = [
                {
                  name: `${element.fullname}`,
                  userId: element.userId,
                  id: element.userManpower._id,
                  timeEntry: innerEl,
                  type: element.userManpower.foreman
                    ? "Foreman"
                    : element.userManpower.journeyman
                    ? "Journeyman"
                    : element.userManpower.apprentice
                    ? "Apprentice"
                    : "Construction",
                },
                ...newMappedArr,
              ];
            });
          }
        });
        setAllUserLabors(newMappedArr);
        // const mappedSortedUserJobs = sortedUserJobs.map((inner) => {
        //   return {
        //     label: `${inner.fullname} - ${
        //       inner.userManpower.foreman
        //         ? "Foreman"
        //         : inner.userManpower.journeyman
        //         ? "Journeyman"
        //         : inner.userManpower.apprentice
        //         ? "Apprentice"
        //         : "Construction"
        //     }`,
        //     value: `${inner.fullname} - ${
        //       inner.userManpower.foreman
        //         ? "Foreman"
        //         : inner.userManpower.journeyman
        //         ? "Journeyman"
        //         : inner.userManpower.apprentice
        //         ? "Apprentice"
        //         : "Construction"
        //     }`,
        //     type: inner.userManpower.foreman
        //       ? "foreman"
        //       : inner.userManpower.journeyman
        //       ? "journeyman"
        //       : inner.userManpower.apprentice
        //       ? "apprentice"
        //       : "construction",
        //     userId: inner.userId,
        //     id: inner.userManpower._id,
        //     fullname: inner.fullname,
        //     manpowerId: inner.userManpower.manpowerId,
        //   };
        // });
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/jobNumber/`)
      .then((res) => {
        const sortedJobNumbers = res.data.jobNumbers
          .map((i) => {
            return {
              jobNumber: i.jobNumber,
              jobName: i.jobName,
            };
          })
          .find((inner) => inner.jobNumber == jobNo);
        setJobName(sortedJobNumbers.jobName);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [open, laborFlag]);
  const userLoad = () => {
    setLoadingUser(true);
    axios
      .get(`${apiPath.prodPath}/api/users/`)
      .then((res) => {
        const usersFiltered = res.data.allUsers.map((i) => {
          return { label: i.fullname, value: i.fullname };
        });
        setEmpOpt(usersFiltered);
        setLoadingUser(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const loadUserLaborData = () => {
    setLoader(true);
    axios
      .get(`${apiPath.prodPath}/api/manpowerUsers/${jobNo}`)
      .then((res) => {
        const sortedUserJobs = res.data.allUserLabors.filter(
          (item) =>
            item.userManpower.job == jobNo &&
            item.userManpower.manpowerId == manpowerId
        );
        setAllUserLabors(sortedUserJobs);
        const mappedSortedUserJobs = sortedUserJobs.map((inner) => {
          return {
            label: `${inner.fullname}`,
            value: `${inner.fullname}`,
            type: inner.userManpower.foreman
              ? "foreman"
              : inner.userManpower.journeyman
              ? "journeyman"
              : inner.userManpower.apprentice
              ? "apprentice"
              : "construction",
            userId: inner.userId,
            id: inner.userManpower._id,
            fullname: inner.fullname,
            manpowerId: inner.userManpower.manpowerId,
          };
        });
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(`${apiPath.prodPath}/api/jobNumber/`)
      .then((res) => {
        const sortedJobNumbers = res.data.jobNumbers
          .map((i) => {
            return {
              jobNumber: i.jobNumber,
              jobName: i.jobName,
            };
          })
          .find((inner) => inner.jobNumber == jobNo);
        setJobName(sortedJobNumbers.jobName);
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
    setFilterFlag(true);
    e.preventDefault();
    if (filterOpt.value == "Employee") {
      const filteredVal = allUserLabors.filter((i) => i.name == search.value);
      setFilteredData(filteredVal);
    } else {
      const filteredVal = allUserLabors.filter(
        (i) =>
          moment(i.timeEntry.date).format("MM-DD-YYYY") ==
          moment(search).format("MM-DD-YYYY")
      );
      setFilteredData(filteredVal);
    }
  };
  const handleClear = () => {
    setFilterFlag(false);
    setSearch("");
    setFilteredData(allUserLabors);
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-row justify-center align-middle w-full h-full"
    >
      <div className="bg-white w-5/6 h-dvh p-10 border-none overflow-y-scroll">
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">
              Job: {jobNo} - {jobName}
            </h1>
          </Button>
        </div>
        <div className="p-5">
          <form className="flex flex-row gap-3" onSubmit={handleSearch}>
            <div className="w-1/4">
              <Select
                options={[
                  { label: "Employee", value: "Employee" },
                  { label: "Date", value: "Date" },
                ]}
                value={filterOpt}
                onChange={(value) => setFilterOpt(value)}
                className="z-10"
              />
            </div>
            {filterOpt.value == "Employee" ? (
              <div className="w-1/4">
                {loadingUser ? (
                  <p>Loading...</p>
                ) : (
                  <Select
                    options={empOpt}
                    onChange={(e) => setSearch(e)}
                    value={search}
                    className="z-10"
                  />
                )}
              </div>
            ) : (
              <div className="w-1/4">
                <input
                  type="date"
                  placeholder="Search By Date"
                  className="p-2 rounded-[5px] border-solid border-[1px] border-[#a2a2a2] w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  required={true}
                />
              </div>
            )}
            <div className="w-[100px]">
              <input
                type="submit"
                value={"Search"}
                className="p-2 rounded-[5px] bg-orange-400 text-white font-semibold hover:cursor-pointer"
              />
            </div>
            {search !== "" ? (
              <div className="w-[100px]">
                <button
                  onClick={handleClear}
                  className="p-2 rounded-[5px] bg-orange-400 text-white font-semibold hover:cursor-pointer"
                >
                  Clear
                </button>
              </div>
            ) : null}
          </form>
        </div>
        <TableContainer sx={{ height: 700 }}>
          <Table stickyHeader style={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 200 }}>Name</TableCell>
                <TableCell style={{ minWidth: 200 }}>Date</TableCell>
                <TableCell style={{ minWidth: 200 }}>Day</TableCell>
                <TableCell style={{ minWidth: 100 }}>Checked In</TableCell>
                <TableCell style={{ minWidth: 100 }}>
                  Lunch Time Start
                </TableCell>
                <TableCell style={{ minWidth: 100 }}>Lunch Time End</TableCell>
                <TableCell style={{ minWidth: 100 }}>Checked Out</TableCell>
                <TableCell style={{ minWidth: 100 }}>Notes</TableCell>
                {/* <TableCell style={{ minWidth: 100 }}>Reimbursal</TableCell> */}
              </TableRow>
            </TableHead>
            {filterFlag ? (
              <TableBody>
                {loader ? (
                  <TableRow>loading....</TableRow>
                ) : filterdData.length ? (
                  filterdData
                    .sort((a, b) =>
                      a.timeEntry.date.localeCompare(b.timeEntry.date)
                    )
                    .map((i, ind) => {
                      return (
                        <TableRow key={`${i.userId}-${ind}`}>
                          <TableCell style={{ minWidth: 200 }}>
                            {i.name} - {i.type}
                          </TableCell>
                          <TableCell style={{ minWidth: 200 }}>
                            {moment(i.timeEntry.date).format("MM-DD-YYYY")}
                          </TableCell>
                          <TableCell style={{ minWidth: 200 }}>
                            {i.timeEntry.dayName == ""
                              ? "Not Entered"
                              : i.timeEntry.dayName}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.checkedIn == ""
                              ? "Not Entered"
                              : i.timeEntry.checkedIn}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.lunchTimeStart == ""
                              ? "Not Entered"
                              : i.timeEntry.lunchTimeStart}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.lunchTimeEnd == ""
                              ? "Not Entered"
                              : i.timeEntry.lunchTimeEnd}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.checkedOut == ""
                              ? "Not Entered"
                              : i.timeEntry.checkedOut}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.notes == ""
                              ? "Not Entered"
                              : i.timeEntry.notes}
                          </TableCell>
                          {/* <TableCell style={{ minWidth: 100 }}>
                            <button className="bg-orange-400 text-white p-2 rounded-[10px]">
                              View
                            </button>
                          </TableCell> */}
                        </TableRow>
                      );
                    })
                ) : null}
              </TableBody>
            ) : (
              <TableBody>
                {loader ? (
                  <TableRow>loading....</TableRow>
                ) : allUserLabors.length ? (
                  allUserLabors
                    .sort((a, b) =>
                      a.timeEntry.date.localeCompare(b.timeEntry.date)
                    )
                    .map((i, ind) => {
                      return (
                        <TableRow key={`${i.userId}-${ind}`}>
                          <TableCell style={{ minWidth: 200 }}>
                            {i.name} - {i.type}
                          </TableCell>
                          <TableCell style={{ minWidth: 200 }}>
                            {moment(i.timeEntry.date).format("MM-DD-YYYY")}
                          </TableCell>
                          <TableCell style={{ minWidth: 200 }}>
                            {i.timeEntry.dayName == ""
                              ? "Not Entered"
                              : i.timeEntry.dayName}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.checkedIn == ""
                              ? "Not Entered"
                              : i.timeEntry.checkedIn}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.lunchTimeStart == ""
                              ? "Not Entered"
                              : i.timeEntry.lunchTimeStart}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.lunchTimeEnd == ""
                              ? "Not Entered"
                              : i.timeEntry.lunchTimeEnd}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.checkedOut == ""
                              ? "Not Entered"
                              : i.timeEntry.checkedOut}
                          </TableCell>
                          <TableCell style={{ minWidth: 100 }}>
                            {i.timeEntry.notes == ""
                              ? "Not Entered"
                              : i.timeEntry.notes}
                          </TableCell>
                          {/* <TableCell style={{ minWidth: 100 }}>
                            <button className="bg-orange-400 text-white p-2 rounded-[10px]">
                              View
                            </button>
                          </TableCell> */}
                        </TableRow>
                      );
                    })
                ) : null}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
}

export default TimeTrackEmpModal;
