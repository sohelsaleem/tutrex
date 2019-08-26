sudo git reset --hard
sudo git pull origin master
sudo -u www-data php app/console doctrine:schema:update --force
sudo -u www-data php app/console assetic:dump
sudo -u www-data php app/console cache:clear --env=prod
sudo chmod -R 777 app/cache
sudo chmod -R 777 app/logs
sudo chmod -R 777 web
