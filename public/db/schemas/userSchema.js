const userSchema = {
  properties: {
    firstName: { type: "string" },
    imgSrc: { type: "string" },
    lastName: { type: "string" },
    password: { type: "string" },
    role: { type: "string" },
    newPass: { type: "boolean" },
  },
  type: "object",
};

module.exports = userSchema;
