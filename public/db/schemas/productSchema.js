const productSchema = {
  properties: {
    category: { type: "string" },
    discount: { type: "number" },
    imgSrc: { type: "string" },
    name: { type: "string" },
    price: { type: "number" },
    stockQuantity: { type: "integer" },
    criticalLevel: { type: "integer" },
    //pwd sc vat
    isPWDItem: { type: "boolean" },
    isSCItem: { type: "boolean" },
    isWithVat: { type: "boolean" },
  },
  type: "object",
};

module.exports = productSchema;
