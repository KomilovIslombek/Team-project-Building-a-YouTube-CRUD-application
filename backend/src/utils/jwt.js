import JWT from 'jsonwebtoken'

export const signToken = (user) => 
    JWT.sign({ sub: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
});


export const verifyToken = (token) => JWT.verify(token, process.env.JWT_SECRET)