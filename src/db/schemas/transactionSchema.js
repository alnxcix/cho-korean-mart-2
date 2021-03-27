const transactionSchema = {
  properties: {
    applySpecialDiscount: { type: "boolean" },
    cart: { type: "array" },
    cash: { type: "number" },
    date: { type: "integer" },
    userId: { type: "string" },
    vatRate: { type: "number" },
  },
  type: "object",
};

module.exports = transactionSchema;
