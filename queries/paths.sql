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
		 (SELECT ARRAY_AGG(t.osm_id)
		  FROM (
			SELECT DISTINCT ON (a.points) a.points, v.osm_id, MIN(ST_DISTANCE(v.the_geom, a.points)) OVER (PARTITION BY a.points ORDER BY ST_DISTANCE(v.the_geom, a.points))
			FROM ((SELECT ST_GEOMFROMEWKT('SRID=4326;POINT(' || $3 || ' ' || $4 || ')') AS points)) a
			CROSS JOIN ways_vertices_pgr v
		  ) t),
		 directed := false
	) dij
	JOIN ways ON dij.edge = ways.gid
) t
