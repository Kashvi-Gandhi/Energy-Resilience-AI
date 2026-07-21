-- 1. Activate the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Clean out old tables to avoid schema shape errors
DROP TABLE IF EXISTS vessels CASCADE;
DROP TABLE IF EXISTS refineries CASCADE;
DROP TABLE IF EXISTS supply_routes CASCADE;
DROP TABLE IF EXISTS geopolitical_news CASCADE;
DROP TABLE IF EXISTS simulation_logs CASCADE;
DROP TABLE IF EXISTS active_threats CASCADE;
DROP TABLE IF EXISTS ports CASCADE;

-- 3. Create relational, interconnected tables
CREATE TABLE supply_routes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_name TEXT NOT NULL UNIQUE,
    risk_score INT DEFAULT 0, 
    waypoints JSONB NOT NULL 
);

CREATE TABLE refineries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    refinery_name TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL,
    capacity_mpda DOUBLE PRECISION NOT NULL,
    crude_compatibility TEXT[] NOT NULL 
);

CREATE TABLE vessels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    current_lat DOUBLE PRECISION NOT NULL,
    current_lon DOUBLE PRECISION NOT NULL,
    cargo_type TEXT NOT NULL,
    capacity_barrels INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'En Route',
    current_route_id UUID REFERENCES supply_routes(id) ON DELETE SET NULL,
    destination_refinery_id UUID REFERENCES refineries(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE geopolitical_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source TEXT NOT NULL,
    associated_route_id UUID REFERENCES supply_routes(id) ON DELETE SET NULL,
    embedding VECTOR(768), -- EXACT DIMENSIONS FOR GEMINI EMBEDDINGS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create ports table
CREATE TABLE ports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    throughput_capacity_mtpa DOUBLE PRECISION DEFAULT 0,
    crude_stream_compatibility TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Alter vessels to add optional FK columns for origin/destination ports
ALTER TABLE vessels
    ADD COLUMN IF NOT EXISTS origin_port_id UUID REFERENCES ports(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS destination_port_id UUID REFERENCES ports(id) ON DELETE SET NULL;

-- 6. Create active_threats table
CREATE TABLE active_threats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MEDIUM',
    region TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    description TEXT,
    route_id UUID REFERENCES supply_routes(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Create simulation_logs table (persists every /api/simulate-crisis run)
CREATE TABLE simulation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scenario_title TEXT NOT NULL,
    sector TEXT,
    risk_score INT NOT NULL DEFAULT 0,
    premium_surge INT NOT NULL DEFAULT 0,
    action_taken TEXT,
    scout_analysis TEXT,
    logistics_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security and allow public reads for the three tables the
-- frontend queries directly via the anon key.
ALTER TABLE simulation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read simulation_logs" ON simulation_logs
    FOR SELECT USING (true);
CREATE POLICY "Service insert simulation_logs" ON simulation_logs
    FOR INSERT WITH CHECK (true);

-- 8. Create the Vector Similarity helper function matching the 768 space
CREATE OR REPLACE FUNCTION match_news (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  source TEXT,
  associated_route_id UUID,
  similarity FLOAT
)
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    geopolitical_news.id,
    geopolitical_news.title,
    geopolitical_news.content,
    geopolitical_news.source,
    geopolitical_news.associated_route_id,
    1 - (geopolitical_news.embedding <=> query_embedding) AS similarity
  FROM geopolitical_news
  WHERE 1 - (geopolitical_news.embedding <=> query_embedding) > match_threshold
  ORDER BY geopolitical_news.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;