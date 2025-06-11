const getMembers = require("../Members/getMembers");

async function getMemberCount(socket, deviceState) {
  try {
    //deviceState.memberData = await getMembers(socket.deviceId);
    const totalCount = deviceState.deviceInfo.members.length;
    const records = deviceState.deviceInfo.members;
    //console.log(totalCount); //, records);
    if (totalCount) {
      //const totalCount = deviceState.deviceInfo.members.length;
      //const records = deviceState.deviceInfo.members;

      if (!Array.isArray(records) || records.length === 0) {
        return socket.write(`#SCTMEMBERCOUNT:${socket.deviceId}NO RECORDS!\n`);
      }

      // Respond to IoT device with total count
      const countMsg = `#SCTMEMBERCOUNT:${socket.deviceId}${String(
        totalCount
      ).padStart(4, "0")}!`;

      return socket.write(countMsg);
    }

    return socket.write(`#SCTMEMBERCOUNT:${socket.deviceId}NO RECORDS!\n`);
  } catch (err) {
    console.error("❌ Error fetching member count:", err);
    socket.write(`#SCTMEMBERCOUNT:${socket.deviceId}ERROR!\n`);
  }
}

module.exports = getMemberCount;
