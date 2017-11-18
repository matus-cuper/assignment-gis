SELECT ST_DISTANCE(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POINT(' || $1 || ' ' || $2 || ')'), 3857)) AS distance, name, amenity,
ST_Y(ST_TRANSFORM(point, 4326)) AS lat, ST_X(ST_TRANSFORM(point, 4326)) AS lon
FROM amenity_point
WHERE category IN ($3, $4, $5)
AND ST_DWITHIN(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POINT(' || $1 || ' ' || $2 || ')'), 3857), $6)
ORDER BY distance
LIMIT $7
