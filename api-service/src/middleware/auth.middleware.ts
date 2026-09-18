import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    };
}

export const authenticationToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(401).json({
            message: "Authorization header missing",
        });
    }

    const [type, token] = authHeader.split(" ");

    if(type !== "Bearer" || !token){
        return res.status(401).json({
            message: "Invalid authorization format",
        })
    }
    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
        }
        next();
    } catch{
        return res.status(401).json({
            message: "Invalid or expired token",
        })
    }
}
