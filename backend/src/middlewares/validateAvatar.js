const ALLOWED = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 2 * 1024 * 1024; // 2mb

export const validateAvatar = (req, res, next) => {
    let file = req.files?.file
    if(!file) return next(); // profile_img is optional

    if(Array.isArray(file)) {
        return res.status(400).json({ status: 400, message: "upload only one image!" })
    }
    if(!ALLOWED.includes(file.mimetype)) {
        return res.status(400).json({ status: 400, message: "only JPG, PNG, WEBP allowed!" })
    }
    if (file.size > MAX_SIZE) {
        return res.status(400).json({ status: 400, message: "Image must be under 2MB" });
    }

    next() // handle to next middleware or logic (right) function 
}