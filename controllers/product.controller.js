const Product = require('../models/product.model');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const {
  errorHandler
} = require('../helpers/dbErrorHandling');


exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: 'Product not found'
        });
      }
      req.product = product;
      next();
    });
};

exports.removeProduct = (req, res) => {
  let product = req.product
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      })
    }

    res.json({
      message: "product deleted sucessfully"
    })
  })
}
exports.create = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    // check for all fields
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping
    } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
    const product = new Product(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }

      res.json(result);
    });
  });
};
exports.updateProduct = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded'
      });
    }
    // check for all fields
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping
    } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
    let product = req.product;
    product = _.extend(product, fields)

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size'
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }

      res.json(result);
    });
  });
};

exports.readProduct = (req, res) => {
  console.log(req.product)
  req.product.photo = undefined
  return res.json(req.product)
}

/*
 * sell / arrival
 * arrival = /products?sortBy=createdAt&order=desc&limit=4
 * sold = /products?sortBy=sold&order=desc&limit=4
 */

exports.listProducts = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([
      [sortBy, order]
    ])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found'
        });
      }
      res.json({length: products.length,products});
    });
}