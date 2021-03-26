const AJV = require("ajv");
const Datastore = require("nedb-promises");
const schema = require("../schemas/stockHistoryEntrySchema");

class StockHistoryEntryStore {
  constructor() {
    this.schemaValidator = new AJV.default({
      allErrors: true,
      useDefaults: true,
    }).compile(schema);

    this.db = Datastore.create({
      filename: `${process.cwd()}/stockHistoryEntries.db`,
      timestampData: true,
    });
  }

  validate = (data) => this.schemaValidator(data);

  create = (data) => (this.validate(data) ? this.db.insert(data) : null);

  readAll = () => this.db.find();

  delete = (data) => this.db.remove({ _id: data._id });
}

module.exports = new StockHistoryEntryStore();
