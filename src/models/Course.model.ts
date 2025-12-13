import mongoose, { Schema } from 'mongoose';
import { ICourse } from '../types';

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'DevOps',
        'Design',
        'Business',
        'Marketing',
        'Other',
      ],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    thumbnail: {
      type: String,
      default: null,
    },
    duration: {
      type: Number,
      required: [true, 'Please provide course duration in hours'],
      min: [1, 'Duration must be at least 1 hour'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ title: 'text', description: 'text' });

// Calculate average rating before saving
CourseSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    const sum = this.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    this.rating = parseFloat((sum / this.reviews.length).toFixed(1));
  }
};

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
