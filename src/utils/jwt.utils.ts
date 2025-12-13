import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export const generateAccessToken = (userId: string, role: string): string => {
    const payload = { id: userId, role };
    const options: SignOptions = { expiresIn: config.jwt_expire as SignOptions['expiresIn'] };

    return jwt.sign(payload, config.jwt_secret, options);
};

export const generateRefreshToken = (userId: string): string => {
    const payload = { id: userId };
    const options: SignOptions = { expiresIn: config.jwt_refresh_expire as SignOptions['expiresIn'] };

    return jwt.sign(payload, config.jwt_refresh_secret, options);
};

export const verifyAccessToken = (token: string): any => {
    return jwt.verify(token, config.jwt_secret);
};

export const verifyRefreshToken = (token: string): any => {
    return jwt.verify(token, config.jwt_refresh_secret);
};
