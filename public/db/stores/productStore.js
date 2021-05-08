const AJV = require("ajv");
const Datastore = require("nedb-promises");
const schema = require("../schemas/productSchema");

class ProductStore {
  constructor() {
    this.schemaValidator = new AJV.default({
      allErrors: true,
      useDefaults: true,
    }).compile(schema);

    this.db = Datastore.create({
      filename: `${process.cwd()}/products.db`,
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
          category: data.category,
          discount: data.discount,
          imgSrc: data.imgSrc,
          name: data.name,
          price: data.price,
          stockQuantity: data.stockQuantity,
          criticalLevel: data.criticalLevel,
          //pwd sc vat
          isPWDItem: data.isPWDItem,
          isSCItem: data.isSCItem,
          isWithoutVat: data.isWithoutVat,
        },
      }
    );

  delete = (data) => this.db.remove({ _id: data._id });
}

module.exports = new ProductStore();
