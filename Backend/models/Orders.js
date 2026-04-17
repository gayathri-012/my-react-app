
// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "products",
//     required: true,
//   },

//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },

//   userName: {
//     type: String,
//   },

//   quantity: {
//     type: Number,
//     required: true,
//     default: 1,
//   },

//   totalPrice: {
//     type: Number,
//     required: true,
//   },

//   address: String,
//   paymentMethod: String,

//   paymentId: {  
//     type: String,
//   },

//   status: {
//     type: String,
//     enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
//     default: "Pending",
//   },

//   }, { timestamps: true });  

// module.exports = mongoose.model("orders", orderSchema);


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  userName: {
    type: String,
  },


  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
      }
    }
  ],

  totalPrice: {
    type: Number,
    required: true,
  },

  address: String,
  paymentMethod: String,

  paymentId: {  
    type: String,
  },

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  }

}, { timestamps: true });

module.exports = mongoose.model("orders", orderSchema);