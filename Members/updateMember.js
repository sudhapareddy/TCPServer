const DeviceModel = require("../models/device");

async function updateMemberRecord(deviceId, codeToMatch, newRecord) {
  codeToMatch = codeToMatch.toString().replace(/^0+/, "");

  try {
    const updateFields = {};
    const fields = [
      "MILKTYPE",
      "COMMISSIONTYPE",
      "MEMBERNAME",
      "CONTACTNO",
      "STATUS",
    ];

    fields.forEach((field) => {
      if (newRecord[field] !== undefined) {
        let val = newRecord[field];
        if (typeof val === "string") val = val.trim();
        updateFields[`members.$.${field}`] = val;
      }
    });

    const updatedResult = await DeviceModel.findOneAndUpdate(
      { deviceid: deviceId, "members.CODE": codeToMatch },
      { $set: updateFields },
      { new: true }
    );

    if (updatedResult) {
      const updatedMember = updatedResult.members.find(
        (m) => m.CODE.toString().replace(/^0+/, "") === codeToMatch
      );
      console.log("✅ Updated Member:", updatedMember);
      return updatedResult;
    } else {
      console.log("❌ No matching member found for update");
      return null;
    }
  } catch (err) {
    console.error("❌ Error updating member record:", err);
    return null;
  }
}

async function editMemberRecord(message, socket) {
  const index = message.indexOf(`${socket.deviceId}`);

  if (index !== -1) {
    const code = message.substring(index + 7, index + 11);
    const milkType = message[index + 11];
    const commType = message[index + 12];
    const memberName = message.substring(index + 13, index + 33).trim();
    const contactNo = message.substring(index + 33, index + 43).trim();
    const status = message[index + 43];

    const updatedRecord = {
      MILKTYPE: milkType,
      COMMISSIONTYPE: commType,
      MEMBERNAME: memberName,
      CONTACTNO: contactNo,
      STATUS: status,
    };

    const updated = await updateMemberRecord(
      socket.deviceId,
      code,
      updatedRecord
    );

    if (updated) {
      console.log("✅ Record updated successfully\n");
      socket.write(`#SCTEDITMEMBER:${socket.deviceId}${code}!`);
    } else {
      console.log("❌ No record found to update!\n");
      socket.write("#No record found to update!");
    }
  } else {
    console.log("⚠️ Device ID not found in message.\n");
  }
}

module.exports = editMemberRecord;
