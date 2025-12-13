import mongoose, { Schema } from 'mongoose';
import { ILesson } from '../types';

const LessonSchema = new Schema<ILesson>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide lesson content'],
    },
    videoUrl: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      required: [true, 'Please provide lesson duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['pdf', 'video', 'link'],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
LessonSchema.index({ course: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
