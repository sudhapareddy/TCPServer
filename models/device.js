const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    FAT: Number,
    SNF: Number, // Optional: if you're using SNF in the rate table
    RATE: Number,
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    CODE: Number,
    MILKTYPE: String,
    COMMISSIONTYPE: String,
    MEMBERNAME: String,
    CONTACTNO: String,
    STATUS: String,
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const DeviceSchema = new mongoose.Schema(
  {
    deviceid: {
      type: String,
      required: true,
      unique: true,
    },
    dairyCode: String,
    status: String,
    rateChartIds: Object, // Can be refined later
    effectiveDates: Object, // Can be refined later
    serverSettings: Object, // Can be refined later
    members: [memberSchema],
    fatCowTable: [rateSchema],
    fatBufTable: [rateSchema],
  },
  { strict: false, collection: "devicesList" }
);

module.exports = mongoose.model("DeviceModel", DeviceSchema);
