const artworks = [
  { id: "golden-hour", title: "The Golden Hour", artist: "Lumi Visuals", handle: "@lumivisuals", location: "Lagos, Nigeria", price: 320, kind: "Original", category: "Painting", size: "60 × 80 cm", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85", alt: "Colorful expressive portrait painting", color: "linear-gradient(135deg,#cf744d,#23424a)", description: "A celebration of the quiet magic that happens just before the day ends. Rich layers of color and texture bring warmth, movement and a little bit of wonder into any room." },
  { id: "river-thoughts", title: "River of Thoughts", artist: "Nia Adeyemi", handle: "@nia.creates", location: "Accra, Ghana", price: 240, kind: "Original", category: "Painting", size: "50 × 70 cm", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=85", alt: "Abstract blue and ochre landscape artwork", color: "linear-gradient(135deg,#578d9a,#db9951)", description: "An abstract landscape inspired by the places we carry with us. Hand-painted in acrylic on archival canvas." },
  { id: "urban-soul", title: "Urban Soul", artist: "Kemi Arts", handle: "@kemi.arts", location: "Lagos, Nigeria", price: 180, kind: "Print", category: "Digital Art", size: "40 × 50 cm", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1000&q=85", alt: "Vibrant modern abstract artwork", color: "linear-gradient(135deg,#e45d38,#253f4e)", description: "A vivid study of city life, movement and identity. Archival quality print, signed by the artist." },
  { id: "silent-forest", title: "The Silent Forest", artist: "Tobi Okafor", handle: "@tobisketches", location: "Abuja, Nigeria", price: 420, kind: "Original", category: "Illustration", size: "70 × 90 cm", image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85", alt: "Dreamlike forest-inspired art print", color: "linear-gradient(135deg,#6c8261,#c4a36b)", description: "A quiet escape into green. This original mixed-media work layers delicate botanical forms with soft, earthy pigments." },
  { id: "blue-visions", title: "Blue Visions", artist: "Lumi Visuals", handle: "@lumivisuals", location: "Lagos, Nigeria", price: 150, kind: "Print", category: "Digital Art", size: "40 × 60 cm", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=85", alt: "Blue and orange contemporary abstract painting", color: "linear-gradient(135deg,#17465c,#ed7c44)", description: "A signed limited-edition print exploring bold color, memory and the feeling of a city at dusk." },
  { id: "sunday-dreams", title: "Sunday Dreams", artist: "Maya Bello", handle: "@mayabello", location: "Ibadan, Nigeria", price: 200, kind: "Original", category: "Sculpture", size: "30 × 40 cm", image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=85", alt: "Soft earthy abstract art on canvas", color: "linear-gradient(135deg,#c8a775,#8b7759)", description: "A tender little reminder to slow down. Created with natural pigments on handmade cotton paper." }
];

const artists = [
  { name: "Lumi Visuals", handle: "@lumivisuals", location: "Lagos, NG", letter: "L", tint: "linear-gradient(145deg,#d68c58,#334b45)" },
  { name: "Nia Adeyemi", handle: "@nia.creates", location: "Accra, GH", letter: "N", tint: "linear-gradient(145deg,#477d83,#d58e5c)" },
  { name: "Kemi Arts", handle: "@kemi.arts", location: "Lagos, NG", letter: "K", tint: "linear-gradient(145deg,#d75f42,#1d3c49)" },
  { name: "Tobi Okafor", handle: "@tobisketches", location: "Abuja, NG", letter: "T", tint: "linear-gradient(145deg,#97a875,#555c43)" }
];

const posts = [
  { id: "post-golden-hour", author: "Lumi Visuals", handle: "@lumivisuals", caption: "Chasing that last bit of golden light in the studio. This piece is finally ready to find its forever home.", image: artworks[0].image, artworkId: "golden-hour", likes: 28, reposts: 4 },
  { id: "post-river-thoughts", author: "Nia Adeyemi", handle: "@nia.creates", caption: "A little look at the colors and memories behind River of Thoughts. What does this landscape remind you of?", image: artworks[1].image, artworkId: "river-thoughts", likes: 16, reposts: 2 },
  { id: "post-live-studio", author: "Kemi Arts", handle: "@kemi.arts", caption: "I'm live from the studio, working through a new abstract piece. Come say hello and ask me anything.", image: artworks[2].image, live: true, likes: 9, reposts: 1 }
];
const stories = artists.slice(0, 4).map((artist, index) => ({
  id: `story-${index}`,
  author: artist.name,
  handle: artist.handle,
  caption: ["A quiet moment in the studio today.", "New colors, new directions.", "Working on something bright.", "Sketchbook pages from this week."][index],
  image: artworks[index].image
}));
const state = { view: "home", category: "All", query: "", saved: new Set(), selectedArtwork: artworks[0], cart: null, followed: new Set(), likedPosts: new Set(), repostedPosts: new Set(), comments: {}, openComments: new Set(), hostedSession: null };
const container = document.querySelector("#view-container");
const modalRoot = document.querySelector("#modal-root");
const toastEl = document.querySelector("#toast");
let toastTimer;

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function setView(view) {
  state.view = view;
  document.querySelectorAll("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  const labels = { home: "Home", explore: "Explore", live: "Live Sessions", saved: "Saved Artwork", profile: "My Profile", create: "Create", notifications: "Notifications", detail: "Artwork" };
  document.querySelector("#crumb-current").textContent = labels[view] || "Home";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function artistAvatar(name, extra = "") {
  const artist = artists.find((item) => item.name === name);
  return `<span class="avatar ${extra}" style="background:${artist?.tint || "linear-gradient(145deg,#d59b71,#776450)"}">${artist?.letter || name[0]}</span>`;
}

function artworkCard(item) {
  const isSaved = state.saved.has(item.id);
  return `<article class="art-card" data-art="${item.id}" tabindex="0" aria-label="${item.title} by ${item.artist}, $${item.price}">
    <div class="art-image"><img src="${item.image}" alt="${item.alt}" loading="lazy" onerror="this.style.background='${item.color}';this.style.opacity='.2'"><button class="heart-button ${isSaved ? "saved" : ""}" data-save="${item.id}" aria-label="${isSaved ? "Remove from" : "Add to"} saved artwork">${isSaved ? "♥" : "♡"}</button></div>
    <div class="art-info"><div class="art-title-row"><h3>${item.title}</h3><span class="art-price">$${item.price}</span></div>
    <div class="artist-line">${artistAvatar(item.artist)}<span>${item.artist}</span></div>
    <div class="art-meta"><span>${item.category} · ${item.kind}</span><span>♡ ${Math.floor(item.price / 3 + 12)}</span></div></div>
  </article>`;
}

function pageHeading(eyebrow, title, subtitle, action = "") {
  return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="subheading">${subtitle}</p></div>${action}</div>`;
}

function storyRow() {
  return `<section class="section social-stories"><div class="section-head"><div><h2>Stories</h2><p>Little moments from the Artify community.</p></div><button class="text-link" data-social-compose="story">＋ Add to your story</button></div><div class="story-row"><button class="story story-add" data-social-compose="story" aria-label="Add to your story"><span class="story-add-avatar">+</span><small>Your story</small></button>${stories.map((story) => `<button class="story" data-story="${escapeHtml(story.id)}" aria-label="View ${escapeHtml(story.author)}'s story">${artistAvatar(story.author)}<small>${escapeHtml(story.author.split(" ")[0])}</small></button>`).join("")}</div></section>`;
}

function postCard(post) {
  const artwork = artworks.find((item) => item.id === post.artworkId);
  const comments = state.comments[post.id] || [];
  const liked = state.likedPosts.has(post.id);
  const reposted = state.repostedPosts.has(post.id);
  return `<article class="social-post">
    <header class="social-post-head">${artistAvatar(post.author)}<div class="social-author"><strong>${escapeHtml(post.author)}</strong><small>${escapeHtml(post.handle)} · ${post.live ? "Live session" : "Art community"}</small></div>${post.live ? `<span class="live-badge">● LIVE</span>` : ""}</header>
    ${post.caption ? `<p class="social-caption">${escapeHtml(post.caption)}</p>` : ""}
    ${post.image ? `<img class="social-post-image" src="${escapeHtml(post.image)}" alt="${artwork ? escapeHtml(artwork.alt) : `Artwork shared by ${escapeHtml(post.author)}`}" loading="lazy">` : ""}
    ${artwork ? `<div class="post-art-link"><div><strong>${escapeHtml(artwork.title)}</strong><small>${escapeHtml(artwork.artist)} · ${escapeHtml(artwork.kind)}</small></div><button class="buy-cta" data-buy="${escapeHtml(artwork.id)}">Buy artwork · $${artwork.price}</button></div>` : ""}
    ${post.live ? `<button class="post-live-link" data-view="live">Join the live session <span>↗</span></button>` : ""}
    <div class="social-post-actions"><button class="${liked ? "liked" : ""}" data-like="${escapeHtml(post.id)}" aria-pressed="${liked}"><span>${liked ? "♥" : "♡"}</span> ${post.likes + (liked ? 1 : 0)} Likes</button><button data-comment-toggle="${escapeHtml(post.id)}" aria-expanded="${state.openComments.has(post.id)}"><span>◯</span> Comment · ${comments.length}</button><button class="${reposted ? "reposted" : ""}" data-repost="${escapeHtml(post.id)}" aria-pressed="${reposted}"><span>⟳</span> ${reposted ? "Reposted" : `Repost · ${post.reposts + (reposted ? 1 : 0)}`}</button><button data-share="${escapeHtml(post.id)}"><span>↗</span> Share</button></div>
    ${state.openComments.has(post.id) ? `<section class="post-comments" aria-label="Comments"><div class="comment-list">${comments.length ? comments.map((comment) => `<p><strong>${escapeHtml(comment.author)}</strong> ${escapeHtml(comment.text)}</p>`).join("") : `<p class="no-comments">Be the first to share a thought.</p>`}</div><form class="comment-form" data-comment-form="${escapeHtml(post.id)}"><label class="sr-only" for="comment-${escapeHtml(post.id)}">Write a comment</label><input id="comment-${escapeHtml(post.id)}" name="comment" required maxlength="280" placeholder="Add a thoughtful comment..."><button type="submit" aria-label="Post comment">Post</button></form></section>` : ""}
  </article>`;
}

function communityFeed() {
  return `<section class="section community-feed"><div class="section-head"><div><h2>Community feed</h2><p>Fresh work, conversations and studio moments.</p></div><button class="button button-primary" data-social-compose="post">＋ Create a post</button></div><button class="feed-composer" data-social-compose="post">${artistAvatar("Emmanuel")}<span>Share a thought or a new piece...</span><strong>Post</strong></button><div class="social-post-list">${posts.map(postCard).join("")}</div></section>`;
}

function homeView() {
  const categories = [["✳", "Painting"], ["▧", "Illustration"], ["◈", "Digital Art"], ["◉", "Sculpture"], ["✿", "Mixed Media"]];
  return `${pageHeading("The Artify community", "Art is better together.", "Discover artists, share what inspires you, and find your next favorite piece.", `<button class="button button-primary" data-social-compose="post">＋ Create a post</button>`)}
    ${storyRow()}${communityFeed()}
    <section class="hero"><div class="hero-copy"><p class="eyebrow">THE ARTIST SPOTLIGHT · THIS WEEK</p><h1>Art that tells a story.</h1><p>Meet independent artists making work that moves you. Find something meaningful, made with care.</p><button class="button button-primary" data-artist="Lumi Visuals">Meet Lumi Visuals <span>↗</span></button></div><div class="hero-art"><div class="hero-caption"><strong>Color in the quiet</strong><span>Lumi Visuals · Lagos</span></div></div></section>
    <section class="section"><div class="section-head"><div><h2>Explore by feeling</h2><p>Start with what catches your eye.</p></div><button class="text-link" data-view="explore">See all categories ↗</button></div><div class="category-row">${categories.map(([icon, name]) => `<button class="category-chip" data-category="${name}"><span class="category-emoji">${icon}</span>${name}</button>`).join("")}</div></section>
    <section class="section"><div class="section-head"><div><h2>Pieces worth a closer look</h2><p>Thoughtful work from artists in our community.</p></div><button class="text-link" data-view="explore">Explore all artwork ↗</button></div><div class="art-grid">${artworks.slice(0, 3).map(artworkCard).join("")}</div></section>
    <section class="section"><div class="section-head"><div><h2>Artists to know</h2><p>Good things happen when you follow your curiosity.</p></div><button class="text-link" data-view="explore">Meet the community ↗</button></div><div class="artist-strip">${artists.map(artistCard).join("")}</div></section>`;
}

function artistCard(artist) {
  const following = state.followed.has(artist.name);
  return `<div class="artist-card">${artistAvatar(artist.name)}<div><strong>${artist.name}</strong><small>${artist.location}</small></div><button class="follow-mini" data-follow="${artist.name}">${following ? "Following" : "Follow"}</button></div>`;
}

function exploreView() {
  const categories = ["All", "Painting", "Illustration", "Digital Art", "Sculpture", "Mixed Media"];
  let matches = artworks.filter((art) => state.category === "All" || art.category === state.category);
  if (state.query) matches = matches.filter((art) => `${art.title} ${art.artist} ${art.category}`.toLowerCase().includes(state.query.toLowerCase()));
  return `${pageHeading("Discover something new", "Explore artwork", "A little inspiration for wherever you are in your day.")}
    <label class="explore-search"><span>⌕</span><input id="explore-search" value="${escapeHtml(state.query)}" placeholder="Search artwork, artists, styles..." aria-label="Search explore"></label>
    <div class="filters">${categories.map((category) => `<button class="filter-chip ${state.category === category ? "active" : ""}" data-category="${category}">${category}</button>`).join("")}<span style="flex:1"></span><select class="filter-select" id="sort-select" aria-label="Sort artwork"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>
    <div class="art-grid" id="explore-grid">${matches.length ? matches.map(artworkCard).join("") : `<div class="empty-state"><span>⌕</span><h3>No art found just yet</h3><p>Try another search or category.</p></div>`}</div>`;
}

function savedView() {
  const items = artworks.filter((art) => state.saved.has(art.id));
  return `${pageHeading("Your collection", "Saved artwork", "Keep the pieces you love close by.")}
    <div class="art-grid">${items.length ? items.map(artworkCard).join("") : `<div class="empty-state"><span>♡</span><h3>Your saved collection starts here</h3><p>Tap the heart on any artwork to save it for later.</p><button class="button button-primary" data-view="explore" style="margin-top:16px">Explore artwork</button></div>`}</div>`;
}

function detailView() {
  const item = state.selectedArtwork;
  return `<button class="text-link back-link" data-view="explore">← Back to explore</button><section class="detail-layout" style="margin-top:17px"><div class="detail-image"><img src="${item.image}" alt="${item.alt}"></div><div class="detail-copy"><p class="eyebrow">${item.category} · ${item.kind}</p><h1>${item.title}</h1><div class="artist-byline">${artistAvatar(item.artist)}<span>By <strong>${item.artist}</strong><br>${item.location}</span><button class="follow-mini" data-follow="${item.artist}">${state.followed.has(item.artist) ? "Following" : "Follow"}</button></div><div class="detail-price">$${item.price} <span class="detail-tag">Available</span></div><p>${item.description}</p><div class="detail-specs"><div><span>Medium</span><strong>${item.category === "Digital Art" ? "Archival print" : "Acrylic on canvas"}</strong></div><div><span>Dimensions</span><strong>${item.size}</strong></div><div><span>Availability</span><strong>1 original available</strong></div><div><span>Ships from</span><strong>${item.location}</strong></div></div><button class="button button-primary" data-buy="${item.id}">Buy this artwork <span>↗</span></button><button class="text-link" data-save="${item.id}" style="margin-top:12px">${state.saved.has(item.id) ? "♥ Saved to your collection" : "♡ Save for later"}</button><section class="section"><div class="section-head"><h2>About the artist</h2></div><p class="subheading">Creating color-filled stories inspired by everyday life, memory and the places we call home.</p></section></div></section>`;
}

function profileView() {
  const items = artworks.filter((art) => art.artist === "Lumi Visuals");
  return `<div class="profile-cover"></div><div class="profile-card">${artistAvatar("Lumi Visuals")}<div class="profile-name"><h1>Lumi Visuals</h1><p>@lumivisuals · Lagos, Nigeria</p></div><button class="button ${state.followed.has("Lumi Visuals") ? "button-light" : "button-primary"}" data-follow="Lumi Visuals">${state.followed.has("Lumi Visuals") ? "Following" : "Follow artist"}</button></div><div class="profile-stats"><div><strong>36</strong><small>Artworks</small></div><div><strong>1.2k</strong><small>Followers</small></div><div><strong>324</strong><small>Following</small></div><div><strong>48</strong><small>Collected</small></div></div><p class="profile-bio">I create art that tells stories of identity, resilience and the everyday magic in our surroundings. Inspired by people, my community and the colors around me.</p><section class="section"><div class="section-head"><div><h2>Available artwork</h2><p>Original pieces and limited prints.</p></div><button class="text-link" data-view="live">Watch live session ↗</button></div><div class="art-grid">${items.map(artworkCard).join("")}${artworkCard(artworks[4])}</div></section>`;
}

function liveView() {
  const liveItems = [
    { name: "Studio Sunday with Lumi", artist: "Lumi Visuals", viewers: 128, image: artworks[0].image },
    { name: "Sketchbook to canvas", artist: "Nia Adeyemi", viewers: 64, image: artworks[1].image }
  ];
  const hostedSession = state.hostedSession ? `<article class="host-session-card"><div class="host-session-status"><span class="live-badge">● LIVE · YOUR SESSION</span><button class="text-link" data-end-live>End session</button></div><h2>${escapeHtml(state.hostedSession.title)}</h2><p>Your demo session is open. Live video is not connected in this prototype.</p>${state.hostedSession.artwork ? `<div class="checkout-summary"><img src="${state.hostedSession.artwork.image}" alt="${escapeHtml(state.hostedSession.artwork.alt)}"><div><strong>${escapeHtml(state.hostedSession.artwork.title)}</strong><small>$${state.hostedSession.artwork.price} · Featured artwork</small></div><button class="button button-primary button-small" data-buy="${escapeHtml(state.hostedSession.artwork.id)}">Buy · $${state.hostedSession.artwork.price}</button></div>` : ""}</article>` : "";
  return `${pageHeading("Happening right now", "Live from the studio", "Watch artists create, ask questions and find your next favorite piece.", `<button class="button button-primary" data-host-live>＋ Start a live session</button>`)}
    ${hostedSession}<div class="live-grid">${liveItems.map((item) => `<article class="live-card"><img src="${item.image}" alt=""><div class="live-card-copy"><span class="live-badge">● LIVE&nbsp;&nbsp; ${item.viewers} watching</span><h3>${item.name}</h3><p>With ${item.artist} · Tap to join the session</p></div></article>`).join("")}</div>
    <section class="section"><div class="section-head"><div><h2>Coming up</h2><p>Save a reminder for a session you don't want to miss.</p></div></div><div class="artist-strip">${artists.slice(1, 4).map((artist) => `<div class="artist-card">${artistAvatar(artist.name)}<div><strong>${artist.name}</strong><small>Studio session · Tomorrow</small></div><button class="follow-mini" data-remind="${artist.name}">Remind me</button></div>`).join("")}</div></section>`;
}

function notificationsView() {
  const rows = [
    ["K", "Kemi Arts started a live session", "Studio tour: Abstracts & Art · 20 min ago"],
    ["L", "Someone liked your artwork", "“Golden Hour” · 1 hour ago"],
    ["N", "You got a new follower", "nia.creates started following you · 4 hours ago"],
    ["T", "A collector purchased your art", "“The Golden Hour” · Yesterday"]
  ];
  return `${pageHeading("Your latest updates", "Notifications", "A little love from around the Artify community.")}<div class="notification-list">${rows.map(([artist, title, description]) => `<div class="notification-row">${artistAvatar(artists.find((item) => item.letter === artist)?.name || "Lumi Visuals")}<div><p><strong>${title}</strong></p><small>${description}</small></div></div>`).join("")}</div>`;
}

function createView() {
  return `${pageHeading("Make something wonderful", "Create and share", "Post a moment, add to your story, or list artwork for sale.")}
    <section class="create-shortcuts"><button class="create-shortcut" data-social-compose="post"><span>✎</span><strong>Create a post</strong><small>Share a thought, image, or artwork.</small></button><button class="create-shortcut" data-social-compose="story"><span>◉</span><strong>Add to your story</strong><small>Share a quick behind-the-scenes moment.</small></button><button class="create-shortcut" data-host-live><span>●</span><strong>Host a live session</strong><small>Meet your community in the studio.</small></button></section>
    <section class="create-listing"><h2>List artwork for sale</h2><p class="subheading">Add a piece to the marketplace with clear pricing.</p><form id="listing-form"><div class="form-field"><label for="listing-title">Artwork title</label><input id="listing-title" required placeholder="e.g. Sunlit mornings"></div><div class="form-field"><label for="listing-description">Tell us about your work</label><textarea id="listing-description" placeholder="What inspired this piece?"></textarea></div><div class="detail-specs" style="margin:13px 0"><div class="form-field" style="margin:0"><label for="listing-price">Price (USD)</label><input id="listing-price" required type="number" min="1" placeholder="120"></div><div class="form-field" style="margin:0"><label for="listing-category">Category</label><select id="listing-category"><option>Painting</option><option>Illustration</option><option>Digital Art</option><option>Sculpture</option></select></div></div><div class="form-field"><label for="listing-image">Image URL (optional)</label><input id="listing-image" type="url" placeholder="https://..."></div><button class="button button-primary" type="submit">Publish artwork ↗</button></form></section>`;
}

function render() {
  const views = { home: homeView, explore: exploreView, saved: savedView, detail: detailView, profile: profileView, live: liveView, notifications: notificationsView, create: createView };
  container.innerHTML = (views[state.view] || homeView)();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function openArtwork(item) {
  state.selectedArtwork = item;
  setView("detail");
}

function showCheckout(id) {
  const item = artworks.find((art) => art.id === id);
  if (!item) return;
  state.cart = item;
  modalRoot.innerHTML = `<div class="modal-backdrop" data-dismiss><section class="modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title"><div class="modal-head"><div><p class="eyebrow">A piece to call your own</p><h2 id="checkout-title">Confirm your artwork</h2></div><button class="modal-close" data-dismiss aria-label="Close checkout">×</button></div><form id="checkout-form"><div class="checkout-summary"><img src="${item.image}" alt=""><div><strong>${item.title}</strong><small>${item.artist} · ${item.kind}</small></div><b style="margin-left:auto">$${item.price}</b></div><div class="checkout-total"><span>Total</span><span>$${item.price}</span></div><p class="checkout-note">This demo checkout won't charge you. Delivery and payment details would be collected securely at the next step.</p><button class="button button-primary checkout-confirm" type="submit">Confirm demo purchase · $${item.price} <span>↗</span></button></form></section></div>`;
}

function showSuccess(item) {
  modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal success-panel" role="dialog" aria-modal="true" aria-labelledby="success-title"><div class="success-check">✓</div><h2 id="success-title">Your order is confirmed!</h2><p>Thank you for supporting independent art.<br>Your demo order for <strong>${item.title}</strong> is on its way.</p><div class="checkout-summary" style="text-align:left;margin:20px 0"><img src="${item.image}" alt=""><div><strong>${item.title}</strong><small>Order #ART${Math.floor(100000 + Math.random() * 899999)} · Estimated delivery 5–7 days</small></div></div><button class="button button-primary" data-dismiss>Back to browsing</button></section></div>`;
}

function showSocialComposer(kind) {
  const isStory = kind === "story";
  const title = isStory ? "Share a story" : "Create a post";
  modalRoot.innerHTML = `<div class="modal-backdrop" data-dismiss><section class="modal" role="dialog" aria-modal="true" aria-labelledby="social-compose-title"><div class="modal-head"><div><p class="eyebrow">${isStory ? "A moment from your studio" : "Your voice belongs here"}</p><h2 id="social-compose-title">${title}</h2></div><button class="modal-close" data-dismiss aria-label="Close">×</button></div><form id="social-form" data-kind="${kind}"><div class="form-field"><label for="social-caption">Add a caption <span class="field-optional">optional</span></label><textarea id="social-caption" name="caption" maxlength="500" placeholder="${isStory ? "A peek behind the scenes..." : "Tell the community about your work or inspiration..."}"></textarea></div><label class="upload-field" for="social-image-file"><span class="upload-icon">＋</span><span><strong>Add a photo</strong><small>Choose an image from your device</small></span><input id="social-image-file" name="imageFile" type="file" accept="image/*"></label><div class="form-field"><label for="social-image">Or paste an image link <span class="field-optional">optional</span></label><input id="social-image" name="image" type="url" placeholder="https://..."></div><div class="form-field"><label for="social-artwork">Feature an artwork <span class="field-optional">optional</span></label><select id="social-artwork" name="artwork"><option value="">No artwork selected</option>${artworks.map((artwork) => `<option value="${escapeHtml(artwork.id)}">${escapeHtml(artwork.title)} · $${artwork.price}</option>`).join("")}</select></div><p class="composer-hint">Add a caption, a photo, or both to share.</p><button class="button button-primary" type="submit">${isStory ? "Share story" : "Publish post"} <span>↗</span></button></form></section></div>`;
  document.querySelector("#social-caption").focus();
}

function showHostSession() {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-dismiss><section class="modal" role="dialog" aria-modal="true" aria-labelledby="host-session-title"><div class="modal-head"><div><p class="eyebrow">Bring your studio to the community</p><h2 id="host-session-title">Start a live session</h2></div><button class="modal-close" data-dismiss aria-label="Close">×</button></div><form id="host-session-form"><div class="form-field"><label for="session-title">Session title <span class="field-optional">optional</span></label><input id="session-title" name="title" maxlength="80" placeholder="Studio time with Emmanuel"></div><div class="form-field"><label for="session-artwork">Feature an artwork <span class="field-optional">optional</span></label><select id="session-artwork" name="artwork"><option value="">No artwork selected</option>${artworks.map((artwork) => `<option value="${escapeHtml(artwork.id)}">${escapeHtml(artwork.title)} · $${artwork.price}</option>`).join("")}</select></div><p class="composer-hint">This demo opens a session preview. Live video streaming isn't connected yet.</p><button class="button button-primary" type="submit">Start session <span>↗</span></button></form></section></div>`;
  document.querySelector("#session-title").focus();
}

function showStory(id) {
  const story = stories.find((item) => item.id === id);
  if (!story) return;
  const artwork = artworks.find((item) => item.id === story.artworkId);
  modalRoot.innerHTML = `<div class="modal-backdrop story-backdrop" data-dismiss><section class="story-viewer" role="dialog" aria-modal="true" aria-label="${escapeHtml(story.author)}'s story"><img src="${escapeHtml(story.image || artwork?.image || artworks[0].image)}" alt="Story shared by ${escapeHtml(story.author)}"><div class="story-viewer-shade"></div><header>${artistAvatar(story.author)}<div><strong>${escapeHtml(story.author)}</strong><small>${escapeHtml(story.handle)}</small></div><button class="modal-close" data-dismiss aria-label="Close story">×</button></header><p>${escapeHtml(story.caption)}</p>${artwork ? `<button class="button button-primary story-buy" data-buy="${escapeHtml(artwork.id)}">View ${escapeHtml(artwork.title)} · $${artwork.price}</button>` : ""}</section></div>`;
}

function showShareLink(url) {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-dismiss><section class="modal" role="dialog" aria-modal="true" aria-labelledby="share-title"><div class="modal-head"><div><p class="eyebrow">Pass the inspiration along</p><h2 id="share-title">Share this post</h2></div><button class="modal-close" data-dismiss aria-label="Close">×</button></div><div class="form-field"><label for="share-url">Post link</label><input id="share-url" readonly value="${escapeHtml(url)}"></div><button class="button button-primary" type="button" data-copy-link>Copy link</button><p class="subheading" style="margin-top:10px">Copy this link to share the post with someone.</p></section></div>`;
  document.querySelector("#share-url").select();
}

async function sharePost(id) {
  const post = posts.find((item) => item.id === id);
  if (!post) return;
  const url = new URL(window.location.href);
  url.hash = `post=${encodeURIComponent(id)}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Artify community", text: post.caption, url: url.href });
      toast("Post shared.");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Couldn't share the post:", error);
    }
  }
  showShareLink(url.href);
}

async function copyShareLink() {
  const input = document.querySelector("#share-url");
  if (!input) return;
  input.select();
  try {
    if (!navigator.clipboard) throw new Error("Clipboard access is unavailable.");
    await navigator.clipboard.writeText(input.value);
    toast("Link copied to clipboard.");
  } catch (error) {
    console.error("Couldn't copy the post link:", error);
    toast("Link selected. Press Ctrl+C to copy it.");
  }
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, [data-art], [data-dismiss], [data-artist]");
  if (!target) return;
  if (target.matches("[data-dismiss]")) {
    if (target.classList.contains("modal-backdrop") && event.target !== target) return;
    modalRoot.innerHTML = "";
    if (state.view === "detail" && target.closest(".success-panel")) setView("home");
    return;
  }
  if (target.dataset.socialCompose) { showSocialComposer(target.dataset.socialCompose); return; }
  if (target.hasAttribute("data-host-live")) { showHostSession(); return; }
  if (target.hasAttribute("data-end-live")) {
    state.hostedSession = null;
    toast("Your demo session has ended.");
    render();
    return;
  }
  if (target.dataset.story) { showStory(target.dataset.story); return; }
  if (target.dataset.like) {
    const id = target.dataset.like;
    state.likedPosts.has(id) ? state.likedPosts.delete(id) : state.likedPosts.add(id);
    render();
    return;
  }
  if (target.dataset.commentToggle) {
    const id = target.dataset.commentToggle;
    state.openComments.has(id) ? state.openComments.delete(id) : state.openComments.add(id);
    render();
    if (state.openComments.has(id)) document.querySelector(`[data-comment-form="${id}"] input`)?.focus();
    return;
  }
  if (target.dataset.repost) {
    const id = target.dataset.repost;
    state.repostedPosts.has(id) ? state.repostedPosts.delete(id) : state.repostedPosts.add(id);
    toast(state.repostedPosts.has(id) ? "Post added to your reposts." : "Repost removed.");
    render();
    return;
  }
  if (target.dataset.share) { sharePost(target.dataset.share); return; }
  if (target.hasAttribute("data-copy-link")) { copyShareLink(); return; }
  if (target.dataset.view) { event.preventDefault(); setView(target.dataset.view); return; }
  if (target.dataset.category) {
    state.category = target.dataset.category;
    if (state.view !== "explore") setView("explore"); else render();
    return;
  }
  if (target.dataset.save) {
    event.stopPropagation();
    const id = target.dataset.save;
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    toast(state.saved.has(id) ? "Added to your saved artwork." : "Removed from saved artwork.");
    render();
    return;
  }
  if (target.dataset.follow) {
    const name = target.dataset.follow;
    state.followed.has(name) ? state.followed.delete(name) : state.followed.add(name);
    toast(state.followed.has(name) ? `You're now following ${name}.` : `Unfollowed ${name}.`);
    render();
    return;
  }
  if (target.dataset.remind) { toast(`Reminder set for ${target.dataset.remind}'s session.`); target.textContent = "Reminder set"; return; }
  if (target.dataset.buy) { showCheckout(target.dataset.buy); return; }
  if (target.dataset.artist) { setView("profile"); return; }
  if (target.dataset.art) { openArtwork(artworks.find((art) => art.id === target.dataset.art)); }
});

document.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-art]");
  if (card && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openArtwork(artworks.find((art) => art.id === card.dataset.art)); }
  if (event.key === "Escape") modalRoot.innerHTML = "";
});

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("The selected image couldn't be read."));
    });
    reader.addEventListener("error", () => reject(reader.error || new Error("The selected image couldn't be read.")));
    reader.readAsDataURL(file);
  });
}

document.addEventListener("submit", async (event) => {
  if (event.target.matches("[data-comment-form]")) {
    event.preventDefault();
    const id = event.target.dataset.commentForm;
    const input = event.target.elements.comment;
    const text = input.value.trim();
    if (!text) return;
    state.comments[id] = state.comments[id] || [];
    state.comments[id].push({ author: "Emmanuel", text });
    state.openComments.add(id);
    render();
    toast("Comment posted.");
    return;
  }
  if (event.target.id === "social-form") {
    event.preventDefault();
    const form = event.target;
    const caption = form.elements.caption.value.trim();
    const selectedArtwork = artworks.find((artwork) => artwork.id === form.elements.artwork.value);
    let image = form.elements.image.value.trim() || selectedArtwork?.image || "";
    const imageFile = form.elements.imageFile.files[0];
    if (imageFile) {
      try {
        image = await readImageFile(imageFile);
      } catch (error) {
        console.error("Couldn't read the selected image:", error);
        toast("Couldn't load that image. Try another file.");
        return;
      }
    }
    if (!caption && !image) { toast("Add a caption or photo before sharing."); return; }
    if (form.dataset.kind === "story") {
      stories.unshift({ id: `story-${Date.now()}`, author: "Emmanuel", handle: "@emmanuel", caption: caption || "A moment from my studio.", image, artworkId: selectedArtwork?.id });
      toast("Your story is live.");
    } else {
      posts.unshift({ id: `post-${Date.now()}`, author: "Emmanuel", handle: "@emmanuel", caption, image, artworkId: selectedArtwork?.id, likes: 0, reposts: 0 });
      toast("Your post is live.");
    }
    modalRoot.innerHTML = "";
    if (state.view === "home") render(); else setView("home");
    return;
  }
  if (event.target.id === "host-session-form") {
    event.preventDefault();
    const form = event.target;
    const artwork = artworks.find((item) => item.id === form.elements.artwork.value);
    state.hostedSession = {
      title: form.elements.title.value.trim() || "Studio session with Emmanuel",
      artwork
    };
    modalRoot.innerHTML = "";
    setView("live");
    toast("Your demo session is open.");
    return;
  }
  if (event.target.id === "checkout-form") {
    event.preventDefault();
    showSuccess(state.cart);
  }
  if (event.target.id === "listing-form") {
    event.preventDefault();
    const title = document.querySelector("#listing-title").value.trim();
    const price = Number(document.querySelector("#listing-price").value);
    const image = document.querySelector("#listing-image").value.trim();
    const category = document.querySelector("#listing-category").value;
    if (!title || !Number.isFinite(price) || price <= 0) { toast("Add a title and a valid price to continue."); return; }
    artworks.unshift({ id: `listing-${Date.now()}`, title, artist: "Emmanuel", handle: "@emmanuel", location: "Lagos, Nigeria", price, kind: "Original", category, size: "40 × 50 cm", image: image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1000&q=85", alt: `${title}, artwork listing`, color: "linear-gradient(135deg,#d78356,#364a43)", description: document.querySelector("#listing-description").value || "A new piece shared with the Artify community." });
    toast("Your artwork listing is live in this demo.");
    setView("profile");
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "global-search") {
    state.query = event.target.value;
    state.category = "All";
    setView("explore");
    document.querySelector("#explore-search").focus();
    return;
  }
  if (event.target.id === "explore-search") {
    state.query = event.target.value;
    const cursor = event.target.selectionStart;
    render();
    const field = document.querySelector("#explore-search");
    field.focus();
    field.setSelectionRange(cursor, cursor);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "sort-select") {
    if (event.target.value === "price-low") artworks.sort((a, b) => a.price - b.price);
    if (event.target.value === "price-high") artworks.sort((a, b) => b.price - a.price);
    render();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.querySelector("#global-search").focus();
  }
});

render();
