import { useEffect } from "react";
import Chart from "chart.js";
import moment from "moment";
import { formatDigits } from "../utils/formatDigits";

const ChartComponent = () => {
  useEffect(
    () =>
      window
        .require("electron")
        .remote.getGlobal("transactions")
        .readAll()
        .then(
          (transactions) =>
            new Chart(document.getElementById("myChart").getContext("2d"), {
              type: "line",
              responsive: true,
              maintainAspectRatio: false,
              data: {
                labels: [
                  ...[6, 5, 4, 3, 2, 1].map((el) =>
                    moment().subtract(el, "d").format("MMM. DD")
                  ),
                  [`${moment().format("MMM. DD")}`, "TODAY"],
                ],
                datasets: [
                  {
                    backgroundColor: Array(8).fill("rgba(153, 0, 0, 0.5)"),
                    borderColor: Array(8).fill("rgba(0, 0, 0, 1)"),
                    borderWidth: 0.5,
                    data: [6, 5, 4, 3, 2, 1, 0].map((el) =>
                      transactions
                        .filter((transaction) =>
                          moment(transaction.date).isSame(
                            moment().subtract(el, "d"),
                            "d"
                          )
                        )
                        .map((transaction) =>
                          transaction.cart
                            .map(
                              (cartItem) =>
                                (cartItem.price -
                                  (cartItem.price / 100) * cartItem.discount) *
                                cartItem.quantity
                            )
                            .reduce((acc, cur) => acc + cur, 0)
                        )
                        .reduce((acc, cur) => acc + cur, 0)
                    ),
                    label: "Total Sales",
                  },
                ],
              },
              options: {
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        callback: (tick) =>
                          `??? ${formatDigits(tick.toFixed(2))}`,
                      },
                    },
                  ],
                },
                tooltips: {
                  callbacks: {
                    label: (label) =>
                      `??? ${formatDigits(label.yLabel.toFixed(2))}`,
                  },
                },
              },
            })
        ),
    []
  );
  return <canvas height="110" id="myChart" />;
};

export default ChartComponent;
