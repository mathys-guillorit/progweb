import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: "Access denied. Missing or incorrectly formatted token." 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: "Access denied. Invalid or expired token." 
        });
    }
};