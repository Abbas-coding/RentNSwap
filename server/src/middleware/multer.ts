import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";
import fs from "fs";

let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log("cloudinary name found");
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Configure storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: "rentnswap",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
      };
    },
  });
  console.log("Using Cloudinary storage for uploads.");
} else {
  // Fallback to Disk Storage
  const uploadDir = "uploads/";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  console.log("Using Local Disk storage for uploads.");
}

// Create the multer instance
const upload = multer({ storage });

export default upload;
