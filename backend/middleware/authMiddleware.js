import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // should match the one used during login

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header is present
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token and extract user data
    const decoded = jwt.verify(token, JWT_SECRET);
    // 3. Attach user to request object
    req.user = decoded;

    next(); // proceed to the next middleware/route handler
  } catch (error) {
    console.error('Invalid Token:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken;
