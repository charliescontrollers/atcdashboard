const API_URL = "PASTE_YOUR_WEB_APP_URL_HERE?action=todayDistribution";

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
