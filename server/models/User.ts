import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  discord_id: {
    type: String,
    required: true,
    unique: true,
  },
  global_name: {
    type: String,
    required: true,
  },
  server_name: {
    type: String,
    required: true,
  },
  main_role: {
    type: String,
    required: true,
    enum: ['tank', 'dps', 'heal'],
  },
}, {
  timestamps: true,
})

// Create index for global_name queries
userSchema.index({ global_name: 1 })

export const User = mongoose.models.User || mongoose.model('User', userSchema) 