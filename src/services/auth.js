// src/services/auth.js
import crypto from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

const generateToken = (length = 48) => crypto.randomBytes(length).toString('hex');

export const createSession = async (userId) => {
    const accessToken = generateToken(32);
    const refreshToken = generateToken(48);

    const session = await Session.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });

    return session;
};

export const setSessionCookies = (res, session) => {
    const cookieOptions = { httpOnly: true, secure: true, sameSite: 'none' };

    res.cookie('accessToken', session.accessToken, {
        ...cookieOptions,
        maxAge: FIFTEEN_MINUTES,
    });
    res.cookie('refreshToken', session.refreshToken, {
        ...cookieOptions,
        maxAge: ONE_DAY,
    });
    res.cookie('sessionId', session._id.toString(), {
        ...cookieOptions,
        maxAge: ONE_DAY,
    });
};
