import mongoose from "mongoose";

const connect = (URI: any) => {
  mongoose
    .connect(URI, { autoIndex: false })
    .then(() => console.log("connected to the DB"))
    .catch((err) => console.log(err));
};

export default connect;
