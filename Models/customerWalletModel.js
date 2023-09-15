import mongoose from "mongoose";

const CustomerWalletSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    balance: { type: Number, required: true, default: 0 },
    walletId: { type: String },
  },
  {
    timestamps: true,
  }
);

const CustomerWallet = mongoose.model("CustomerWallet", CustomerWalletSchema);

export default CustomerWallet;
