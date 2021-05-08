const AJV = require("ajv");
const Datastore = require("nedb-promises");
const schema = require("../schemas/transactionSchema");

class TransactionStore {
  constructor() {
    this.schemaValidator = new AJV.default({
      allErrors: true,
      useDefaults: true,
    }).compile(schema);

    this.db = Datastore.create({
      filename: `${process.cwd()}/transactions.db`,
      timestampData: true,
    });
  }

  validate = (data) => this.schemaValidator(data);

  create = (data) => (this.validate(data) ? this.db.insert(data) : null);

  read = (data) => this.db.findOne({ _id: data });

  readAll = () => this.db.find();

  update = (data) =>
    this.db.update(
      { _id: data._id },
      {
        $set: {
          cart: data.cart,
          cash: data.cash,
          date: data.date,
          userId: data.userId,
          //pwd sc
          specialDiscount: data.specialDiscount,
          subTotal: data.subTotal,
          totalDiscount: data.totalDiscount,
          totalVAT: data.totalVAT,
        },
      }
    );

  delete = (data) => this.db.remove({ _id: data._id });
}

module.exports = new TransactionStore();
