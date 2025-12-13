import { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'instructor' | 'admin';
    avatar?: string;
    bio?: string;
    isEmailVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
    generateRefreshToken(): string;
}

export interface ICourse extends Document {
    title: string;
    description: string;
    instructor: mongoose.Types.ObjectId;
    category: string;
    price: number;
    thumbnail?: string;
    duration: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    enrollmentCount: number;
    rating: number;
    reviews: Array<{
        user: mongoose.Types.ObjectId;
        rating: number;
        comment: string;
        createdAt: Date;
    }>;
    status: 'draft' | 'published' | 'archived';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    // Instance methods
    calculateAverageRating(): void;
}

export interface IEnrollment extends Document {
    user: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    progress: number;
    completedLessons: mongoose.Types.ObjectId[];
    enrolledAt: Date;
    lastAccessedAt: Date;
    completedAt?: Date;
}

export interface ILesson extends Document {
    course: mongoose.Types.ObjectId;
    title: string;
    content: string;
    videoUrl?: string;
    duration: number;
    order: number;
    resources: Array<{
        title: string;
        url: string;
        type: 'pdf' | 'video' | 'link';
    }>;
    createdAt: Date;
    updatedAt: Date;
}
