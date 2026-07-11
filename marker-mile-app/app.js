const locations = [
  { id: "boston", name: "Boston, MA", lat: 42.3601, lon: -71.0589 },
  { id: "new-york", name: "New York, NY", lat: 40.7128, lon: -74.006 },
  { id: "philadelphia", name: "Philadelphia, PA", lat: 39.9526, lon: -75.1652 },
  { id: "washington", name: "Washington, DC", lat: 38.9072, lon: -77.0369 },
  { id: "richmond", name: "Richmond, VA", lat: 37.5407, lon: -77.436 },
  { id: "charleston", name: "Charleston, SC", lat: 32.7765, lon: -79.9311 },
  { id: "savannah", name: "Savannah, GA", lat: 32.0809, lon: -81.0912 },
  { id: "st-augustine", name: "St. Augustine, FL", lat: 29.9012, lon: -81.3124 },
  { id: "atlanta", name: "Atlanta, GA", lat: 33.749, lon: -84.388 },
  { id: "nashville", name: "Nashville, TN", lat: 36.1627, lon: -86.7816 },
  { id: "memphis", name: "Memphis, TN", lat: 35.1495, lon: -90.049 },
  { id: "new-orleans", name: "New Orleans, LA", lat: 29.9511, lon: -90.0715 },
  { id: "chicago", name: "Chicago, IL", lat: 41.8781, lon: -87.6298 },
  { id: "st-louis", name: "St. Louis, MO", lat: 38.627, lon: -90.1994 },
  { id: "kansas-city", name: "Kansas City, MO", lat: 39.0997, lon: -94.5786 },
  { id: "denver", name: "Denver, CO", lat: 39.7392, lon: -104.9903 },
  { id: "santa-fe", name: "Santa Fe, NM", lat: 35.687, lon: -105.9378 },
  { id: "flagstaff", name: "Flagstaff, AZ", lat: 35.1983, lon: -111.6513 },
  { id: "los-angeles", name: "Los Angeles, CA", lat: 34.0522, lon: -118.2437 },
  { id: "san-francisco", name: "San Francisco, CA", lat: 37.7749, lon: -122.4194 },
  { id: "portland", name: "Portland, OR", lat: 45.5152, lon: -122.6784 },
  { id: "seattle", name: "Seattle, WA", lat: 47.6062, lon: -122.3321 }
];

const markers = [
  {
    id: "old-north",
    name: "Old North Church Marker",
    place: "Boston, MA",
    road: "I-93 / US 1",
    year: "1775",
    lat: 42.3663,
    lon: -71.0544,
    story: "A marker near Boston's North End points travelers toward the steeple linked with Paul Revere's midnight ride and the warning lanterns before Lexington and Concord."
  },
  {
    id: "federal-hall",
    name: "Federal Hall National Memorial",
    place: "New York, NY",
    road: "I-278 / FDR Drive",
    year: "1789",
    lat: 40.7073,
    lon: -74.0102,
    story: "This stop marks the place where George Washington took the first presidential oath and where the early federal government met in New York."
  },
  {
    id: "valley-forge",
    name: "Valley Forge Encampment",
    place: "King of Prussia, PA",
    road: "I-76",
    year: "1777",
    lat: 40.1009,
    lon: -75.4455,
    story: "Roadside markers around Valley Forge recall the Continental Army's winter encampment and the discipline that reshaped the army."
  },
  {
    id: "fort-mchenry",
    name: "Fort McHenry Marker",
    place: "Baltimore, MD",
    road: "I-95 / I-695",
    year: "1814",
    lat: 39.263,
    lon: -76.579,
    story: "This marker connects the highway corridor to the defense of Baltimore, where the flag over Fort McHenry inspired the national anthem."
  },
  {
    id: "fredericksburg",
    name: "Fredericksburg Battlefield",
    place: "Fredericksburg, VA",
    road: "I-95",
    year: "1862",
    lat: 38.2983,
    lon: -77.4705,
    story: "Markers along the I-95 corridor describe the December 1862 battle and the costly assaults below Marye's Heights."
  },
  {
    id: "first-flight",
    name: "First Flight Highway Marker",
    place: "Kill Devil Hills, NC",
    road: "US 158",
    year: "1903",
    lat: 36.0174,
    lon: -75.6686,
    story: "This coastal marker honors the Wright brothers' powered flights at Kitty Hawk and the sandy testing ground that changed travel."
  },
  {
    id: "fort-sumter",
    name: "Fort Sumter Departure Marker",
    place: "Charleston, SC",
    road: "I-26",
    year: "1861",
    lat: 32.7906,
    lon: -79.925,
    story: "Charleston markers point toward Fort Sumter, where the opening shots of the Civil War made the harbor a national landmark."
  },
  {
    id: "savannah-cotton",
    name: "Savannah Cotton Exchange",
    place: "Savannah, GA",
    road: "I-16 / I-95",
    year: "1887",
    lat: 32.0818,
    lon: -81.0912,
    story: "This riverfront marker preserves the story of Savannah's cotton trade, port economy, and the brokers who shaped the waterfront."
  },
  {
    id: "castillo",
    name: "Castillo de San Marcos Marker",
    place: "St. Augustine, FL",
    road: "I-95 / A1A",
    year: "1672",
    lat: 29.8979,
    lon: -81.3116,
    story: "A highway detour reaches the coquina fortress that guarded Spanish St. Augustine, the oldest continuously occupied European-founded city in the continental United States."
  },
  {
    id: "king-birth-home",
    name: "Martin Luther King Jr. Birth Home",
    place: "Atlanta, GA",
    road: "I-75 / I-85",
    year: "1929",
    lat: 33.7552,
    lon: -84.3726,
    story: "Markers in Sweet Auburn identify the neighborhood where Dr. King was born and trace Atlanta's central role in the civil rights movement."
  },
  {
    id: "grand-ole-opry",
    name: "Grand Ole Opry Marker",
    place: "Nashville, TN",
    road: "I-40 / I-65",
    year: "1925",
    lat: 36.2069,
    lon: -86.6922,
    story: "This marker celebrates the radio show that carried country music from Nashville stages to listeners across the United States."
  },
  {
    id: "mason-temple",
    name: "Mason Temple Civil Rights Marker",
    place: "Memphis, TN",
    road: "I-55 / I-40",
    year: "1968",
    lat: 35.1172,
    lon: -90.0358,
    story: "A Memphis marker commemorates the church where Dr. King delivered his final speech during the sanitation workers' strike."
  },
  {
    id: "preservation-hall",
    name: "Preservation Hall Marker",
    place: "New Orleans, LA",
    road: "I-10",
    year: "1961",
    lat: 29.9584,
    lon: -90.0653,
    story: "This French Quarter marker ties the road traveler to the living traditions of New Orleans jazz and the musicians who kept them visible."
  },
  {
    id: "route-66-begin",
    name: "Route 66 Begin Sign",
    place: "Chicago, IL",
    road: "I-55 / Historic Route 66",
    year: "1926",
    lat: 41.8786,
    lon: -87.6324,
    story: "Downtown Chicago's marker for Route 66 marks the traditional eastern launch point of the highway that carried generations west."
  },
  {
    id: "gateway-arch",
    name: "Gateway Arch Grounds Marker",
    place: "St. Louis, MO",
    road: "I-44 / I-64 / I-70",
    year: "1965",
    lat: 38.6247,
    lon: -90.1848,
    story: "Markers near the Mississippi riverfront interpret St. Louis as a launching place for western migration and the Jefferson National Expansion Memorial."
  },
  {
    id: "truman-home",
    name: "Harry S. Truman Home Marker",
    place: "Independence, MO",
    road: "I-70",
    year: "1884",
    lat: 39.0932,
    lon: -94.4215,
    story: "This marker connects the interstate to the longtime home of President Truman and the town that shaped his public life."
  },
  {
    id: "santa-fe-trail",
    name: "Santa Fe Trail Marker",
    place: "Santa Fe, NM",
    road: "I-25",
    year: "1821",
    lat: 35.687,
    lon: -105.9378,
    story: "Markers around Santa Fe recall the trade route that linked Missouri with New Mexico and carried merchants, soldiers, and settlers across the plains."
  },
  {
    id: "meteor-crater",
    name: "Meteor Crater Roadside Marker",
    place: "Winslow, AZ",
    road: "I-40",
    year: "1906",
    lat: 35.0272,
    lon: -111.0225,
    story: "This I-40 stop interprets the impact site that helped scientists prove the geologic force of meteor strikes on Earth."
  },
  {
    id: "santa-monica-pier",
    name: "Route 66 End of the Trail",
    place: "Santa Monica, CA",
    road: "I-10 / Historic Route 66",
    year: "1926",
    lat: 34.0094,
    lon: -118.4973,
    story: "The pier marker celebrates the western terminus of Route 66 and the symbolic finish line for cross-country road trips."
  },
  {
    id: "golden-gate",
    name: "Golden Gate Bridge Marker",
    place: "San Francisco, CA",
    road: "US 101",
    year: "1937",
    lat: 37.8199,
    lon: -122.4783,
    story: "Bridge markers describe the engineering, labor, and public imagination behind one of the West Coast's defining crossings."
  },
  {
    id: "fort-vancouver",
    name: "Fort Vancouver Marker",
    place: "Vancouver, WA",
    road: "I-5",
    year: "1825",
    lat: 45.6268,
    lon: -122.6615,
    story: "This marker identifies the Hudson's Bay Company post that became a hub of trade, migration, and settlement in the Pacific Northwest."
  },
  {
    id: "pioneer-square",
    name: "Pioneer Square Historic District",
    place: "Seattle, WA",
    road: "I-5 / I-90",
    year: "1852",
    lat: 47.6019,
    lon: -122.3343,
    story: "Markers in Pioneer Square trace Seattle's early settlement, rebuilding after the Great Fire, and its role as a gateway to Alaska."
  }
];

const state = {
  origin: "new-york",
  destination: "st-augustine",
  activeTab: "route",
  activeMarkerId: null,
  stamps: loadStamps()
};

const els = {
  originSelect: document.querySelector("#originSelect"),
  destinationSelect: document.querySelector("#destinationSelect"),
  swapButton: document.querySelector("#swapButton"),
  resetButton: document.querySelector("#resetButton"),
  tripMiles: document.querySelector("#tripMiles"),
  stopCount: document.querySelector("#stopCount"),
  stampCount: document.querySelector("#stampCount"),
  mapCanvas: document.querySelector("#mapCanvas"),
  routeStops: document.querySelector("#routeStops"),
  stampGrid: document.querySelector("#stampGrid"),
  routeTab: document.querySelector("#routeTab"),
  collectionTab: document.querySelector("#collectionTab"),
  routeView: document.querySelector("#routeView"),
  collectionView: document.querySelector("#collectionView"),
  collectionText: document.querySelector("#collectionText"),
  corridorText: document.querySelector("#corridorText"),
  markerDialog: document.querySelector("#markerDialog"),
  markerDetail: document.querySelector("#markerDetail")
};

function loadStamps() {
  try {
    return JSON.parse(localStorage.getItem("marker-mile-stamps")) || {};
  } catch {
    return {};
  }
}

function saveStamps() {
  localStorage.setItem("marker-mile-stamps", JSON.stringify(state.stamps));
}

function milesBetween(a, b) {
  const earthMiles = 3958.8;
  const toRad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toRad;
  const dLon = (b.lon - a.lon) * toRad;
  const lat1 = a.lat * toRad;
  const lat2 = b.lat * toRad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthMiles * Math.asin(Math.sqrt(h));
}

function projectedPoint(point, originLat) {
  const milesPerDegree = 69;
  return {
    x: point.lon * milesPerDegree * Math.cos(originLat * Math.PI / 180),
    y: point.lat * milesPerDegree
  };
}

function pointToSegment(point, start, end) {
  const originLat = (start.lat + end.lat) / 2;
  const p = projectedPoint(point, originLat);
  const a = projectedPoint(start, originLat);
  const b = projectedPoint(end, originLat);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared));
  const nearest = { x: a.x + t * dx, y: a.y + t * dy };
  const distance = Math.hypot(p.x - nearest.x, p.y - nearest.y);
  return { distance, progress: t };
}

function currentTrip() {
  const origin = locations.find((item) => item.id === state.origin);
  const destination = locations.find((item) => item.id === state.destination);
  const tripMiles = milesBetween(origin, destination);
  const corridor = tripMiles > 1200 ? 90 : tripMiles > 650 ? 70 : 50;
  const stops = markers
    .map((marker) => {
      const match = pointToSegment(marker, origin, destination);
      return {
        ...marker,
        distanceFromRoute: Math.round(match.distance),
        routeMile: Math.round(match.progress * tripMiles),
        progress: match.progress
      };
    })
    .filter((marker) => marker.distanceFromRoute <= corridor)
    .sort((a, b) => a.progress - b.progress || a.distanceFromRoute - b.distanceFromRoute);

  return { origin, destination, tripMiles: Math.round(tripMiles), corridor, stops };
}

function populateSelects() {
  const options = locations.map((location) => `<option value="${location.id}">${location.name}</option>`).join("");
  els.originSelect.innerHTML = options;
  els.destinationSelect.innerHTML = options;
  els.originSelect.value = state.origin;
  els.destinationSelect.value = state.destination;
}

function mapBounds(points) {
  const lats = points.map((point) => point.lat);
  const lons = points.map((point) => point.lon);
  const padLat = Math.max(0.4, (Math.max(...lats) - Math.min(...lats)) * 0.18);
  const padLon = Math.max(0.4, (Math.max(...lons) - Math.min(...lons)) * 0.18);
  return {
    minLat: Math.min(...lats) - padLat,
    maxLat: Math.max(...lats) + padLat,
    minLon: Math.min(...lons) - padLon,
    maxLon: Math.max(...lons) + padLon
  };
}

function project(point, bounds) {
  const width = 360;
  const height = 330;
  const x = ((point.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon || 1)) * width;
  const y = height - ((point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * height;
  return { x: Math.max(14, Math.min(width - 14, x)), y: Math.max(16, Math.min(height - 16, y)) };
}

function renderMap(trip) {
  const mapPoints = [trip.origin, trip.destination, ...trip.stops];
  const bounds = mapBounds(mapPoints);
  const start = project(trip.origin, bounds);
  const end = project(trip.destination, bounds);
  const routeLine = `${start.x},${start.y} ${end.x},${end.y}`;
  const stopNodes = trip.stops
    .map((marker, index) => {
      const point = project(marker, bounds);
      const collected = Boolean(state.stamps[marker.id]);
      const fill = collected ? "#23675d" : index % 2 ? "#bd5145" : "#d69f2d";
      return `
        <g class="marker-dot" data-marker-id="${marker.id}" tabindex="0" role="button" aria-label="${marker.name}">
          <circle cx="${point.x}" cy="${point.y}" r="10" fill="${fill}" stroke="#fff" stroke-width="3"></circle>
          <text x="${point.x}" y="${point.y + 3.5}" text-anchor="middle" fill="#fff" font-size="9" font-weight="900">${index + 1}</text>
        </g>
      `;
    })
    .join("");

  els.mapCanvas.innerHTML = `
    <svg viewBox="0 0 360 330" aria-label="Map showing route markers" role="img">
      <defs>
        <pattern id="roadHatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="18" stroke="rgba(56,111,164,0.14)" stroke-width="3"></line>
        </pattern>
      </defs>
      <rect x="0" y="0" width="360" height="330" fill="url(#roadHatch)" opacity="0.38"></rect>
      <polyline points="${routeLine}" fill="none" stroke="#ffffff" stroke-width="17" stroke-linecap="round"></polyline>
      <polyline points="${routeLine}" fill="none" stroke="#173f3a" stroke-width="8" stroke-linecap="round"></polyline>
      <polyline points="${routeLine}" fill="none" stroke="#d69f2d" stroke-width="2" stroke-dasharray="7 10" stroke-linecap="round"></polyline>
      ${stopNodes}
      <circle cx="${start.x}" cy="${start.y}" r="12" fill="#386fa4" stroke="#fff" stroke-width="3"></circle>
      <circle cx="${end.x}" cy="${end.y}" r="12" fill="#14211f" stroke="#fff" stroke-width="3"></circle>
      <text class="map-label" x="${start.x}" y="${start.y - 18}" text-anchor="middle">Start</text>
      <text class="map-label" x="${end.x}" y="${end.y - 18}" text-anchor="middle">Finish</text>
    </svg>
  `;

  els.mapCanvas.querySelectorAll(".marker-dot").forEach((node) => {
    node.addEventListener("click", () => openMarker(node.dataset.markerId, trip));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMarker(node.dataset.markerId, trip);
      }
    });
  });
}

function stopCard(marker, index) {
  const collected = Boolean(state.stamps[marker.id]);
  return `
    <article class="stop-card" data-marker-id="${marker.id}">
      <div class="mile-badge">${marker.routeMile}<br>mi</div>
      <div class="stop-main">
        <strong>${index + 1}. ${marker.name}</strong>
        <span>${marker.place} · ${marker.road} · ${marker.distanceFromRoute} mi off route</span>
      </div>
      <div class="stamp-status ${collected ? "collected" : ""}" aria-label="${collected ? "Stamped" : "Not stamped"}">${collected ? "✓" : "+"}</div>
    </article>
  `;
}

function renderStops(trip) {
  if (!trip.stops.length) {
    els.routeStops.innerHTML = `<div class="empty-state">No matching markers on this route</div>`;
    return;
  }

  els.routeStops.innerHTML = trip.stops.map(stopCard).join("");
  els.routeStops.querySelectorAll(".stop-card").forEach((card) => {
    card.addEventListener("click", () => openMarker(card.dataset.markerId, trip));
  });
}

function renderCollection(trip) {
  const stamped = markers.filter((marker) => state.stamps[marker.id]);
  const routeIds = new Set(trip.stops.map((marker) => marker.id));
  els.collectionText.textContent = `${stamped.length} collected`;

  if (!stamped.length) {
    els.stampGrid.innerHTML = `<div class="empty-state">No stamps yet</div>`;
    return;
  }

  els.stampGrid.innerHTML = stamped
    .map((marker) => {
      const stamp = state.stamps[marker.id];
      const routeNote = routeIds.has(marker.id) ? "This trip" : marker.place;
      return `
        <article class="stamp-card">
          <button type="button" data-marker-id="${marker.id}">
            <div class="stamp-photo"><img src="${stamp.image}" alt="Saved photo for ${marker.name}"></div>
            <strong>${marker.name}<br><span>${routeNote}</span></strong>
          </button>
        </article>
      `;
    })
    .join("");

  els.stampGrid.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => openMarker(button.dataset.markerId, trip));
  });
}

function renderStats(trip) {
  const stampedOnRoute = trip.stops.filter((marker) => state.stamps[marker.id]).length;
  els.tripMiles.textContent = trip.tripMiles.toLocaleString();
  els.stopCount.textContent = trip.stops.length;
  els.stampCount.textContent = stampedOnRoute;
  els.corridorText.textContent = `Within ${trip.corridor} mi`;
}

function renderTabs() {
  const routeActive = state.activeTab === "route";
  els.routeTab.classList.toggle("active", routeActive);
  els.collectionTab.classList.toggle("active", !routeActive);
  els.routeTab.setAttribute("aria-selected", String(routeActive));
  els.collectionTab.setAttribute("aria-selected", String(!routeActive));
  els.routeView.classList.toggle("hidden", !routeActive);
  els.collectionView.classList.toggle("hidden", routeActive);
}

function openMarker(markerId, trip = currentTrip()) {
  const marker = markers.find((item) => item.id === markerId);
  if (!marker) return;
  const tripMarker = trip.stops.find((item) => item.id === markerId) || marker;
  const stamp = state.stamps[markerId];
  state.activeMarkerId = markerId;
  els.markerDetail.innerHTML = `
    <div class="detail-photo">
      ${stamp ? `<img src="${stamp.image}" alt="Saved photo for ${marker.name}">` : ""}
    </div>
    <div class="detail-body">
      <h3>${marker.name}</h3>
      <div class="detail-meta">
        <span class="pill">${marker.place}</span>
        <span class="pill">${marker.road}</span>
        <span class="pill">${marker.year}</span>
        ${tripMarker.routeMile !== undefined ? `<span class="pill">${tripMarker.routeMile} mi from start</span>` : ""}
      </div>
      <p>${marker.story}</p>
      <div class="photo-actions">
        <label class="upload-label">
          <span>${stamp ? "Replace stamp" : "Add stamp photo"}</span>
          <input id="photoInput" type="file" accept="image/*" capture="environment">
        </label>
        <button class="clear-photo" id="clearPhotoButton" type="button" ${stamp ? "" : "disabled"}>Clear</button>
      </div>
    </div>
  `;

  els.markerDetail.querySelector("#photoInput").addEventListener("change", handlePhoto);
  els.markerDetail.querySelector("#clearPhotoButton").addEventListener("click", () => clearPhoto(markerId));
  if (!els.markerDialog.open) {
    els.markerDialog.showModal();
  }
}

function handlePhoto(event) {
  const file = event.target.files?.[0];
  if (!file || !state.activeMarkerId) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.stamps[state.activeMarkerId] = {
      image: reader.result,
      addedAt: new Date().toISOString()
    };
    saveStamps();
    const trip = render();
    openMarker(state.activeMarkerId, trip);
  });
  reader.readAsDataURL(file);
}

function clearPhoto(markerId) {
  delete state.stamps[markerId];
  saveStamps();
  const trip = render();
  openMarker(markerId, trip);
}

function render() {
  const trip = currentTrip();
  renderStats(trip);
  renderMap(trip);
  renderStops(trip);
  renderCollection(trip);
  renderTabs();
  return trip;
}

function bindEvents() {
  els.originSelect.addEventListener("change", () => {
    state.origin = els.originSelect.value;
    if (state.origin === state.destination) {
      state.destination = locations.find((item) => item.id !== state.origin).id;
      els.destinationSelect.value = state.destination;
    }
    render();
  });

  els.destinationSelect.addEventListener("change", () => {
    state.destination = els.destinationSelect.value;
    if (state.origin === state.destination) {
      state.origin = locations.find((item) => item.id !== state.destination).id;
      els.originSelect.value = state.origin;
    }
    render();
  });

  els.swapButton.addEventListener("click", () => {
    [state.origin, state.destination] = [state.destination, state.origin];
    els.originSelect.value = state.origin;
    els.destinationSelect.value = state.destination;
    render();
  });

  els.routeTab.addEventListener("click", () => {
    state.activeTab = "route";
    renderTabs();
  });

  els.collectionTab.addEventListener("click", () => {
    state.activeTab = "collection";
    renderTabs();
  });

  els.resetButton.addEventListener("click", () => {
    if (!Object.keys(state.stamps).length) return;
    state.stamps = {};
    saveStamps();
    render();
  });
}

populateSelects();
bindEvents();
render();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}
