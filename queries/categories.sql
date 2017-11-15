SELECT DISTINCT ON (name) way, name, tourism AS amenity
FROM planet_osm_point
WHERE name != ''
AND tourism in ('alpine_hut', 'apartment', 'apartments', 'chalet', 'guest_house', 'hostel', 'hotel', 'motel', 'resort', 'wilderness_hut')
ORDER BY name, tourism, way


SELECT DISTINCT ON (name) way, name, amenity
FROM planet_osm_point
WHERE name != ''
AND amenity in ('bar', 'bar;cafe', 'cafe', 'cafe;coworking_space', 'ice_cream', 'nightclub', 'pub')
ORDER BY name, amenity, way


SELECT DISTINCT ON (name) way, name, amenity
FROM planet_osm_point
WHERE name != ''
AND amenity in ('bbq', 'biergarten', 'fast_food', 'food_court', 'restaurant')
ORDER BY name, amenity, way
