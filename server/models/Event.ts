import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
})

// Create index for datetime to improve query performance
eventSchema.index({ datetime: -1 })

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema) 