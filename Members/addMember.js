const DeviceModel = require("../models/device");

async function addMember(message, socket) {
  const index = message.indexOf(`${socket.deviceId}`);

  if (index !== -1 && message.length >= index + 44) {
    const code = message.substring(index + 7, index + 11);
    const milkType = message[index + 11];
    const commType = message[index + 12];
    const memberName = message.substring(index + 13, index + 33).trim();
    const contactNo = message.substring(index + 33, index + 43).trim();
    const status = message[index + 43];

    const newMember = {
      CODE: code,
      MILKTYPE: milkType,
      COMMISSIONTYPE: commType,
      MEMBERNAME: memberName,
      CONTACTNO: contactNo,
      STATUS: status,
      createdOn: new Date(),
    };

    try {
      const result = await DeviceModel.updateOne(
        { deviceid: socket.deviceId },
        { $push: { members: newMember } }
      );

      if (result.modifiedCount === 1) {
        socket.write(`#SCTADDMEMBER:${socket.deviceId}${code}!`);
        console.log("✅ Member added to device:", socket.deviceId);
      } else {
        socket.write("#Device not found!\n");
        console.warn("⚠️ Device not found:", socket.deviceId);
      }
    } catch (error) {
      socket.write("#Error saving member!\n");
      console.error("❌ Error adding member:", error);
    }
  } else {
    socket.write("#Invalid message format or length!\n");
  }
}

module.exports = addMember;
