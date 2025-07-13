import { Request, Response } from 'express';
import CustomDesignRequest from '../models/CustomDesignRequest';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const request = await CustomDesignRequest.create(req.body);
    res.status(201).json(request);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await CustomDesignRequest.find();
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const request = await CustomDesignRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 