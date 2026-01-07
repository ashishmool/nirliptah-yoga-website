// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map();

const rateLimiter = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100, // limit each IP to 100 requests per windowMs
        message = "Too many requests from this IP, please try again later.",
    } = options;

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress || "unknown";
        const now = Date.now();
        const windowStart = now - windowMs;

        // Get or create rate limit entry for this IP
        let rateLimit = rateLimitMap.get(ip);

        if (!rateLimit) {
            rateLimit = {
                requests: [],
                resetTime: now + windowMs,
            };
            rateLimitMap.set(ip, rateLimit);
        }

        // Clean old requests outside the window
        rateLimit.requests = rateLimit.requests.filter(
            (time) => time > windowStart
        );

        // Check if limit exceeded
        if (rateLimit.requests.length >= max) {
            return res.status(429).json({
                message,
                retryAfter: Math.ceil((rateLimit.resetTime - now) / 1000),
            });
        }

        // Add current request
        rateLimit.requests.push(now);

        // Set rate limit headers
        res.setHeader("X-RateLimit-Limit", max);
        res.setHeader("X-RateLimit-Remaining", max - rateLimit.requests.length);
        res.setHeader(
            "X-RateLimit-Reset",
            new Date(rateLimit.resetTime).toISOString()
        );

        next();
    };
};

// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, rateLimit] of rateLimitMap.entries()) {
        if (rateLimit.resetTime < now) {
            rateLimitMap.delete(ip);
        }
    }
}, 60 * 1000); // Cleanup every minute

module.exports = rateLimiter;

