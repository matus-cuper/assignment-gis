WITH amenities AS (
	SELECT DISTINCT ON (name) ST_DISTANCE(point, ST_TRANSFORM(street.way, 3857)) AS distance, name, category, amenity,
	ST_Y(ST_TRANSFORM(point, 4326)) AS lat, ST_X(ST_TRANSFORM(point, 4326)) AS lon
	FROM amenity_point
	JOIN
		(
		SELECT way FROM planet_osm_line
		WHERE unaccent(lower(name)) LIKE unaccent(lower($8 || '%'))
		ORDER BY ST_DISTANCE(ST_TRANSFORM(way, 4326), ST_GEOMFROMEWKT('SRID=4326;POINT(' || $1 || ' ' || $2 || ')'))
		) street ON ST_DWITHIN(point, ST_TRANSFORM(street.way, 3857), $6)
	WHERE category IN ($3, $4, $5)
	ORDER BY name, distance
)
SELECT * FROM amenities
ORDER BY distance
LIMIT $7
