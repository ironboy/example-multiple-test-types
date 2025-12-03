import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useStateObject } from '../utils/useStateObject';
import ShoppingCart from './ShoppingCart';

export default function Main() {
  // a state to use with outlet context
  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Price (low to high)',
    showShoppingCart: false
  });

  const [state, setter] = stateAndSetter;
  (globalThis as any).stateSetter = setter;

  return <main className="mt-5">
    <Container className="mt-5 mb-4">
      <Outlet context={stateAndSetter} />
      <ShoppingCart
        show={state.showShoppingCart}
        hideMe={() => setter('showShoppingCart', false)
        } />
    </Container>
  </main>;
}