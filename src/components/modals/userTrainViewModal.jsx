import Modal from "@mui/material/Modal";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { Poppins } from "next/font/google";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Select from "react-select";
import { apiPath } from "@/utils/routes";
import Swal from "sweetalert2";

const poppins = Poppins({
  weight: ["300", "500"],
  subsets: ["latin"],
  style: ["normal"],
});
function UserViewTrainModal({ open, onClose, data }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-row justify-center align-middle w-full h-full"
    >
      <div className="bg-white w-[700px] h-[500px] p-10 border-none overflow-y-scroll">
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Watched By</h1>
          </Button>
        </div>

        <div>
          <div className="flex flex-col gap-2 w-[550px]">
            <label className="font-semibold">Users Who Watched</label>
            {data.map((i, index) => {
              return <p key={index}>{i.name}</p>;
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UserViewTrainModal;
