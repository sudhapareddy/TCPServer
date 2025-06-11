const axios = require("axios");

async function sendSMS() {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulk", // ✅ use /bulk, not /bulkV2
      new URLSearchParams({
        sender_id: "FSTSMS", // ✅ Mandatory default sender ID
        message: "This is a promotional test message sudha 🚀",
        language: "english",
        route: "p",
        numbers: "7382440738",
      }),
      {
        headers: {
          authorization:
            "3bwIQkX78CpK75Ekdlu67QcxCrpEYxAO4WOaroYNIsaz1VYISDxLXkfyYWVm",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("✅ Full Response:", response); // print full response

    console.log("✅ Promotional SMS Sent:", response.data);
  } catch (error) {
    console.error(
      "❌ Promotional SMS Failed:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = sendSMS;
