import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";


export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  console.log(header.startsWith("Bearer "));
  
  if (!header?.startsWith("Bearer ")) throw new AppError("Authentication required", 401);

  try {
    const payload = verifyToken(header.slice(7));
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};