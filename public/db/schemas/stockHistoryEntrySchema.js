const stockHistoryEntrySchema = {
  properties: {
    date: { type: "integer" },
    productId: { type: "string" },
    inOut: { type: "string" },
    quantity: { type: "integer" },
    userId: { type: "string" },
  },
  type: "object",
};

module.exports = stockHistoryEntrySchema;
