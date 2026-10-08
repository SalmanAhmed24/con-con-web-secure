"use client";
import Task from "@/components/task";
import useStore from "@/utils/store/store";
import React, { useState, useEffect } from "react";

function Notification() {
  const { user } = useStore();
  return (
    <section>
      <main className="flex flex-row justify-center pt-4">
        <h1 className="font-semibold text-[48px]">Coming Soon</h1>
      </main>
    </section>
  );
}

export default Notification;
