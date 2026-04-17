const express = require("express")
const mongose = require("mongoose")
const cors = require("cors")
const UserModel = require("./models/Users")
const ProductModel = require("./models/Products")
const multer = require("multer")
const CartModel = require("./models/Cart");
const OrderModel = require("./models/Orders");
const nodemailer = require("nodemailer");

require("./models/Products");
require("dotenv").config();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });


const app = express()
app.use(express.json())
app.use("/uploads", express.static("uploads"));


app.use(cors())
mongose.connect(process.env.MONGO_URI); 




app.post('/login', (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {

          res.json({
            status: "success",
            role: user.role,
            user: user
          });

        } else {
          res.json({ status: "error", message: "Wrong password" });
        }
      } else {
        res.json({ status: "error", message: "No user found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.json({ status: "error" });
    });
});



app.post('/register', (req, res) => {
  UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

//adding product
app.post('/products', upload.single("image"), (req, res) => {
  const productDetail = {
    title: req.body.title,
    price: req.body.price,
    quantity: req.body.quantity,
    rating: req.body.rating,
    imageUpload: req.file.filename,
    category: req.body.category
  };

  ProductModel.create(productDetail)
    .then(product => res.json(product))
    .catch(err => res.json(err));
})

// get all products
app.get('/products', (req, res) => {
  ProductModel.find({})
    .then(data => res.json(data))
    .catch(err => res.status(500).json(err))
})



const fs = require("fs");
const path = require("path");

app.delete("/products/:id", async (req, res) => {
  try {

    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.json("Product not found");
    }


    const imagePath = path.join(__dirname, "uploads", product.imageUpload);


    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log("Image not found or already deleted");
      }
    });


    await ProductModel.findByIdAndDelete(req.params.id);

    res.json("Product deleted successfully");

  } catch (err) {
    console.log(err);
    res.json(err);
  }
});


//geting single product
app.get('/products/:id', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});


app.put('/products/:id', upload.single("image"), async (req, res) => {
  try {
    const { title, price, rating, category, quantity } = req.body;
    const updateData = {
      title,
      price,
      rating,
      category,
      quantity
    };
    if (req.file) {
      updateData.imageUpload = req.file.filename;
    }
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, }
    );
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});




app.get("/products/category/:category", async (req, res) => {
  try {
    const category = req.params.category;

    const products = await ProductModel.find({ category: category });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// storing cart data  
app.post("/cart", async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    const existing = await CartModel.findOne({ productId, userId });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const newItem = await CartModel.create({
      productId,
      quantity,
      userId
    });

    res.json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


app.get("/cart/:userId", async (req, res) => {
  try {
    const items = await CartModel.find({
      userId: req.params.userId
    }).populate("productId");

    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.put("/cart/:id", async (req, res) => {
  try {
    const updated = await CartModel.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});


app.delete("/cart/:id", async (req, res) => {
  try {
    await CartModel.findByIdAndDelete(req.params.id);
    res.json("Item removed");
  } catch (err) {
    res.status(500).json(err);
  }
});


//mail send
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/orders", async (req, res) => {
  try {
    console.log("ORDER DATA:", req.body);

    const user = await UserModel.findById(req.body.userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    let total = 0;
    const items = [];

    
    for (let item of req.body.items) {
      const product = await ProductModel.findById(item.productId);

      if (!product) continue;

      items.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });

      total += product.price * item.quantity;
    }

   
    const order = await OrderModel.create({
      userId: req.body.userId,
      userName: user.name || user.firstname,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      status: "Pending",
      paymentId: req.body.paymentId,

      items: items,
      totalPrice: total
    });

  
    await CartModel.deleteMany({ userId: req.body.userId });

    
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "From HRX- Order Confirmation",
      html: `
        <h2>Order Placed Successfully</h2>
        <p>Hello ${user.name || user.firstname},</p>
        <p>Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total:</strong> ₹${order.totalPrice}</p>
        <p>Thank you for shopping with us!</p>
      `
    });

    
    res.json(order);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json(err);
  }
});


// get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate({
        path: "items.productId",
        model: "products"
      });

    const validOrders = orders.filter(order => order.items.length > 0);

    res.json(validOrders);
  } catch (err) {
    console.error("GET ORDER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


app.put("/orders/:id", async (req, res) => {
  try {
    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }

    let subject = "";
    let message = "";


    if (req.body.status === "Shipped") {
      subject = "From HRX- Your Order has been Shipped";
      message = `
        <h2>Order Shipped</h2>
        <p>Hello ${updated.userName},</p>
        <p>Your order has been shipped.</p>
        <p><strong>Order ID:</strong> ${updated._id}</p>
        <p><strong>Total Price:</strong> ₹${updated.totalPrice}</p>
        <p>Thank you for shopping with us!</p>
      `;
    }

    if (req.body.status === "Delivered") {
      subject = "From HRX- Your Order has been Delivered";
      message = `
        <h2>Order Delivered</h2>
        <p>Hello ${updated.userName},</p>
        <p>Your order has been delivered.</p>
        <p><strong>Order ID:</strong> ${updated._id}</p>
        <p>Thank you for shopping with us!</p>

      `;
    }

    if (subject && message) {
      const user = await UserModel.findById(updated.userId);

      if (user?.email) {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: subject,
          html: message,
        });
      }
    }

    res.json(updated);

  } catch (err) {
    console.error("PUT ORDER ERROR:", err);
    res.status(500).json(err);
  }
});


// to delete order
app.delete("/orders/:id", async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json("Order deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});


// get orders of a user in profile page 
app.get("/orders/:userId", async (req, res) => {
  try {
    const orders = await OrderModel.find({
      userId: req.params.userId
    }).populate({
      path: "items.productId",
      model: "products"
    });

    res.json(orders);
  } catch (err) {
    console.error("GET USER ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});




app.get("/search", async (req, res) => {
  const query = req.query.query;

  const products = await ProductModel.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } }
    ]
  });

  res.json(products);
});




const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_rcptid_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json(order);

  } catch (err) {
    res.status(500).send(err);
  }
});

const crypto = require("crypto");

app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartData,
      userId,
      userName,
      address
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET; 

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    // ✅ VERIFY SIGNATURE
    if (expectedSignature === razorpay_signature) {

      // ✅ CREATE SINGLE ORDER
      const newOrder = await OrderModel.create({
        userId,
        userName,
        address,
        paymentMethod: "ONLINE",
        paymentId: razorpay_payment_id,
        status: "Pending",

        items: cartData.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        })),

        totalPrice: cartData.reduce(
          (sum, item) => sum + item.productId.price * item.quantity,
          0
        )
      });

      // ✅ REMOVE ITEMS FROM CART
      for (let item of cartData) {
        const cartItem = await CartModel.findOne({
          userId,
          productId: item.productId._id
        });

        if (cartItem) {
          if (cartItem.quantity > item.quantity) {
            cartItem.quantity -= item.quantity;
            await cartItem.save();
          } else {
            await CartModel.deleteOne({ _id: cartItem._id });
          }
        }
      }

      return res.json({ success: true, order: newOrder });

    } else {
      return res.json({ success: false });
    }

  } catch (err) {
    console.log("VERIFY PAYMENT ERROR:", err);
    return res.status(500).json({ success: false });
  }
});



// app.listen(3001, () => {
//   console.log("server is running")
// })

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});