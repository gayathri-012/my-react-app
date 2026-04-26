// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({

//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "users",
//     required: true,
//   },

//   userName: {
//     type: String,
//   },

//   items: [
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "products",
//     },
//     title: String,
//     image: String,
//     quantity: {
//       type: Number,
//       default: 1,
//     },
//     price: Number,
//     gst: Number,
//     gstAmount: Number
//   }
// ],

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
//   }

// }, { timestamps: true });

// module.exports = mongoose.model("orders", orderSchema);



const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  userName: String,

  address: String,

  paymentMethod: String,

  paymentId: String,

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      title: String,
      image: String,

      quantity: {
        type: Number,
        default: 1,
      },

      price: Number,

      gst: Number,      
      gstAmount: Number,  

      total: Number       
    }
  ],

  subtotal: Number,      
  totalGST: Number,      
  totalPrice: {
    type: Number,
    required: true,      
  },

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  }

}, { timestamps: true });

module.exports = mongoose.model("orders", orderSchema);