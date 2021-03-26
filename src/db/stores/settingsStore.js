const AJV = require("ajv");
const Datastore = require("nedb-promises");
const schema = require("../schemas/settingsSchema");

class SettingsStore {
  constructor() {
    this.schemaValidator = new AJV.default({
      allErrors: true,
      useDefaults: true,
    }).compile(schema);

    this.db = Datastore.create({
      filename: `${process.cwd()}/settings.db`,
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
          vat: data.vat,
        },
      }
    );

  //   delete = (data) => this.db.remove({ _id: data._id });
}

module.exports = new SettingsStore();
