/**
 * Route metadata for SEO prerendering.
 * Each key is a route path; values provide per-page SEO fields.
 */
const routeMeta = {
  '/': {
    title: 'DoAide Draw — Free Online Whiteboard & Drawing Tool',
    description:
      'DoAide Draw — Free online whiteboard and drawing tool. Sketch, diagram, and collaborate with an infinite canvas. No login required.',
    canonical: 'https://draw.doaide.com/',
    og: {
      title: 'DoAide Draw — Free Online Whiteboard & Drawing Tool',
      description:
        'Sketch, diagram, and draw on an infinite canvas. Free online whiteboard — no login required.',
      image: 'https://draw.doaide.com/og-image.png',
      imageWidth: 1200,
      imageHeight: 630,
      type: 'website',
    },
  },
}

export default routeMeta
