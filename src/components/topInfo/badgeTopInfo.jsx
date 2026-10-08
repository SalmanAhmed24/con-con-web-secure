import moment from "moment";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PicFileService from "../badge/picFile";
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
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});
const dateFormatted = (date) => {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8, 10);
  const formattedDate = month + "-" + day + "-" + year;
  return formattedDate;
};
function TopInfoBadge({ data, getData }) {
  console.log("this is data", data);
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
                <label className="font-semibold text-orange-400">Badge#</label>
                <p className="text-end">{data.badge}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Badge Status
                </label>
                <p className="text-end">{data.badgeStatus}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Badge Type
                </label>
                <p className="text-end">{data.badgeType}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Employee
                </label>
                <p className="text-end">{data.employee}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">Phone</label>
                <p className="text-end">{data.phone}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">Email</label>
                <p className="text-end">{data.email}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Date Issued
                </label>
                <p className="text-end">{dateFormatted(data.dateIssued)}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Sponsored
                </label>
                <p className="text-end">{data.sponsored}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  General Contractor
                </label>
                <p className="text-end">{data.generalContractor}</p>
              </div>
            </div>
            <div className="w-1/3 flex flex-col gap-2">
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Escorting
                </label>
                <p className="text-end">{data.escorting}</p>
              </div>
              <div className="w-100 flex flex-row justify-between">
                <label className="font-semibold text-orange-400">
                  Expiration Date
                </label>
                <p className="text-end">{dateFormatted(data.expDate)}</p>
              </div>
            </div>
          </div>
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
          <PicFileService badgeId={data.id} attachments={data.attachments} />
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default TopInfoBadge;
