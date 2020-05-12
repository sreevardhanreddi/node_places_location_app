require("dotenv").config();
const dbUrl = process.env.DATABASE_URL;

const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Mongodb connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

module.exports = connectDb;
