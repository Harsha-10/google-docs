import mongoose from 'mongoose'
const connect = async(url)=>{
    try {
        await mongoose.connect(url);
        console.log("db connected");
    } catch (error) {
        console.log('Error while connecting with the database ', error);
    }
}
export default connect
