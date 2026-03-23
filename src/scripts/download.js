/**
 * download.js — OS detection + GitHub Releases integration for the download section.
 */

const GITHUB_REPO = "CaroAstruz/WNG-App";
const RELEASE_API = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;

const PLATFORMS = {
  windows: { icon: "\uD83D\uDCBB", label: "Windows", match: (n) => n.endsWith(".msi") || (n.endsWith(".exe") && n.includes("setup")) },
  macos:   { icon: "\uD83C\uDF4E", label: "macOS",   match: (n) => n.endsWith(".dmg") },
  linux:   { icon: "\uD83D\uDC27", label: "Linux",   match: (n) => n.endsWith(".deb") || n.endsWith(".AppImage") },
};

function detectOS() {
  const ua = navigator.userAgent.toLowerCase();
  const p = (navigator.platform || "").toLowerCase();
  if (p.includes("win") || ua.includes("windows")) return "windows";
  if (p.includes("mac") || ua.includes("macintosh")) return "macos";
  if (ua.includes("linux") || ua.includes("x11")) return "linux";
  return "unknown";
}

function formatBytes(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
}

export async function initDownloadSection() {
  const cardsEl = document.getElementById("download-cards");
  const loadingEl = document.getElementById("download-loading");
  const errorEl = document.getElementById("download-error");

  if (!cardsEl) return;

  const currentOS = detectOS();

  try {
    const resp = await fetch(RELEASE_API);
    if (!resp.ok) throw new Error(`GitHub API ${resp.status}`);
    const release = await resp.json();

    const version = release.tag_name?.replace(/^v/, "") || "0.0.0";
    const assets = release.assets || [];

    // Match assets to platforms
    const found = {};
    for (const [key, cfg] of Object.entries(PLATFORMS)) {
      const asset = assets.find((a) => cfg.match(a.name.toLowerCase()));
      if (asset) found[key] = { ...cfg, url: asset.browser_download_url, size: asset.size };
    }

    loadingEl.hidden = true;

    if (Object.keys(found).length === 0) {
      errorEl.textContent = "Aucun installateur disponible pour le moment.";
      errorEl.hidden = false;
      return;
    }

    // Render cards — current OS first with "primary" style
    const sorted = Object.entries(found).sort(([a], [b]) => {
      if (a === currentOS) return -1;
      if (b === currentOS) return 1;
      return 0;
    });

    for (const [platform, data] of sorted) {
      const isPrimary = platform === currentOS;
      const card = document.createElement("div");
      card.className = `download-card${isPrimary ? " primary" : ""}`;
      card.innerHTML = `
        <span class="platform-icon">${data.icon}</span>
        <div class="platform-name">${data.label}</div>
        <div class="platform-meta">v${version} — ${formatBytes(data.size)}</div>
        <a href="${data.url}" class="btn ${isPrimary ? "btn-primary" : "btn-outline"}" download>
          ${isPrimary ? "Telecharger" : "Telecharger"}
        </a>
      `;
      cardsEl.appendChild(card);
    }
  } catch (err) {
    loadingEl.hidden = true;
    errorEl.textContent = "Impossible de charger les telechargements.";
    errorEl.hidden = false;
    console.error("[Download]", err);
  }
}
