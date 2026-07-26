import multer from "multer";
import fs from "fs";
import path from "path";

// directory to save the uploaded files
const uploadDir = path.resolve("./temp")

// agr directory nhi hai to bna denge
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({  // Fixed: diskStorage -> diskStorage
    destination(req, file, cb) {
        cb(null, uploadDir)
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")){  // Fixed: mimeType -> mimetype
        cb(null, true)
    } else {
        cb(new Error("Only pdf and image files are allowed"), false)
    }
}

export default multer({ storage, fileFilter, limits: { fileSize: 20 * 1024 * 1024 } })