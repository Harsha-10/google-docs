import mongoose from "mongoose";
const Document1=mongoose.Schema({
    _id:String,
    data:Object
});
const Document = mongoose.model('Document',Document1);
export default Document