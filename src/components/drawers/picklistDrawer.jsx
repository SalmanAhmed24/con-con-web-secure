import { Drawer } from "@mui/material";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import Select from "react-select";

import "./style.scss";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import Image from "next/image";
const poppins = Poppins({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

function PicklistDrawer({
  open,
  onClose,
  picklistName,
  addPicklist,
  editPicklist,
  id,
  edit,
  data,
}) {
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [parentCategoryOpt, setParentCategoryOpt] = useState("");
  const [parentSubCategoryOpt, setParentSubCategoryOpt] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [parentSubCategory, setParentSubCategory] = useState("");
  const [picklistValue, setPicklistValue] = useState("");
  const [days, setDays] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    dataEntryRefresh();
    if (picklistName == "Tool Sub-Category") {
      axios
        .get(`${apiPath.prodPath}/api/toolCategory`)
        .then((res) => {
          if (res.data && res.data.toolCategory)
            setParentCategoryOpt(
              res.data.toolCategory
                .map((i) => ({
                  label: i.name,
                  value: i.name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))
            );
        })
        .catch((err) => console.log(err));
    }
    if (picklistName == "Tool Description") {
      axios
        .get(`${apiPath.prodPath}/api/toolCategory`)
        .then((res) => {
          if (res.data && res.data.toolCategory)
            setParentCategoryOpt(
              res.data.toolCategory
                .map((i) => ({
                  label: i.name,
                  value: i.name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))
            );
        })
        .catch((err) => console.log(err));
      let toolApiUrl = `${apiPath.prodPath}/api/subtoolCategory/`;
      axios
        .get(toolApiUrl)
        .then((res) => {
          if (res.data && res.data.subtoolCategorys)
            setParentSubCategoryOpt(
              res.data.subtoolCategorys
                .map((i) => ({
                  label: i.name,
                  value: i.name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))
            );
        })
        .catch((err) => console.log(err));
    }
    if (picklistName == "Storage Id") {
      axios
        .get(`${apiPath.prodPath}/api/building`)
        .then((res) => {
          if (res.data && res.data.buildings)
            setParentCategoryOpt(
              res.data.buildings
                .map((i) => ({
                  label: i.name,
                  value: i.name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label))
            );
        })
        .catch((err) => console.log(err));
    }
    if (edit) {
      if (
        picklistName == "Customer Type" ||
        picklistName == "Material Level" ||
        picklistName == "Labor Level" ||
        picklistName == "Salesperson Code"
      ) {
        setPicklistValue(
          picklistName == "Material Level"
            ? data.materialLevel
            : picklistName == "Customer Type"
            ? data.customerType
            : picklistName == "Labor Level"
            ? data.laborLevel
            : picklistName == "Salesperson Code"
            ? data.salesPersonCode
            : ""
        );
      }
      if (picklistName == "Customer Term") {
        setDays(data.days);
        setDescription(data.description);
      }
      if (picklistName == "Tool Sub-Category" || picklistName == "Storage Id") {
        setName(data.name);
        setParentCategory({
          label: data.parentCategory,
          value: data.parentCategory,
        });
      } else if (picklistName == "Tool Description") {
        setName(data.name);
        setParentSubCategory({
          label: data.parentSubCategory,
          value: data.parentSubCategory,
        });
        setParentCategory({
          label: data.parentCategory,
          value: data.parentCategory,
        });
      } else {
        setName(data.name);
        setShortCode(data.shortCode);
      }
    }
  }, []);

  const handleAddPicklist = (e) => {
    e.preventDefault();
    let dataObj;
    if (picklistName == "Customer Term") {
      dataObj = {
        days,
        description,
      };
    } else if (
      picklistName == "Tool Sub-Category" ||
      picklistName == "Storage Id"
    ) {
      dataObj = {
        name,
        parentCategory: parentCategory.value,
      };
    } else if (picklistName == "Customer Type") {
    } else if (picklistName == "Tool Description") {
      dataObj = {
        name,
        parentSubCategory: parentSubCategory.value,
        parentCategory: parentCategory.value,
      };
    } else if (picklistName == "Customer Type") {
      dataObj = {
        customerType: picklistValue,
      };
    } else if (picklistName == "Material Level") {
      dataObj = {
        materialLevel: picklistValue,
      };
    } else if (picklistName == "Labor Level") {
      dataObj = {
        laborLevel: picklistValue,
      };
    } else if (picklistName == "Salesperson Code") {
      dataObj = {
        salesPersonCode: picklistValue,
      };
    } else {
      dataObj = {
        name,
        shortCode,
      };
    }
    if (edit) {
      editPicklist(dataObj, id);
    } else {
      addPicklist(dataObj);
      dataEntryRefresh();
    }
  };

  const dataEntryRefresh = () => {
    setName("");
    setShortCode("");
    setPicklistValue("");
    setDays("");
    setDescription("");
    setParentCategory({});
    setParentSubCategory({});
  };
  const handleCat = (e) => {
    setParentSubCategory("");
    setParentCategory(e);
    let toolApiUrl = `${apiPath.prodPath}/api/subtoolCategory/`;
    axios
      .get(toolApiUrl)
      .then((res) => {
        if (res.data && res.data.subtoolCategorys) {
          const filteredCat = res.data.subtoolCategorys.filter(
            (i) => i.parentCategory == e.value
          );
          setParentSubCategoryOpt(
            filteredCat
              .map((i) => ({
                label: i.name,
                value: i.name,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))
          );
        }
      })
      .catch((err) => console.log(err));
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
            className="flex flex-col justify-center align-middle hover:cursor-pointer"
          >
            <Image src={"/back.png"} width={12} height={21} alt="Back" />
          </span>
          {edit ? `Edit ${picklistName}` : `Add ${picklistName}`}
        </h1>
        {picklistName == "Customer Type" ||
        picklistName == "Material Level" ||
        picklistName == "Labor Level" ||
        picklistName == "Salesperson Code" ? (
          <form
            onSubmit={handleAddPicklist}
            className="flex flex-row gap-5 flex-wrap w-full mt-9"
          >
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">{picklistName}</label>
              <input
                value={picklistValue}
                className={`${poppins.className} p-2 cus-tool-form`}
                onChange={(e) => setPicklistValue(e.target.value)}
                required={true}
              />
            </div>
            <div className="sub-btn-wrap">
              <input
                className={`${poppins.className} addEmp`}
                type="submit"
                value={edit ? `Edit ${picklistName}` : `Add ${picklistName}`}
              />
            </div>
          </form>
        ) : picklistName == "Customer Term" ? (
          <form
            onSubmit={handleAddPicklist}
            className="flex flex-row gap-5 flex-wrap w-full mt-9"
          >
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Days</label>
              <input
                value={days}
                className={`${poppins.className} p-2 cus-tool-form`}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-1/4 gap-2">
              <label className="font-semibold">Description</label>
              <input
                value={description}
                className={`${poppins.className} p-2 cus-tool-form`}
                onChange={(e) => setDescription(e.target.value)}
                required={true}
              />
            </div>
            <div className="sub-btn-wrap">
              <input
                className={`${poppins.className} addEmp`}
                type="submit"
                value={edit ? `Edit ${picklistName}` : `Add ${picklistName}`}
              />
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleAddPicklist}
            className="flex flex-row gap-5 flex-wrap w-full mt-9"
          >
            {picklistName == "Tool Description" ? null : (
              <div className="flex flex-col w-1/4 gap-2">
                <label className="font-semibold">
                  {picklistName == "Tool Description"
                    ? "Tool Description"
                    : "Name"}
                </label>
                <input
                  value={name}
                  className={`${poppins.className} p-2 cus-tool-form`}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            {picklistName == "Tool Sub-Category" ||
            picklistName == "Storage Id" ? (
              <div className="flex flex-col w-1/4 gap-2">
                <label className="font-semibold">Parent Category</label>
                <Select
                  value={parentCategory}
                  className={`${poppins.className} employee-names`}
                  onChange={(e) => setParentCategory(e)}
                  required={true}
                  options={parentCategoryOpt}
                />
              </div>
            ) : picklistName == "Tool Description" ? null : (
              <div className="flex flex-col w-1/4 gap-2">
                <label className="font-semibold">Shortcode</label>
                <input
                  value={shortCode}
                  className={`${poppins.className} p-2 cus-tool-form`}
                  onChange={(e) => setShortCode(e.target.value)}
                  required={true}
                />
              </div>
            )}
            {picklistName == "Tool Description" ? (
              <>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Category</label>
                  <Select
                    value={parentCategory}
                    className={`${poppins.className} employee-names`}
                    onChange={(e) => {
                      handleCat(e);
                    }}
                    required={true}
                    options={parentCategoryOpt}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">Sub Category</label>
                  <Select
                    value={parentSubCategory}
                    className={`${poppins.className} employee-names`}
                    onChange={(e) => setParentSubCategory(e)}
                    required={true}
                    options={parentSubCategoryOpt}
                  />
                </div>
                <div className="flex flex-col w-1/4 gap-2">
                  <label className="font-semibold">
                    {picklistName == "Tool Description"
                      ? "Tool Description"
                      : "Name"}
                  </label>
                  <input
                    value={name}
                    className={`${poppins.className} p-2 cus-tool-form`}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </>
            ) : null}
            <div className="flex flex-row justify-end w-full mt-10">
              <input
                className="p-3 bg-orange-400 text-white font-semibold rounded-xl"
                type="submit"
                value={edit ? `Edit ${picklistName}` : `Add ${picklistName}`}
              />
            </div>
          </form>
        )}
      </div>
    </Drawer>
  );
}

export default PicklistDrawer;
