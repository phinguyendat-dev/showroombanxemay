require('../utils/MongooseUtil');
const Models = require('./Models');

const mongoose = require('mongoose');

const OrderDAO = {
  async insert(order) {
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  },

  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },

  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // giảm dần theo ngày
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },
  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  },

  async deleteById(_id) {
    const result = await Models.Order.findByIdAndDelete(_id);
    return result;
  },

  async deleteMany(ids) {
    const result = await Models.Order.deleteMany({ _id: { $in: ids } });
    return result;
  },
};

module.exports = OrderDAO;