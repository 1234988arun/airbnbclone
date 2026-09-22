import mongoose from "mongoose";

const connectDatabase = async (): Promise<void> => {
    const dbUrl = process.env.DB?.trim();

    if (!dbUrl || !/^mongodb(?:\+srv)?:\/\//.test(dbUrl)) {
        throw new Error("Invalid MongoDB connection string. Set DB to a mongodb:// or mongodb+srv:// URL.");
    }

    try {
        await mongoose.connect(dbUrl);

        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed");

        if (error instanceof Error) {
            console.error(error.message);
        }

        throw error;
    }
};

export default connectDatabase;