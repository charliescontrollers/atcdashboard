let visibilityChart = null;
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


const VIS_API = "https://script.google.com/macros/s/AKfycbzV4ui6UDakPD5O20MKjn63CUFPuExNkTmDOLicE73L59CK7zFH9WBnC8WZMLzJyAB8/exec?action=visibility";

// ===== LOAD FUNCTION =====
function loadVisibility() {
  fetch(VIS_API)
    .then(res => res.json())
    .then(updateChart)
    .catch(console.error);
}

// ===== UPDATE CHART =====
function updateChart(data) {
  const ctx = document
    .getElementById("visibilityChart")
    .getContext("2d");

  if (!visibilityChart) {
    visibilityChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.times,
        datasets: [{
          label: "Visibility (m)",
          data: data.values,
          borderColor: "#2563EB",
          backgroundColor: "rgba(37,99,235,0.15)",
          tension: 0.3,
          fill: true,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  } else {
    visibilityChart.data.labels = data.times;
    visibilityChart.data.datasets[0].data = data.values;
    visibilityChart.update();
  }
}

// ===== INITIAL LOAD + AUTO REFRESH =====
loadVisibility();
setInterval(loadVisibility, 600000);

