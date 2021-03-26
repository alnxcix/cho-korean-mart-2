const AJV = require("ajv");
const Datastore = require("nedb-promises");
const schema = require("../schemas/userSchema");

class UserStore {
  constructor() {
    this.schemaValidator = new AJV.default({
      allErrors: true,
      useDefaults: true,
    }).compile(schema);

    this.db = Datastore.create({
      filename: `${process.cwd()}/users.db`,
      timestampData: true,
    });
  }

  validate = (data) => this.schemaValidator(data);

  create = (data) => (this.validate(data) ? this.db.insert(data) : null);

  auth = (_id, password) => this.db.findOne({ _id: _id, password: password });

  read = (data) => this.db.findOne({ _id: data });

  readAll = () => this.db.find();

  update = (data) =>
    this.db.update(
      { _id: data._id },
      {
        $set: {
          firstName: data.firstName,
          imgSrc: data.imgSrc,
          lastName: data.lastName,
          password: data.password,
          role: data.role,
        },
      }
    );

  delete = (data) => this.db.remove({ _id: data._id });
}

module.exports = new UserStore();
