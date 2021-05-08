const transactionSchema = {
  properties: {
    cart: { type: "array" },
    cash: { type: "number" },
    date: { type: "integer" },
    userId: { type: "string" },
    vatRate: { type: "number" },
    //pwd sc
    specialDiscount: { type: "string" },
    subTotal: { type: "number" },
    totalDiscount: { type: "number" },
    totalVAT: { type: "number" },
  },
  type: "object",
};

module.exports = transactionSchema;
