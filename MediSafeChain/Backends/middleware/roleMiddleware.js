// backend/middleware/roleMiddleware.js
export function requireRole(role) {
    return (req, res, next) => {
      const userRole = req.headers["x-role"];
  
      if (userRole !== role) {
        return res.status(403).json({ error: "Access denied. Invalid role." });
      }
  
      next();
    };
  }
  