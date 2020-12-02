import mongoose from "mongoose";

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose
  .connect(MONGO_URI, options)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => res.send(err));
