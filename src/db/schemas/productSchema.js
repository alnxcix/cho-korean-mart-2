const productSchema = {
  properties: {
    category: { type: "string" },
    discount: { type: "number" },
    imgSrc: { type: "string" },
    name: { type: "string" },
    price: { type: "number" },
    stockQuantity: { type: "integer" },
    criticalLevel: { type: "integer" },
  },
  type: "object",
};

module.exports = productSchema;
