import dotenv from "dotenv";

dotenv.config();
const {
  PORT,
  GOOGLE_CLIENT_ID,
  MONGODB_URL,
  FRONTEND_URL,
  ACCESS_TOKEN_SECRET,
} = process.env;

export const env = {
  PORT,
  GOOGLE_CLIENT_ID,
  MONGODB_URL,
  FRONTEND_URL,
  ACCESS_TOKEN_SECRET,
};
