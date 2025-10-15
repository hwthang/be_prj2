import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: req.query.folder || "uploads/default",
    format: file.mimetype.split("/")[1],
    public_id: file.originalname.split(".")[0],
  }),
});

const upload = multer({ storage });
export default upload;
