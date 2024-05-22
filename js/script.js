// function bybitPrice() {
//   const BASE_URL = "https://bybit4.p.rapidapi.com";
//   const END_POINT = "/spot/v3/public/quote/ticker/price";

//   const params = new URLSearchParams({});

//   const url = `${BASE_URL}${END_POINT}?${params}`;

//   const headers = {
//     "X-RapidAPI-Key": "8fed956945msh51d417cdf5166c4p178a36jsnccf3abaeaf98",
//     "X-RapidAPI-Host": "bybit4.p.rapidapi.com",
//   };

//   return fetch(url, { headers })
//     .then((res) => res.json())
//     .then((data) => {
//       return console.log(data.result.list);
//     });
// }

// function binancePrice() {
//   const BASE_URL = "https://binance43.p.rapidapi.com";
//   const END_POINT = "/ticker/price";

//   const params = new URLSearchParams({});

//   const url = `${BASE_URL}${END_POINT}?${params}`;

//   const headers = {
//     "X-RapidAPI-Key": "8fed956945msh51d417cdf5166c4p178a36jsnccf3abaeaf98",
//     "X-RapidAPI-Host": "binance43.p.rapidapi.com",
//   };

//   return fetch(url, { headers })
//     .then((res) => res.json())
//     .then((data) => {
//       return console.log(data);
//     });
// }
// binancePrice();
// bybitPrice();
// Functions to fetch data from Bybit and Binance
// Functions to fetch data from Bybit and Binance
// Functions to fetch data from Bybit and Binance
// Functions to fetch data from Bybit and Binance
// Functions to fetch data from Bybit and Binance
// Functions to fetch data from Bybit and Binance
function bybitPrice() {
  const BASE_URL = "https://bybit4.p.rapidapi.com";
  const END_POINT = "/spot/v3/public/quote/ticker/24hr";

  const url = `${BASE_URL}${END_POINT}`;

  const headers = {
    "X-RapidAPI-Key": "8fed956945msh51d417cdf5166c4p178a36jsnccf3abaeaf98",
    "X-RapidAPI-Host": "bybit4.p.rapidapi.com",
  };

  return fetch(url, { headers })
    .then((res) => res.json())
    .then((data) => {
      return data.result.list.map((item) => ({
        symbol: item.s,
        price: parseFloat(item.lp),
      }));
    });
}

function binancePrice() {
  const BASE_URL = "https://binance43.p.rapidapi.com";
  const END_POINT = "/ticker/price";

  const url = `${BASE_URL}${END_POINT}`;

  const headers = {
    "X-RapidAPI-Key": "8fed956945msh51d417cdf5166c4p178a36jsnccf3abaeaf98",
    "X-RapidAPI-Host": "binance43.p.rapidapi.com",
  };

  return fetch(url, { headers })
    .then((res) => res.json())
    .then((data) => {
      return data.map((item) => ({
        symbol: item.symbol,
        price: parseFloat(item.price),
      }));
    });
}

// Function to merge data from both exchanges
function mergeData(bybitData, binanceData) {
  return bybitData
    .map((bybitItem) => {
      const binanceItem = binanceData.find(
        (item) => item.symbol === bybitItem.symbol
      );
      if (binanceItem) {
        return {
          symbol: bybitItem.symbol,
          bybitPrice: bybitItem.price,
          binancePrice: binanceItem.price,
          difference: binanceItem.price - bybitItem.price,
          percentageDifference: (
            ((binanceItem.price - bybitItem.price) / bybitItem.price) *
            100
          ).toFixed(2),
        };
      }
      return null;
    })
    .filter((item) => item !== null);
}

// Function to display data in table
function displayData(data) {
  const tableBody = document.getElementById("cryptoTableBody");
  tableBody.innerHTML = ""; // Clear previous data

  data.forEach((item) => {
    const row = document.createElement("tr");

    const symbolCell = document.createElement("td");
    symbolCell.textContent = item.symbol;
    row.appendChild(symbolCell);

    const bybitPriceCell = document.createElement("td");
    bybitPriceCell.textContent = item.bybitPrice;
    row.appendChild(bybitPriceCell);

    const binancePriceCell = document.createElement("td");
    binancePriceCell.textContent = item.binancePrice;
    row.appendChild(binancePriceCell);

    const differenceCell = document.createElement("td");
    differenceCell.textContent = item.difference;
    if (item.difference !== "N/A") {
      differenceCell.classList.add(
        item.difference > 0 ? "positive" : "negative"
      );
    }
    row.appendChild(differenceCell);

    const percentageDifferenceCell = document.createElement("td");
    percentageDifferenceCell.textContent = item.percentageDifference;
    if (item.percentageDifference !== "N/A") {
      percentageDifferenceCell.classList.add(
        item.difference > 0 ? "positive" : "negative"
      );
    }
    row.appendChild(percentageDifferenceCell);

    tableBody.appendChild(row);
  });
}

// Sorting functionality
function sortTable(columnIndex) {
  const tableBody = document.getElementById("cryptoTableBody");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  const sortedRows = rows.sort((a, b) => {
    const cellA = a.getElementsByTagName("td")[columnIndex].textContent;
    const cellB = b.getElementsByTagName("td")[columnIndex].textContent;

    const valueA = isNaN(cellA) ? cellA : parseFloat(cellA);
    const valueB = isNaN(cellB) ? cellB : parseFloat(cellB);

    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
  });

  tableBody.innerHTML = "";
  sortedRows.forEach((row) => tableBody.appendChild(row));
}

// Filter functionality
function filterTable() {
  const filterInput = document
    .getElementById("filterInput")
    .value.toUpperCase();
  const tableBody = document.getElementById("cryptoTableBody");
  const rows = tableBody.getElementsByTagName("tr");

  Array.from(rows).forEach((row) => {
    const cell = row.getElementsByTagName("td")[0];
    if (cell) {
      const txtValue = cell.textContent || cell.innerText;
      row.style.display =
        txtValue.toUpperCase().indexOf(filterInput) > -1 ? "" : "none";
    }
  });
}

// Main function to fetch, merge and display data
function updateTable() {
  Promise.all([bybitPrice(), binancePrice()])
    .then(([bybitData, binanceData]) => {
      const mergedData = mergeData(bybitData, binanceData);
      displayData(mergedData);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Initial data fetch and display
updateTable();

// Optional: Update data every 30 seconds
setInterval(updateTable, 180000);

// Make functions globally accessible
window.sortTable = sortTable;
window.filterTable = filterTable;
