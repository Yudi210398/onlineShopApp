const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let tanggal = function () {
  const dates = new Date();
  dates.setTime(dates.getTime() + 1 * 24 * 60 * 60 * 1000);
  const option = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("id-ID", option).format(dates);
};
const Orders = new Schema({
  waktuBatasPembayaran: { type: String, default: tanggal() },
  produks: [
    {
      produk: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalHarga: { type: String, required: true },
  user: {
    nama: {
      type: String,
      required: true,
    },
    userId: {
      type: Object,
      required: true,
      ref: "users",
    },
  },
});

module.exports = mongoose.model("Orders", Orders);
