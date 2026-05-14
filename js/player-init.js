// Player initialization — loaded only on player.html
// Depends on: VIDEO_CATALOG (videos.js), catalog.js, videojs global (vendor/video.min.js)

function detectType(src, declaredType) {
  if (declaredType) return declaredType;
  if (!src) return 'video/mp4';
  if (src.includes('.m3u8')) return 'application/x-mpegURL';
  if (src.includes('.webm')) return 'video/webm';
  return 'video/mp4';
}

function showNotFound(message) {
  var wrap = document.getElementById('player-wrap');
  if (wrap) {
    wrap.innerHTML =
      '<div class="not-found">' +
        '<h2>Video nenájdené</h2>' +
        '<p>' + (message || 'Zadané video neexistuje v katalógu.') + '</p>' +
        '<a href="./index.html">← Späť na prehľad</a>' +
      '</div>';
  }
}

function initPlayer() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');

  if (!id) { showNotFound('Nebol zadaný žiadny identifikátor videa.'); return; }

  var video = getVideoById(decodeURIComponent(id));
  if (!video) { showNotFound('Video s ID "' + id + '" sa nenašlo.'); return; }

  // Update page metadata
  document.title = video.title + ' – VideoEnabler';
  var titleEl = document.getElementById('video-title');
  if (titleEl) titleEl.textContent = video.title || 'Bez názvu';

  var metaEl = document.getElementById('video-meta');
  if (metaEl) {
    var parts = [];
    if (video.duration) parts.push(video.duration);
    if (video.category) parts.push(video.category);
    metaEl.textContent = parts.join(' · ');
  }

  var descEl = document.getElementById('video-desc');
  if (descEl) {
    descEl.textContent = video.description || '';
    descEl.style.display = video.description ? 'block' : 'none';
  }

  // Initialize Video.js
  // video.min.js 8.x bundles VHS (HLS) — no separate plugin needed
  // HLS uses XHR/fetch only, zero WebSockets — works behind corporate firewalls
  var player = videojs('video-player', {
    controls: true,
    autoplay: false,
    preload: 'metadata',
    fluid: false,
    fill: true,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
    html5: {
      vhs: {
        // Disable WebSocket-based low-latency features — only use plain XHR
        enableLowInitialPlaylist: false,
        useNetworkInformationApi: false
      }
    },
    sources: [{
      src: video.src,
      type: detectType(video.src, video.type)
    }],
    poster: video.thumbnail || ''
  });

  player.on('error', function() {
    var err = player.error();
    console.error('VideoEnabler player error:', err);
  });

  // Populate the up-next sidebar
  var sidebarList = document.getElementById('sidebar-list');
  if (sidebarList) {
    var others = getAllVideos().filter(function(v) { return v.id !== video.id; });
    others.forEach(function(v) {
      sidebarList.appendChild(createSidebarCard(v));
    });
    if (others.length === 0) {
      sidebarList.innerHTML = '<p style="color:var(--text-secondary);font-size:13px;">Žiadne ďalšie videá.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', initPlayer);
