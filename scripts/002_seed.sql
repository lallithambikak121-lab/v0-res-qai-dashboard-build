-- Seed weather data for multiple locations
insert into public.weather_data (location, temperature, humidity, wind_speed, wind_direction, precipitation, visibility, pressure, condition)
values
  ('California', 28.5, 45, 12.5, 'NW', 0, 10, 1013.2, 'Partly Cloudy'),
  ('Texas', 32.1, 38, 15.2, 'S', 0, 12, 1012.8, 'Clear'),
  ('Florida', 26.8, 72, 8.3, 'SE', 2.5, 8, 1015.1, 'Rainy'),
  ('New York', 15.2, 55, 18.7, 'NE', 0, 9, 1011.5, 'Windy'),
  ('Washington', 12.3, 62, 22.1, 'W', 5.1, 7, 1010.2, 'Stormy')
on conflict do nothing;

-- Seed risk assessments for each state
insert into public.risk_assessments (state, risk_level, risk_score, contributing_factors)
values
  ('California', 'high', 78, array['Wildfire Risk', 'Drought Conditions', 'High Temperatures']),
  ('Texas', 'high', 75, array['Flooding Risk', 'Tornado Potential', 'Hurricane Season']),
  ('Florida', 'critical', 92, array['Hurricane Risk', 'Flooding', 'Storm Surge']),
  ('New York', 'medium', 55, array['Winter Storms', 'Nor''easters', 'Coastal Flooding']),
  ('Washington', 'medium', 48, array['Volcanic Activity', 'Wildfires', 'Earthquakes'])
on conflict do nothing;

-- Seed alerts
insert into public.alerts (title, description, severity, location, status, alert_type, affected_population)
values
  ('Wildfire Warning', 'Active wildfires in Northern California threatening residential areas', 'critical', 'California', 'active', 'wildfire', 125000),
  ('Flood Watch', 'Heavy rainfall expected in South Texas with flood risk', 'high', 'Texas', 'active', 'flood', 85000),
  ('Hurricane Warning', 'Category 4 hurricane approaching Florida coast', 'critical', 'Florida', 'active', 'hurricane', 450000),
  ('Winter Storm Warning', 'Severe winter storm affecting New York with heavy snow', 'high', 'New York', 'active', 'winter_storm', 200000),
  ('Windstorm Alert', 'Severe windstorm conditions in Western Washington', 'high', 'Washington', 'active', 'windstorm', 95000),
  ('Flood Alert', 'Flash flooding reported in Houston area', 'high', 'Texas', 'active', 'flood', 45000),
  ('Air Quality Alert', 'Poor air quality due to wildfire smoke in San Francisco', 'medium', 'California', 'active', 'air_quality', 320000),
  ('Coastal Flood Advisory', 'Minor coastal flooding expected in Tampa Bay', 'medium', 'Florida', 'active', 'coastal_flood', 15000),
  ('Extreme Heat Warning', 'Heat index exceeding 115F in Phoenix area', 'high', 'Arizona', 'active', 'heat', 200000),
  ('Tornado Watch', 'Tornado watch in effect for Central Texas', 'high', 'Texas', 'active', 'tornado', 120000)
on conflict do nothing;

-- Seed resources
insert into public.resources (name, resource_type, location, status, capacity, current_utilization, contact_person, contact_phone)
values
  ('Red Cross Shelter - LA', 'shelter', 'California', 'available', 500, 120, 'John Smith', '310-555-0101'),
  ('County Emergency Hospital', 'medical', 'California', 'available', 200, 145, 'Dr. Maria Garcia', '310-555-0102'),
  ('Fire Department - Dallas', 'vehicle', 'Texas', 'deployed', 45, 38, 'Chief Robert Johnson', '214-555-0103'),
  ('Emergency Relief Center', 'supplies', 'Texas', 'available', 1000, 320, 'Lisa Anderson', '214-555-0104'),
  ('Miami Beach Community Center', 'shelter', 'Florida', 'deployed', 1000, 650, 'David Martinez', '305-555-0105'),
  ('Jackson Memorial Hospital', 'medical', 'Florida', 'available', 500, 480, 'Dr. Patricia Lee', '305-555-0106'),
  ('FDOT Response Team', 'vehicle', 'Florida', 'deployed', 120, 105, 'Michael Thompson', '305-555-0107'),
  ('Roosevelt Island Shelter', 'shelter', 'New York', 'available', 800, 150, 'Jennifer Wilson', '212-555-0108'),
  ('Mount Sinai Medical Center', 'medical', 'New York', 'available', 600, 520, 'Dr. Christopher Brown', '212-555-0109'),
  ('Seattle Police Department', 'vehicle', 'Washington', 'available', 60, 42, 'Captain Sarah Davis', '206-555-0110'),
  ('Puget Sound Food Bank', 'supplies', 'Washington', 'available', 2000, 600, 'Tom Wilson', '206-555-0111'),
  ('Chandler Convention Center', 'shelter', 'Arizona', 'deployed', 2000, 1200, 'Robert Anderson', '480-555-0112'),
  ('Phoenix Fire Department', 'vehicle', 'Arizona', 'deployed', 75, 68, 'Chief Richard Harris', '602-555-0113'),
  ('Banner Medical Center', 'medical', 'Arizona', 'available', 400, 350, 'Dr. James Clark', '602-555-0114'),
  ('Desert Relief Supplies', 'supplies', 'Arizona', 'available', 1500, 800, 'Amanda Cooper', '602-555-0115')
on conflict do nothing;

-- Seed action plans
insert into public.action_plans (title, description, location, status, priority, steps)
values
  ('Wildfire Evacuation Protocol', 'Coordinate evacuation of affected areas in Northern California', 'California', 'in_progress', 'critical', 
   array['Alert residents via emergency broadcast', 'Open shelters for evacuees', 'Deploy firefighting teams', 'Coordinate with local law enforcement']),
  ('Emergency Hospital Surge', 'Activate additional beds and staff for hurricane casualties', 'Florida', 'in_progress', 'critical', 
   array['Call in additional medical staff', 'Convert non-critical spaces to patient beds', 'Establish triage areas', 'Prepare emergency supply distribution']),
  ('Resource Distribution', 'Distribute emergency supplies to affected communities', 'Texas', 'pending', 'high', 
   array['Assess critical needs', 'Organize supply logistics', 'Deploy distribution teams', 'Track resource usage']),
  ('Winter Storm Response', 'Clear roads and assist stranded motorists', 'New York', 'in_progress', 'high', 
   array['Deploy road clearing equipment', 'Establish warming centers', 'Coordinate rescue operations', 'Monitor road conditions']),
  ('Wind Damage Assessment', 'Survey damage and prioritize repairs', 'Washington', 'pending', 'medium', 
   array['Send assessment teams', 'Document damage', 'Create repair priorities', 'Coordinate contractor resources'])
on conflict do nothing;
