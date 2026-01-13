/* =========================
   NIGHT MODE
========================= */
function applyNightMode() {
  const hour = new Date().getUTCHours();
  if (hour >= 18 || hour <= 6) {
    document.body.classList.add("night");
  } else {
    document.body.classList.remove("night");
  }
}

/* =========================
   GLOBAL FLAGS
========================= */
let lowVisAlertPlayed = false;

/* =========================
   VISIBILITY COLOR LOGIC
========================= */
function colorForValue(v) {
  if (v >= 5000) return "#16A34A";   // green
  if (v >= 3000) return "#2563EB";   // blue
  if (v >= 2500) return "#EAB308";   // yellow
  return "#DC2626";                  // red
}

/* =========================
   CAT BANDS PLUGIN
========================= */
const catBandsPlugin = {
  id: "catBands",
  beforeDraw(chart) {
    const { ctx, chartArea, scales } = chart;
    if (!chartArea) return;

    const y = scales.y;
    const bands = [
      { from: 0, to: 2500, color: "rgba(220,38,38,0.08)" },
      { from: 2500, to: 3000, color: "rgba(234,179,8,0.08)" },
      { from: 3000, to: 5000, color: "rgba(37,99,235,0.08)" },
      { from: 5000, to: 10000, color: "rgba(22,163,74,0.06)" }
    ];

    bands.forEach(b => {
      ctx.fillStyle = b.color;
      ctx.fillRect(
        chartArea.left,
        y.getPixelForValue(b.to),
        chartArea.right - chartArea.left,
        y.getPixelForValue(b.from) - y.getPixelForValue(b.to)
      );
    });
  }
};

/* =========================
   UNIT DISTRIBUTION (JSONP)
========================= */
function loadTodayData() {
  const s = document.createElement("script");
  s.src =
    "https://script.google.com/macros/s/AKfycby8LijOFrszB9tlT8dVDj44BZWiG0iJPLektDUXyjetj6JYtkjs2QsXzCTABkkCz9yy/exec?action=today&callback=handleToday";
  document.body.appendChild(s);
}

function handleToday(response) {
  const box = document.getElementById("table-container");
  if (!box) return;

  if (!response || !response.data) {
    box.innerHTML = "No data available";
    return;
  }

  const units = ["WSO", "RADAR", "PLC", "TWR", "ARO", "FMP/ACC ALPHA", "CMD/ACC ALPHA", "TWR ALPHA"];

  let html = "<table class='unit-table'>";

  response.data.forEach((row, i) => {
    const colA = (row[0] || "").toString().trim().toUpperCase();
    const isUnitHeader = units.includes(colA);

    if (isUnitHeader) {
      // Add separator BEFORE every unit except the first
      if (i !== 0) {
        html += `
          <tr class="unit-divider">
            <td colspan="2"></td>
          </tr>
        `;
      }

      html += `
        <tr class="unit-header">
          <td>${colA}</td>
          <td>${row[1] || ""}</td>
        </tr>
      `;
    } else {
      html += `
        <tr class="unit-person">
          <td></td>
          <td>${row[1] || ""}</td>
        </tr>
      `;
    }
  });

  html += "</table>";
  box.innerHTML = html;
}


/* =========================
   VISIBILITY (JSONP)
========================= */
function loadVisibility() {
  const s = document.createElement("script");
  s.src =
    "https://script.google.com/macros/s/AKfycby8LijOFrszB9tlT8dVDj44BZWiG0iJPLektDUXyjetj6JYtkjs2QsXzCTABkkCz9yy/exec" +
    "?action=visibility&callback=handleVisibility";
  document.body.appendChild(s);
}

function handleVisibility(data) {
  if (!data || !data.series) return;
  drawVisibility(data);
}

/* =========================
   DRAW VISIBILITY CHART
========================= */
function drawVisibility(data) {
  renderWeatherTable(data.weather);

  const meta = document.getElementById("vis-meta");
  if (meta) {
    meta.innerText =
      `Source: ${data.source}` +
      (data.issueTime ? ` | Issued: ${data.issueTime} UTC` : "");
  }

  if (!data.series.length) return;

  const times = data.series.map(p => p.time);
  const values = data.series.map(p => Number(p.vis));

  /* ---- TREND ---- */
  const trendBox = document.getElementById("trend-arrow");
  if (trendBox && values.length >= 2) {
    const diff = values[0] - values[1];
    if (diff > 100) {
      trendBox.innerText = "📉 Falling visibility";
      trendBox.style.color = "#DC2626";
    } else if (diff < -100) {
      trendBox.innerText = "📈 Improving visibility";
      trendBox.style.color = "#16A34A";
    } else {
      trendBox.innerText = "➡ Stable visibility";
      trendBox.style.color = "#64748B";
    }
  }

  /* ---- LOW VIS ALERT ---- */
  const alertBox = document.getElementById("vis-alert");
  const sound = document.getElementById("lowVisSound");

  if (alertBox && values[0] < 800) {
    alertBox.innerText = `⚠ LOW VISIBILITY: ${values[0]} m`;
    alertBox.style.display = "block";
    if (!lowVisAlertPlayed && sound) {
      sound.play().catch(() => {});
      lowVisAlertPlayed = true;
    }
  } else if (alertBox) {
    alertBox.style.display = "none";
    lowVisAlertPlayed = false;
  }

  /* ---- RAW TAF ---- */
  const tafBox = document.getElementById("taf-box");
  if (tafBox && data.raw) tafBox.innerText = data.raw;

  /* ---- CHART ---- */
  const canvas = document.getElementById("visibilityChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  if (window.visChart) window.visChart.destroy();

  window.visChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: "Visibility (m)",
        data: values,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: values.map(colorForValue),
        segment: {
          borderColor: c => colorForValue(c.p0.parsed.y)
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: c => `${c.parsed.y} m`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10000,
          title: { display: true, text: "Visibility (m)" }
        },
        x: {
          title: { display: true, text: "UTC Time" }
        }
      }
    },
    plugins: [catBandsPlugin]
  });
}

/* =========================
   WEATHER TABLE
========================= */
function renderWeatherTable(weather) {
  const table = document.getElementById("weather-table");
  if (!table || !weather) {
    table.innerHTML = "<tr><td>No METAR weather available</td></tr>";
    return;
  }

  table.innerHTML = `
    <tr><td>Wind</td><td>${weather.wind}</td></tr>
    <tr><td>Visibility</td><td>${weather.visibility}</td></tr>
    <tr><td>Weather</td><td>${weather.weather}</td></tr>
    <tr><td>Clouds</td><td>${weather.clouds}</td></tr>
    <tr><td>Temp / Dew</td><td>${weather.temp}</td></tr>
    <tr><td>QNH</td><td>${weather.qnh}</td></tr>
  `;
}

/* =========================
   NOTAMS (JSONP)
========================= */
function loadNOTAMs() {
  const s = document.createElement("script");
  s.src =
    "https://script.google.com/macros/s/AKfycbz0fYY-QW_Oh4lmRoBb_gynWpY9b5_gn7zrL6FYb-EPB81RLUdoBHEKy2zs-X31OMC6/exec" +
    "?action=notams&callback=handleNOTAMs";
  document.body.appendChild(s);
}

function handleNOTAMs(data) {
  const box = document.getElementById("notam-list");
  if (!box || !data || !data.notams) return;

  if (data.notams.length === 0) {
    box.innerHTML = "<div>No NOTAMs for today</div>";
    return;
  }

  // Group by type
  const groups = {};
  data.notams.forEach(n => {
    if (!groups[n.type]) groups[n.type] = [];
    groups[n.type].push(n);
  });

  box.innerHTML = "";

  Object.keys(groups).forEach(type => {
    // Section header
    const header = document.createElement("div");
    header.className = "notam-section";
    header.innerText = type;
    box.appendChild(header);

    groups[type].forEach(n => {
      const div = document.createElement("div");
      div.className =
        "notam " +
        type +
        (n.expiring ? " notam-expiring" : "");

      div.innerHTML = `
        <div class="notam-text">${n.text}</div>
        <div class="notam-validity">${n.validity}</div>
      `;

      box.appendChild(div);
    });
  });
}


/* =========================
   INIT
========================= */
applyNightMode();
loadTodayData();
loadVisibility();
loadNOTAMs();

setInterval(loadVisibility, 600000);   // 10 min
setInterval(loadNOTAMs, 1800000);      // 30 min
