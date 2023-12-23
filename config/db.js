import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGP_URL, {
      dbName: "ecomerce",
    });
    console.log(`Connected to Mongodb Database ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error in MongoDB ${error}`.bgRed.blue);
  }
};

export default connectDB;
