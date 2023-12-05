import mongoose from 'mongoose'
const connect = async(username='docsuser',password='docsuser123')=>{
    const url = `mongodb+srv://${username}:${password}@cluster0.lb8gg2f.mongodb.net/google-docs?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(url);
        console.log("db connected");
    } catch (error) {
        console.log('Error while connecting with the database ', error);
    }
}
export default connect
