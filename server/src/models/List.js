import mongoose, { Schema } from 'mongoose';

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    prospects: [{ type: Schema.Types.ObjectId, ref: 'Lead' }],
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    filter: {
      country: { type: String },
      niche: { type: String },
      scoreMin: { type: Number },
      scoreMax: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

ListSchema.index({ status: 1, createdBy: 1 });
ListSchema.index({ name: 1, createdBy: 1 });

const List = mongoose.model('List', ListSchema);

export default List;

