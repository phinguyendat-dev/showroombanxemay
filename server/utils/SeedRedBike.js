require('./MongooseUtil');
const mongoose = require('mongoose');
const Models = require('../models/Models');

async function ensureRedBike() {
  const productName = 'Honda Vision Do';
  const exists = await Models.Product.findOne({ name: productName }).exec();
  if (exists) return;

  let category = await Models.Category.findOne({ name: 'Xe ga' }).exec();
  if (!category) {
    category = await Models.Category.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Xe ga'
    });
  }

  // 1x1 red pixel PNG as base64 fallback image.
  const redBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9u0dQAAAAASUVORK5CYII=';

  await Models.Product.create({
    _id: new mongoose.Types.ObjectId(),
    name: productName,
    price: 35000000,
    image: redBase64,
    cdate: Date.now(),
    category,
    brand: 'Honda',
    engine: '110cc',
    type: 'Xe ga',
    color: 'Do'
  });
  console.log('[seed] Added red bike:', productName);
}

module.exports = { ensureRedBike };
