export default async function emptyCart() {
  return await (await fetch('/api/cart', {
    method: 'DELETE'
  })).json();
}
