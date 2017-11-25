SELECT json_build_object(
  'type',       'Feature',
  'geometry',   ST_AsGeoJSON(t.point)::json,
  'properties', json_build_object(
	   'amenity', t.amenity,
     'category', t.category,
     'distance', t.distance,
     'name', t.name
  )
) AS geojson
FROM
(
	SELECT ST_TRANSFORM(point, 4326) AS point, amenity, category, name,
	ST_DISTANCE(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POINT(' || $1 || ' ' || $2 || ')'), 3857)) AS distance
	FROM amenity_point
        WHERE category IN ($3, $4, $5)
	AND ST_DWITHIN(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POINT(' || $1 || ' ' || $2 || ')'), 3857), $6)
	ORDER BY distance
	LIMIT $7
) t
