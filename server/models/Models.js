// server/models/Models.js

const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
  },
  { versionKey: false }
);

const CategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String, // Xe số, Xe ga, Xe côn tay, Xe điện
  },
  { versionKey: false }
);

const CustomerSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    password: String,
    name: String,
    phone: String,
    email: String,
    active: Number,
    token: String,
  },
  { versionKey: false }
);

const ProductSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,       // Tên xe: Honda Wave Alpha, Yamaha Exciter...
    price: Number,      // Giá bán (VNĐ)
    image: String,      // Ảnh base64
    cdate: Number,      // Ngày nhập (timestamp)
    category: CategorySchema,

    // 🏍️ THÔNG SỐ XE MÁY
    brand: String,      // Hãng: Honda, Yamaha, Suzuki, SYM, Piaggio
    engine: String,     // Dung tích: 110cc, 125cc, 150cc, 250cc...
    type: String,       // Loại: Xe số, Xe ga, Xe côn tay, Xe điện
    color: String,      // Màu sắc: Đỏ, Xanh, Đen, Trắng...
  },
  { versionKey: false }
);

const ItemSchema = mongoose.Schema(
  {
    product: ProductSchema,
    quantity: Number,
  },
  {
    versionKey: false,
    _id: false,
  }
);

const OrderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cdate: Number,
    total: Number,
    status: String,     // PENDING, APPROVED, CANCELED
    customer: CustomerSchema,
    items: [ItemSchema],
  },
  { versionKey: false }
);

// Models
const Admin    = mongoose.model('Admin',    AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product  = mongoose.model('Product',  ProductSchema);
const Order    = mongoose.model('Order',    OrderSchema);

module.exports = { Admin, Category, Customer, Product, Order };