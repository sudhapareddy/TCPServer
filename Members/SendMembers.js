function formatMemberRecord(record) {
  const idStr = String(record.CODE).padStart(4, "0"); // 4-digit code
  const type1 = record.MILKTYPE || " "; // single char milk type
  const type2 = record.COMMISSIONTYPE || " "; // single char commission type
  const nameStr = (record.MEMBERNAME || "").padEnd(20, " "); // member name padded to 20 chars
  const blank = (record.CONTACTNO || "").padEnd(10, " "); // 10 spaces blank
  const status = record.STATUS || " "; // status char

  return `${idStr}${type1}${type2}${nameStr}${blank}${status}`;
}

function sendMemberBatch(socket, deviceState, payload) {
  const cleanedPayload = payload.split("!")[0];

  // Extract deviceId (first 7 chars) and batch string (next 4 chars)
  const deviceId = cleanedPayload.substring(0, 7);
  const batchStr = cleanedPayload.substring(7, 11).trim(); // Trim spaces

  const batchNumber = parseInt(batchStr, 10);

  const records = deviceState.deviceInfo.members || [];

  if (!Array.isArray(records) || records.length === 0) {
    socket.write(`#SCTMEMBER:${socket.deviceId}NO RECORDS!`);
    return;
  }

  const batchSize = 30;
  const totalBatches = Math.ceil(records.length / batchSize);

  if (batchNumber >= totalBatches) {
    socket.write(`#SCTMEMBER:${socket.deviceId}ENDMEMBERS!`);
    return;
  }

  const startIdx = batchNumber * batchSize;
  const endIdx = startIdx + batchSize;
  const batch = records.slice(startIdx, endIdx);

  let formatData = "";

  const responseData = `#SCTMEMBER:${socket.deviceId}${String(
    batchNumber
  ).padStart(4, "0")}`;

  for (const record of batch) {
    const formatted = formatMemberRecord(record);
    console.log(formatted);

    formatData += formatted;
  }
  socket.write(`${responseData}${formatData}!`);
  //console.log(formatData);
}

module.exports = sendMemberBatch;
