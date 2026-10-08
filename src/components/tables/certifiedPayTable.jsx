import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Image from "next/image";
// import EmployeeDrawer from "../drawers/employeeDrawer";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AttachmentModal from "../modals/attachmentModal";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
export default function CertifiedPayTable({
  loading,
  refreshData,
  certifiedPay,
  getEditData,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [viewModal, setViewModal] = useState(false);
  const [CPId, setCPId] = useState("");
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
  const deleteData = (i, id) => {
    console.log("this is item", i);
    Swal.fire({
      icon: "warning",
      text: "Are you sure you want to delete?",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "orange",
    }).then((result) => {
      if (result.isConfirmed) {
        const attachments = JSON.stringify(i.attachments);
        axios
          .delete(`${apiPath.prodPath}/api/certifiedPay/${id}`, {
            data: {
              oldFiles: attachments,
            },
          })
          .then((res) => {
            if (res.data.error) {
              Swal.fire({
                icon: "error",
                text: "Error Occurred Cannot delete",
              });
            } else {
              Swal.fire({
                icon: "success",
                text: "Deleted Successfully",
              });
              refreshData();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  return (
    <Paper
      className={poppins.className}
      sx={{
        width: "100%",
        overflow: "scroll",
        bgcolor: "transparent",
        border: "none",
      }}
    >
      <TableContainer sx={{ height: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell style={{ minWidth: 150 }}>Actions</TableCell>
              <TableCell style={{ minWidth: 150 }}>Job Name</TableCell>
              <TableCell style={{ minWidth: 150 }}>Job Number</TableCell>
              <TableCell style={{ minWidth: 150 }}>
                General Contractor
              </TableCell>
              <TableCell style={{ minWidth: 120 }}>Frequency</TableCell>
              <TableCell style={{ minWidth: 120 }}>Start Date</TableCell>
              <TableCell style={{ minWidth: 120 }}>CP</TableCell>
              <TableCell style={{ minWidth: 120 }}>Active</TableCell>
              <TableCell style={{ minWidth: 120 }}>Address</TableCell>
              <TableCell style={{ minWidth: 150 }}>Contact</TableCell>
              <TableCell style={{ minWidth: 150 }}>Delivery Method</TableCell>
              <TableCell style={{ minWidth: 150 }}>Attachments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certifiedPay.length == 0 ? (
              <TableRow>
                <p className={poppins.className}>No Devices Data Found</p>
              </TableRow>
            ) : (
              certifiedPay
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((i) => {
                  return (
                    <TableRow key={i.id}>
                      <TableCell style={{ minWidth: 150 }}>
                        <div className="flex flex-row gap-2">
                          <EditIcon
                            className="text-blue-400"
                            onClick={() => {
                              getEditData(i, i.id);
                            }}
                          />
                          <DeleteIcon
                            className="text-red-500"
                            onClick={() => {
                              deleteData(i, i.id);
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        {i.jobName}
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        {i.jobNumber}
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        {i.generalContractor}
                      </TableCell>
                      <TableCell style={{ minWidth: 120 }}>
                        {i.frequency}
                      </TableCell>
                      <TableCell style={{ minWidth: 120 }}>
                        {i.startDate}
                      </TableCell>
                      <TableCell style={{ minWidth: 120 }}>
                        {i.CP ? "True" : "False"}
                      </TableCell>
                      <TableCell style={{ minWidth: 120 }}>
                        {i.active ? "True" : "False"}
                      </TableCell>
                      <TableCell style={{ minWidth: 120 }}>
                        {i.address}
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        {i.contact}
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        {i.deliveryMethod}
                      </TableCell>
                      <TableCell style={{ minWidth: 150 }}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setCPId(i.id);
                            setViewModal(true);
                          }}
                          className="bg-orange-400 text-white p-2 rounded-[5px] font-semibold hover:cursor-pointer"
                        >
                          View
                        </button>
                      </TableCell>
                      {CPId == i.id && viewModal ? (
                        <AttachmentModal
                          files={i.attachments}
                          openFlag={viewModal}
                          closeModal={() => setViewModal(false)}
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
        count={certifiedPay.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
