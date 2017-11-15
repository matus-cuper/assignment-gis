SELECT DISTINCT ON (name) way, name, tourism AS amenity
FROM planet_osm_point
WHERE name != ''
AND tourism in ('alpine_hut', 'apartment', 'apartments', 'chalet', $1, 'hostel', 'hotel', 'motel', 'resort', 'wilderness_hut')
ORDER BY name, tourism, way
