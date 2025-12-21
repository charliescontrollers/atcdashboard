const API_URL = "https://script.google.com/macros/s/AKfycbzF_dvHnzJMu4LQxrG3jV_tmexqhUysJ0NucoPMG97liFTmaROktLLE8PObYB3c_iQC/exec?action=todayDistribution";

fetch(API_URL)
  .then(res => res.json())
  .then(json => renderTable(json.data));

function renderTable(data) {
  let html = "<table>";

  data.forEach(row => {
    html += "<tr>";
    row.forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += "</tr>";
  });

  html += "</table>";
  document.getElementById("content").innerHTML = html;
}
