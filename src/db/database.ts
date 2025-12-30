import mongoose from 'mongoose';

const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL || '');
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));
};

export default connectDB;
