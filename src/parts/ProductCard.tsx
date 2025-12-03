import type Product from '../interfaces/Product';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../utils/useStateObject';
import priceFormatter from '../utils/priceFormatter';
import addToCart from '../utils/addToCart';
import { currentLang } from '../utils/routeLocalize';
import { Card, Button, Row, Col } from 'react-bootstrap';
import Image from './Image';

export default function ProductCard(
  { id, name, quantity, price$, slug }: Product
) {

  const navigate = useNavigate();
  const [_state, setState] = useStateContext();

  return <Card
    className="mb-4 border-0"
    role="button" /*sets the cursor to pointer*/
    onClick={() => navigate(`/${currentLang()}/products/${slug}`)}
  >
    <Card.Body as={Row} className="pb-4">
      <Col className="mb-n5">
        <Card.Title>{name}</Card.Title>
        <Card.Text className="mb-0">
          <strong className=" d-sm-none">Qty:</strong>
          <strong className="d-none d-none d-sm-inline-block">Quantity:</strong>
          <span className="float-end">{quantity}</span>
        </Card.Text>
        <Card.Text>
          <strong>
            Price:
            <span className="float-end"> {priceFormatter(price$)}</span>
          </strong>
        </Card.Text>
        <Button variant="primary w-100">More info</Button>
        <Button
          variant="primary me-5 mt-3 w-100"
          onClick={e => { e.stopPropagation(); addToCart({ productId: id, setState }); }}>
          Buy
        </Button>
      </Col>
      <Col className="mb-n2">
        <Card.Img
          as={Image}
          src={'/images/products/' + id + '.jpg'}
          alt={'Product image of the product ' + name + '.'}
          className="h-100"
        />
      </Col>
    </Card.Body>
  </Card >;
}