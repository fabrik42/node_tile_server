module.exports =
  osm_streets:
    postgres:
      host: 'localhost'
      port: 5432
      connectionPool: 5
      user: 'USER'
      password: 'PASSWORD'
      database: 'osm_node'

  heatmap:
    postgres:
      host: 'localhost'
      port: 5432
      connectionPool: 5
      user: 'USER'
      password: 'PASSWORD'
      database: 'geo_point_table'
    query:
      table: 'geo_points'
      column: 'geom'