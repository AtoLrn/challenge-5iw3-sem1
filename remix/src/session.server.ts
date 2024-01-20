import { createCookieSessionStorage } from '@remix-run/node' // or cloudflare/deno

type SessionData = {
    token: string;
};

type SessionFlashData = {
    error: string;
};

const { getSession, commitSession, destroySession } = 
    createCookieSessionStorage<SessionData, SessionFlashData>(
    	{
    		cookie: {
    			name: '__session',

    			// all of these are optional
    			// Expires can also be set (although maxAge overrides it when used in combination).
    			// Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    			//
    			// expires: new Date(Date.now() + 60_000),
    			httpOnly: true,
    			maxAge: process.env.NODE_ENV === 'production' ? 60 * 60 * 24 * 31 : 60 * 60,
    			path: '/',
    			sameSite: 'lax',
    			secrets: ['s3cret1'],
    			secure: process.env.NODE_ENV === 'production',
    		},
    	}
    )

export { getSession, commitSession, destroySession }