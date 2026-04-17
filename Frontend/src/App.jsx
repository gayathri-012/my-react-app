
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./PublicLayout";
import PrivateLayout from "./PrivateLayout";

import AdminProtectRoute from "./AdminProtectRoute";

import Home from "./Home";
import Collection from "./Collection";
import Community from "./Community";
import ProductView from "./ProductView";
import ProductDisplay from "./ProductDisplay";
import Cart from "./Components/Cart";
import Category from "./Category";
import Smartwatch from "./Components/Smartwatch";
import Cap from "./Components/Cap";
import Eyewear from "./Components/Eyewear";
import Bag from "./Components/Bag";
import Bluetooth from "./Components/Bluetooth";
import Connect from "./Connect";
import Checkout from "./Components/Checkout";
import Payment from "./Components/Payment";
import Login from "./Login";
import Register from "./Register";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";
import ManageProduct from "./pages/ManageProduct";
import EditProduct from "./pages/EditProduct";
import ManageOrder from "./pages/ManageOrder";
import Profile from "./Profile";
import Orders from "./Orders";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/community" element={<Community />} />
          <Route path="/productview" element={<ProductView />} />
          <Route path="/productdisplay/:id" element={<ProductDisplay />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category" element={<Category />} />
          <Route path="/smartwatch" element={<Smartwatch />} />
          <Route path="/cap" element={<Cap />} />
          <Route path="/eyewear" element={<Eyewear />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/bluetooth" element={<Bluetooth />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          
        </Route>


        <Route element={<PrivateLayout />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route element={<AdminProtectRoute />}>

            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/manageproduct" element={<ManageProduct />} />
            <Route path="/editproduct/:id" element={<EditProduct />} />
            <Route path="/manageorder" element={<ManageOrder />} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;