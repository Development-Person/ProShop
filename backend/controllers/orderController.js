import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

/*We are retrieving products in accordance with the schema set out in orderModel*/
//@desc     Create new order
//@route    POST/api/orders
//@access   Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, //we will be able to get the token and get the userId from the token
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

/*We are an order by its id*/
//@desc     Get order by id
//@route    POST/api/orders/:id
//@access   Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  //If you take a look at the Order model schema, the first property is 'user' which references/links to the User model.
  //The .populate() is saying to use that user model reference/link to populate the found order object with the user name and email.
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export { addOrderItems, getOrderById };
