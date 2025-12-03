import type Product from '../interfaces/Product';
import { Row, Col, Button } from 'react-bootstrap';
import { Link, useLoaderData } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import Image from '../parts/Image';
import productsLoader from '../utils/productsLoader';
import addToCart from '../utils/addToCart';
import { useStateContext } from '../utils/useStateObject';
import priceFormatter from '../utils/priceFormatter';
import { currentLang } from '../utils/routeLocalize';

ProductDetailsPage.route = {
  path: '/products/:slug',
  parent: '/',
  loader: productsLoader
};

export default function ProductDetailsPage() {

  const [_state, setState] = useStateContext();

  const product =
    useLoaderData().products[0] as Product;

  // if no product found, show 404
  if (!product) {
    return <NotFoundPage />;
  }

  const { id, name, quantity, price$, description } = product;

  return <article className="product-details">
    <Row>
      <Col>
        <h2 className="text-primary">{name}</h2>
        <Image
          src={'/images/products/' + id + '.jpg'}
          alt={'Product image of the product ' + name + '.'}
        />
        {description.split('\n').map((x, i) => <p key={i}>{x}</p>)}
      </Col>
    </Row>
    <Row>
      <Col className="px-4 pb-4">
        <Row className="p-3 bg-primary-subtle rounded">
          <Col className="pe-4 pe-sm-5 border-end border-primary">
            <strong>Quantity</strong>:
            <span
              className="d-block d-sm-inline float-sm-end"
            >
              {quantity}
            </span>
          </Col>
          <Col className="ps-4 ps-sm-5 text-end text-sm-start">
            <strong>Price</strong>:
            <span
              className="d-block d-sm-inline float-sm-end"
            >
              {priceFormatter(price$)}
            </span>
          </Col>
        </Row>
      </Col>
    </Row >
    <Row>
      <Col>
        <Link to={'/' + currentLang()} className="btn btn-primary" style={{ minWidth: '25%' }}>
          Back to the product list
        </Link>
        <Button
          className="btn btn-primary float-end w-25"
          onClick={() => addToCart({ productId: id, setState })}>
          Buy
        </Button>
      </Col>
    </Row>
  </article >;
};