import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Extend Express Request interface to include file property
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

const router = Router();
const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), function (req: MulterRequest, res: Response) {
    const file = req.file;
    if (!file)
        return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${file.filename}`;
    res.json({ url });
});

export default router; 