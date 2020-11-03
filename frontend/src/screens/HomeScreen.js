import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';

const HomeScreen = () => {
  //products = what we want to call the state, setProducts = the function that we want to apply to the state. Empty array is the default for products.
  const [products, setProducts] = useState([]);

  /*
  1. setProducts sets the empy array in useState to the data returned by the axios.get request.
  2. useEffect fires off when HomeScreen.js loads. 
  3. {data} = res.data. 
  4. https://scotch.io/tutorials/asynchronous-javascript-using-async-await offers a good tutorial on why you would use async-await instead of a promise (which would chain a .then with a resultant arrow function): tldr it leads to cleaner code
  5. The second argument of useEffect is for an array of dependencies. If a dependency within the array changes it will trigger useEffect. If you don't have any dependencies then assign the second argument an empty array or else you will 
  get infinite get requests.
  */
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
