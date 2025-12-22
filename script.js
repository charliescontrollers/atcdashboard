
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
  // Show date
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
// VISIBILITY GRAPH (SAMPLE DATA)
// ==============================


function colorForValue(v) {
  if (v >= 5000) return "#16A34A";
  if (v >= 3000) return "#2563EB";
  if (v >= 2500) return "#EAB308";
  return "#DC2626";
}

function drawVisibility(data) {
  const times = ["Now"];
  const values = [data.observed];

  data.forecast.forEach(f => {
    times.push(f.time);
    values.push(f.vis);
  });

  const colors = values.map(colorForValue);

  const ctx = document.getElementById("visibilityChart").getContext("2d");

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
          tension: 0.3,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
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
            beginAtZero: true,
            title: { display: true, text: "Meters" }
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

fetch("https://script.google.com/macros/s/AKfycbzNhIBtQPEmOndhGX2USXCZlYqwy2wVM-S-y5FOag_CvtguHhH8F2QqYRL9vnhSbUqD/exec?action=visibility")
  .then(r => r.json())
  .then(drawVisibility);



