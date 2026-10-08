import { apiPath } from "@/utils/routes";
import moment from "moment";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { TimePicker } from "react-rainbow-components";
import { Modal } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import { CheckboxGroup } from "react-rainbow-components";

function SpectrumModal({ open, onClose, handleSpectrumForm }) {
  const [checkbox, setCheckbox] = useState([]);
  const handleForm = (e) => {
    e.preventDefault();
    handleSpectrumForm(checkbox[0] == "spectrum" ? true : false);
    onClose();
  };
  const handleCheckbox = (value) => {
    setCheckbox(value);
  };
  const options = [{ value: "spectrum", label: "Spectrum", disabled: false }];
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex flex-row justify-center self-center w-full"
    >
      <div className="bg-white w-1/3 h-350 p-10 border-none">
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Set Notes</h1>
          </Button>
        </div>
        <form onSubmit={handleForm} className="flex flex-row flex-wrap">
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col w-1/4 gap-2">
              <CheckboxGroup
                id="checkbox-group-1"
                options={options}
                value={checkbox}
                onChange={handleCheckbox}
              />
            </div>
            <input
              type="submit"
              value={"Add"}
              className="bg-orange-400 text-white rounded-xl w-1/5 p-2 font-semibold text-lg self-center"
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default SpectrumModal;
