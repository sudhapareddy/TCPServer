const dairyModel = require("./models/dairy");

async function getDairyInfo(dairyCode) {
  console.log("Dairy Code:", dairyCode);
  try {
    const dairy = await dairyModel.findOne({ dairyCode: dairyCode });

    return dairy; // Returns full document or null
  } catch (error) {
    console.error("Error finding dairy:", error);
    return null;
  }
}

module.exports = getDairyInfo;
