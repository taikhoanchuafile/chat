import { NextFunction, Request, Response } from "express";

export const errorHandles = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(500).json({ message: err.message });
};
