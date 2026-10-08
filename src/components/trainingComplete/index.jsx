"use client";
import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { apiPath } from "@/utils/routes";
import TrainAssignmentTable from "../tables/trainAssignmentTable";

const poppins = Poppins({
  weight: ["300", "400", "600", "800", "900"],
  subsets: ["latin"],
});
function TrainCompleteComp({ user }) {
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [trainingCategoryOpt, setTrainingCategoryOpt] = useState();
  const [trainingCategory, setTrainingCategory] = useState();
  const [searchFlag, setSearchFlag] = useState(false);
  useEffect(() => {
    axios
      .get(`${apiPath.prodPath}/api/trainingCategory/`)
      .then((res) => {
        const optionArr = res.data.trainingCategorys.map((i) => {
          return { label: i.name, value: i.name };
        });
        setTrainingCategoryOpt(optionArr);
      })
      .catch((error) => console.log(error));
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/trainAssignment/`)
      .then((res) => {
        console.log(res.data);
        setTrainings(res.data.trainingAssignments);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/trainAssignment/`)
      .then((res) => {
        setTrainings(res.data.trainingAssignments);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .get(`${apiPath.prodPath}/api/trainAssignment/`)
      .then((res) => {
        const filterTraining = res.data.trainingAssignments.filter(
          (i) => i.trainingCategory == trainingCategory.value,
        );
        setTrainings(filterTraining);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleClear = () => {
    refreshData();
    setSearchFlag(false);
    setTrainingCategory("");
  };
  return (
    <section className={`${poppins.className} employee-wrap`}>
      <form
        onSubmit={handleSearch}
        className={`${poppins.className} w-1/2 flex flex-col justify-start gap-3 pb-2`}
      >
        <Select
          className="employee-names"
          options={trainingCategoryOpt}
          value={trainingCategory}
          onChange={(v) => {
            setTrainingCategory(v);
            setSearchFlag(true);
          }}
        />
        <div className="flex flex-row justify-start gap-2">
          <input
            className="bg-orange-400 text-white p-2 rounded-xl"
            type="submit"
            value="Search"
          />
          {searchFlag ? (
            <p
              className="bg-orange-400 text-white p-2 rounded-xl"
              onClick={handleClear}
            >
              Clear
            </p>
          ) : null}
        </div>
      </form>
      {loading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[300px] w-[500px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <TrainAssignmentTable
          data={trainings.filter((inner) => inner.status == "Completed")}
          refreshData={refreshData}
          loading={loading}
          user={user}
          status={"Completed"}
        />
      )}
    </section>
  );
}

export default TrainCompleteComp;
