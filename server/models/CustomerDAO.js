require("../utils/MongooseUtil");
const Models = require("./Models");

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  async insert(customer) {
    const mongoose = require("mongoose");
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },

  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };

    const result = await Models.Customer.findOneAndUpdate(query, newvalues, {
      new: true,
    });

    return result;
  },

  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  async update(customer) {
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    };

    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      newvalues,
      { new: true }
    );

    return result;
  },

  // 🔥 LẤY TOÀN BỘ
  async selectAll() {
    const customers = await Models.Customer.find({}).exec();
    return customers;
  },

  // 🔥 LẤY THEO ID (cách 1)
  async selectById(id) {
    const customer = await Models.Customer.findById(id);
    return customer;
  },

  // 🔥 LẤY THEO ID (cách 2 - bạn vừa thêm)
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },

  // 🔥 XOÁ
  async delete(id) {
    const result = await Models.Customer.findByIdAndDelete(id);
    return result;
  },

  // 🔥 SEARCH
  async search(keyword) {
    const query = {
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    };

    const customers = await Models.Customer.find(query);
    return customers;
  },
};

module.exports = CustomerDAO;