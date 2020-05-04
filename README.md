# Group 4 Project Git

Structure:
-db_builder.sql
-README.md
-Site
	-app.js
	-config.js
	-db.js
	-package-lock.json
	-package.json
	-routes.js
	-server.js
	-node_modules
		-all code to execute node.js local host
	-resources
		-css
		-img
		-scripts
	-views
		-ejs
		-pages

To run project:


```shell
cd Site/
npm install
node app.js
```
go to localhost:3000/ in a browser

### Database Setup

copy database from db_builder to a local database named site_db, owned by user postgres with password passwd, on port 5432
