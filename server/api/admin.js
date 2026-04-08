const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil'); // ✅ thêm

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
const CustomerDAO = require('../models/CustomerDAO');

// ================= LOGIN =================
router.post('/login', async function (req, res) {
  const { username, password } = req.body;

  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

    if (admin) {
      const token = JwtUtil.genToken(username, password);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

// ================= TOKEN =================
router.get('/token', JwtUtil.checkToken, function (req, res) {
  res.json({ success: true, message: 'Token is valid' });
});

// ================= CATEGORY =================
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const result = await CategoryDAO.insert({ name: req.body.name });
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CategoryDAO.update({
    _id: req.params.id,
    name: req.body.name,
  });
  res.json(result);
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CategoryDAO.delete(req.params.id);
  res.json(result);
});

// ================= PRODUCT =================
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  const total = await ProductDAO.selectByCount();
  const sizePage = 4;
  const noPages = Math.ceil(total / sizePage);

  let curPage = parseInt(req.query.page) || 1;
  const skip = (curPage - 1) * sizePage;

  const products = await ProductDAO.selectBySkipLimit(skip, sizePage);

  res.json({ products, noPages, curPage });
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const category = await CategoryDAO.selectByID(req.body.category);

  const product = {
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    cdate: new Date().getTime(),
    category: category,
    brand: req.body.brand,
    engine: req.body.engine,
    type: req.body.type,
    color: req.body.color,
  };

  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const category = await CategoryDAO.selectByID(req.body.category);

  const product = {
    _id: req.params.id,
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    cdate: new Date().getTime(),
    category: category,
    brand: req.body.brand,
    engine: req.body.engine,
    type: req.body.type,
    color: req.body.color,
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await ProductDAO.delete(req.params.id);
  res.json(result);
});

// ================= CUSTOMER =================

// GET ALL
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// GET BY ID
router.get('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const customer = await CustomerDAO.selectById(req.params.id);
  res.json(customer);
});

// DELETE
router.delete('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CustomerDAO.delete(req.params.id);
  res.json(result);
});

// SEARCH
router.get('/customers/search/:keyword', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.search(req.params.keyword);
  res.json(customers);
});

// ACTIVE
router.put('/customers/active/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CustomerDAO.active(req.params.id, req.body.token, 1);
  res.json(result);
});

// DEACTIVE
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await CustomerDAO.active(req.params.id, req.body.token, 0);
  res.json(result);
});

// 🔥 SEND EMAIL (NEW)
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);

  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);

    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

// ================= ORDER =================

// GET ALL
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

// GET BY CUSTOMER
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectByCustID(req.params.cid);
  res.json(orders);
});

// UPDATE STATUS
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await OrderDAO.update(req.params.id, req.body.status);
  res.json(result);
});

// DELETE ONE
router.delete('/orders/:id', JwtUtil.checkToken, async function (req, res) {
  const result = await OrderDAO.deleteById(req.params.id);
  res.json(result);
});

// BULK DELETE (body: { ids: string[] })
router.post('/orders/bulk-delete', JwtUtil.checkToken, async function (req, res) {
  const ids = req.body && req.body.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: 'ids array required' });
  }
  const result = await OrderDAO.deleteMany(ids);
  res.json({ success: true, deletedCount: result.deletedCount });
});

module.exports = router;