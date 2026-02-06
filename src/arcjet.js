import arcjet, { detectBot, shield, slidingWindow } from '@arcjet/node';
const arcjetkey = process.env.ARCJET_KEY;
const arcjetMode = process.env.ARCJET_MODE === 'DRY_RUN' ? 'DRY_RUN' : 'LIVE';


if(!arcjetkey) throw new Error('ARCJET_KEY environment variable is missing');
 
export const httpArcjet =arcjetkey ? 
arcjet({
    key: arcjetkey,
    rules: [
        shield({mode: arcjetMode}),
       // detectBot({mode:arcjetMode, allow:['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW']}),
        slidingWindow ({mode:arcjetMode, interval: '10s', max:10})
    ],
}):null;

export const wsArcjet = arcjetkey ?
arcjet({
    key: arcjetkey,
    rules: [
        shield({mode: arcjetMode}),
        detectBot({mode:arcjetMode, allow:['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW']}),
        slidingWindow ({mode:arcjetMode, interval: '2s', max: 5})
    ],
    }): null;

   

    export function securityMiddleware() {
        return async (req, res, next) => {
            
                if (!httpArcjet)return next();
                
                try {
                    const decision = await httpArcjet.protect(req);
                    if (decision.isDenied()){
                        if (decision.reason.isRateLimit()) {
                            return res.status(429).json({error: 'rate limit exceeded'});
                    }
                    return res.status(403).json({error: 'forbidden'});
                }
                }catch (e) {
                    console.error('Arcjet middleware failed', e);
                    return res.status(503).json({error: 'service unavailable'});
            }
            next();
        };
        }
    