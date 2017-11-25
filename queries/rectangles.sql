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
  ST_DISTANCE(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POLYGON((' || $1 || ' ' || $2 || ',' || $1 || ' ' || $4 || ',' || $3 || ' ' || $4 || ',' || $3 || ' ' || $2 || ',' || $1 || ' ' || $2 || '))'), 3857)) AS distance
  FROM amenity_points
  WHERE category IN ($5, $6, $7)
  AND ST_WITHIN(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POLYGON((' || $1 || ' ' || $2 || ',' || $1 || ' ' || $4 || ',' || $3 || ' ' || $4 || ',' || $3 || ' ' || $2 || ',' || $1 || ' ' || $2 || '))'), 3857))
  ORDER BY distance
  LIMIT $8
) t
