import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import logo from "../assets/ChoKoreanMart.jpg";

export const generatePrintable = (products, transaction, users) => {
  let columns = [
    { title: "Product", dataKey: "Product" },
    { title: "Quantity", dataKey: "Quantity" },
    { title: "Unit Price", dataKey: "UnitPrice" },
    { title: "VAT", dataKey: "VAT" },
    { title: "Discount", dataKey: "Discount" },
    { title: "Total", dataKey: "Total" },
  ];
  const getTotal = transaction.cart
    .map((cartItem) =>
      Number(
        (cartItem.price * cartItem.quantity * (100 - cartItem.discount)) / 100
      )
    )
    .reduce((acc, cur) => acc + cur, 0);
  const getTotalDisc = transaction.cart
    .map((cartItem) =>
      Number((cartItem.price * cartItem.quantity * cartItem.discount) / 100)
    )
    .reduce((acc, cur) => acc + cur, 0);
  const formatDigits = (num) =>
    num
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  let doc = new jsPDF("portrait", "px", "a4", "false");
  // doc.text(30, 60, "logo here");
  doc.addImage(logo, "JPG", 30, 15, 100, 100);
  doc.setFontSize(11);
  doc.setFont("Helvetica", "bold");
  doc.text(350, 40, "CHO Korean Mart");
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(268, 60, "967 Del Monte Ave corner San Pedro Bautista,");
  doc.text(340, 70, "S.D.M., Q.C, Philippines");
  doc.text(375, 80, "09774400017");
  doc.text(312, 100, "facebook.com/chokoreanmart.ph");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor("#900");
  doc.text(30, 150, `Transaction #: ${transaction._id}`);

  doc.setFont("Helvetica", "normal");
  doc.setTextColor("#000000");
  doc.setFontSize(11);
  doc.setFont("Helvetica", "bold");
  doc.text(30, 175, `Date: `);
  doc.text(100, 175, `Salesperson: `);
  doc.setFont("Helvetica", "normal");
  doc.text(30, 185, `${moment(transaction.date).format("ll")}`);
  doc.text(
    100,
    185,
    `${
      users.find((user) => user._id === transaction.userId) === undefined
        ? `Deleted User (${transaction.userId})`
        : `${
            users.find((user) => user._id === transaction.userId).firstName
          } (${transaction.userId})`
    }`
  );
  let rows = transaction.cart.map((cartItem) => ({
    Product:
      products.find((product) => product._id === cartItem._id) === undefined
        ? `Deleted Item (${cartItem._id})`
        : products.find((product) => product._id === cartItem._id).name,
    Quantity: cartItem.quantity,
    UnitPrice: `Php ${formatDigits(
      (cartItem.price / (100 + transaction.vatRate)) * 100
    )}`,
    VAT: `${transaction.vatRate}%`,
    Discount: `${cartItem.discount}%`,
    Total: `Php ${formatDigits(
      (cartItem.price * cartItem.quantity * (100 - cartItem.discount)) / 100
    )}`,
  }));
  doc.autoTable(columns, rows, {
    startY: 205,
    theme: "striped",
    headStyles: { fillColor: "#900" },
  });
  // doc.autoTable(columns, rows, {
  //   // startY: 205,
  //   theme: "striped",
  //   headStyles: { fillColor: "#900" },
  // });
  doc.autoTable({
    theme: "striped",
    body: [
      [
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t", //bakdshfghwbsd
        "Subtotal: ",
        `Php ${formatDigits((getTotal / (100 + transaction.vatRate)) * 100)}`,
      ],
      [
        "",
        `Total VAT (${transaction.vatRate}%): `,
        `Php ${formatDigits(
          getTotal - (getTotal / (100 + transaction.vatRate)) * 100
        )}`,
      ],
      ["", `Total Discount: `, `Php ${formatDigits(getTotalDisc)}`],
      ["", `Grand Total: `, `Php ${formatDigits(getTotal)}`],
      ["", `Cash: `, `Php ${formatDigits(transaction.cash)}`],
      ["", `Change: `, `Php ${formatDigits(transaction.cash - getTotal)}`],
    ],
  });
  doc.save(`Transaction ${transaction._id}.pdf`);
};
