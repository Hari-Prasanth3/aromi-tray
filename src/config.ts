require('dotenv').config();

export const config = {
  // DB Config
  dbUrl: process.env.DB_URL,

  // JWT Auth
   TEMP_TOKEN_SECRET:  process.env.TEMP_TOKEN_SECRET,
   JWT_SECRET:  process.env.JWT_SECRET,
   REFRESH_TOKEN_SECRET:  process.env.REFRESH_TOKEN_SECRET,
  
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,

};
