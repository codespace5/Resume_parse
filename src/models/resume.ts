import mongoose from "mongoose";

const  resumeSchema = new mongoose.Schema({
    date: { type: String, require: true, unique: false },
    attached:{type:String, require:false, unique:false},
    createAt: { type: Date, default: Date.now() },
})

const Resume = mongoose.model('resume', resumeSchema)

export default Resume;