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
  if (!data.series || data.series.length === 0) {
    console.warn("No visibility data received");
    return;
  }

  const times = data.series.map(p => p.time);
  const values = data.series.map(p => Number(p.vis));
  const colors = values.map(colorForValue);

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
          borderColor: colors,
          pointBackgroundColor: colors,
          pointRadius: 5,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.parsed.y} m`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Visibility (meters)"
            }
          },
          x: {
            title: {
              display: true,
              text: "UTC Time"
            }
          }
        }
      }
    });
  } else {
    window.visChart.data.labels = times;
    window.visChart.data.datasets[0].data = values;
    window.visChart.data.datasets[0].borderColor = colors;
    window.visChart.data.datasets[0].pointBackgroundColor = colors;
    window.visChart.update();
  }
}


// ==============================
// FETCH VISIBILITY DATA
// ==============================

fetch(
  "https://script.google.com/macros/s/AKfycbxM99vF8ROC_dAUCEZNqsnJkNWkeVcefdLx5-IpJ-72AC_geIRJbKesvdvnTHcLdh00/exec?action=visibility"
)
  .then(r => r.json())
  .then(drawVisibility)
  .catch(err => console.error("Visibility API error:", err));
