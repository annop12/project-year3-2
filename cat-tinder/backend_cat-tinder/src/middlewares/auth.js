// Simple auth middleware (temporary - for development)
// TODO: Replace with proper JWT authentication later

export function authMiddleware(req, res, next) {
  // For now, just accept ownerId from request body or headers for testing
  // In production, this will verify JWT token

  const ownerId = req.headers['x-owner-id'] || req.body.ownerId;

  if (!ownerId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Please provide x-owner-id header or ownerId in body'
    });
  }

  // Attach ownerId to request for use in controllers
  req.ownerId = ownerId;
  next();
}
