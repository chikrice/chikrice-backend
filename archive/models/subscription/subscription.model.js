const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'PlanMonth',
      required: true,
    },
    details: {
      type: {
        type: String,
        enum: ['custom', 'general'],
        required: true,
      },
      title: {
        en: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true },
      },
      subtitle: {
        en: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true },
      },
      description: {
        en: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true },
      },
      price: {
        type: Number,
        required: true,
      },
      mealsInDay: {
        type: Number,
        required: true,
      },
      snacksInDay: {
        type: Number,
        required: true,
      },
      imgUrl: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      daysCount: {
        type: Number,
        required: true,
      },
      mealsCount: {
        type: Number,
        required: true,
      },
      snacksCount: {
        type: Number,
        required: true,
      },
      weeksCount: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'freezed', 'canceled'],
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalDiscount: {
      type: Number,
      required: true,
    },
    totalDiscountedPrice: {
      type: Number,
      required: true,
    },
    deliveryPrice: {
      total: {
        type: Number,
        required: true,
      },
      perDay: {
        type: Number,
        required: true,
      },
    },
    deliveryDate: {
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
