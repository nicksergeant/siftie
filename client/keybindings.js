keyBindings = {
  expandImage: function(e) {
    e.preventDefault();
    $('i.expand-img').click();
  },
  nextChannel: function(e) {
    e.preventDefault();
    const next = $('.channel-panel__list li.active')
      .next('li')
      .children('a')
      .get(0);
    if (next) next.click();
  },
  nextItem: function(e) {
    e.preventDefault();
    $('article.post.-active')
      .next()
      .click();
  },
  nextTeam: function(e) {
    e.preventDefault();
    const next = $('nav.menu div a.active')
      .next('a')
      .get(0);
    if (next) {
      next.click();
    } else {
      const first = $('nav.menu div a')
        .first()
        .get(0);
      first.click();
    }
  },
  openItem: function(e) {
    e.preventDefault();
    const link = $('a.item-link').attr('href');
    window.open(link);
  },
  prevChannel: function(e) {
    e.preventDefault();
    const prev = $('.channel-panel__list li.active')
      .prev('li')
      .children('a')
      .get(0);
    if (prev) prev.click();
  },
  prevItem: function(e) {
    e.preventDefault();
    $('article.post.-active')
      .prev()
      .click();
  },
  prevTeam: function(e) {
    e.preventDefault();
    const prev = $('nav.menu div a.active')
      .prev('a')
      .get(0);
    if (prev) {
      prev.click();
    } else {
      const last = $('nav.menu div a')
        .last()
        .get(0);
      last.click();
    }
  },
  toggleChannels: function(e) {
    e.preventDefault();
    $('i.panel-toggle').click();
  },
};

$(document).bind('keydown', e => {
  if (['INPUT', 'TEXTAREA'].indexOf(e.target.nodeName) !== -1) return;
  if (!e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
    switch (e.keyCode) {
      case 37:
      case 72:
        keyBindings.prevChannel(e);
        break;
      case 39:
      case 76:
        keyBindings.nextChannel(e);
        break;
      case 74:
      case 40:
        keyBindings.nextItem(e);
        break;
      case 75:
      case 38:
        keyBindings.prevItem(e);
        break;
      case 73:
      case 27:
        keyBindings.expandImage(e);
        break;
      case 13:
      case 79:
        keyBindings.openItem(e);
        break;
      case 67:
        keyBindings.toggleChannels(e);
        break;
      case 78:
        keyBindings.nextTeam(e);
        break;
      case 80:
        keyBindings.prevTeam(e);
        break;
    }
  }
});
