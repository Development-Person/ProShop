import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import { listProducts } from '../actions/productActions';

/* import axios from 'axios'; we did not need this here once we switched to redux since it's handled in the Actions*/
/*this was all the stuff that was in Homescreen before the return value before we switched to using Redux.
 useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('api/products');
      setProducts(data);
    };
    fetchProducts();
  }, []);
  
  products = what we want to call the state, setProducts = the function that we want to apply to the state. Empty array is the default for products.
  const [products, setProducts] = useState([]);

  1. setProducts sets the empy array in useState to the data returned by the axios.get request.
  2. useEffect fires off when HomeScreen.js loads. 
  3. {data} = res.data. 
  4. https://scotch.io/tutorials/asynchronous-javascript-using-async-await offers a good tutorial on why you would use async-await instead of a promise (which would chain a .then with a resultant arrow function): tldr it leads to cleaner code
  5. The second argument of useEffect is for an array of dependencies. If a dependency within the array changes it will trigger useEffect. If you don't have any dependencies then assign the second argument an empty array or else you will 
  get infinite get requests.
  */

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword; //get the keyword from the query params
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber)); //keyword lists products according to what is in the keyword (could be nothing or could be a random word)
  }, [dispatch, keyword, pageNumber]);

  //we check for keyword in product carousel because we don't want the carousel showing up when doing a search. Keyword is an easy way to tell if there is a search happening.
  return (
    <>
      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
