// models/image.model.ts
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  prompt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema);

export default Image;