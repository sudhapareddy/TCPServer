function sendSnfRate(command, message, socket, deviceState) {
  const snfType = command.includes("BUF") ? "snfBufRecord" : "snfCowRecord";

  // Extract FAT value after device ID (e.g., SCT000304.4!)
  const fatMatch = message.match(
    new RegExp(`${socket.deviceId}(0*\\d+\\.\\d+)!`)
  );

  if (!fatMatch) {
    socket.write("#Invalid FAT format!\n");
    return;
  }

  const fatValue = parseFloat(fatMatch[1]).toFixed(1); // Normalize FAT to 1 decimal
  const snf = deviceState.fatToSnfMap?.[fatValue] || fatValue; // Use SNF mapping if present

  const rate = deviceState.fatsnfRateMapping[fatValue];
  if (!rate) {
    socket.write("#Rate value not found!\n");
    return;
  }

  const response = `#${command.slice(1)}:${socket.deviceId}${fatValue.padStart(
    4,
    "0"
  )}${rate}!\n`;
  console.log("📤 SNF Rate Response:", response);

  socket.write(response);

  // Increment SNF value (for tracking only, not part of response)
  deviceState[snfType] = (parseFloat(deviceState[snfType]) + 0.1)
    .toFixed(1)
    .padStart(4, "0");
}

module.exports = sendSnfRate;
