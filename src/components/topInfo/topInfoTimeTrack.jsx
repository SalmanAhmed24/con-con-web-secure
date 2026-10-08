import moment from "moment";

function TopInfoTimeTrack({ item }) {
  function tConvert(time) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }
  return (
    <div className="flex flex-row gap-20 pb-5">
      <div className="w-1/3 flex flex-col gap-5">
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Name</label>
          <p className="text-end">{item.fullname}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Job</label>
          <p className="text-end">{item.job}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Start Date</label>
          <p className="text-end">
            {moment(item.startDate).format("MM-DD-YYYY")}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">End Date</label>
          <p className="text-end">
            {moment(item.endDate).format("MM-DD-YYYY")}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Shift Start</label>
          <p className="text-end"> {tConvert(item.shiftStartTime)}</p>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-5">
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Shift End</label>
          <p className="text-end">{tConvert(item.shiftEndTime)}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Current Date</label>
          <p className="text-end">{moment(item.date).format("MM-DD-YYYY")}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Day</label>
          <p className="text-end">{item.dayName}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">CheckedIn</label>
          <p className="text-end">
            {item.checkedIn !== "" ? tConvert(item.checkedIn) : "Not Entered"}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">
            Lunch Start Time
          </label>
          <p className="text-end">
            {item.lunchTimeStart !== ""
              ? tConvert(item.lunchTimeStart)
              : "Not Entered"}
          </p>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-5">
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">
            Lunch End Time
          </label>
          <p className="text-end">
            {item.lunchTimeStart !== ""
              ? tConvert(item.lunchTimeEnd)
              : "Not Entered"}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Checked Out</label>
          <p className="text-end">
            {item.checkedOut !== "" ? tConvert(item.checkedOut) : "Not Entered"}
          </p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Notes</label>
          <p className="text-end">{item.notes}</p>
        </div>
        <div className="w-100 flex flex-row justify-between">
          <label className="font-semibold text-orange-400">Spectrum</label>
          <p className="text-end">
            {item.spectrum == false ? "false" : "true"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopInfoTimeTrack;
