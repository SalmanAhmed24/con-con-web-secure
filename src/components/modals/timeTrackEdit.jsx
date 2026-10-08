import { Modal } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button } from "../ui/button";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Select from "react-select";
import { TimePicker } from "react-rainbow-components";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { CheckboxGroup } from "react-rainbow-components";

// import "./style.scss";
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
function TimeTrackEdit({ open, onClose, item, refreshData }) {
  const [reimbursalOpt, setReimbursalOpt] = useState([]);
  const [userOpt, setUserOpt] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [lunchStartTime, setLunchStartTime] = useState("");
  const [lunchEndTime, setLunchEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [employees, setEmployees] = useState("");
  const [checkbox, setCheckbox] = useState([]);
  const [reimbursalArr, setReimbursalArr] = useState([
    {
      id: uuidv4(),
      reimbursalType: "",
      note: "",
      amount: "",
    },
  ]);
  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/reimbursalType/`)
      .then((res) => {
        setReimbursalOpt(
          res.data.reimbursalTypes
            .map((i) => {
              return { label: i.name, value: i.name };
            })
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      })
      .catch((err) => console.log(err));
    setCheckIn(item.checkedIn);
    setCheckOut(item.checkedOut);
    setLunchStartTime(item.lunchTimeEnd);
    setLunchEndTime(item.lunchEndTime);
    setNotes(item.notes);
    setCheckbox(item.spectrum == true ? ["spectrum"] : []);
    const modifiedValues =
      item.reimbursal && item.reimbursal.length
        ? item.reimbursal.map((i) => {
            return {
              id: i._id,
              reimbursalType: {
                label: i.reimbursalType,
                value: i.reimbursalType,
              },
              amount: i.amount,
              note: i.note,
            };
          })
        : [
            {
              id: uuidv4(),
              reimbursalType: "",
              note: "",
              amount: "",
            },
          ];

    setReimbursalArr(modifiedValues);
  }, []);
  const handleGrpForm = (e) => {
    e.preventDefault();
    const filteredData = reimbursalArr.map((i) => {
      return {
        reimbursalType: i.reimbursalType.value,
        amount: i.amount,
        note: i.note,
      };
    });
    const dataObj = {
      checkedIn: checkIn,
      checkedOut: checkOut,
      lunchTimeStart: lunchStartTime,
      lunchTimeEnd: lunchEndTime,
      notes: notes,
      spectrum: checkbox[0] == "spectrum" ? true : false,
      reimbursal: filteredData,
      userId: item.userId,
    };
    axios
      .post(
        `${apiPath.prodPath}/api/manpowerUsers/editTimeTrack/${item.manpowerId}`,
        dataObj
      )
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to edit time track table.",
            confirmButtonColor: "orange",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Edited successfully",
            confirmButtonColor: "orange",
          });
          refreshData();
          onClose();
        }
      })
      .catch((err) => console.log(err));
  };
  const handleReimbursalType = (e, i) => {
    const result = reimbursalArr.map((el) => {
      if (el.id == i.id) {
        el.reimbursalType = e;
      }
      return el;
    });

    setReimbursalArr(result);
  };
  const handleReimbursalAmount = (e, i) => {
    const result = reimbursalArr.map((el) => {
      if (el.id == i.id) {
        el.amount = e.target.value;
      }
      return el;
    });
    setReimbursalArr(result);
  };
  const handleReimbursalNote = (e, i) => {
    const result = reimbursalArr.map((el) => {
      if (el.id == i.id) {
        el.note = e.target.value;
      }
      return el;
    });

    setReimbursalArr(result);
  };
  const handleRemoveEl = (i) => {
    const filteredArr = reimbursalArr.filter((el) => el.id !== i.id);
    setReimbursalArr(filteredArr);
  };
  const handleCheckbox = (value) => {
    setCheckbox(value);
  };
  const addNewForm = () => {
    const newForm = {
      id: uuidv4(),
      reimbursalType: "",
      amount: "",
      note: "",
    };
    setReimbursalArr((arr) => {
      return [...arr, newForm];
    });
  };
  const options = [{ value: "spectrum", label: "Spectrum", disabled: false }];

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="flex flex-row justify-center align-middle w-full h-full"
    >
      <div
        className="bg-white w-5/6 h-dvh p-10 border-none overflow-y-scroll"
        style={{ alignSelf: "center" }}
      >
        <div className="mb-10">
          <Button
            onClick={() => onClose()}
            className="bg-transparent flex flex-row text-black hover:bg-transparent text-3xl p-0"
          >
            <ArrowBackIosIcon className="text-4xl text-gray-500" />
            <h1 className="text-3xl font-semibold">Edit Time Track</h1>
          </Button>
        </div>
        <div className="flex flex-row gap-2 mb-10">
          <div className="w-1/5 flex flex-col gap-2">
            <label className="text-orange-400 font-bold">Date</label>
            <p>{moment(item.date).format("MM-DD-YYYY")}</p>
          </div>
          <div className="w-1/5 flex flex-col gap-2">
            <label className="text-orange-400 font-bold">Day</label>
            <p>{item.dayName}</p>
          </div>
        </div>
        <form onSubmit={handleGrpForm} className="flex flex-row flex-wrap">
          <div className="w-1/3 flex flex-col gap-2">
            <label className="font-semibold">CheckIn Time</label>
            <TimePicker
              value={checkIn}
              abel="CheckIn Time"
              onChange={(time) => setCheckIn(time)}
              className="rainbow-m-vertical_small rainbow-p-horizontal_medium rainbow-m_auto"
            />
          </div>
          <div className="w-1/3 flex flex-col gap-2">
            <label className="font-semibold">CheckOut Time</label>
            <TimePicker
              value={checkOut}
              onChange={(time) => setCheckOut(time)}
              className="rainbow-m-vertical_small rainbow-p-horizontal_medium rainbow-m_auto"
            />
          </div>
          <div className="w-1/3 flex flex-col gap-2">
            <label className="font-semibold">Lunch Start Time</label>

            <TimePicker
              value={lunchStartTime}
              onChange={(time) => setLunchStartTime(time)}
              className="rainbow-m-vertical_small rainbow-p-horizontal_medium rainbow-m_auto"
            />
          </div>
          <div className="w-1/3 flex flex-col gap-2">
            <label className="font-semibold">Lunch End Time</label>

            <TimePicker
              value={lunchEndTime}
              onChange={(time) => setLunchEndTime(time)}
              className="rainbow-m-vertical_small rainbow-p-horizontal_medium rainbow-m_auto"
            />
          </div>

          <div className="w-1/3 flex flex-col gap-2">
            <label className="font-semibold">Notes</label>

            <input
              type="text"
              value={notes}
              placeholder="Enter Notes"
              className="p-2 border-gray-200 border-2 w-4/5"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex flex-row flex-wrap gap-4 w-full">
            {reimbursalArr.map((i) => {
              return (
                <div key={i.id} className="w-full flex flex-row gap-4">
                  <div className="flex flex-col w-1/4 gap-2">
                    <label className="font-semibold">Reimbursal Type</label>
                    <Select
                      name={`reimbursalType${i.id}`}
                      options={reimbursalOpt}
                      value={i.reimbursalType}
                      onChange={(e) => {
                        handleReimbursalType(e, i);
                      }}
                      className={`${poppins.className} employee-names`}
                      required={true}
                    />
                  </div>
                  <div className="flex flex-col w-1/4 gap-2">
                    <label className="font-semibold">Amount</label>
                    <input
                      name={`amount${i.id}`}
                      placeholder="Enter Amount"
                      value={i.amount}
                      onChange={(e) => {
                        handleReimbursalAmount(e, i);
                      }}
                      className="p-2 cus-tool-form"
                      required={true}
                    />
                  </div>
                  <div className="flex flex-col w-1/4 gap-2">
                    <label className="font-semibold">Note</label>
                    <textarea
                      name={`note${i.id}`}
                      placeholder="Enter Note"
                      value={i.note}
                      onChange={(e) => {
                        handleReimbursalNote(e, i);
                      }}
                      className="p-2 cus-tool-form"
                    />
                  </div>
                  <div className="w-full flex flex-row justify-end">
                    <span
                      className={`${poppins.className} self-center p-2 bg-orange-400 text-white rounded-xl font-semibold hover:cursor-pointer`}
                      onClick={addNewForm}
                    >
                      Add Another Reimbursal
                    </span>
                  </div>
                  {reimbursalArr.length > 1 ? (
                    <span
                      className="minus"
                      style={{ fontSize: "22px" }}
                      onClick={() => handleRemoveEl(i)}
                    >
                      &#9866;
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col w-full mb-10 gap-2">
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
            className="bg-orange-400 text-white rounded-xl p-2 font-semibold text-lg self-center"
          />
        </form>
      </div>
    </Modal>
  );
}

export default TimeTrackEdit;
