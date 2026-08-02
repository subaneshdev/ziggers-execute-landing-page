export default function sitemap() {
  const baseUrl = 'https://execute.ziggers.in';

  const paths = [
    '',
    '/solutions/product-sampling',
    '/solutions/retail-activation',
    '/solutions/roadshows-and-events',
    '/industries/fmcg-and-d2c',
    '/industries/retail-and-fashion',
    '/industries/tech-and-finance',
    '/cities/chennai',
    '/cities/bangalore',
    '/cities/mumbai',
    '/pricing',
    '/partners',
    '/about',
    '/careers',
    '/contact',
    '/dashboard'
  ];

  return paths.map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.8,
  }));
}
