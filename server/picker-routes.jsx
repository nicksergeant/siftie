Picker.route('/:teamSlug/curated/rss', function(params, req, res, next) {
  res.setHeader('Content-Type', 'text/xml');

  const items = [];

  const itemizer = (item) => {
    return `
      <item>
        <title>${item.title}</title>
        <link>${item.link}</link>
        <description>${item.description}</description>
        <pubDate>${item.pubDate}</pubDate>
      </item>
    `;
  };

  const itemsXml = items.map((item) => {
    return itemizer(item);
  });

  res.end(`<?xml version="1.0" encoding="utf-8" ?>
    <rss version="2.0">
      <channel>
        ${itemsXml}
      </channel>
    </rss>
  `);
});
