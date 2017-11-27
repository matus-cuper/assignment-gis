SELECT ST_AsGeoJSON(t.the_geom)::json AS geojson
FROM (
	SELECT dij.*, ways.gid, ways.the_geom
	FROM pgr_dijkstra(
		'SELECT gid AS id,
		 source_osm AS source,
		 target_osm AS target,
		 length AS cost
		 FROM ways',
		 (SELECT osm_id FROM ways_vertices_pgr ORDER BY ST_DISTANCE(the_geom, ST_GEOMFROMEWKT('SRID=4326;POINT(' || $1 || ' ' || $2 || ')')) LIMIT 1),
		 (SELECT osm_id FROM ways_vertices_pgr ORDER BY ST_DISTANCE(the_geom, ST_GEOMFROMEWKT('SRID=4326;POINT(' || $3 || ' ' || $4 || ')')) LIMIT 1),
		 directed := false
	) dij
	JOIN ways ON dij.edge = ways.gid
) t
