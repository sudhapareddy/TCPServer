const mongoose = require("mongoose");

const dairySchema = new mongoose.Schema(
  {
    dairyCode: String,
    // other fields
  },
  { strict: false, collection: "dairies" }
);

module.exports = mongoose.model("DairyModel", dairySchema);
