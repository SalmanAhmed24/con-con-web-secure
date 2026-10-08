import { Poppins } from "next/font/google";
import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { heicTo } from "heic-to";

const poppins = Poppins({
  weight: ["300", "600", "700"],
  subsets: ["latin"],
});

import dynamic from "next/dynamic";

const PDFViewerClient = dynamic(() => import("../pdf-viewer/index"), {
  ssr: false, // This is crucial to prevent server-side rendering
});

// Configure PDF.js worker source
function AttachmentModal({ files, openFlag, closeModal }) {
  const [modifiedFile, setModifiedFile] = useState("");
  useEffect(() => {
    const customObj = files.map((i) => {
      return {
        ...i,
        mimeType:
          i.filename.split(".").pop() == "png"
            ? "image/png"
            : i.filename.split(".").pop() == "jpg"
            ? "image/jpeg"
            : i.filename.split(".").pop() == "pdf"
            ? "application/pdf"
            : i.filename.split(".").pop() == "heic"
            ? "image/heic"
            : "image/jpeg",
      };
    });

    setModifiedFile(customObj);
  }, [openFlag]);
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
  async function getHeicBlobFromUrl(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error fetching HEIC file:", error);
      return null;
    }
  }

  const conversionHEICToPng = (url) => {
    getHeicBlobFromUrl(url).then((heicBlob) => {
      if (heicBlob) {
        const fileBlob = heicBlob;

        heicTo({ blob: fileBlob, type: "image/png" })
          .then((pngBlob) => {
            // pngBlob is a Blob containing the PNG image
            const img = document.getElementsByClassName("heic");
            for (let index = 0; index < img.length; index++) {
              // const element = array[index];
              img[index].setAttribute("src", URL.createObjectURL(pngBlob));
            }
            // img[0].setAttribute("src", URL.createObjectURL(pngBlob));
          })
          .catch((error) => {
            console.error("Error converting HEIC:", error);
          });
      } else {
        console.log("Failed to get HEIC Blob.");
      }
    });
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
          {modifiedFile &&
            modifiedFile.map((file, ind) => {
              return (
                <div key={ind} className="flex flex-col justify-start gap-2">
                  {file.mimeType == "image/heic" ? (
                    <div className="w-[200px]">
                      <img
                        className="heic"
                        src={conversionHEICToPng(file.fileUrl)}
                      />
                      <p className={`${poppins.className} text-md`}>
                        {file.filename}
                      </p>
                    </div>
                  ) : file.mimeType == "image/png" ||
                    file.mimeType == "image/jpg" ||
                    file.mimeType == "image/jpeg" ? (
                    <div className="w-[200px]">
                      <img
                        src={file.fileUrl}
                        className="attach-img"
                        onClick={() => viewPic(file)}
                      />
                      <p className={`${poppins.className} text-md`}>
                        {file.filename}
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
                        <PDFViewerClient pdfUrl={file.fileUrl} />
                        {/* <img
                        src={`/pdf.png`}
                        width={150}
                        height={150}
                        onClick={() => viewFile(file)}
                      /> */}
                        <p className={`${poppins.className} text-md`}>
                          {file.fileName}
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

export default AttachmentModal;
