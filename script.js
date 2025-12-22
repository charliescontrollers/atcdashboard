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

const visibilityData = {
  times: [
    "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00", "08:00"
  ],
  values: [3000, 2500, 2000, 1800, 2200, 4000, 6000]
};

const ctx = document.getElementById("visibilityChart").getContext("2d");

const visibilityChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: visibilityData.times,
    datasets: [{
      label: "Visibility (meters)",
      data: visibilityData.values,
      borderColor: "#2563EB",      // aviation blue
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      tension: 0.3,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (UTC)"
        }
      },
      y: {
        title: {
          display: true,
          text: "Visibility (meters)"
        },
        beginAtZero: true
      }
    }
  }
});

