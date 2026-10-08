import { Drawer } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";

import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import Image from "next/image";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Select from "react-select";
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
function VendorDrawer({
  open,
  onClose,
  addVendor,
  editVendor,
  id,
  edit,
  data,
}) {
  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/vendorCategory`)
      .then((res) => {
        // const sortedCat = res.data.vendorCategorys
        //   .map((i) => {
        //     return { label: i.name, value: i.name };
        //   })
        //   .sort((a, b) => a.label.localeComapre(b.label));
        setVendorCatOpt(
          res.data.vendorCategorys.map((i) => {
            return {
              label: i.name,
              value: i.name,
            };
          })
        );
      })
      .catch((err) => console.log(err));
    if (edit) {
      setName(data.name);
      setCompanyName(data.companyName);
      setAddress(data.address);
      setCity(data.city);
      setState(data.state);
      setZipCode(data.zipCode);
      setPrimaryContact(data.primaryContact);
      setPhone(data.phone);
      setEmail(data.email);
      setWebsite(data.website);
      setPreferredFlag(data.preferred);
      setVendorCategory(
        data.vendorCategory == undefined
          ? ""
          : { label: data.vendorCategory, value: data.vendorCategory }
      );
    }
  }, []);

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [preferredFlag, setPreferredFlag] = useState(false);
  const [vendorCatOpt, setVendorCatOpt] = useState([]);
  const [vendorCategory, setVendorCategory] = useState("");

  const handleaddJob = (e) => {
    e.preventDefault();
    const dataObj = {
      name,
      companyName,
      address,
      city,
      state,
      zipCode,
      phone,
      email,
      primaryContact,
      website,
      preferred: preferredFlag,
      vendorCategory: vendorCategory.value,
    };
    if (edit) {
      editVendor(dataObj, id);
    } else {
      addVendor(dataObj);
      dataEntryRefresh();
    }
  };
  const dataEntryRefresh = () => {
    setName("");
    setCompanyName("");
    setAddress("");
    setCity("");
    setState("");
    setZipCode("");
    setPrimaryContact("");
    setPhone("");
    setEmail("");
    setWebsite("");
    setVendorCategory("");
  };
  const handlePreferred = (e) => {
    setPreferredFlag(e.target.checked);
  };
  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={onClose}
      className="tools-drawer"
    >
      <div className={`${poppins.className} w-full flex flex-col p-10`}>
        <h1 className="flex flex-row gap-x-3 font-bold text-2xl">
          <span
            onClick={() => onClose()}
            className="flex flex-col justify-center align-middle"
          >
            <Image src={"/back.png"} width={12} height={21} alt="Back" />
          </span>
          {edit ? "Edit Vendor" : "Add Vendor"}
        </h1>
        <form
          onSubmit={handleaddJob}
          className="flex flex-row gap-5 flex-wrap w-full mt-9"
        >
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Vendor Category</label>
            <Select
              options={vendorCatOpt}
              value={vendorCategory}
              onChange={(e) => setVendorCategory(e)}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Zipcode</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Primary Contact</label>
            <input
              type="text"
              value={primaryContact}
              onChange={(e) => setPrimaryContact(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <label className="font-semibold">website</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={`${poppins.className} p-2 cus-tool-form`}
            />
          </div>
          <div className="flex flex-col w-1/4 gap-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={preferredFlag}
                  onChange={handlePreferred}
                  inputProps={{ "aria-label": "controlled" }}
                  value={"preferred"}
                />
              }
              label="Preferred"
            />
          </div>
          <div className="flex flex-row gap-5 justify-end w-full mt-10">
            <input
              className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
              type="submit"
              value={edit ? "Save" : "Add Vendor"}
            />
            {edit ? (
              <button
                className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </Drawer>
  );
}

export default VendorDrawer;
