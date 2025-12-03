export default async function addToCart(
  { productId = 0, setState = () => { }, relative = true, quantity = 1 }: any
) {
  const newCartState = await (await fetch('/api/change-product-in-cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity, add: relative })
  })).json();

  setState('showShoppingCart', true);
  return newCartState;
}