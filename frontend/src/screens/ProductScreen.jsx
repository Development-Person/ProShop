import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Rating from '../components/Rating';

/*
1. Explainer for useState and useEffect can be found in HomeScreen.js
2. Difference here is the useState default is set to an Object rather than an array because a single product is an object (cf products which is an array)
3. The react-router-dom library passes in a prop called match (props.match) into every route that is rendered. Destructured here as { Match }
4. Inside the Match object is another object called params. This holds all the params applying to product. The one we need is id, which would be longform typed as match.params.id.
5. The route path in app.js to this Component is '/product/:id' - the :id is a placeholder and is reffered to when match.params.id is called*/

const ProductScreen = ({ match }) => {
  /*
  1. The following code was testing placeholder during construction of the react frontend.
  2. It has been replaced by useState and useEffect().  
  3. The code would bring up the correct product by running find() on products.
  4. With find() we are looking for the element of the array (called 'p' in this instance) with the ._id parameter (stored in the "database") which matches the match.params.id, which was provided to us by the Route (which is explained above).   
            
        const product = products.find((p) => p._id === match.params.id);

  */
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${match.params.id}`);
      setProduct(data);
    };
    fetchProduct();
  }, []);

  return (
    <>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Row>
                <Col>Price: </Col>
                <Col>
                  <strong>${product.price}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Status: </Col>
                <Col>
                  <strong>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                className='btn-block'
                type='button'
                disabled={product.countInStock === 0}>
                Add to Cart
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
      <Row className='my-2'></Row>
      <Link className='btn- btn-primary my-3 p-2' to='/'>
        Go Back
      </Link>
    </>
  );
};

export default ProductScreen;
