const API_URL =
  "https://script.google.com/macros/s/AKfycbwuL4fQTx-RYpcEAjIfiTvTkYJioFxBZcXj4UItQcE/dev?action=today";

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
