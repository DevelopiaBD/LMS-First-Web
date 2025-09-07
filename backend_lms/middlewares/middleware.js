import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();


// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "uploads";

    if (file.mimetype.startsWith("video")) {
      folderName = "course_videos";
    } else if (file.mimetype.startsWith("image")) {
      folderName = "course_images";
    }

    return {
      folder: folderName,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Multer Middleware
const upload = multer({ storage });

export default upload;
