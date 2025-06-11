const getMinMaxFatSnf = require("./GetSnfMinMax"); // adjust path as needed

async function sendSnfLimits(command, message, socket, deviceState) {
  const isBuf = command.includes("BUF");
  const milkType = isBuf ? "SNFBUF" : "SNFCOW";

  let snfTable, rateTableId, snfEffectiveDate;

  if (milkType === "SNFBUF") {
    if (deviceState.deviceInfo.isDeviceRateTable.snfBufTable === true) {
      snfTable = deviceState.deviceInfo.snfBufTable;
      console.log("Device snf Buf Table");
    } else {
      snfTable = deviceState.dairyInfo.snfBufTable;
      console.log("Dairy Snf Buf Table");
    }

    rateTableId = deviceState.deviceInfo.rateChartIds?.snfBufId;
    snfEffectiveDate =
      deviceState.deviceInfo.effectiveDates?.snfBufEffectiveDate;
  } else if (milkType === "SNFCOW") {
    if (deviceState.deviceInfo.isDeviceRateTable.snfCowTable === true) {
      snfTable = deviceState.deviceInfo.snfCowTable;
      console.log("Device Snf Cow Table");
    } else {
      snfTable = deviceState.dairyInfo.snfCowTable;
      console.log("Dairy Snf Cow Table");
    }

    rateTableId = deviceState.deviceInfo.rateChartIds?.snfCowId;
    snfEffectiveDate =
      deviceState.deviceInfo.effectiveDates?.snfCowEffectiveDate;
  }

  if (message === `${command}:${socket.deviceId}${rateTableId}!`) {
    return socket.write("#NO NEW RATE CHART AVAILABLE!");
  }

  const limits = await getMinMaxFatSnf(snfTable, socket, deviceState);
  if (!limits) {
    // rate tables not found, already informed device
    console.log("#No Limits Available!");

    socket.write("#No Limits Available!");
    return;
  }
  deviceState.fatsnfRateMapping = limits.fatRateMapping;

  //const snfId = rateTableId;
  const snfKey = isBuf ? "snfBufRecord" : "snfCowRecord";
  deviceState[snfKey] = limits.minFat;

  const response = `#${command.slice(1)}:${socket.deviceId}${rateTableId}${
    limits.minFat
  }${limits.maxFat}${limits.minSnf}${limits.maxSnf}${snfEffectiveDate}!`;
  console.log(response);
  socket.write(response);
}

module.exports = sendSnfLimits;
