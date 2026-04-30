const express = require("express")
const mongose = require("mongoose")
const cors = require("cors")
const UserModel = require("./models/Users")
const ProductModel = require("./models/Products")
const multer = require("multer")
const CartModel = require("./models/Cart");
const OrderModel = require("./models/Orders");
const generateInvoice = require("./utils/generateInvoice");

require("dotenv").config();

//sendgrid email setup
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendOrderEmail = async (order, invoicePath) => {
  const fs = require("fs");

  const msg = {
    to: order.email,
    from: "gayathrikulal558@gmail.com",
    subject: "Order Placed Successfully",
    html: `
      <h2>Order Confirmed</h2>
      <p>Hello ${order.userName},</p>
      <p>Your order has been placed successfully.</p>

      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Amount:</strong> ₹${order.totalPrice}</p>
      <p><strong>Payment:</strong> ${order.paymentMethod}</p>

      <br/>
      <p>Thank you for shopping with us </p>
    `,
    attachments: [
      {
        content: fs.readFileSync(invoicePath).toString("base64"),
        filename: `invoice_${order._id}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(msg);
};

require("./models/Products");


const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
  },
});

const upload = multer({ storage });

const app = express()
app.use(express.json())

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
    imageUpload: req.file.path,
    category: req.body.category,
    gst: Number(req.body.gst)
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
      updateData.imageUpload = req.file.path;
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

      const base = product.price * item.quantity;
      const gst = product.gst || 0;
      const gstAmount = (base * gst) / 100;

      items.push({
        productId: product._id,
        title: product.title,
        image: product.imageUpload,
        quantity: item.quantity,
        price: product.price,
        gst: gst,
        gstAmount: gstAmount
      });

      total += base + gstAmount;
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

    //  CLEAR CART FIRST
    if (req.body.isFromCart) 
      {
  for (let item of req.body.items) {
    await CartModel.deleteOne({
      userId: req.body.userId,
      productId: item.productId
    });
  }
}


    res.json({ success: true, order });

    
    (async () => {
      try {
        const invoicePath = path.join(
          __dirname,
          `invoice_${order._id}.pdf`
        );

        await generateInvoice(order, invoicePath);
        console.log("Invoice generated at:", invoicePath);

        await sendOrderEmail(
          {
            ...order.toObject(),
            email: user.email
          },
          invoicePath
        );

        console.log("Email sent with invoice");

        if (fs.existsSync(invoicePath)) {
          fs.unlinkSync(invoicePath);
          console.log("Invoice deleted after sending");
        }

      } catch (err) {
        console.log("Background error:", err.message);
      }
    })();

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
      { returnDocument: 'after' }
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
        try {
          await sgMail.send({
            to: user.email,
            from: "gayathrikulal558@gmail.com",
            subject: subject,
            html: message,
          });
        } catch (err) {
          console.log("SendGrid error:", err.message);
        }
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


//razorpay
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

//razorpay verification
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

    // validation
    if (!cartData || !Array.isArray(cartData)) {
      return res.status(400).json({ success: false });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret.trim())
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false });
    }

   
    let items = [];
    let totalPrice = 0;

    for (let item of cartData) {
      const productId = item.productId?._id || item.productId;

      const product = await ProductModel.findById(productId);
      if (!product) continue;

      const qty = item.quantity || 1;
      const base = product.price * qty;
      const gst = product.gst || 0;
      const gstAmount = (base * gst) / 100;

      items.push({
        productId: product._id,
        title: product.title,
        image: product.imageUpload,
        quantity: qty,
        price: product.price,
        gst,
        gstAmount
      });

      totalPrice += base + gstAmount;
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false });
    }

    
    const newOrder = await OrderModel.create({
      userId,
      userName,
      address,
      paymentMethod: "ONLINE",
      paymentId: razorpay_payment_id,
      status: "Pending",
      items,
      totalPrice
    });

    console.log("ORDER CREATED:", newOrder._id);

  
    res.json({ success: true, order: newOrder });

    
    (async () => {
      try {
        const invoicePath = path.join(
          __dirname,
          `invoice_${newOrder._id}.pdf`
        );

        await generateInvoice(newOrder, invoicePath);

        const user = await UserModel.findById(userId);

        if (user?.email) {
          sendOrderEmail(
            {
              ...newOrder.toObject(), 
              email: user.email
            },
            invoicePath
          ).catch(err =>
            console.log("SendGrid error:", err.message)
          );
        }

        if (fs.existsSync(invoicePath)) {
          fs.unlinkSync(invoicePath);
        }

      } catch (e) {
        console.log("Email error:", e.message);
      }
    })();

   
    if (req.body.isFromCart) {
  for (let item of cartData) {
    const productId = item.productId?._id || item.productId;
    await CartModel.deleteOne({ userId, productId });
  }
}


  } catch (err) {
    console.log("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ success: false });
  }
});





// admin dashboard stats
app.get("/admin/stats", async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: 1 });
    const users = await UserModel.find().sort({ createdAt: 1 });
    const products = await ProductModel.find();

    //console.log("Products:", products.length);

    let salesByDate = {};
    let usersByDate = {};

    let codPayments = 0;
    let onlinePayments = 0;

    let productMap = {};

    orders.forEach(order => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt)
        .toISOString()
        .split("T")[0];

      salesByDate[date] =
        (salesByDate[date] || 0) + (order.totalPrice || 0);

      if (order.paymentMethod === "COD") {
        codPayments += order.totalPrice || 0;
      } else {
        onlinePayments += order.totalPrice || 0;
      }

      order.items?.forEach(item => {
        const name = item.title || "Unknown";
        productMap[name] =
          (productMap[name] || 0) + (item.quantity || 1);
      });
    });


    users.forEach(user => {
      if (!user.createdAt) return;

      const date = new Date(user.createdAt)
        .toISOString()
        .split("T")[0];

      usersByDate[date] = (usersByDate[date] || 0) + 1;
    });

    const fillDates = (data, start) => {
      let result = {};
      let current = new Date(start);
      let today = new Date();

      while (current <= today) {
        const key = current.toISOString().split("T")[0];
        result[key] = data[key] || 0;
        current.setDate(current.getDate() + 1);
      }

      return result;
    };

    const startDate = new Date("2026-04-01");

    salesByDate = fillDates(salesByDate, startDate);
    usersByDate = fillDates(usersByDate, startDate);


    const topProducts = Object.entries(productMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      totalOrders: orders.length,
      totalProducts: products.length,
      totalUsers: users.length,

      totalPayments: orders.reduce(
        (sum, o) => sum + (o.totalPrice || 0),
        0
      ),

      salesByDate,
      usersByDate,

      codPayments,
      onlinePayments,
      topProducts
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});