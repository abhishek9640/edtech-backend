import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../types';
import { config } from '../config/env';

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'instructor', 'admin'],
            default: 'user',
        },
        avatar: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot be more than 500 characters'],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT access token
UserSchema.methods.generateAuthToken = function (): string {
    const payload = { id: this._id, role: this.role };
    const options: SignOptions = { expiresIn: config.jwt_expire as SignOptions['expiresIn'] };

    return jwt.sign(payload, config.jwt_secret, options);
};

// Generate JWT refresh token
UserSchema.methods.generateRefreshToken = function (): string {
    const payload = { id: this._id };
    const options: SignOptions = { expiresIn: config.jwt_refresh_expire as SignOptions['expiresIn'] };

    return jwt.sign(payload, config.jwt_refresh_secret, options);
};

// Index for faster queries
UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
