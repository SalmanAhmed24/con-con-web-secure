import moment from "moment";
function ToolTopInfo({ item }) {
  return (
    <div className="flex flex-row gap-20">
      <div className="w-1/3 flex flex-col gap-5">
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Tool#</label>
          <p className="text-end">{item.toolNumber}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Sub Category</label>
          <p className="text-end">{item.subCategory}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">
            Tool Description
          </label>
          <p className="text-end">{item.toolDescription}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Entered By</label>
          <p className="text-end">{item.employee}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">
            Last Purchase Price
          </label>
          <p className="text-end">${item.lastPurchasePrice}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">
            Tech Assigned To
          </label>
          <p className="text-end">{item.techAssigned}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Brand</label>
          <p className="text-end">{item.brand}</p>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-5">
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Category</label>
          <p className="text-end">{item.category}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Location</label>
          <p className="text-end">{item.location}</p>
        </div>

        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Project</label>
          <p className="text-end">
            {item.job == undefined || item.job == "" ? "N/A" : item.job}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Vehicle</label>
          <p className="text-end">{item.vehicle}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Purchase Date</label>
          <p className="text-end">
            {item.purchaseDate == "" || item.purchaseDate == undefined
              ? "N/A"
              : moment(item.purchaseDate).format("MM/DD/YYYY")}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Warranty Date</label>
          <p className="text-end">
            {item.warrantyExpDate == "" || item.warrantyExpDate == undefined
              ? "N/A"
              : moment(item.warrantyExpDate).format("MM/DD/YYYY")}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Serial #</label>
          <p className="text-end">{item.serial}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Checked Out</label>
          <p className="text-end">{item.checkedOut}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Date</label>
          <p className="text-end">
            {moment(item.toolTrackDate).format("MM-DD-YYYY")}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Time</label>
          <p className="text-end">{item.toolTrackTime}</p>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-5">
        <div className="flex flex-row gap-4">
          {item.picture.length ? (
            item.picture.map((i) => {
              return (
                <div
                  key={i.filename}
                  className="flex flex-col w-[200px] shadow-md"
                >
                  <img
                    className="w-full h-full"
                    src={i.fileUrl}
                    alt="Tool Picture"
                  />
                </div>
              );
            })
          ) : (
            <p>No Image</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToolTopInfo;
