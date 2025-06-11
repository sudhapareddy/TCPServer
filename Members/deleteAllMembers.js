const DeviceModel = require("../models/device");

async function deleteAllMemberRecords(socket) {
  try {
    // Clear the 'members' array for the device document
    const result = await DeviceModel.updateOne(
      { deviceid: socket.deviceId },
      { $set: { members: [] } }
    );

    if (result.modifiedCount === 1) {
      console.log("✅ All member records deleted successfully.");
      socket.write(`#SCTDELETEALL:${socket.deviceId}!`);
    } else {
      console.log("⚠️ Device not found or no members to delete.");
      socket.write(`#SCTDELETEALL:${socket.deviceId}NO MEMBERS FOUND!`);
    }
  } catch (err) {
    console.error("❌ Error deleting members:", err.message);
    socket.write("#Error deleting members!\n");
  }
}

module.exports = deleteAllMemberRecords;
