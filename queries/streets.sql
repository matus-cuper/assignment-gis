SELECT json_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(t.point)::json,
  'properties', json_build_object(
     'amenity', t.amenity,
     'category', t.category,
     'distance', t.distance,
		 'original_distance', t.original_distance,
     'name', t.name,
     'street',   ST_AsGeoJSON(t.way)::json
  )
) AS geojson
FROM
(
	WITH t AS (
		SELECT ST_TRANSFORM(way, 3857) AS way, ST_DISTANCE(ST_TRANSFORM(way, 3857), ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POINT(' || $1 || ' ' || $2 || ')'), 3857)) AS original_distance
		FROM planet_osm_line
		WHERE unaccent(lower(name)) LIKE unaccent(lower($8 || '%'))
		ORDER BY original_distance
		LIMIT $7
	)
	SELECT DISTINCT ON (a.name) a.amenity, a.category, a.name, t.original_distance, ST_DISTANCE(t.way, a.point) AS distance, ST_TRANSFORM(t.way, 4326) AS way, ST_TRANSFORM(a.point, 4326) AS point
	FROM t
	JOIN amenity_points AS a ON ST_DISTANCE(t.way, a.point) < $6
	WHERE a.category IN ($3, $4, $5)
	ORDER BY a.name, original_distance, distance
) t
ORDER BY t.original_distance, distance
