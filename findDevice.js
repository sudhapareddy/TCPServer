const DeviceModel = require("./models/device");

async function getRegisteredDevice(deviceId) {
  console.log("Device Id:", deviceId);
  try {
    // const device = await DeviceModel.findOne(
    //   { deviceid: deviceId },
    //   { deviceid: 1, status: 1, dairyCode: 1, _id: 0 }
    // );
    const device = await DeviceModel.findOne({ deviceid: deviceId });

    // console.log("device details:", device.rateChartIds);
    // console.log("device details:", device.effectiveDates);
    // console.log("device details:", device.members);

    return device; // Returns full document or null
  } catch (error) {
    console.error("Error finding device:", error);
    return null;
  }
}

module.exports = getRegisteredDevice;
