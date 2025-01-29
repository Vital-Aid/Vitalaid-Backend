import { Response, Request, NextFunction } from 'express'
import Event from '../../Models/Event'
import CustomError from '../../utils/CustomError'


interface file extends Express.Multer.File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    bucket: string;
    key: string;
    acl: string;
    contentType: string;
    location: string;  
};



export const addEvent = async (req: Request, res: Response, next: NextFunction):  Promise<void> => {
    console.log(req);

    const { organization, location, date, description, title } = req.body;

    // Access the image URL from req.file
    const image = (req.file as file)?.location;

    console.log("Image URL:", image);

    if (!image) {
      res.status(400).json({ error: true, message: 'Image is required' });
    }

    const newEvent = new Event({ title, organization, location, image, date, description });

    await newEvent.save();
   res.status(200).json({ error: false, message: 'Event added successfully', event: newEvent });
}

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
    const events = await Event.find()
    if (!events) {
        return next(new CustomError("Events not found", 404))
    }
    res.status(200).json({ error: 'false', events: events })
}

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const event = await Event.findById(id)
    if (!event) {
        return next(new CustomError('event not found', 404))
    }
    res.status(200).json({error:'false',event:event})
}

export const editEvents=async(req:Request,res:Response,next:NextFunction)=>{
  
    const {id}=req.params
    const{organization,location,date,description,title}=req.body
    const image = (req.file as file)?.location;
    const eventData = { organization, location, date, description, title,image };
    const editedEvent=await Event.findByIdAndUpdate(id,eventData,{new:true})
    res.status(200).json({error:'false',message:'event edited successfully',event:editedEvent})
}

