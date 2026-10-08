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
import Swal from "sweetalert2";
import BadgeDrawer from "../drawers/badgeDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import BadgeInfoModal from "../modals/badgeInfoModal";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
export default function BadgeTable({ allBadges, loading, refreshData }) {
  const [actionFlag, setActionFlag] = useState(false);
  const [badgeId, setBadgeId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  useEffect(() => {
    setPage(0);
  }, [loading]);
  const handleActions = (id) => {
    setBadgeId(id);
    setActionFlag(!actionFlag);
  };
  const openInfoDrawer = (id) => {
    setBadgeId(id);
    setInfoModal(true);
  };
  const openEmpModal = (data) => {
    setOpenModal(true);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleEdit = (dataObj) => {
    axios
      .patch(`${apiPath.prodPath}/api/badge/${badgeId}`, dataObj)
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Error editing badge",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Edited Successfully",
          });
          refreshData();
        }
      })
      .catch((err) => console.log(err));
  };
  const deleteBadge = (id) => {
    setActionFlag(!actionFlag);
    Swal.fire({
      icon: "warning",
      title: "Are You Sure?",
      text: "Are you sure you want to delete the data? This action is irreversible.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "orange",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiPath.prodPath}/api/badge/${id}`)
          .then((res) => {
            refreshData();
            openEmpModal();
            setActionFlag(false);
          })
          .catch((err) => console.log(err));
      }
    });
  };
  const dateFormatted = (date) => {
    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);
    const formattedDate = month + "-" + day + "-" + year;
    return formattedDate;
  };
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
          <TableContainer sx={{ height: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: 150 }}>Actions</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Badge#</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Badge Status</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Badge Type</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Employee</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Phone</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Email</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Date Issued</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Sponsored</TableCell>
                  <TableCell style={{ minWidth: 150 }}>
                    General Contractor
                  </TableCell>
                  <TableCell style={{ minWidth: 150 }}>Escorting</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Expiry Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allBadges.length == 0 ? (
                  <TableRow>
                    <p className={poppins.className}>No Data Found</p>
                  </TableRow>
                ) : (
                  allBadges
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                  onClick={() => {
                                    setBadgeId(i.id);
                                    setEditData(i);
                                    openEmpModal();
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteBadge(i.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.badge}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.badgeStatus}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.badgeType}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.employee}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.phone}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.email}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {dateFormatted(i.dateIssued)}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.sponsored}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.generalContractor}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {i.escorting}
                          </TableCell>
                          <TableCell style={{ minWidth: 150 }}>
                            {dateFormatted(i.expDate)}
                          </TableCell>
                          {openModal && editData && i.id == badgeId ? (
                            <BadgeDrawer
                              edit={true}
                              open={openModal}
                              onClose={() => setOpenModal(false)}
                              id={badgeId}
                              editData={editData}
                              refreshData={refreshData}
                              editBadge={handleEdit}
                            />
                          ) : null}
                          {infoModal && badgeId == i.id ? (
                            <BadgeInfoModal
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
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20, 30, 40, 50]}
            component="div"
            count={allBadges.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
}
