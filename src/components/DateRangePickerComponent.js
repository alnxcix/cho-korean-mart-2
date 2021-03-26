import { useEffect } from "react";
import moment from "moment";
import "daterangepicker";
import "daterangepicker/daterangepicker.css";
import $ from "jquery";

const DateRangePickerComponent = (props) => {
  let { setDates } = props;
  useEffect(
    () =>
      $('input[name="dates"]').daterangepicker(
        {
          startDate: moment().startOf("d"),
          endDate: moment().endOf("d"),
          locale: { format: "MMMM DD, yyyy" },
          ranges: {
            Today: [moment().startOf("d"), moment().endOf("d")],
            Yesterday: [
              moment().subtract(1, "days").startOf("d"),
              moment().subtract(1, "days").endOf("d"),
            ],
            "Last 7 Days": [
              moment().subtract(6, "d").startOf("d"),
              moment().endOf("d"),
            ],
            "Last 30 Days": [
              moment().subtract(29, "d").startOf("d"),
              moment().endOf("d"),
            ],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment().subtract(1, "month").startOf("month"),
              moment().subtract(1, "month").endOf("month"),
            ],
          },
        },
        (start, end) => setDates(start, end)
      ),
    []
  );
  return <input className="form-control" name="dates" />;
};

export default DateRangePickerComponent;
