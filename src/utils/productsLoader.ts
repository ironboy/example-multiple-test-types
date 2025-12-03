export default async function productsLoader({ params }: any) {
  if (!['en', 'sv', 'no'].includes(params.lang)) { return []; }
  let url = `/api/${params.lang}/products`;
  if (params.slug) { url += '?slug=' + params.slug; }
  return {
    products:
      await (await fetch(url)).json()
  };
};