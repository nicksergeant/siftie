Siftie
=============

[Siftie](https://siftie.com) is an RSS reader for everyone. It's a web app, and
it's built with the [Meteor](https://www.meteor.com/) framework.

This repository is just the web app. There is a separate service that does the
actual crawling of feeds, and it's called [Siftie Feeds](https://github.com/siftie/feeds).
You need to have both running if you want items to actually appear.

UI Screenshot
-------------

![http://i.nick.sg/fddd1db0125d4c7e82a4253d6c30c936.gif](http://i.nick.sg/fddd1db0125d4c7e82a4253d6c30c936.gif)

Install
-------

- `curl https://install.meteor.com/ | sh`

Develop
-------

1. `cd /path/to/siftie`
2. `meteor`
3. Visit [http://localhost:3000/](http://localhost:3000/).

Deploy
------

1. `heroku create --buildpack https://github.com/AdmitHub/meteor-buildpack-horse.git`
2. `heroku addons:create mongolab:sandbox`
3. `heroku config:set FEEDIE_KEY='...'`
5. `heroku config:set POSTMARK_API_KEY='...'`
6. `heroku config:set ROOT_URL='https://siftie.com'`
7. `git push heroku`
