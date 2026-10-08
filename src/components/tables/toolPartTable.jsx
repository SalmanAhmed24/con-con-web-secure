import { Poppins } from "next/font/google";
const poppins = Poppins({
  weight: ["300", "500"],
  style: ["normal"],
  subsets: ["latin"],
});
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

function ToolPartTable({ allToolPart, refreshData, callEdit }) {
  const [openFlag, setOpenFlag] = useState(false);
  const openEmpModal = (data) => {
    callEdit(data.partNo, data.description, data.id);
  };
  const deleteToolPart = (idObj) => {
    Swal.fire({
      icon: "warning",
      text: "Are you sure you want to delete this?",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "orange",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${apiPath.prodPath}/api/toolPart/${idObj}`)
          .then((res) => {
            if (res.data.error) {
              Swal.fire({
                icon: "error",
                text: "Unable to delete",
                confirmButtonColor: "orange",
              });
            }
            if (res.data.error == false) {
              Swal.fire({
                icon: "success",
                text: "Deleted Successfully",
                confirmButtonColor: "orange",
              });
              refreshData();
            }
          });
      }
    });
  };
  return (
    <section>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              <TableCell>Part No</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allToolPart.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  <TableCell>
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
                          onClick={() => {
                            openEmpModal(row);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            deleteToolPart(row.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>{row.partNo}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}

export default ToolPartTable;
