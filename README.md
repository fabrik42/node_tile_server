# node_tile_server

This is an experimental [node.js](http://nodejs.org/) powered tile server that renders data from a postgres database with an [openstreetmap schema](http://wiki.openstreetmap.org/wiki/Osmosis/PostGIS_Setup).

It works very well with [CloudMade's Leaflet](http://leaflet.cloudmade.com/) map client (example included).

At the moment it doesn't really render much and it probably will never compete with other full sized map renderers like mapnik.

But you could use it e.g. to add a second tile layer to your map client and render some additional custom map features.

![probably outdated screenshot](http://dl.dropbox.com/u/1523969/screenshots/2011-06-06T23-06-02_screenshot1.jpg)

# Installation Guide

## Requirements for OS X

* node.js
* npm
* homebrew
* Postgres and PostGIS
* Java (only for importing of osm files into db)

## Part 1: Setting up an OpenStreetMap database with some example data

### Install osmosis

`brew install osmosis`

### Setup DB

```sql
CREATE DATABASE osm_node
  WITH ENCODING='UTF8'
       OWNER=YOUR_DB_USER
       TEMPLATE=template_postgis
       CONNECTION LIMIT=-1;
```

See: http://wiki.openstreetmap.org/wiki/Osmosis/PostGIS_Setup

### Install HStore

`psql -d osm_node -f /usr/local/Cellar/postgresql/9.0.3/share/contrib/hstore.sql`

### Load Osmosis Scripts

`psql -d osm_node -f /usr/local/Cellar/osmosis/0.38/libexec/script/pgsql_simple_schema_0.6.sql`

`psql -d osm_node -f /usr/local/Cellar/osmosis/0.38/libexec/script/pgsql_simple_schema_0.6_linestring.sql`

`psql -d osm_node -f /usr/local/Cellar/osmosis/0.38/libexec/script/pgsql_simple_schema_0.6_bbox.sql`

`psql -d osm_node -f /usr/local/Cellar/osmosis/0.38/libexec/script/pgsql_simple_schema_0.6_action.sql`

### Load an osm file in DB

`osmosis --read-xml file="/Users/fabrik42/Dev/node/postgis/osm/dieburg.osm"  --write-pgsql user="YOUR_DB_USER" database="osm_node" password="YOUR_DB_PASSWORD"`

## Part 2: Starting the node.js Server

### Install node.js dependencies

`npm install`

### Create database config file

Create the file `src/settings.js`, based on `src/settings_example.js`

### Run the server

`node src/app.js`

### Point your browser to

`http://localhost:3000`