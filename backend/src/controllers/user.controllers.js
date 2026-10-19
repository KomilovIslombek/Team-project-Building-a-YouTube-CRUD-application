import { createUser, findAllUsers } from "../services/user.service.js";
import { buildAvatarName, saveAvatar } from "../utils/avatar.js";
import { signToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
    let  { username, password } = req.body;
    let file = req.files?.file;
    let imgName = file ? buildAvatarName(file) : null;

    let user = await createUser({username, password, profile_img: imgName})
    
    if(user) await saveAvatar(file, imgName);

    const token = signToken(user);

    return res.status(201).json({ 
        status: 201, 
        message: 'user created successfully', 
        data: {user, token} 
    })
} 


export const getUsers = async (req, res) => {
    let users = await findAllUsers()
    return res.status(200).json({ status: 200, message: 'Users fetched successfully', data: users })
}