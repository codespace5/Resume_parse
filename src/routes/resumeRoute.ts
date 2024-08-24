import express, { Request, Response } from 'express';
import { ResumeController } from '../controllers/resumeController';


const ResumeRouter = express.Router();


ResumeRouter.post('/upload', ResumeController.UploadResumeFile);
ResumeRouter.post('/process', ResumeController.ExtractInformation);

export default ResumeRouter
