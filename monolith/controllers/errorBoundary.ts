import { NextFunction, Request, Response } from 'express';

type Controller = (req: Request, res: Response, next: NextFunction) => void;

const errorBoundary = (controllerFunction: Controller) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controllerFunction(req, res, next);
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    };
};

export default errorBoundary;
