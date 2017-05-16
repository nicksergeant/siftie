Picker.route('/:teamSlug/curated/rss', function(params, req, res, next) {
  const team = Teams.findOne({ slug: params.teamSlug });

  if (!team) return res.end();

  const items = CuratedItems.find({ teamId: team._id }).fetch();

  const itemizer = (item) => {
    return `
      <item>
        <title>${item.title}</title>
        <link>${item.url}</link>
        <description><![CDATA[${item.content}]]></description>
        <pubDate>${item.date_published}</pubDate>
      </item>
    `;
  };

  const itemsXml = items.map((item) => {
    return itemizer(item);
  });

  res.setHeader('Content-Type', 'text/xml');
  res.end(`<?xml version="1.0" encoding="utf-8" ?>
    <rss version="2.0">
      <channel>
        ${itemsXml}
      </channel>
    </rss>
  `);
});
