CREATE TABLE amenity_point (
	osm_id bigint,
	point geometry(Point,3857),
	category text,
	name text,
	amenity text
)

INSERT INTO amenity_point (point, category, name, amenity)
SELECT ST_TRANSFORM(way,3857), a.category, name, amenity
FROM planet_osm_point
CROSS JOIN (SELECT 'restaurants' AS category) a
WHERE name != ''
AND amenity in ('bbq', 'biergarten', 'fast_food', 'food_court', 'restaurant')

INSERT INTO amenity_point (point, category, name, amenity)
SELECT ST_TRANSFORM(way,3857), a.category, name, amenity
FROM planet_osm_point
CROSS JOIN (SELECT 'bars' AS category) a
WHERE name != ''
AND amenity in ('bar', 'bar;cafe', 'cafe', 'cafe;coworking_space', 'ice_cream', 'nightclub', 'pub')

INSERT INTO amenity_point (point, category, name, amenity)
SELECT ST_TRANSFORM(way,3857), a.category, name, tourism AS amenity
FROM planet_osm_point
CROSS JOIN (SELECT 'hotels' AS category) a
WHERE name != ''
AND tourism in ('alpine_hut', 'apartment', 'apartments', 'chalet', 'guest_house', 'hostel', 'hotel', 'motel', 'resort', 'wilderness_hut')


DROP TABLE amenity_point;
