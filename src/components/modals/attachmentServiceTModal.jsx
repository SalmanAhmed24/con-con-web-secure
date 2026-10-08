import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});

import dynamic from "next/dynamic";

const PDFViewerClient = dynamic(() => import("../pdf-viewer/index"), {
  ssr: false, // This is crucial to prevent server-side rendering
});

// Configure PDF.js worker source
function AttachmentServiceTModal({ files, openFlag, closeModal }) {
  // const [modifiedFile, setModifiedFile] = useState("");
  // useEffect(() => {
  //   const customObj = files.map((i) => {
  //     return {
  //       ...i,
  //       mimeType:
  //         i.name.split(".").pop() == "png"
  //           ? "image/png"
  //           : i.name.split(".").pop() == "jpg"
  //           ? "image/jpeg"
  //           : i.name.split(".").pop() == "pdf"
  //           ? "application/pdf"
  //           : "image/jpeg",
  //     };
  //   });
  //   setModifiedFile(customObj);
  // }, [openFlag]);
  const viewPic = (file) => {
    window.open(
      file.fileUrl,
      "Image",
      "width=largeImage.stylewidth,height=largeImage.style.height,resizable=1"
    );
  };
  const viewFile = (file) => {
    window.open(file.fileUrl, "_blank");
  };
  return (
    <Modal
      open={openFlag}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="picModal h-dvh bg-transparent flex flex-col justify-center p-5"
    >
      <div className="outer-wrap bg-white p-5 h-dvh overflow-scroll">
        <div className="flex flex-row justify-end p-5">
          <CloseIcon onClick={closeModal} className="hover:cursor-pointer" />
        </div>
        <h1 className={`${poppins.className} font-semibold text-xl mb-5`}>
          Attachments
        </h1>
        <div className="flex flex-row justify-start gap-3">
          {files &&
            files.map((file, ind) => {
              return (
                <div key={ind} className="flex flex-col justify-start gap-2">
                  {file.type == "image/png" ||
                  file.type == "image/jpg" ||
                  file.type == "image/jpeg" ? (
                    <div>
                      <img
                        src={URL.createObjectURL(file)}
                        className="attach-img"
                        onClick={() => viewPic(file)}
                      />
                      <p className={`${poppins.className} text-md`}>
                        {file.name}
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => viewFile(file)}
                        className="p-2 mb-2 bg-orange-400 text-white font-semibold self-start"
                      >
                        Download
                      </button>
                      <div className="flex flex-col justify-start gap-3 border-[1px] border-[#cfcfcf]">
                        <PDFViewerClient pdfUrl={URL.createObjectURL(file)} />
                        {/* <img
                        src={`/pdf.png`}
                        width={150}
                        height={150}
                        onClick={() => viewFile(file)}
                      /> */}
                        <p className={`${poppins.className} text-md`}>
                          {file.name}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}

export default AttachmentServiceTModal;
