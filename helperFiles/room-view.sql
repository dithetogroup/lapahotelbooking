-- detailed info for each room type, including how many physical rooms exist for that room type:

SELECT 
  rt.id AS room_type_id,
  rt.room_name,
  rt.room_code,
  rt.available_rooms,
  rt.week_price,
  rt.weekend_price,
  rt.discounted_price,
  rt.status AS room_type_status,
  rt.created_at AS room_type_created,
  rt.updated_at AS room_type_updated,

  bt.bed_type,
  bt.created_at AS bed_type_created,
  bt.updated_at AS bed_type_updated,

  rd.room_details_list,

  COUNT(r.id) AS total_rooms_of_this_type

FROM room_types rt

-- Join bed_types table
LEFT JOIN bed_types bt ON rt.bed_type_id = bt.id

-- Join room_details (optional: shows amenities or features per bed_type)
LEFT JOIN room_details rd ON rd.bed_type_id = bt.id

-- Join rooms table to count how many actual rooms exist per type
LEFT JOIN rooms r ON r.room_type_id = rt.id

GROUP BY 
  rt.id,
  rt.room_name,
  rt.room_code,
  rt.available_rooms,
  rt.week_price,
  rt.weekend_price,
  rt.discounted_price,
  rt.status,
  rt.created_at,
  rt.updated_at,
  bt.bed_type,
  bt.created_at,
  bt.updated_at,
  rd.room_details_list;
