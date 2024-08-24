import express, { Request, Response } from 'express';
import Resume from '../models/resume';
const multer = require('multer');
const path = require('path');
const OpenAI = require("openai");


const openai = new OpenAI({
  apiKey: "sk-",
});
const fs = require("fs");



const resumeStorage = multer.diskStorage({
    destination: "./public/resume/",
    filename: (req: any, file: any, cb: any) => {
      cb(null, "resume-" + Date.now() + path.extname(file.originalname));
    },
  });
  
  const UploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 150 * 1024 * 1024 },
  }).single("file");
  
  export const UploadResumeFile = async (req: any, res: any) => {
    UploadResume(req, res, () => {
      try {
        return res.status(200).json({
          success: true,
          path: "resume/" + req.file?.filename,
        });
      } catch (err) {
        return res.status(500).json({ message: "File uploading error!" });
      }
    });
  };


  const ExtractPDF = async () => {
    try {
      const myFile = await openai.files.create({
        file: fs.createReadStream('./public/resume/1.pdf'), 
        // file: fs.createReadStream(req.file.path), // Ensure that 'req.file.path' points to the correct uploaded file path
        purpose: "assistants",
      });
      console.log("This is the file object: ", myFile, "\n");
  
      const myAssistant = await openai.beta.assistants.create({
        model: "gpt-4-turbo-preview",
        instructions: "You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
        name: "Customer Support Chatbot",
        tools: [{ type: "retrieval" }],
      });
      console.log("This is the assistant object: ", myAssistant, "\n");
  
      const myThread = await openai.beta.threads.create();
      console.log("This is the thread object: ", myThread, "\n");
  
      // Step 4: Add a Message to a Thread
      const myThreadMessage = await openai.beta.threads.messages.create(myThread.id, {
        role: "user",
        content: "Plesae submit all content in the document",
        file_ids: [myFile.id],
      });
      console.log("This is the message object: ", myThreadMessage.text, "\n");
  
      const myRun = await openai.beta.threads.runs.create(myThread.id, {
        assistant_id: myAssistant.id,
        instructions: "Please process the attached PDF and extract relevant data.",
      });
      console.log("This is the run object: ", myRun, "\n");
  
      const retrieveRun = async () => {
        let keepRetrievingRun;
  
        while (myRun.status === "queued" || myRun.status === "in_progress") {
          keepRetrievingRun = await openai.beta.threads.runs.retrieve(myThread.id, myRun.id);
          console.log(`Run status: ${keepRetrievingRun.status}`);
  
          if (keepRetrievingRun.status === "completed") {
            console.log("\n");
  
            const allMessages = await openai.beta.threads.messages.list(myThread.id);
            console.log("User: ", myThreadMessage.content);
            console.log("Assistant: ", allMessages.data[0].content);
            return allMessages.data[0].content
  
            // return res.status(200).json({
            //   success: true,
            //   extractedData: allMessages.data[0].content,
            // });
            Resume
  
          } else if (
            keepRetrievingRun.status === "queued" ||
            keepRetrievingRun.status === "in_progress"
          ) {
          } else {
            console.log(`Run status: ${keepRetrievingRun.status}`);
            return "Run failed with status"
          }
        }
      };
      retrieveRun();
    } catch (error) {
      console.log(error);
      return "Failed to extract PDF data";
    }
  };

  const extractRelevantJson = (responseContent: string): any => {
    try {
        const start = responseContent.indexOf("{");
        const end = responseContent.lastIndexOf("}") + 1;
        const relevantJson = responseContent.slice(start, end);
        return JSON.parse(relevantJson);
    } catch (e) {
        throw new Error(`Error parsing JSON:`);
    }
    };


  
  const handleProcessing = async(document:string) =>{
    try {
      const main_prompt = 'document' + document + `

      Fill the following JSON structure using the content of the document.
  
      fName: {{ type: String, default: "" }},
      lName: {{ type: String, default: "" }},
      email: {{ type: String, required: true, unique: true }},
      number: {{ type: String, default: "" }},
      devAddress: {{ type: String, default: "" }},
      devAddress2: {{ type: String, default: "" }},
      devTellUrStory: {{ type: String, default: "" }},
      devCity: {{ type: String, default: "" }},
      devState: {{ type: String, default: "" }},
  
      devAcademic: [
      {{
      institution: {{ type: String, default: "" }},
      specialization: {{ type: String, default: "" }},
      startDate: {{ type: String, default: "" }},
      endDate: {{ type: String, default: "" }},
      }},
      ],
  
      devTools: [
      {{
      toolName: {{ type: String, default: "" }},
      toolExp: {{ type: String, default: "" }},
      toolIcon: {{ type: String, default: "" }},
      }},
      ],
  
      devEmployment: [
      {{
      designation: {{ type: String, default: "" }},
      companyName: {{ type: String, default: "" }},
      from: {{ type: String, default: "" }},
      to: {{ type: String, default: "" }},
      stillWorking: {{ type: Boolean, default: false }},
      techUsed: [
      {{
      value: {{ type: String, default: "" }},
      label: {{ type: String, default: "" }},
      }},
      ],
      toolUsed: [
      {{
      value: {{ type: String, default: "" }},
      label: {{ type: String, default: "" }},
      }},
      ],
      aboutRole: {{ type: String, default: "" }},
      uniKey: {{ type: String, default: "" }},
      }},
      ],
  
      devTotalExperience: {{
      type: Number,
      default: 0,
      }},
  
      devCertificates: [
      {{
      certificateName: {{ type: String, default: "" }},
      certInstitution: {{ type: String, default: "" }},
      startDate: {{ type: String, default: "" }},
      endDate: {{ type: String, default: "" }},
      }},
      ],
  
      devSocialProfile: {{
      gitHub: {{ type: String, default: "" }},
      linkedin: {{ type: String, default: "" }},
      facebook: {{ type: String, default: "" }},
      twitter: {{ type: String, default: "" }},
      }}`


      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          {
            role: "system",
            content: "you are a smart data extractor",
          },
          {
            role: "user",
            content: main_prompt,
          },
        ],
        temperature: 1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      const rawResponse = response.choices[0].message.content.trim();
      console.log("Raw response:", rawResponse);

      // Use the extractRelevantJson function to parse the JSON
      const res1 = extractRelevantJson(rawResponse);
      console.log("Extracted JSON:", res1);
      return res1;


    } catch (error) {
      console.error("Error:", error);
    }
  }

  const ExtractInformation = async (req: Request, res: Response) => {
    const content = await ExtractPDF()
    if (!content || content === "Failed to extract PDF data") {
      console.error("Failed to extract PDF content");
      res.status(400).json({ error: "Failed to extract PDF data" });
      return;
    }
    const data = await handleProcessing(content)
    console.log("content is", content)
    return res.status(501).json({status:true, content:data})
  }




export const ResumeController = {
    UploadResumeFile,
    ExtractInformation,
}
