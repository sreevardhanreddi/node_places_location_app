const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const placeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: false },
    acceptsCash: { type: Boolean, required: false, default: true },
    acceptsCard: { type: Boolean, required: false, default: false },
    acceptsUpi: { type: Boolean, required: false, default: false },
    workingDays: { type: String, required: false, default: "Mon to Sat" },
    workingHours: {
      type: String,
      required: false,
      default: "8:00 AM to 10:00 PM",
    },
    tags: { type: [{ type: String }], required: false, default: [] },
    location: { type: pointSchema, required: true, index: "2dsphere" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", placeSchema);

const Category = mongoose.model("Category", categorySchema);

module.exports = {
  Place: Place,
  Category: Category,
};
