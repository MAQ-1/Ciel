import redis from "../../../shared/redis/redis.js";

const Limits={
    chat:20,
    coding:5,
    pdf:3,
    ppt:2,
    vision:3,
    search:5,
    
}

export const checkAgentLimit = async (userId ,agent) => {

    const maxLimit = Limits[agent] || Limits["chat"];
    const key = `rate:${userId}:${agent}`;

    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, 60); // Set expiration to 60 seconds
    }

    const ttl = await redis.ttl(key);

    if (count > maxLimit) {
        const minutes = Math.floor(ttl / 60);
        const seconds = ttl % 60;

        const time =
            minutes > 0
                ? `${minutes}m ${seconds}s`
                : `${seconds}s`;

        const error = new Error(`Rate limit exceeded for ${agent}.`);

        error.status = 429;

        error.data = {
            success: false,
            agent,
            limit: maxLimit,
            remainingTime: ttl,
            retryAfter: time,
           message: `You've reached the PDF generation limit (${maxLimit} requests per minute). Please try again in ${time}.`
        };

        throw error;
    }

    return {
        remaining: maxLimit - count,
        limit: maxLimit,
    };
};
