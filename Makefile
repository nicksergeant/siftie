deploy:
	@git push dokku

feeds:
	@node --harmony ../feedie/index

feeds-server:
	@dokku run feedie make feeds

import-db-backup:
	mkdir ~/Downloads/siftie;
	mv ~/Downloads/*_siftie-mongodb.tar ~/Downloads/siftie.tar
	tar xvf ~/Downloads/siftie.tar -C ~/Downloads/siftie
	brew unlink mongodb
	brew link homebrew/versions/mongodb26
	cd ~/Downloads/siftie; mongodump --dbpath ~/Downloads/siftie
	brew unlink homebrew/versions/mongodb26
	brew link mongodb
	mongorestore --drop --port=3001 -d meteor ~/Downloads/siftie/dump/siftie
	rm -rf ~/Downloads/siftie
	rm -rf ~/Downloads/siftie.tar

run:
	@meteor

.PHONY: deploy feeds feeds-server import-db-backup run
