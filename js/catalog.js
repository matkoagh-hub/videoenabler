// Shared catalog utilities — loaded on both index.html and player.html
// Depends on: VIDEO_CATALOG (global from videos.js)

function getVideoById(id) {
  return VIDEO_CATALOG.find(function(v) { return v.id === id; });
}

function getAllVideos() {
  return VIDEO_CATALOG.slice();
}

function getVideosByCategory(cat) {
  if (!cat || cat === 'all') return VIDEO_CATALOG.slice();
  return VIDEO_CATALOG.filter(function(v) { return v.category === cat; });
}

function searchVideos(query) {
  if (!query) return VIDEO_CATALOG.slice();
  var q = query.toLowerCase();
  return VIDEO_CATALOG.filter(function(v) {
    return (
      (v.title && v.title.toLowerCase().includes(q)) ||
      (v.description && v.description.toLowerCase().includes(q)) ||
      (v.tags && v.tags.some(function(t) { return t.toLowerCase().includes(q); })) ||
      (v.category && v.category.toLowerCase().includes(q))
    );
  });
}

function getCategories() {
  var seen = {};
  var cats = [];
  VIDEO_CATALOG.forEach(function(v) {
    if (v.category && !seen[v.category]) {
      seen[v.category] = true;
      cats.push(v.category);
    }
  });
  return cats;
}

function createThumb(video, cssClass) {
  var wrap = document.createElement('div');
  wrap.className = cssClass || 'video-card-thumb';

  if (video.thumbnail) {
    var img = document.createElement('img');
    img.src = video.thumbnail;
    img.alt = video.title || '';
    img.loading = 'lazy';
    // Fallback to placeholder on error
    img.onerror = function() {
      wrap.innerHTML = '<div class="thumb-placeholder">▶</div>';
    };
    wrap.appendChild(img);
  } else {
    var ph = document.createElement('div');
    ph.className = 'thumb-placeholder';
    ph.textContent = '▶';
    wrap.appendChild(ph);
  }

  if (video.duration) {
    var badge = document.createElement('span');
    badge.className = 'duration-badge';
    badge.textContent = video.duration;
    wrap.appendChild(badge);
  }

  return wrap;
}

// Returns a grid-style video card <a> element
function createVideoCard(video) {
  var a = document.createElement('a');
  a.className = 'video-card';
  a.href = './player.html?id=' + encodeURIComponent(video.id);
  a.title = video.title || 'Video';

  a.appendChild(createThumb(video, 'video-card-thumb'));

  var info = document.createElement('div');
  info.className = 'video-card-info';

  var title = document.createElement('div');
  title.className = 'video-card-title';
  title.textContent = video.title || 'Untitled';
  info.appendChild(title);

  var meta = document.createElement('div');
  meta.className = 'video-card-meta';
  meta.textContent = video.duration || '';
  info.appendChild(meta);

  if (video.category) {
    var chip = document.createElement('span');
    chip.className = 'category-chip';
    chip.textContent = video.category;
    info.appendChild(chip);
  }

  a.appendChild(info);
  return a;
}

// Returns a compact sidebar video card <a> element
function createSidebarCard(video) {
  var a = document.createElement('a');
  a.className = 'video-card-sidebar';
  a.href = './player.html?id=' + encodeURIComponent(video.id);
  a.title = video.title || 'Video';

  var thumbWrap = createThumb(video, 'sidebar-thumb');
  a.appendChild(thumbWrap);

  var info = document.createElement('div');
  info.className = 'sidebar-card-info';

  var title = document.createElement('div');
  title.className = 'sidebar-card-title';
  title.textContent = video.title || 'Untitled';
  info.appendChild(title);

  var meta = document.createElement('div');
  meta.className = 'sidebar-card-meta';
  meta.textContent = (video.category || '') + (video.duration ? ' · ' + video.duration : '');
  info.appendChild(meta);

  a.appendChild(info);
  return a;
}
