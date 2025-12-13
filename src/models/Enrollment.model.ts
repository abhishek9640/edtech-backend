import mongoose, { Schema } from 'mongoose';
import { IEnrollment } from '../types';

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one enrollment per user per course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
EnrollmentSchema.index({ user: 1 });
EnrollmentSchema.index({ course: 1 });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
