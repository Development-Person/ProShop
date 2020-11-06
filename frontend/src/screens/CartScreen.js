import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { addToCart } from '../actions/cartActions';
import Message from '../components/Message';

const CartScreen = ({ match, location, history }) => {
  //we need match.params.id to id our product so we destructure into {match}. We also need location bc we need the quantity and we get that through location.search. We also want history which is used to redirect.
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1; //console.log(qty) if you added one thing to cart would be ?qty=1.
  //location.search.split will split the string at the = and then put each part into an array (?qty in [0], the nunmber in [1]). We use [1] to get the number because we want to know the quantity.
  //We wrap it in a number because otherwise it will be returned as a string, and we want it as a number.
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  return <div>Cart</div>;
};

export default CartScreen;
