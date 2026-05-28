import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath  = path.join(process.cwd(), "uploads/resumes");

if(!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// storage engine for multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },

  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

// file filter to allow only PDFs
const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowedMimeTypes = [
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

// multer instance for resume uploads
export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});