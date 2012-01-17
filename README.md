# node_tile_server

This is an experimental [node.js](http://nodejs.org) powered [Quad Tile](http://wiki.openstreetmap.org/wiki/QuadTiles) server written in [CoffeeScript](http://coffeescript.org) to render geo data from a postgres database.

Its purpose is to create map overlays in a convenient way using a [server-side](https://github.com/LearnBoost/node-canvas) version of the HTML5 [Canvas](https://developer.mozilla.org/en/Canvas_tutorial) element.

It supports different tile modes:

* Rendering a heatmap overlay based on [geo points](http://postgis.refractions.net/documentation/manual-1.5/ST_Point.html).

* Rendering a very simple street map based on the [OpenStreetMap schema](http://wiki.openstreetmap.org/wiki/Osmosis/PostGIS_Setup).

It works very well with [CloudMade's Leaflet](http://leaflet.cloudmade.com/) map client - [examples included](https://github.com/fabrik42/node_tile_server/tree/master/examples).

## Rendering a Heatmap

![probably outdated screenshot](http://dl.dropbox.com/u/1523969/node_tile_server/heatmap.jpg)

## Rendering OpenStreetMap Data

![probably outdated screenshot](http://dl.dropbox.com/u/1523969/node_tile_server/osm_streets.jpg)

# Setup Guide for OSM Data

*Note on rendering OpenStreetMap data:* 
At the moment it doesn't really render much and it probably will never compete with other full sized map renderers like mapnik.

But you could use it e.g. to add a second tile layer to your map client and render some additional custom map features.

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

Create the file `src/settings.coffee`, based on `src/settings_example.coffee`

### Build the lib

`cake build`

### Run the server

`node lib/server.js`

### Point your browser to

`http://localhost:3000/osm_streets.html`