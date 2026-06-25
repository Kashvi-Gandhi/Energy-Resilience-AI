-- 1. Activate the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Clean out old tables to avoid schema shape errors
DROP TABLE IF EXISTS vessels CASCADE;
DROP TABLE IF EXISTS refineries CASCADE;
DROP TABLE IF EXISTS supply_routes CASCADE;
DROP TABLE IF EXISTS geopolitical_news CASCADE;

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

-- 4. Create the Vector Similarity helper function matching the 768 space
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