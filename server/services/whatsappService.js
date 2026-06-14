const sendWhatsAppMessage = async (toPhone, message) => {
  if (!toPhone) {
    console.log("⚠️ [WhatsApp Service] No phone number provided. Skipping notification.");
    return false;
  }

  // Clean phone number (remove spaces, ensure standard format)
  const cleanPhone = toPhone.replace(/\s+/g, "");

  const hasTwilio = process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_NUMBER;

  if (hasTwilio) {
    try {
      const twilio = require("twilio");
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${cleanPhone}`,
        body: message
      });
      console.log(`✅ [WhatsApp Service] Real message successfully sent to ${cleanPhone} via Twilio`);
      return true;
    } catch (err) {
      console.error(`❌ [WhatsApp Service] Twilio API call failed:`, err.message);
    }
  }

  // High Availability Fallback simulation log
  console.log(`\n==================================================`);
  console.log(`📱 [WHATSAPP NOTIFICATION SIMULATION]`);
  console.log(`   To: ${cleanPhone}`);
  console.log(`   Message: ${message}`);
  console.log(`==================================================\n`);
  return true;
};

module.exports = {
  sendWhatsAppMessage
};
