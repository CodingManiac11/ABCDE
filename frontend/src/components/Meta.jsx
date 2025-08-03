import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title ? `${title} | ShopEase` : 'ShopEase'}</title>
      <meta 
        name="description" 
        content={description || 'Discover amazing products at the best prices on ShopEase'}
      />
      <meta 
        name="keywords" 
        content={keywords || 'ecommerce, shop, online shopping, buy online'}
      />
      <meta property="og:title" content={title ? `${title} | ShopEase` : 'ShopEase'} />
      <meta 
        property="og:description" 
        content={description || 'Discover amazing products at the best prices on ShopEase'}
      />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ShopEase` : 'ShopEase'} />
      <meta 
        name="twitter:description" 
        content={description || 'Discover amazing products at the best prices on ShopEase'}
      />
    </Helmet>
  );
};

export default Meta;
