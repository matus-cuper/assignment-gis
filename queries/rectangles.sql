SELECT ST_DISTANCE(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POLYGON((' || $1 || ' ' || $2 || ',' || $1 || ' ' || $4 || ',' || $3 || ' ' || $4 || ',' || $3 || ' ' || $2 || ',' || $1 || ' ' || $2 || '))'), 3857)) AS distance, name, category, amenity,
ST_Y(ST_TRANSFORM(point, 4326)) AS lat, ST_X(ST_TRANSFORM(point, 4326)) AS lon
FROM amenity_point
WHERE category IN ($5, $6, $7)
AND ST_WITHIN(point, ST_TRANSFORM(ST_GEOMFROMEWKT('SRID=4326;POLYGON((' || $1 || ' ' || $2 || ',' || $1 || ' ' || $4 || ',' || $3 || ' ' || $4 || ',' || $3 || ' ' || $2 || ',' || $1 || ' ' || $2 || '))'), 3857))
ORDER BY distance
LIMIT $8
