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
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Swal from "sweetalert2";
import JobNumberDrawer from "../drawers/jobNumberDrawer";
import JobNumberInfo from "../modals/jobNumberInfoModal";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
export default function JobNumberTable({
  allJobNumbers,
  loading,
  refreshData,
  handleChangePage,
  totalCount,
  page,
  pageSize,
  handleChangeRowsPerPage,
  handleJobSort,
  jobFlag,
  jobSortLabel,
}) {
  const [actionFlag, setActionFlag] = useState(false);
  const [jobId, setJobId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [infoModal, setInfoModal] = useState(false);
  const [item, setItem] = useState();
  const [pageCus, setPageCus] = useState(0);
  const [rowsPerPageCus, setRowsPerPageCus] = useState(20);
  // useEffect(() => {
  //   setPage(0);
  // }, [loading]);
  const handleChangePageCus = (event, newPage) => {
    setPageCus(newPage);
  };

  const handleChangeRowsPerPageCus = (event) => {
    setRowsPerPageCus(+event.target.value);
    setPageCus(0);
  };
  const openEmpModal = (data) => {
    setJobId(data.id);
    setEditData(data);
    setOpenModal(!openModal);
  };
  const openInfoDrawer = (id) => {
    setJobId(id);
    setInfoModal(!infoModal);
  };
  const editJob = (data, id) => {
    axios
      .patch(`${apiPath.prodPath}/api/jobNumber/${id}`, data)
      .then((res) => {
        Swal.fire({
          icon: "success",
          text: "Edited Successfully",
        });
        refreshData();
        setOpenModal(false);
        setActionFlag(false);
      })
      .catch((err) => console.log(err));
    const sheetData = {
      newEntry: data,
      oldEntry: item,
    };
    axios
      .put(`${apiPath.prodPath}/api/sheetsData/editSingleJob/`, sheetData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  const deleteJobNumber = (id) => {
    setActionFlag(false);
    Swal.fire({
      icon: "warning",
      title: "Are You Sure?",
      text: "Are you sure you want to delete the Job Number data? This action is irreversible.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "orange",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiPath.prodPath}/api/jobNumber/${id}`)
          .then((res) => {
            refreshData();
            openEmpModal();
            setActionFlag(false);
          })
          .catch((err) => console.log(err));
        axios
          .delete(`${apiPath.prodPath}/api/sheetsData/${item.jobNumber}`)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    });
  };
  function numberWithCommas(x) {
    const formatCus = (Math.round(x * 100) / 100).toFixed(2);
    return formatCus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
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
        <>
          <TableContainer sx={{ height: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 150 }}>Actions</TableCell>
                  <TableCell
                    style={{ minWidth: 150 }}
                    className="hover:cursor-pointer"
                    onClick={() => handleJobSort("Job Number", jobFlag)}
                  >
                    Job Number
                    {jobSortLabel == "Job Number" && jobFlag == false ? (
                      <ArrowUpwardIcon className="text-[20px]" />
                    ) : jobSortLabel == "Job Number" && jobFlag ? (
                      <ArrowDownwardIcon className="text-[20px]" />
                    ) : null}
                  </TableCell>
                  <TableCell
                    style={{ minWidth: 150 }}
                    className="hover:cursor-pointer"
                    onClick={() => handleJobSort("Job Name", jobFlag)}
                  >
                    Job Name
                    {jobSortLabel == "Job Name" && jobFlag == false ? (
                      <ArrowUpwardIcon className="text-[20px]" />
                    ) : jobSortLabel == "Job Name" && jobFlag ? (
                      <ArrowDownwardIcon className="text-[20px]" />
                    ) : null}
                  </TableCell>
                  <TableCell
                    style={{ minWidth: 150 }}
                    className="hover:cursor-pointer"
                    onClick={() => handleJobSort("General Contractor", jobFlag)}
                  >
                    General Contractor
                    {jobSortLabel == "General Contractor" &&
                    jobFlag == false ? (
                      <ArrowUpwardIcon className="text-[20px]" />
                    ) : jobSortLabel == "General Contractor" && jobFlag ? (
                      <ArrowDownwardIcon className="text-[20px]" />
                    ) : null}
                  </TableCell>
                  <TableCell style={{ minWidth: 150 }}>Contract / TM</TableCell>
                  <TableCell
                    style={{ minWidth: 150 }}
                    className="hover:cursor-pointer"
                    onClick={() => handleJobSort("PM", jobFlag)}
                  >
                    Job PM
                    {jobSortLabel == "PM" && jobFlag == false ? (
                      <ArrowUpwardIcon className="text-[20px]" />
                    ) : jobSortLabel == "PM" && jobFlag ? (
                      <ArrowDownwardIcon className="text-[20px]" />
                    ) : null}
                  </TableCell>
                  <TableCell style={{ minWidth: 150 }}>Date Created</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Date Billed</TableCell>
                  <TableCell style={{ minWidth: 150 }}>PO</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Amount</TableCell>
                  <TableCell style={{ minWidth: 150 }}>CO</TableCell>
                  <TableCell style={{ minWidth: 150 }}>
                    Percentage Billed
                  </TableCell>
                  <TableCell style={{ minWidth: 150 }}>Notes</TableCell>
                  <TableCell style={{ minWidth: 150 }}>
                    Project Checklist
                  </TableCell>
                  <TableCell style={{ minWidth: 50 }}>QBW</TableCell>
                  <TableCell style={{ minWidth: 50 }}>PAY</TableCell>
                </TableRow>
              </TableHead>
              {jobSortLabel !== "" ? (
                <TableBody>
                  {allJobNumbers.length == 0 ? (
                    <TableRow>
                      <p className={poppins.className}>No Jobs Data Found</p>
                    </TableRow>
                  ) : (
                    allJobNumbers
                      .slice(
                        pageCus * rowsPerPageCus,
                        pageCus * rowsPerPageCus + rowsPerPageCus
                      )
                      .map((i) => {
                        return (
                          <TableRow key={i.id}>
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
                                  <DropdownMenuItem
                                    onClick={() => openInfoDrawer(i.id)}
                                  >
                                    Open
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => openEmpModal(i)}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => deleteJobNumber(i.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.jobNumber}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.jobName}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.generalContractor}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.contractTM}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.jobPM}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.dateCreated}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.dateBilled}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.PO}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.amount}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.CO}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.percentageBilled}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.notes}
                            </TableCell>
                            <TableCell style={{ minWidth: 150 }}>
                              {i.projectChecklist}
                            </TableCell>
                            <TableCell style={{ minWidth: 50 }}>
                              {i.QBW == false ? "No" : "Yes"}
                            </TableCell>
                            <TableCell style={{ minWidth: 50 }}>
                              {i.PAY == false ? "No" : "Yes"}
                            </TableCell>
                            {openModal && editData && jobId == i.id ? (
                              <JobNumberDrawer
                                edit={true}
                                open={openModal}
                                onClose={() => setOpenModal(false)}
                                id={jobId}
                                data={i}
                                editJob={editJob}
                              />
                            ) : null}
                            {infoModal && jobId == i.id ? (
                              <JobNumberInfo
                                open={infoModal}
                                onClose={() => setInfoModal(false)}
                                item={i}
                                refreshData={refreshData}
                              />
                            ) : null}
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              ) : (
                <TableBody>
                  {allJobNumbers.length == 0 ? (
                    <TableRow>
                      <p className={poppins.className}>No Jobs Data Found</p>
                    </TableRow>
                  ) : (
                    allJobNumbers.map((i) => {
                      return (
                        <TableRow key={i.id}>
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
                                <DropdownMenuItem
                                  onClick={() => openInfoDrawer(i.id)}
                                >
                                  Open
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEmpModal(i)}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteJobNumber(i.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.jobNumber}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.jobName}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.generalContractor}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.contractTM}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.jobPM}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.dateCreated}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.dateBilled}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.PO}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.amount}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.CO}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.percentageBilled}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.notes}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.projectChecklist}
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }}>
                            {i.QBW == false ? "No" : "Yes"}
                          </TableCell>
                          <TableCell style={{ minWidth: 50 }}>
                            {i.PAY == false ? "No" : "Yes"}
                          </TableCell>
                          {openModal && editData && jobId == i.id ? (
                            <JobNumberDrawer
                              edit={true}
                              open={openModal}
                              onClose={() => setOpenModal(false)}
                              id={jobId}
                              data={i}
                              editJob={editJob}
                            />
                          ) : null}
                          {infoModal && jobId == i.id ? (
                            <JobNumberInfo
                              open={infoModal}
                              onClose={() => setInfoModal(false)}
                              item={i}
                              refreshData={refreshData}
                            />
                          ) : null}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          {jobSortLabel !== "" ? (
            <TablePagination
              rowsPerPageOptions={[20]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPageCus}
              page={pageCus}
              onPageChange={handleChangePageCus}
              onRowsPerPageChange={handleChangeRowsPerPageCus}
            />
          ) : (
            <TablePagination
              rowsPerPageOptions={[20]}
              component="div"
              rowsPerPage={pageSize}
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </>
      )}
    </Paper>
  );
}
