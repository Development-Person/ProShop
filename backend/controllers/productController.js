import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

/*We are retrieving products in accordance with the schema set out in productModel*/
//@desc     Fetch all products
//@route    GET/api/products
//@access   Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc     Fetch single product
//@route    GET/api/products/:id
//@access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc     delete a product
//@route    DELETE/api/products/:id
//@access   Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc     create a product - every time an admin creates a product a dummy product is created in the database and then productUpdate updates that product
//@route    POST/api/products/
//@access   Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc     update a product
//@route    PUT/api/products/:id
//@access   Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc     create new review
//@route    POST/api/products/:id/reviews
//@access   Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id); //finding the product we are reviewing

  if (product) {
    //check to see if user has already submitted a review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString() //for each review attached to the product, check that the user within the review model matches the logged in user (using user._id)
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed 👮‍♂️');
    }

    const review = {
      //constructing a review object which will contain the information submitted by the user
      name: req.user.name, //logged in user name
      rating: Number(rating), //rating from the body that we destructured above
      comment, //comment from the body that we destructured above
      user: req.user._id, //the user including name, id, etc.
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added 🎉' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
