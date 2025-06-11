const mongoose = require("mongoose");
const Device = require("../models/device"); // assuming this contains fatCowTable, fatBufTable

async function sendFatAndRateValues(command, message, socket, deviceState) {
  const milkType = command.includes("BUF") ? "FATBUF" : "FATCOW";

  let fatTable, fatTableId, fatEffectiveDate;

  if (milkType === "FATBUF") {
    if (deviceState.deviceInfo.isDeviceRateTable.fatBufTable === true) {
      fatTable = deviceState.deviceInfo.fatBufTable;
      console.log("Device Fat Buf Table");
    } else {
      fatTable = deviceState.dairyInfo.fatBufTable;
      console.log("Dairy Fat Buf Table");
    }

    fatTableId = deviceState.deviceInfo.rateChartIds?.fatBufId;
    fatEffectiveDate =
      deviceState.deviceInfo.effectiveDates?.fatBufEffectiveDate;
  } else if (milkType === "FATCOW") {
    if (deviceState.deviceInfo.isDeviceRateTable.fatCowTable === true) {
      fatTable = deviceState.deviceInfo.fatCowTable;
      console.log("Device Fat COw Table");
    } else {
      fatTable = deviceState.dairyInfo.fatCowTable;
      console.log("Dairy Fat Cow Table");
    }

    fatTableId = deviceState.deviceInfo.rateChartIds?.fatCowId;
    fatEffectiveDate =
      deviceState.deviceInfo.effectiveDates?.fatCowEffectiveDate;
  }

  // Check if already sent
  if (message === `${command}:${socket.deviceId}${fatTableId}!`) {
    return socket.write("#NO NEW RATE CHART AVAILABLE!");
  }

  try {
    if (!fatTable || fatTable.length === 0) {
      return socket.write("#No FAT data found in device record!\n");
    }

    const fats = fatTable.map((r) => r.FAT);
    const rates = fatTable.map((r) => r.RATE);

    const minFat = Math.min(...fats)
      .toFixed(1)
      .padStart(4, "0");
    const maxFat = Math.max(...fats)
      .toFixed(1)
      .padStart(4, "0");

    const ratesData = rates
      .map((rate) => rate.toFixed(2).padStart(6, "0"))
      .join(",");

    const responseData = `${command}:${socket.deviceId}${fatTableId}${minFat}${maxFat}${fatEffectiveDate}${ratesData}!`;

    console.log("📤 Writing to socket:", responseData);
    socket.write(responseData + "\n");
  } catch (error) {
    console.error(`❌ ${milkType} FAT Rate Send Error:`, error.message);
    socket.write(`#FAT RATE ERROR: ${error.message}!\n`);
  }
}

module.exports = sendFatAndRateValues;
