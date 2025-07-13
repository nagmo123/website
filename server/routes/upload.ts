import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

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

router.post('/api/upload', upload.single('image'), function (req: Request, res: Response) {
    const file = req.file as Express.Multer.File | undefined;
    if (!file)
        return res.status(400).json({ message: 'No file uploaded' });
    const url = `/uploads/${file.filename}`;
    res.json({ url });
});

export default router; 