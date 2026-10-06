-- ============================================================
-- GOLDEN — esquema Supabase (edición compartida en tiempo real)
-- Pegá y ejecutá esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- Un bloque de la canción por fila (el contenido va como JSON)
create table if not exists segments (
  id          text primary key,
  doc_id      text not null default 'golden',
  pos         double precision default 0,   -- orden (segundos de inicio)
  data        jsonb not null,               -- el objeto completo del bloque
  updated_at  timestamptz default now()
);

-- Metadatos del documento (título, duración, estado, versión)
create table if not exists doc_meta (
  id          text primary key,             -- = doc_id
  data        jsonb not null,
  updated_at  timestamptz default now()
);

create index if not exists segments_doc_idx on segments (doc_id, pos);

-- ------------------------------------------------------------
-- Permisos. Para una herramienta interna de prototipo dejamos
-- lectura/escritura abierta con la anon key. (Cualquiera con el
-- link y la key puede editar — es intencional para el equipo.)
-- ------------------------------------------------------------
alter table segments enable row level security;
alter table doc_meta enable row level security;

drop policy if exists "open segments" on segments;
drop policy if exists "open meta" on doc_meta;

create policy "open segments" on segments
  for all using (true) with check (true);
create policy "open meta" on doc_meta
  for all using (true) with check (true);

-- Realtime: avisar cambios a todos los navegadores conectados
alter publication supabase_realtime add table segments;
alter publication supabase_realtime add table doc_meta;
