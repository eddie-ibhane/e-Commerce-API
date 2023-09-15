import mongoose from "mongoose";

const VendorWalletSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    balance: { type: Number, required: true },
    walletId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const VendorWallet = mongoose.model("VendorWallet", VendorWalletSchema);

export default VendorWallet;
