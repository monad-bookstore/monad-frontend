cd dist/
rsync -v --stats --progress -a --force -I . root@91.211.246.132:/var/www/html --chmod=Du=rwx,Dgo=rx,Fu=rw,Fog=r
cd ../