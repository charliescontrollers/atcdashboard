function applyNightMode() {
  const hour = new Date().getUTCHours();
  if (hour >= 18 || hour <= 6) {
    document.body.classList.add("night");
  } else {
    document.body.classList.remove("night");
  }
}


let lowVisAlertPlayed = false;


function colorForValue(v) {
  if (v >= 5000) return "#16A34A";   // green
  if (v >= 3000) return "#2563EB";   // blue
  if (v >= 2500) return "#EAB308";   // yellow
  return "#DC2626";                  // red
}
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



// ==============================
// DAILY UNIT DISTRIBUTION TABLE
// ==============================

const API_URL =
  "https://script.google.com/macros/s/AKfycbwgItqRIUEf4tuBiCQIVASEkVdNIOXmVo_arYDV8oC0AX21qESl9SOe_jXZu4flL-pa/exec?action=today";

fetch(API_URL)
  .then(res => res.json())
  .then(showData)
  .catch(err => {
    document.getElementById("table-container").innerHTML =
      "Error loading data";
    console.error(err);
  });

function showData(response) {
  document.getElementById("date").innerText =
    "Date: " + response.date;

  const data = response.data;
  let html = "<table>";

  data.forEach(row => {
    html += "<tr>";
    row.forEach(cell => {
      html += `<td>${cell || ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  document.getElementById("table-container").innerHTML = html;
}


// ==============================
// VISIBILITY GRAPH (TAF BASED)
// ==============================

function colorForValue(v) {
  if (v >= 5000) return "#16A34A";
  if (v >= 3000) return "#2563EB";
  if (v >= 2500) return "#EAB308";
  return "#DC2626";
}

function drawVisibility(data) {
  renderWeatherTable(data.weather);
  const meta = document.getElementById("vis-meta");
meta.innerText =
  `Source: ${data.source}` +
  (data.issueTime ? ` | Issued: ${data.issueTime} UTC` : "");

  if (!data.series || data.series.length === 0) return;

  const times = data.series.map(p => p.time);
  const values = data.series.map(p => Number(p.vis));

  // ---- LOW VIS ALERT ----
 const alertBox = document.getElementById("vis-alert");
const sound = document.getElementById("lowVisSound");

if (values[0] < 800) {
  alertBox.innerText = `⚠ LOW VISIBILITY: ${values[0]} m`;
  alertBox.style.display = "block";
  const trendBox = document.getElementById("trend-arrow");

if (values.length >= 2) {
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


  if (!lowVisAlertPlayed) {
    sound.play().catch(() => {});
    lowVisAlertPlayed = true;
  }
} else {
  alertBox.style.display = "none";
  lowVisAlertPlayed = false;
}


  // ---- RAW TAF DISPLAY ----
const tafBox = document.getElementById("taf-box");
if (tafBox && data.raw) {
  tafBox.innerText = data.raw;
}


  const ctx = document
    .getElementById("visibilityChart")
    .getContext("2d");

  if (!window.visChart) {
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
            borderColor: ctx => {
              const y = ctx.p0.parsed.y;
              if (y >= 5000) return "#16A34A";
              if (y >= 3000) return "#2563EB";
              if (y >= 2500) return "#EAB308";
              return "#DC2626";
            }
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
            title: { display: true, text: "Visibility (meters)" }
          },
          x: {
            title: { display: true, text: "UTC Time" }
          }
        }
      },
      plugins: [catBandsPlugin]
    });
  } else {
    window.visChart.data.labels = times;
    window.visChart.data.datasets[0].data = values;
    window.visChart.update();
  }
}



// ==============================
// FETCH VISIBILITY DATA
// ==============================



function loadVisibility() {
  const script = document.createElement("script");
  script.src =
    "https://script.google.com/macros/s/AKfycbzVOjnnQgXMrcfaUrF77v9knWOtkFUfG2lXWnFfuesH6I7Aes6tZT5F1zBaqOzCdMhB/exec" + "?action=visibility&callback=handleVisibility";

  document.body.appendChild(script);
}

// JSONP callback (called by Apps Script)
function handleVisibility(data) {
  drawVisibility(data);
}

// Load once + refresh every 10 min
loadVisibility();
setInterval(loadVisibility, 600000);


loadVisibility();
setInterval(loadVisibility, 600000); // 10 minutes

applyNightMode();

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

