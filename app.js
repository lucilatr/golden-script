/* ============================================================
   GOLDEN — single-screen visual production tool
   Local (localStorage) or shared realtime (Supabase)
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "golden_rhythm_doc_v2";

  /* ---------------- Catalogs ---------------- */
  const STAGES = [
    { id: "desire_insecurity", label: "Deseo e inseguridad", short: "Deseo", color: "var(--st-desire)" },
    { id: "transformation",    label: "Transformación y liberación", short: "Transformación", color: "var(--st-trans)" },
    { id: "golden",            label: "Consagración dorada", short: "Consagración", color: "var(--st-golden)" },
  ];
  const TOD = [
    { id: "day", label: "Day" }, { id: "sunset", label: "Sunset" }, { id: "night", label: "Night" },
    { id: "demon_world", label: "Demon World" }, { id: "other", label: "Other" },
  ];
  const GP = [
    { id: "frontal", label: "Frontal", color: "var(--gp-frontal)" },
    { id: "lateral", label: "Lateral", color: "var(--gp-lateral)" },
    { id: "combat", label: "Combat", color: "var(--gp-combat)" },
  ];
  const WS = [
    { id: "normal", label: "Normal" }, { id: "demonic", label: "Demonic" },
    { id: "transition", label: "Transition" }, { id: "mixed", label: "Mixed" },
  ];
  const WS_COLOR = { normal: "var(--ws-normal)", demonic: "var(--ws-demonic)", transition: "var(--ws-transition)", mixed: "var(--ws-mixed)" };
  const STATUS = [
    { id: "idea", label: "Idea" }, { id: "to_define", label: "To define" },
    { id: "in_development", label: "In development" }, { id: "review", label: "Review" }, { id: "approved", label: "Approved" },
  ];
  const DOC_STATUS = ["Development", "Review", "Approved"];
  const DOC_STATUS_COLOR = { Development: "#5b8bb5", Review: "#b5479b", Approved: "#5a8f7b" };

  // Tipo de sección — se marca A MANO (vacío por defecto)
  const SECTIONS = [
    { id: "intro", label: "Intro" },
    { id: "estrofa", label: "Estrofa" },
    { id: "pre", label: "Pre-estribillo" },
    { id: "estribillo", label: "Estribillo" },
    { id: "puente", label: "Puente" },
    { id: "outro", label: "Outro" },
  ];
  const SEC_COLOR = { intro: "#737a8f", estrofa: "#4f6ba8", pre: "#5b8bb5", estribillo: "#d9a441", puente: "#b5479b", outro: "#5a8f7b" };

  const labelOf = (list, id) => (list.find((x) => x.id === id) || {}).label || "";
  const stageColor = (id) => (STAGES.find((x) => x.id === id) || {}).color || "var(--line-2)";
  const gpColor = (id) => (GP.find((x) => x.id === id) || {}).color || "var(--line-2)";

  /* ---------------- Time helpers ---------------- */
  function parseTime(str) {
    if (str == null) return 0;
    str = String(str).trim();
    if (str === "") return 0;
    if (str.indexOf(":") === -1) return Math.max(0, parseInt(str, 10) || 0);
    const p = str.split(":").map((x) => parseInt(x, 10) || 0);
    if (p.length === 2) return p[0] * 60 + p[1];
    if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
    return 0;
  }
  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    return String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
  }
  const dur = (s) => Math.max(0, parseTime(s.endTime) - parseTime(s.startTime));

  /* ---------------- Seed (first 30s) ---------------- */
  function seed() {
    const base = {
      lyric: "[LYRIC TO ADD]", musicalCue: "[VERSE 1]", narrativeStage: "desire_insecurity",
      location: "Seoul Streets", timeOfDay: "night", narrativeAction: "", characterAction: "",
      camera: "", gameplayMode: "frontal", playerAction: "", environmentInteraction: "",
      worldState: "normal", visualFX: "", transition: "", productionNotes: "", storyBeat: "", status: "idea",
      sectionType: "", storyboard: "",
    };
    const mk = (id, a, b, over) => {
      const s = Object.assign({ id, startTime: a, endTime: b }, base, over);
      if (!Array.isArray(s.beats)) s.beats = [];
      return s;
    };
    return {
      meta: { title: "GOLDEN", songDuration: "03:30", status: "Development", version: "v01", lastUpdated: new Date().toISOString() },
      segments: [
        mk("scene-001", "00:00", "00:05", {
          musicalCue: "[INTRO]", lyric: "[INTRO MUSIC · sin letra]", status: "in_development",
          narrativeAction: "Presentamos a Rumi caminando por las calles de Seúl durante la noche. El inicio tiene que establecer inmediatamente una sensación de introspección e inseguridad. Queremos captar la atención del jugador durante los primeros cinco segundos.",
          characterAction: "Rumi comienza caminando hacia cámara. Su movimiento y coreografía transmiten el estado emocional sin depender de expresiones faciales complejas.",
          camera: "Frontal tracking shot. La cámara retrocede mientras Rumi avanza.",
          playerAction: "Primeros inputs simples del rhythm game. La interacción comienza rápidamente.",
          visualFX: "Pequeñas señales visuales pueden anticipar que existe algo extraño detrás de la realidad normal.",
          productionNotes: "La introducción tiene que sentirse ligeramente cinemática pero llevar rápidamente al gameplay.",
          storyBeat: "Rumi camina por Seúl de noche. Se establece la introspección e inseguridad.",
          beats: [{
            cue: "Nota de salto en el beat fuerte",
            onHit: "Rumi salta perfecto y sigue bailando sin perder el flow.",
            onMiss: "Rumi salta pero se tropieza levemente y se recupera, retomando la coreografía.",
          }],
        }),
        mk("scene-002", "00:05", "00:10", {
          musicalCue: "[INTRO]", lyric: "[INTRO MUSIC · sin letra]",
          narrativeAction: "Rumi continúa avanzando por Seúl. La coreografía empieza a integrarse con el ritmo.",
          characterAction: "Camina y baila mientras avanza hacia cámara.", camera: "Frontal tracking shot.",
          playerAction: "Taps sincronizados con las notas.",
          environmentInteraction: "Algunos taps afectan elementos del escenario en lugar de controlar directamente los movimientos de Rumi. Por ejemplo: carteles urbanos pueden reaccionar visualmente al input.",
        }),
        mk("scene-003", "00:10", "00:15", {
          musicalCue: "[INTRO]", lyric: "[INTRO MUSIC · sin letra]",
          narrativeAction: "La caminata continúa pero aparece por primera vez una interrupción clara de la realidad.",
          camera: "Mantener la misma composición para que el cambio del mundo sea claramente perceptible.",
          playerAction: "El rhythm gameplay continúa sin interrupción.", worldState: "transition",
          visualFX: "Flash demoníaco breve. El mismo escenario se transforma. Aparecen venas violetas o contaminación visual demoníaca. Luego vuelve inmediatamente al estado normal. (NORMAL → DEMONIC → NORMAL)",
          transition: "Beat-synced environment glitch.", storyBeat: "Primer flash de la realidad demoníaca.",
        }),
        mk("scene-004", "00:15", "00:20", {
          narrativeAction: "La sensación de inestabilidad aumenta. Rumi continúa avanzando mientras el entorno empieza a reflejar con mayor claridad su conflicto interno.",
          playerAction: "La secuencia de taps puede volverse ligeramente más activa.", worldState: "mixed",
          visualFX: "Segundo cambio breve entre realidad y mundo demoníaco sincronizado con la música.",
        }),
        mk("scene-005", "00:20", "00:25", {
          narrativeAction: "Los dos estados del mundo empiezan a intercalarse con mayor frecuencia.",
          playerAction: "Los taps siguen interactuando con elementos del escenario.", worldState: "mixed",
          visualFX: "Las ráfagas demoníacas son progresivamente más evidentes.",
        }),
        mk("scene-006", "00:25", "00:30", {
          narrativeAction: "Cierre del primer pequeño arco de introducción. Rumi continúa caminando pero ya quedó establecido que existe otra realidad relacionada con su identidad demoníaca.",
          camera: "Frontal tracking. Preparar visualmente el siguiente momento de la canción.",
          playerAction: "Final de la primera frase jugable.", worldState: "transition",
          visualFX: "Último flash demoníaco sincronizado con el beat.",
          transition: "Normal / Demonic transition hacia el próximo momento de la canción.",
          storyBeat: "Cierre del arco de introducción: queda establecida la doble realidad.",
        }),
        // ---- Estructura del resto de la canción (tiempos aproximados, ajustar escuchando) ----
        mk("scene-007", "00:30", "00:45", { musicalCue: "[VERSE 1 · cont.]", narrativeStage: "desire_insecurity", location: "", gameplayMode: "" }),
        mk("scene-008", "00:45", "01:00", { musicalCue: "[PRE-CHORUS 1]", narrativeStage: "desire_insecurity", location: "", gameplayMode: "" }),
        mk("scene-009", "01:00", "01:25", { musicalCue: "[CHORUS 1]", narrativeStage: "transformation", location: "", gameplayMode: "" }),
        mk("scene-010", "01:25", "01:45", { musicalCue: "[VERSE 2]", narrativeStage: "transformation", location: "", gameplayMode: "" }),
        mk("scene-011", "01:45", "02:00", { musicalCue: "[PRE-CHORUS 2]", narrativeStage: "transformation", location: "", gameplayMode: "" }),
        mk("scene-012", "02:00", "02:25", { musicalCue: "[CHORUS 2]", narrativeStage: "golden", location: "", gameplayMode: "" }),
        mk("scene-013", "02:25", "02:55", { musicalCue: "[BRIDGE]", narrativeStage: "golden", location: "", gameplayMode: "" }),
        mk("scene-014", "02:55", "03:14", { musicalCue: "[FINAL CHORUS / OUTRO]", narrativeStage: "golden", location: "", gameplayMode: "" }),
      ],
    };
  }

  /* ---------------- State ---------------- */
  let data = { meta: seed().meta, segments: [] };
  const ui = { openId: null, colorBy: "gameplayMode", showDetails: false, drawerMax: false,
    filters: { gameplayMode: "", narrativeStage: "", status: "", location: "" } };

  /* ============================================================
     SYNC LAYER (Supabase or localStorage)
     ============================================================ */
  const Sync = {
    enabled: false, sb: null, docId: "golden", _timers: {},
    init() {
      const c = window.GOLDEN_CONFIG || {};
      this.docId = c.docId || "golden";
      if (c.supabaseUrl && c.supabaseAnonKey && typeof window.supabase !== "undefined") {
        try { this.sb = window.supabase.createClient(c.supabaseUrl, c.supabaseAnonKey); this.enabled = true; }
        catch (e) { this.enabled = false; }
      }
      return this.enabled;
    },
    async loadAll() {
      const { data: segs } = await this.sb.from("segments").select("*").eq("doc_id", this.docId).order("pos", { ascending: true });
      const { data: metaRows } = await this.sb.from("doc_meta").select("*").eq("id", this.docId).limit(1);
      return {
        segments: (segs || []).map((r) => r.data),
        meta: metaRows && metaRows[0] ? metaRows[0].data : null,
      };
    },
    async seedAll(seedData) {
      const rows = seedData.segments.map((s) => ({ id: s.id, doc_id: this.docId, pos: parseTime(s.startTime), data: s }));
      await this.sb.from("segments").upsert(rows);
      await this.sb.from("doc_meta").upsert({ id: this.docId, data: seedData.meta });
    },
    pushSegment(seg, immediate) {
      const row = { id: seg.id, doc_id: this.docId, pos: parseTime(seg.startTime), data: seg };
      const go = () => this.sb.from("segments").upsert(row).then(() => {}, () => toast("Error al guardar"));
      if (immediate) { go(); return; }
      clearTimeout(this._timers[seg.id]);
      this._timers[seg.id] = setTimeout(go, 400);
    },
    deleteSegment(id) { this.sb.from("segments").delete().eq("id", id).then(() => {}, () => {}); },
    pushMeta() {
      clearTimeout(this._timers.__meta);
      this._timers.__meta = setTimeout(() => this.sb.from("doc_meta").upsert({ id: this.docId, data: data.meta }).then(() => {}, () => {}), 300);
    },
    subscribe() {
      this.sb.channel("rt-segments")
        .on("postgres_changes", { event: "*", schema: "public", table: "segments", filter: "doc_id=eq." + this.docId }, (p) => this._onSeg(p))
        .subscribe();
      this.sb.channel("rt-meta")
        .on("postgres_changes", { event: "*", schema: "public", table: "doc_meta", filter: "id=eq." + this.docId }, (p) => this._onMeta(p))
        .subscribe();
    },
    _onSeg(payload) {
      if (payload.eventType === "DELETE") {
        const id = payload.old && payload.old.id;
        data.segments = data.segments.filter((s) => s.id !== id);
        if (ui.openId === id) closeDrawer();
      } else {
        const seg = normalizeSeg(payload.new && payload.new.data);
        if (!seg) return;
        const i = data.segments.findIndex((s) => s.id === seg.id);
        if (i === -1) data.segments.push(seg); else data.segments[i] = seg;
        // no pisar la fila que el usuario está editando en este momento
        if (ui.openId === seg.id && drawerFocused()) { refreshTimeline(); return; }
      }
      renderMain();
    },
    _onMeta(payload) {
      const m = payload.new && payload.new.data;
      if (m && !headerFocused()) { data.meta = m; renderHeader(); }
    },
  };
  function drawerFocused() { const a = document.activeElement; const w = ui.openId ? document.querySelector(`.rowwrap[data-seg="${ui.openId}"]`) : null; return !!(a && w && w.contains(a)); }
  function headerFocused() { const a = document.activeElement; const h = el("header"); return a && h && h.contains(a); }

  /* ---------------- Persistence facade ---------------- */
  function saveLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }
  function touch() { data.meta.lastUpdated = new Date().toISOString(); }
  function persistSegment(seg, immediate) {
    touch();
    if (Sync.enabled) { Sync.pushSegment(seg, immediate); Sync.pushMeta(); } else saveLocal();
    refreshUpdated();
  }
  function persistMeta() { touch(); if (Sync.enabled) Sync.pushMeta(); else saveLocal(); refreshUpdated(); }
  function persistDelete(id) { touch(); if (Sync.enabled) { Sync.deleteSegment(id); Sync.pushMeta(); } else saveLocal(); refreshUpdated(); }
  function persistBulk() { touch(); if (Sync.enabled) { data.segments.forEach((s) => Sync.pushSegment(s, true)); Sync.pushMeta(); } else saveLocal(); refreshUpdated(); }

  /* ---------------- Normalize (migrations) ---------------- */
  function normalizeSeg(s) {
    if (!s) return s;
    if (s.gameplayMode === "cinematic") s.gameplayMode = "frontal";
    if (!Array.isArray(s.beats)) s.beats = [];
    if (s.sectionType == null) s.sectionType = "";
    if (s.storyboard == null) s.storyboard = "";
    return s;
  }
  function normalizeAll() { data.segments.forEach(normalizeSeg); }

  // Migración única: los bloques de estructura se habían creado con modo "frontal"
  // por defecto. Los que no tienen ninguna acción cargada quedan sin modo para que
  // se pueda elegir el gameplay a mano.
  function migrateGpOnce() {
    if (data.meta && data.meta.gpMigrated) return;
    data.segments.forEach((s) => {
      const vacio = !(s.narrativeAction || "").trim() && !(s.characterAction || "").trim()
        && !(s.playerAction || "").trim() && !(s.camera || "").trim() && !((s.beats || []).length);
      if (s.gameplayMode === "frontal" && vacio) s.gameplayMode = "";
    });
    data.meta.gpMigrated = true;
    persistBulk();
  }

  /* ---------------- Derived ---------------- */
  const sorted = () => data.segments.slice().sort((a, b) => parseTime(a.startTime) - parseTime(b.startTime));
  function nextId() {
    let m = 0;
    data.segments.forEach((s) => { const r = /scene-(\d+)/.exec(s.id); if (r) m = Math.max(m, parseInt(r[1], 10)); });
    return "scene-" + String(m + 1).padStart(3, "0");
  }
  function passes(s) {
    const f = ui.filters;
    if (f.gameplayMode && s.gameplayMode !== f.gameplayMode) return false;
    if (f.narrativeStage && s.narrativeStage !== f.narrativeStage) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.location && s.location !== f.location) return false;
    return true;
  }
  function allLocations() { const set = new Set(); data.segments.forEach((s) => s.location && set.add(s.location)); return Array.from(set).sort(); }

  /* ---------------- DOM utils ---------------- */
  const el = (id) => document.getElementById(id);
  function h(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.startsWith("data-")) n.setAttribute(k, attrs[k]);
      else if (k === "style") n.setAttribute("style", attrs[k]);
      else n[k] = attrs[k];
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach((c) => { if (c == null) return; n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function opts(list, sel, empty) {
    let o = empty ? `<option value="">${esc(empty)}</option>` : "";
    list.forEach((x) => { const id = x.id != null ? x.id : x, lb = x.label != null ? x.label : x;
      o += `<option value="${esc(id)}"${id === sel ? " selected" : ""}>${esc(lb)}</option>`; });
    return o;
  }
  let toastT = null;
  function toast(msg) {
    let t = el("toast"); if (!t) { t = h("div", { id: "toast", class: "toast" }); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1900);
  }
  function firstLine(str) {
    if (!str) return ""; const s = String(str).trim();
    const d = s.indexOf(". "); return (d > -1 && d < 95) ? s.slice(0, d + 1) : (s.length > 95 ? s.slice(0, 95) + "…" : s);
  }
  function fmtDate(iso) { try { return new Date(iso).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return "—"; } }

  /* ============================================================
     RENDER
     ============================================================ */
  function renderAll() { renderHeader(); renderMain(); renderDrawer(); }

  /* ---------- Header ---------- */
  function renderHeader() {
    const host = el("header"); host.innerHTML = "";
    host.appendChild(h("div", { class: "header__brand" }, [
      h("h1", {}, data.meta.title || "GOLDEN"),
      h("span", { class: "sub" }, "Narrative & Gameplay Script"),
    ]));

    const meta = h("div", { class: "header__meta" });
    meta.innerHTML = `
      <span class="sync-ind ${Sync.enabled ? "live" : "local"}"><span class="dot"></span>${Sync.enabled ? "Online (en vivo)" : "Local"}</span>
      <span class="mini"><span class="key">Dur</span><input class="dur" id="m-dur" type="text" value="${esc(data.meta.songDuration)}"></span>
      <span class="mini"><span class="dot" id="m-dot" style="background:${DOC_STATUS_COLOR[data.meta.status] || "#888"}"></span>
        <select id="m-status">${opts(DOC_STATUS, data.meta.status)}</select></span>
      <span class="mini"><span class="key">Ver</span><input id="m-ver" type="text" value="${esc(data.meta.version)}" style="width:44px"></span>
      <span class="mini key" id="m-upd">${esc(fmtDate(data.meta.lastUpdated))}</span>`;
    host.appendChild(meta);

    const right = h("div", { class: "header__meta" });
    const addBtn = h("button", { class: "btn-add" }, "+ Bloque");
    addBtn.addEventListener("click", addSegment);
    right.appendChild(addBtn);

    const menuWrap = h("div", { class: "menu-wrap" });
    const gear = h("button", { class: "icon-btn", title: "Más" }, "⋯");
    const menu = h("div", { class: "menu", id: "menu" });
    const mk = (lbl, fn, cls) => { const b = h("button", { class: cls || "" }, lbl); b.addEventListener("click", () => { menu.classList.remove("open"); fn(); }); return b; };
    menu.appendChild(mk("⇩  Export JSON", exportJSON));
    menu.appendChild(mk("⇧  Import JSON", importJSON));
    menu.appendChild(h("div", { class: "sep" }));
    menu.appendChild(mk("↺  Reset a ejemplo", resetData, "danger"));
    gear.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("open"); });
    menuWrap.appendChild(gear); menuWrap.appendChild(menu);
    right.appendChild(menuWrap);
    host.appendChild(right);

    el("m-dur").addEventListener("change", (e) => { data.meta.songDuration = e.target.value; persistMeta(); renderMain(); });
    el("m-status").addEventListener("change", (e) => { data.meta.status = e.target.value; el("m-dot").style.background = DOC_STATUS_COLOR[e.target.value] || "#888"; persistMeta(); });
    el("m-ver").addEventListener("change", (e) => { data.meta.version = e.target.value; persistMeta(); });
  }
  function refreshUpdated() { const n = el("m-upd"); if (n) n.textContent = fmtDate(data.meta.lastUpdated); }

  /* ---------- Main (hero + strip + filters + list) ---------- */
  function renderMain() {
    const host = el("main"); host.innerHTML = "";
    const tl = h("div", { id: "tl" });
    host.appendChild(tl);
    renderHero(tl);
    renderGpStrip(tl);
    renderFilters(host);
    renderList(host);
  }
  // Refresca sólo el timeline (hero + strip), sin tocar la lista ni el editor inline
  function refreshTimeline() {
    const tl = el("tl"); if (!tl) return;
    tl.innerHTML = "";
    renderHero(tl);
    renderGpStrip(tl);
  }

  function renderHero(host) {
    const total = parseTime(data.meta.songDuration) || 210;
    const wrap = h("div", { class: "hero" });
    const head = h("div", { class: "hero__head" });
    head.appendChild(h("span", { class: "seglabel" }, "Timeline — click en un bloque para editar"));
    const tgl = h("div", { class: "pill-toggle" });
    [["gameplayMode", "Gameplay"], ["sectionType", "Sección"], ["narrativeStage", "Etapa"], ["worldState", "Mundo"], ["location", "Locación"]].forEach(([id, lb]) => {
      const b = h("button", { class: ui.colorBy === id ? "active" : "" }, lb);
      b.addEventListener("click", () => { ui.colorBy = id; renderMain(); });
      tgl.appendChild(b);
    });
    head.appendChild(tgl);
    wrap.appendChild(head);

    const track = h("div", { class: "track" });
    const palette = {}; const pcols = ["#4f6ba8", "#b5479b", "#d9a441", "#5a8f7b", "#f5683c", "#8b5cf6", "#5b8bb5", "#c2607a"]; let pi = 0;
    const colorFor = (s) => {
      const by = ui.colorBy;
      if (by === "gameplayMode") return gpColor(s.gameplayMode);
      if (by === "sectionType") return SEC_COLOR[s.sectionType] || "var(--line-2)";
      if (by === "narrativeStage") return stageColor(s.narrativeStage);
      if (by === "worldState") return WS_COLOR[s.worldState] || "var(--line-2)";
      const k = s.location || "—"; if (!(k in palette)) { palette[k] = pcols[pi % pcols.length]; pi++; } return palette[k];
    };
    const labFor = (s) => {
      const by = ui.colorBy;
      if (by === "gameplayMode") return labelOf(GP, s.gameplayMode);
      if (by === "sectionType") return labelOf(SECTIONS, s.sectionType) || "—";
      if (by === "narrativeStage") return (STAGES.find((x) => x.id === s.narrativeStage) || {}).short || "";
      if (by === "worldState") return labelOf(WS, s.worldState);
      return s.location || "—";
    };
    sorted().forEach((s) => {
      const left = (parseTime(s.startTime) / total) * 100;
      const w = Math.max(0.5, (dur(s) / total) * 100);
      const block = h("div", {
        class: "track__block" + (ui.openId === s.id ? " sel" : ""),
        style: `left:${left}%;width:${w}%;background:${colorFor(s)}`,
        title: `${s.startTime}–${s.endTime}  ${labFor(s)}`, "data-jump": s.id,
      });
      if (w > 3.2) {
        const lr = (s.lyric || "").trim();
        const lyrReal = lr && lr !== "[LYRIC TO ADD]" && lr.indexOf("[INTRO MUSIC") !== 0;
        block.appendChild(h("span", { class: "lab" }, lyrReal ? lr.split("\n")[0] : labFor(s)));
      }
      if ((s.storyBeat || "").trim()) block.appendChild(h("span", { class: "star" }, "★"));
      const stage = h("div", { class: "track__stage", style: `left:${left}%;width:${w}%;background:${stageColor(s.narrativeStage)}` });
      track.appendChild(block); track.appendChild(stage);
    });
    wrap.appendChild(track);

    const ruler = h("div", { class: "ruler" });
    for (let i = 0; i <= 6; i++) ruler.appendChild(h("span", {}, fmtTime((total / 6) * i)));
    wrap.appendChild(ruler);

    // legend
    const legend = h("div", { class: "legend" });
    let items = [];
    if (ui.colorBy === "gameplayMode") items = GP.map((g) => [g.label, g.color]);
    else if (ui.colorBy === "sectionType") items = SECTIONS.map((g) => [g.label, SEC_COLOR[g.id]]);
    else if (ui.colorBy === "narrativeStage") items = STAGES.map((g) => [g.short, g.color]);
    else if (ui.colorBy === "worldState") items = WS.map((g) => [g.label, WS_COLOR[g.id]]);
    else items = Object.keys(palette).map((k) => [k, palette[k]]);
    items.forEach(([lb, c]) => { const g = h("span", { class: "lg" }); g.innerHTML = `<span class="sw" style="background:${c}"></span>${esc(lb)}`; legend.appendChild(g); });
    wrap.appendChild(legend);

    host.appendChild(wrap);
    track.querySelectorAll("[data-jump]").forEach((b) => b.addEventListener("click", () => openDrawer(b.getAttribute("data-jump"))));
  }

  function renderGpStrip(host) {
    const segs = sorted();
    // (se eliminaron las tarjetas de porcentaje de gameplay por pedido)

    // longest run warning
    let runMode = null, runSecs = 0, longest = { mode: null, secs: 0 };
    segs.forEach((s) => { const d = dur(s); if (s.gameplayMode === runMode) runSecs += d; else { runMode = s.gameplayMode; runSecs = d; } if (runSecs > longest.secs) longest = { mode: runMode, secs: runSecs }; });
    if (longest.mode && longest.secs >= 20)
      host.appendChild(h("div", { class: "gpflow-warn" }, `⚠ Tramo más largo sin variar: ${labelOf(GP, longest.mode)} durante ${longest.secs}s. Considerá alternar el gameplay.`));
  }

  function renderFilters(host) {
    const f = ui.filters;
    const wrap = h("div", { class: "filters" });
    const addSel = (key, list, empty) => {
      const s = h("select", { "data-f": key }); s.innerHTML = opts(list, f[key], empty);
      s.addEventListener("change", (e) => { f[key] = e.target.value; renderList(el("main")); updateCount(); });
      wrap.appendChild(s);
    };
    addSel("gameplayMode", GP, "Todo gameplay");
    addSel("narrativeStage", STAGES, "Toda etapa");
    addSel("status", STATUS, "Todo estado");
    addSel("location", allLocations().map((l) => ({ id: l, label: l })), "Toda locación");
    if (f.gameplayMode || f.narrativeStage || f.status || f.location) {
      const clr = h("button", { class: "clear" }, "limpiar");
      clr.addEventListener("click", () => { ui.filters = { gameplayMode: "", narrativeStage: "", status: "", location: "" }; renderMain(); });
      wrap.appendChild(clr);
    }
    wrap.appendChild(h("span", { class: "count", id: "f-count" }, ""));
    host.appendChild(wrap);
    updateCount();
  }
  function updateCount() { const n = el("f-count"); if (n) { const v = sorted().filter(passes).length; n.textContent = `${v} / ${data.segments.length} bloques`; } }

  function renderList(host) {
    // remove old list if present (when called standalone)
    const old = host.querySelector(".list"); if (old) old.remove();
    const list = h("div", { class: "list" });
    const vis = sorted().filter(passes);
    const head = h("div", { class: "row row-head" });
    head.innerHTML = `<div></div><div>Tiempo</div><div>Letra</div><div>Acción · storyboard</div><div></div>`;
    list.appendChild(head);
    if (!vis.length) list.appendChild(h("div", { class: "empty" }, "No hay bloques que coincidan con los filtros."));
    vis.forEach((s) => list.appendChild(buildRowWrap(s)));
    const add = h("button", { class: "add-row" }, "+ Agregar bloque");
    add.addEventListener("click", addSegment);
    list.appendChild(add);
    host.appendChild(list);
  }

  function buildRowWrap(s) {
    const open = ui.openId === s.id;
    const wrap = h("div", { class: "rowwrap" + (open ? " open" : ""), "data-seg": s.id });
    wrap.appendChild(buildCollapsedRow(s, open));
    if (open) wrap.appendChild(buildInlineEditor(s));
    return wrap;
  }

  function buildCollapsedRow(s, open) {
    const row = h("div", { class: "row" + (open ? " sel" : ""), style: `--stage-color:${stageColor(s.narrativeStage)}`, "data-seg": s.id });
    const lraw = (s.lyric || "").trim();
    const instrumental = (lraw === "" || lraw === "[LYRIC TO ADD]" || lraw.indexOf("[INTRO MUSIC") === 0);
    const lyrHtml = instrumental
      ? '<div class="lyr instrumental">♪ Instrumental · sin letra</div>'
      : `<div class="lyr">${esc(lraw)}</div>`;
    const media = s.storyboard
      ? `<div class="sbframe has"><img src="${esc(s.storyboard)}" alt="storyboard"></div>`
      : `<div class="sbframe empty"><span>＋ storyboard / captura</span></div>`;
    row.innerHTML = `
      <div class="chev">${open ? "▾" : "▸"}</div>
      <div class="tc">${esc(s.startTime)}<small>${esc(s.endTime)} · ${dur(s)}s</small></div>
      <div class="lyriccell">${lyrHtml}</div>
      <div class="actioncol">${media}</div>
      <div class="right">
        ${(s.beats && s.beats.length) ? `<span class="tap-ind" title="${s.beats.length} momento(s) jugable(s)">⊙${s.beats.length}</span>` : ""}
        ${(s.storyBeat || "").trim() ? '<span class="star-ind" title="Story beat">★</span>' : ""}
        <span class="status-dot s-${s.status}" title="${esc(labelOf(STATUS, s.status))}"></span>
      </div>`;
    row.addEventListener("click", () => toggleRow(s.id));
    return row;
  }

  // Actualiza sólo las celdas de resumen de la fila colapsada (sin reconstruir el editor)
  function updateRowSummary(s) {
    const row = document.querySelector(`.rowwrap[data-seg="${s.id}"] > .row`);
    if (!row) return;
    const lyrEl = row.querySelector(".lyr");
    if (lyrEl) {
      const lraw = (s.lyric || "").trim();
      const instrumental = (lraw === "" || lraw === "[LYRIC TO ADD]" || lraw.indexOf("[INTRO MUSIC") === 0);
      lyrEl.className = "lyr" + (instrumental ? " instrumental" : "");
      lyrEl.textContent = instrumental ? "♪ Instrumental · sin letra" : lraw;
    }
    const small = row.querySelector(".tc small");
    if (small) small.textContent = s.endTime + " · " + dur(s) + "s";
  }

  /* ============================================================
     INLINE EDITOR (desplegable por fila)
     ============================================================ */
  function toggleRow(id) {
    ui.openId = (ui.openId === id) ? null : id;
    ui.showDetails = false;
    renderMain();
    if (ui.openId) scrollToRow(ui.openId, "nearest");
  }
  // alias usados por timeline / CRUD para expandir una fila concreta
  function openDrawer(id) {
    ui.openId = id; ui.showDetails = false;
    renderMain();
    scrollToRow(id, "center");
  }
  function closeDrawer() { ui.openId = null; renderMain(); }
  function renderDrawer() { /* no-op: el editor ahora es inline en la lista */ }
  function scrollToRow(id, block) {
    const w = document.querySelector(`.rowwrap[data-seg="${id}"]`);
    if (w) w.scrollIntoView({ block: block || "nearest", behavior: "smooth" });
  }

  function buildInlineEditor(s) {
    const wrap = h("div", { class: "rowedit", style: `--stage-color:${stageColor(s.narrativeStage)}` });
    const body = h("div", { class: "rowedit-body" });
    const colMain = h("div", { class: "dcol dcol-main" });
    const colBeats = h("div", { class: "dcol dcol-beats" });

    // Timecode
    const tc = h("div", { class: "fg" });
    tc.innerHTML = `<label>Timecode</label>
      <div class="tc-row">
        <input type="text" data-f="startTime" value="${esc(s.startTime)}" data-tc="1">
        <span>→</span>
        <input type="text" data-f="endTime" value="${esc(s.endTime)}" data-tc="1">
        <span class="dur" data-dur>${dur(s)}s</span>
      </div>`;
    colMain.appendChild(tc);

    // Storyboard / captura de gameplay (la columna "Acción")
    colMain.appendChild(storyboardField(s));

    // Gameplay
    colMain.appendChild(gpField(s));

    // Escenario + momento del día (columnas principales)
    const rowCtx = h("div", { class: "fg-row" });
    rowCtx.appendChild(fgInput(s, "location", "Escenario / locación", "Seoul Streets"));
    rowCtx.appendChild(fgSelect(s, "timeOfDay", "Momento del día", TOD));
    colMain.appendChild(wrapFg(rowCtx));

    // World
    colMain.appendChild(wsField(s));

    // Stage + status
    const row2 = h("div", { class: "fg-row" });
    row2.appendChild(fgSelect(s, "narrativeStage", "Etapa narrativa", STAGES));
    row2.appendChild(fgSelect(s, "status", "Estado", STATUS));
    colMain.appendChild(wrapFg(row2));

    // Qué vemos (acción en pantalla)
    colMain.appendChild(fgText(s, "narrativeAction", "Acción — qué sucede en pantalla (no repitas escenario ni momento del día, ya están arriba)"));

    // Momentos jugables → columna derecha
    colBeats.appendChild(beatsField(s));

    body.appendChild(colMain);
    body.appendChild(colBeats);
    wrap.appendChild(body);

    // actions
    const act = h("div", { class: "rowedit-actions" });
    const mk = (lbl, fn, cls) => { const b = h("button", { class: cls || "" }, lbl); b.addEventListener("click", fn); return b; };
    act.appendChild(mk("▲ Subir", () => moveSegment(s.id, -1)));
    act.appendChild(mk("▼ Bajar", () => moveSegment(s.id, 1)));
    act.appendChild(mk("⎘ Duplicar", () => duplicateSegment(s.id)));
    act.appendChild(mk("⇔ Dividir", () => splitSegment(s.id)));
    act.appendChild(h("span", { class: "sp" }));
    act.appendChild(mk("▴ Cerrar", () => closeDrawer()));
    act.appendChild(mk("🗑 Borrar", () => deleteSegment(s.id), "del"));
    wrap.appendChild(act);

    // wire text inputs / selects (sin reconstruir el editor para no perder el foco)
    wrap.querySelectorAll("[data-f]").forEach((inp) => {
      const f = inp.getAttribute("data-f");
      if (inp.tagName === "SELECT") {
        inp.addEventListener("change", (e) => { s[f] = e.target.value; persistSegment(s, true); renderMain(); });
        return;
      }
      inp.addEventListener("input", (e) => {
        s[f] = e.target.value;
        if (inp.getAttribute("data-tc")) {
          const dn = wrap.querySelector("[data-dur]"); if (dn) dn.textContent = dur(s) + "s";
        }
        persistSegment(s);
        updateRowSummary(s);
        refreshTimeline();
      });
    });
    return wrap;
  }

  function storyboardField(s) {
    const d = h("div", { class: "fg" });
    d.appendChild(h("label", {}, "Acción — storyboard / captura de gameplay"));
    const box = h("div", { class: "sbedit" });
    if (s.storyboard) {
      box.appendChild(h("img", { src: s.storyboard, alt: "storyboard" }));
    } else {
      box.appendChild(h("div", { class: "sb-ph" }, "Todavía no hay storyboard ni captura. Subí una imagen o pegá una URL para que el video pueda producirse a partir de esto."));
    }
    d.appendChild(box);

    const ctr = h("div", { class: "sb-ctr" });
    const up = h("label", { class: "sb-up" }, "⬆ Subir imagen");
    const file = h("input", { type: "file", accept: "image/*", style: "display:none" });
    file.addEventListener("change", () => {
      const f = file.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { s.storyboard = r.result; persistSegment(s, true); renderMain(); toast("Storyboard agregado"); };
      r.readAsDataURL(f);
    });
    up.appendChild(file);
    ctr.appendChild(up);

    const url = h("input", { type: "text", class: "sb-url", placeholder: "…o pegá una URL de imagen / frame del video" });
    url.value = (s.storyboard && s.storyboard.indexOf("data:") !== 0) ? s.storyboard : "";
    url.addEventListener("change", () => { s.storyboard = url.value.trim(); persistSegment(s, true); renderMain(); });
    ctr.appendChild(url);

    if (s.storyboard) {
      const rm = h("button", { class: "sb-rm" }, "Quitar");
      rm.addEventListener("click", () => { s.storyboard = ""; persistSegment(s, true); renderMain(); });
      ctr.appendChild(rm);
    }
    d.appendChild(ctr);
    return d;
  }
  function wrapFg(inner) { const w = h("div", { class: "fg" }); w.appendChild(inner); return w; }
  function fgInput(s, f, label, ph) {
    const d = h("div", { class: "fg" });
    d.innerHTML = `<label>${esc(label)}</label><input type="text" data-f="${f}" value="${esc(s[f] || "")}" placeholder="${esc(ph || "")}">`;
    return d;
  }
  function fgText(s, f, label) {
    const d = h("div", { class: "fg" });
    d.innerHTML = `<label>${esc(label)}</label><textarea data-f="${f}">${esc(s[f] || "")}</textarea>`;
    return d;
  }
  function fgSelect(s, f, label, list) {
    const d = h("div", { class: "fg" });
    d.innerHTML = `<label>${esc(label)}</label><select data-f="${f}">${opts(list, s[f])}</select>`;
    return d;
  }
  function gpField(s) {
    const d = h("div", { class: "fg" });
    d.appendChild(h("label", {}, "Gameplay mode — elegí el modo de juego"));
    const set = h("div", { class: "ch-set" });
    GP.forEach((g) => {
      const sel = s.gameplayMode === g.id;
      const b = h("button", { class: "chbtn " + g.id + (sel ? " sel" : "") }, g.label);
      b.addEventListener("click", () => { s.gameplayMode = sel ? "" : g.id; persistSegment(s, true); renderMain(); renderDrawer(); });
      set.appendChild(b);
    });
    d.appendChild(set); return d;
  }
  function wsField(s) {
    const d = h("div", { class: "fg" });
    d.appendChild(h("label", {}, "World state"));
    const set = h("div", { class: "ch-set ws-set" });
    WS.forEach((w) => {
      const b = h("button", { class: "chbtn " + w.id + (s.worldState === w.id ? " sel" : "") }, w.label);
      b.addEventListener("click", () => { s.worldState = w.id; persistSegment(s, true); renderMain(); renderDrawer(); });
      set.appendChild(b);
    });
    d.appendChild(set); return d;
  }
  function sectionField(s) {
    const d = h("div", { class: "fg" });
    d.appendChild(h("label", {}, "Tipo de sección — marcá a mano"));
    const set = h("div", { class: "ch-set sec-set" });
    SECTIONS.forEach((sec) => {
      const sel = s.sectionType === sec.id;
      const b = h("button", { class: "chbtn sec " + sec.id + (sel ? " sel" : "") }, sec.label);
      b.addEventListener("click", () => { s.sectionType = sel ? "" : sec.id; persistSegment(s, true); renderMain(); renderDrawer(); });
      set.appendChild(b);
    });
    d.appendChild(set);
    return d;
  }
  function beatsField(s) {
    const d = h("div", { class: "fg beats-fg" });
    d.appendChild(h("label", {}, "Momentos jugables — el tap modifica la acción"));
    d.appendChild(h("div", { class: "beats-hint" }, "Cada momento: qué nota se tapea y qué pasa según el jugador acierte o falle."));
    const list = h("div", { class: "beatlist" });
    (s.beats || []).forEach((b, i) => list.appendChild(beatCard(s, b, i)));
    d.appendChild(list);
    const add = h("button", { class: "beat-add" }, "+ Agregar momento jugable");
    add.addEventListener("click", () => {
      s.beats = s.beats || [];
      s.beats.push({ cue: "", onHit: "", onMiss: "" });
      persistSegment(s, true); renderDrawer(); renderMain();
    });
    d.appendChild(add);
    return d;
  }
  function beatCard(s, b, i) {
    const c = h("div", { class: "beatcard" });
    const rm = h("button", { class: "rm", title: "Quitar momento" }, "×");
    rm.addEventListener("click", () => { s.beats.splice(i, 1); persistSegment(s, true); renderDrawer(); renderMain(); });
    c.appendChild(rm);

    const cue = h("input", { type: "text", class: "bcue", placeholder: "Cue / nota — ej: nota de salto en el beat fuerte" });
    cue.value = b.cue || "";
    cue.addEventListener("input", (e) => { b.cue = e.target.value; persistSegment(s); });
    c.appendChild(cue);

    const io = h("div", { class: "io" });
    const hit = h("div", { class: "hit" });
    hit.appendChild(h("label", {}, "Si acertás ✓"));
    const hitTa = h("textarea", { placeholder: "Salta perfecto y sigue bailando sin perder el flow" });
    hitTa.value = b.onHit || "";
    hitTa.addEventListener("input", (e) => { b.onHit = e.target.value; persistSegment(s); });
    hit.appendChild(hitTa);
    const miss = h("div", { class: "miss" });
    miss.appendChild(h("label", {}, "Si fallás ✕"));
    const missTa = h("textarea", { placeholder: "Salta pero se tropieza y se recupera, retomando la coreografía" });
    missTa.value = b.onMiss || "";
    missTa.addEventListener("input", (e) => { b.onMiss = e.target.value; persistSegment(s); });
    miss.appendChild(missTa);
    io.appendChild(hit); io.appendChild(miss);
    c.appendChild(io);
    return c;
  }

  /* ---------------- CRUD ---------------- */
  function addSegment() {
    const segs = sorted(); const last = segs[segs.length - 1];
    const start = last ? parseTime(last.endTime) : 0;
    const id = nextId();
    const s = Object.assign(seed().segments[0], {
      id, startTime: fmtTime(start), endTime: fmtTime(start + 5),
      musicalCue: "", lyric: "[LYRIC TO ADD]", status: "idea",
      narrativeAction: "", characterAction: "", camera: "", playerAction: "",
      environmentInteraction: "", visualFX: "", transition: "", productionNotes: "", storyBeat: "",
      beats: [], sectionType: "", storyboard: "", gameplayMode: "", worldState: "normal",
      narrativeStage: last ? last.narrativeStage : "desire_insecurity",
      location: last ? last.location : "", timeOfDay: last ? last.timeOfDay : "night",
    });
    data.segments.push(s);
    persistSegment(s, true);
    openDrawer(id);
    toast("Bloque agregado");
  }
  function duplicateSegment(id) {
    const i = data.segments.findIndex((x) => x.id === id); if (i === -1) return;
    const clone = JSON.parse(JSON.stringify(data.segments[i])); clone.id = nextId();
    data.segments.push(clone);
    persistSegment(clone, true);
    openDrawer(clone.id); toast("Bloque duplicado");
  }
  function deleteSegment(id) {
    const s = data.segments.find((x) => x.id === id); if (!s) return;
    if (!confirm(`¿Borrar el bloque ${s.startTime}–${s.endTime}?`)) return;
    data.segments = data.segments.filter((x) => x.id !== id);
    persistDelete(id); closeDrawer(); toast("Bloque borrado");
  }
  function splitSegment(id) {
    const s = data.segments.find((x) => x.id === id); if (!s) return;
    const a = parseTime(s.startTime), b = parseTime(s.endTime);
    if (b - a < 2) { toast("Bloque muy corto para dividir"); return; }
    const mid = Math.round((a + b) / 2);
    const clone = JSON.parse(JSON.stringify(s)); clone.id = nextId();
    clone.startTime = fmtTime(mid); clone.endTime = fmtTime(b); clone.storyBeat = "";
    s.endTime = fmtTime(mid);
    data.segments.push(clone);
    persistSegment(s, true); persistSegment(clone, true);
    openDrawer(clone.id); toast("Bloque dividido");
  }
  function moveSegment(id, dir) {
    const segs = sorted(); const pos = segs.findIndex((x) => x.id === id); const t = pos + dir;
    if (t < 0 || t >= segs.length) return;
    const a = segs[pos], b = segs[t];
    const as = a.startTime, ae = a.endTime; a.startTime = b.startTime; a.endTime = b.endTime; b.startTime = as; b.endTime = ae;
    persistSegment(a, true); persistSegment(b, true);
    renderMain(); renderDrawer();
  }

  /* ---------------- Export / Import / Reset ---------------- */
  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `golden-script-${data.meta.version}-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url); toast("Export listo");
  }
  function importJSON() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/json,.json";
    inp.addEventListener("change", () => {
      const file = inp.files[0]; if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const p = JSON.parse(r.result); if (!p.segments) throw 0;
          if (!confirm("Importar reemplaza el documento actual. ¿Seguir?")) return;
          data = p; if (!data.meta) data.meta = seed().meta;
          normalizeAll();
          ui.openId = null; persistBulk(); renderAll(); toast("Importado");
        } catch (e) { toast("Archivo JSON inválido"); }
      };
      r.readAsText(file);
    });
    inp.click();
  }
  function resetData() {
    if (!confirm("¿Resetear a los primeros 30s de ejemplo? Se pierde el trabajo actual.")) return;
    data = seed(); ui.openId = null; persistBulk(); renderAll(); toast("Reset listo");
  }

  /* ---------------- Boot ---------------- */
  async function boot() {
    // global click closes menu
    document.addEventListener("click", () => { const m = el("menu"); if (m) m.classList.remove("open"); });
    el("overlay").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && ui.openId) closeDrawer(); });

    if (Sync.init()) {
      try {
        const remote = await Sync.loadAll();
        if (remote.segments.length === 0) { const sd = seed(); await Sync.seedAll(sd); data = sd; }
        else { data.segments = remote.segments; data.meta = remote.meta || seed().meta; }
        Sync.subscribe();
      } catch (e) {
        toast("No se pudo conectar a Supabase — modo local");
        Sync.enabled = false; loadLocal();
      }
    } else {
      loadLocal();
    }
    normalizeAll();
    migrateGpOnce();
    renderAll();
  }
  function loadLocal() {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) { const p = JSON.parse(raw); if (p && p.segments) { data = p; return; } } } catch (e) {}
    data = seed();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
