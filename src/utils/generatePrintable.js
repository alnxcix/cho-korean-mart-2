import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

export const generatePrintable = (products, transaction, users) => {
  let columns = [
    { title: "Product", dataKey: "Product" },
    { title: "Quantity", dataKey: "Quantity" },
    { title: "Unit Price", dataKey: "UnitPrice" },
    { title: "VAT", dataKey: "VAT" },
    { title: "Discount", dataKey: "Discount" },
    { title: "Total", dataKey: "Total" },
  ];
  let doc = new jsPDF("portrait", "px", "a4", "false");
  doc.text(30, 60, "logo here");
  //doc.addImage(imageData, format, x, y, width, height, alias, compression, rotation)
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
        : users.find((user) => user._id === transaction.userId).firstName
    }`
  );
  let rows = transaction.cart.map((cartItem) => ({
    Product:
      products.find((product) => product._id === cartItem._id) === undefined
        ? `Deleted Item (${cartItem._id})`
        : products.find((product) => product._id === cartItem._id).name,
    Quantity: cartItem.quantity,
    UnitPrice: `Php ${cartItem.price.toFixed(2)}`,
    VAT: `${transaction.vatRate}%`,
    Discount: `${cartItem.discount}%`,
    Total: `Php ${(cartItem.price * cartItem.quantity).toFixed(2)}`,
  }));
  doc.autoTable(columns, rows, {
    startY: 205,
    theme: "striped",
    headStyles: { fillColor: "#900" },
    // head: [["Product", "Quantity", "Unit Price", "VAT", "Discount", "Total"]],
    // body: [
    //   [1, 2, 3, 4],
    //   [trans.vat, trans.date],
    // ],
    // ...
  });
  doc.save(`Transaction ${transaction._id}.pdf`);
};
