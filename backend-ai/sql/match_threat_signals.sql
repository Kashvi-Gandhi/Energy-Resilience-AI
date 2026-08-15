create or replace function match_threat_signals (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  title text,
  summary text,
  source_url text,
  similarity float
)
language sql stable
as $$
  select
    threat_signals.id,
    threat_signals.title,
    threat_signals.summary,
    threat_signals.source_url,
    1 - (threat_signals.embedding <=> query_embedding) as similarity
  from threat_signals
  where 1 - (threat_signals.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;