import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface User {
  name: string;
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(401).json({ msg: "Authentication failed" });
  }

  try {
    const { name, id, role } = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;
    req.user = { name: name as string, id: id as string, role: role as string };
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

export { authenticateUser };
