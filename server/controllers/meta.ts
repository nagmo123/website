import { Request, Response } from 'express';

export const getCategories = (req: Request, res: Response) => {
  res.json([
    'All',
    'Botanical',
    'Tropical',
    'Traditional',
    'Whimsical',
    'Luxury',
    'Modern',
  ]);
};

export const getColors = (req: Request, res: Response) => {
  res.json([
    'Green',
    'Blue',
    'Coral',
    'Pink',
    'Gold',
    'Black',
    'White',
    'Cream',
    'Burgundy',
    'Turquoise',
  ]);
};

export const getMaterials = (req: Request, res: Response) => {
  res.json([
    'Non-woven',
    'Vinyl',
    'Paper',
    'Silk',
    'Textured',
    'Metallic',
  ]);
};

export const getRoomTypes = (req: Request, res: Response) => {
  res.json([
    'Living Room',
    'Bedroom',
    'Dining Room',
    'Kids Room',
    'Bathroom',
    'Study',
    'Office',
    'Entry Hall',
    'Nursery',
    'Playroom',
    'All Rooms',
  ]);
}; 