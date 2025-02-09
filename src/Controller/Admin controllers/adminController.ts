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



export const addEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(req);

    const { organization, location, date, description, title, imageUrl } = req.body;

    console.log("Image URL:", imageUrl);

    if (!imageUrl) {
        return next(new CustomError('image is required', 404))
    }

    const newEvent = new Event({ title, organization, location, image: imageUrl, date, description });

    await newEvent.save();
    res.status(200).json({ error: false, message: 'Event added successfully', event: newEvent });
}

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {


    const page = Number(req.query.page)
    const limit = Number(req.query.limit)


    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return next(new CustomError("Invalid pagination parameters", 400));
    }

    const totalevents = await Event.countDocuments({ isDeleted: false })
    const events = await Event.find({ isDeleted: false }).skip((page - 1) * limit).limit(limit)
    if (!events) {
        return next(new CustomError("Events not found", 404))
    }
    res.status(200).json({
        error: 'false',
        events: events,
        totalPages: Math.ceil(totalevents / limit),
        currentPage: page,
        totalevents
    })

}

export const getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
  
  
    const events = await Event.find({ isDeleted: false })
    if (!events) {
        return next(new CustomError("Events not found", 404))
    }
    res.status(200).json({
        error: 'false',
        events: events,
       
    })

}

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const event = await Event.findById(id)
    if (!event) {
        return next(new CustomError('event not found', 404))
    }
    res.status(200).json({ error: 'false', event: event })
}

export const editEvents = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params
    const { organization, location, date, description, title } = req.body
    const image = (req.file as file)?.location;
    const eventData = { organization, location, date, description, title, image };
    const editedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true })
    res.status(200).json({ error: 'false', message: 'event edited successfully', event: editedEvent })
}

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const deleteEvent = await Event.findById(id);

    if (!deleteEvent) {
        return next(new CustomError("Event not found", 404));
    }

    deleteEvent.isDeleted = !deleteEvent.isDeleted;
    await deleteEvent.save();

    res.status(200).json({ error: false, event: deleteEvent });

}