import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "cds",
    resource_type: "auto", // xử lý image + video
    format: file.mimetype.split("/")[1],
    public_id: file.originalname.split(".")[0],
  }),
});

const upload = multer({ storage });
export default upload;
