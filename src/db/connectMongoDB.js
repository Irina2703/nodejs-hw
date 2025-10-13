import mongoose from 'mongoose';

const connectMongoDB = async (mongoUrl) => {
    try {
        await mongoose.connect(mongoUrl);
        console.log('✅ MongoDB connection established successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
    }
};

export default connectMongoDB;
