import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiPath } from "@/utils/routes";
import { Skeleton } from "@/components/ui/skeleton";

const poppins = Poppins({
  weight: ["300", "400", "600", "800"],
  style: ["normal"],
  subsets: ["latin"],
});
import { pusherClient } from "@/utils/pusher";
import useStore from "@/utils/store/store";
import ClientTable from "../tables/clientTable";
import ClientDrawer from "../drawers/clientDrawer";
import Swal from "sweetalert2";
function Clients() {
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allClients, setAllClients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const currentUser = useStore((state) => state.user);
  const [clientFlag, setClientFlag] = useState(false);
  const [clientLabel, setClientLabel] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (
      currentUser !== undefined &&
      currentUser !== null &&
      currentUser.fullname !== undefined
    ) {
      pusherClient.subscribe(currentUser.id);
      const handleUpdatedChat = (updatedChat) => {
        // setAllChats((allChats) =>
        //   allChats.map((chat) => {
        //     if (chat._id === updatedChat.id) {
        //       return { ...chat, messages: updatedChat.messages };
        //     } else {
        //       return chat;
        //     }
        //   })
        // );
      };
      pusherClient.bind("update-chat", handleUpdatedChat);
      return () => {
        if (currentUser !== undefined && currentUser !== null) {
          pusherClient.unsubscribe(currentUser.id);
          pusherClient.unbind("update-chat", handleUpdatedChat);
        }
      };
    } else {
      router.push("/login");
    }
  }, [currentUser]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/clients/?page=${page}&pageSize=${pageSize}`)
      .then((res) => {
        setAllClients(res.data.clients);
        setTotalCount(res.data.totalCount);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  const handleCloseDrawer = () => {
    setDrawer(!drawer);
  };
  const getClients = (pageNew) => {
    setLoading(true);
    axios
      .get(
        `${apiPath.prodPath}/api/clients/?page=${
          pageNew == 0 ? 1 : pageNew
        }&pageSize=${pageSize}`,
      )
      .then((res) => {
        setAllClients(res.data.clients);
        setTotalCount(res.data.totalCount);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSearch = (e) => {
    setLoading(true);
    e.preventDefault();
    if (search == "") {
      return false;
    }
    axios
      .get(`${apiPath.prodPath}/api/clients/${search}`)
      .then((res) => {
        setAllClients(res.data.clients);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const addClient = (data) => {
    axios
      .post(`${apiPath.prodPath}/api/clients/addClient`, data)
      .then((res) => {
        handleCloseDrawer();
        refreshData();
      })
      .catch((err) => console.log(err));
  };
  const refreshData = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/clients/?page=${1}&pageSize=${20}`)
      .then((res) => {
        setAllClients(res.data.clients);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleChangePage = (event, newPage) => {
    if (newPage == 0) {
      setPage(1);
    } else {
      setPage(newPage + 1);
    }
    getClients(newPage + 1);
  };
  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
  };
  const handleClear = () => {
    setLoading(true);
    axios
      .get(`${apiPath.prodPath}/api/clients/?page=${1}&pageSize=${20}`)
      .then((res) => {
        setAllClients(res.data.clients);
        setLoading(false);
        setSearch("");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const handleSorting = (clientSortLabel, clientSortFlag) => {
    if (clientSortLabel == "Customer Code") {
      setClientLabel("Customer Code");
      const sortedData =
        clientSortFlag == false
          ? allClients.sort((a, b) =>
              a.customerCode.localeCompare(b.customerCode),
            )
          : allClients.sort((a, b) =>
              b.customerCode.localeCompare(a.customerCode),
            );
      setAllClients(sortedData);
    }
    if (clientSortLabel == "Customer Name") {
      setClientLabel("Customer Name");
      const sortedData =
        clientSortFlag == false
          ? allClients.sort((a, b) =>
              a.customerName.localeCompare(b.customerName),
            )
          : allClients.sort((a, b) =>
              b.customerName.localeCompare(a.customerName),
            );
      setAllClients(sortedData);
    }
    if (clientSortLabel == "Customer Type") {
      setClientLabel("Customer Type");
      const sortedData =
        clientSortFlag == false
          ? allClients.sort((a, b) =>
              a.customerType.localeCompare(b.customerType),
            )
          : allClients.sort((a, b) =>
              b.customerType.localeCompare(a.customerType),
            );
      setAllClients(sortedData);
    }
    if (clientSortLabel == "Alpha Code") {
      setClientLabel("Alpha Code");
      const sortedData =
        clientSortFlag == false
          ? allClients.sort((a, b) => a.alphaCode.localeCompare(b.alphaCode))
          : allClients.sort((a, b) => b.alphaCode.localeCompare(a.alphaCode));
      setAllClients(sortedData);
    }

    setClientFlag(!clientSortFlag);
  };
  const handleActiveSyncTo = (e, status) => {
    e.preventDefault();
    axios
      .post(`${apiPath.prodPath}/api/customerSheets/addDataToSheet/`, {
        status: status,
      })
      .then((res) => {
        if (res.data.error) {
          Swal.fire({
            icon: "error",
            text: "Unable to Sync the data",
          });
        } else {
          Swal.fire({
            icon: "success",
            text: "Synced Successfully",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: "Unable to Sync the data",
        });
      });
  };
  return (
    <section className="client-wrap">
      <div className="flex flex-row justify-end gap-4 pb-5">
        <button
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
          onClick={(e) => handleActiveSyncTo(e, "Active")}
        >
          Sync Active Clients
        </button>
        <button
          className="p-2 font-medium bg-orange-400 rounded-xl text-white"
          onClick={(e) => handleActiveSyncTo(e, "Inactive")}
        >
          Sync In-active Clients
        </button>
      </div>
      <section className="inner-client">
        <div className="add-btn-wrap">
          <h2
            className={`${poppins.className} font-semibold text-2xl pt-2 pb-2`}
          >
            Clients
          </h2>
        </div>
        <div className="flex flex-row justify-between pb-3">
          <form onSubmit={handleSearch} className="w-3/5 flex flex-row">
            <input
              className="p-2 mt-3 w-2/3 cus-filter-inp"
              type="text"
              placeholder="Search by Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              className="p-2 mt-3 ml-2 bg-orange-400 cus-search-btn"
              type="submit"
              value={"Search"}
            />
            {search == "" ? null : (
              <p
                onClick={handleClear}
                className={`${poppins.className} clear-btn`}
                style={{ color: "red" }}
              >
                Clear
              </p>
            )}
          </form>
          <button
            onClick={() => setDrawer(true)}
            className="p-2 font-medium bg-orange-400 rounded-xl text-white"
          >
            Add Client
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-[500px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <section className="table-wrap">
            <ClientTable
              refreshData={refreshData}
              allClients={allClients}
              loading={false}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              clientFlag={clientFlag}
              clientLabel={clientLabel}
              handleSort={(sortLabel, sortFlag) =>
                handleSorting(sortLabel, sortFlag)
              }
            />
          </section>
        )}
      </section>
      <ClientDrawer
        addClient={addClient}
        open={drawer}
        onClose={handleCloseDrawer}
      />
    </section>
  );
}

export default Clients;
