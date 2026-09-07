(async function () {
  const list = document.getElementById("list");
  const tagsEl = document.getElementById("tags");
  const q = document.getElementById("q");
  const count = document.getElementById("count");

  let essays = [];
  try {
    essays = await (await fetch("essays.json", { cache: "no-cache" })).json();
  } catch (e) {
    list.innerHTML = '<p class="empty">Could not load essays.json.</p>';
    return;
  }
  essays.sort((a, b) => (b.added || "").localeCompare(a.added || ""));

  const params = new URLSearchParams(location.search);
  let activeTag = params.get("tag") || null;
  q.value = params.get("q") || "";
  // A permalink (#id) wins over any filter that would hide it.
  const wanted = decodeURIComponent(location.hash.slice(1));
  if (wanted && essays.some(e => e.id === wanted)) { activeTag = null; q.value = ""; }

  const tagCounts = {};
  for (const e of essays) for (const t of e.tags || []) tagCounts[t] = (tagCounts[t] || 0) + 1;
  const tags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a] || a.localeCompare(b));

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderTags() {
    tagsEl.innerHTML = tags.map(t =>
      `<button type="button" data-tag="${esc(t)}" aria-pressed="${t === activeTag}">${esc(t)} <span aria-hidden="true">${tagCounts[t]}</span></button>`
    ).join("");
  }

  function matches(e, needle) {
    if (activeTag && !(e.tags || []).includes(activeTag)) return false;
    if (!needle) return true;
    const hay = [e.title, e.author, e.source, e.why, ...(e.tags || [])].join(" ").toLowerCase();
    return needle.split(/\s+/).every(w => hay.includes(w));
  }

  function render() {
    const needle = q.value.trim().toLowerCase();
    const shown = essays.filter(e => matches(e, needle));
    const url = new URL(location.href);
    activeTag ? url.searchParams.set("tag", activeTag) : url.searchParams.delete("tag");
    needle ? url.searchParams.set("q", q.value.trim()) : url.searchParams.delete("q");
    history.replaceState(null, "", url);

    list.innerHTML = shown.length ? shown.map(e => `
      <article id="${esc(e.id)}">
        <h2><a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.title)}</a> <a class="anchor" href="#${esc(e.id)}" title="Link to this entry">#</a></h2>
        <p class="byline">${e.author ? esc(e.author) + " · " : ""}${esc(e.source)}${e.published ? " · " + esc(String(e.published).slice(0, 4)) : ""}${e.wayback ? ` · <a href="${esc(e.wayback)}" target="_blank" rel="noopener">archived copy</a>` : ""}</p>
        <p class="why">${esc(e.why)}</p>
        ${(e.tags || []).length ? `<p class="tagline">${e.tags.map(t => `<span>#${esc(t)}</span>`).join("")}</p>` : ""}
      </article>`).join("")
      : '<p class="empty">Nothing matches.</p>';
    count.textContent = `${essays.length} essay${essays.length === 1 ? "" : "s"}. `;
  }

  tagsEl.addEventListener("click", ev => {
    const b = ev.target.closest("button[data-tag]");
    if (!b) return;
    activeTag = activeTag === b.dataset.tag ? null : b.dataset.tag;
    renderTags();
    render();
  });
  q.addEventListener("input", render);

  renderTags();
  render();
  if (wanted) { const el = document.getElementById(wanted); if (el) el.scrollIntoView(); }
})();
