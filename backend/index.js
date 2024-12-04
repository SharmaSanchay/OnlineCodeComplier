const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const {generatefile}   = require('./generateFile');
const { executeCpp } =require("./executeCpp");
const { executePy } = require("./executePy");
const Job =require("./models/Job");
mongoose.connect("mongodb://127.0.0.1:27017/online-complier",).then(()=>{
    console.log("Successfully connected to database");
}).catch((err)=>{
    console.log("Error will connecting to database");
    process.exit(1);
})
app.use(cors());
app.use(express.urlencoded({ extended: true }));    
app.use(express.json());
app.get("/status",async (req,res)=>{
    const jobId = req.query.id;
    if(jobId == undefined){
        return res.status(400).json({success:false,error:"missing id parma"})
    }
    try{
        const job = await Job.findById(jobId);

        if (job === undefined) {
            return res.status(400).json({ success: false, error: "couldn't find job" });
        }
        return res.status(200).json({ success: true, job });
    }catch(err){
        return res.status(400).json({success:false,error:JSON.stringify(err)});
    }
})
app.post("/run",async (req,res)=>{
    const {language="cpp",code} = req.body;
    console.log(language);
    let output;
    if(code === undefined){
        return res.status(400).json({success:false,error:"Empty code body"});
    }
    let job;
    try{
    const filepath =  await generatefile(language,code);
     job = await new Job({language,filepath}).save();
    const jobId  = job["_id"];
    res.status(201).json({success:true,jobId})
    console.log(language)
    job["startedAt"] = new Date();;
    if(language === "cpp"){
        output = await executeCpp(filepath);
    }
    else if(language==="py"){
        console.log("Executing python file ")
        output = await executePy(filepath);
    }
    else{
        output = await executeJavaa(filepath);
    }
        job["completedAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;
        await job.save();
    console.log(job);
    }catch(error) {
        job["completedAt"] = new Date();
        job["status"] = "error";
        job["output"] = JSON.stringify(error);
        await job.save();
        console.log(job);
        console.error("Something went wrong!!", error);
       
    }
})
app.listen(8000,()=>{
    console.log("Server is running on port 8000!!!");
})