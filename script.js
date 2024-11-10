document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#cafesTable tbody");
    const filterForm = document.querySelector("#filterForm");
    const filterInput = document.querySelector("#filter");
    const filterBySelect = document.querySelector("#filterBy");
    const downloadCsvBtn = document.getElementById("downloadCsv");
    const downloadJsonBtn = document.getElementById("downloadJson");
  
    let currentData = [];
  
    function fetchAndDisplayCafes(filter = "", filterBy = "") {
      fetch(`/kafici`)
        .then(response => response.json())
        .then(data => {
          tableBody.innerHTML = "";
          
          currentData = data.filter(cafe => {
            const searchTerm = filter.toLowerCase();
            if (!searchTerm) return true;
            if (filterBy) {
              return cafe[filterBy]?.toString().toLowerCase().includes(searchTerm);
            } else {
              return Object.values(cafe).some(value =>
                value?.toString().toLowerCase().includes(searchTerm)
              );
            }
          });
  
          currentData.forEach(cafe => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${cafe.naziv}</td>
              <td>${cafe.adresa}</td>
              <td>${cafe.naziv_kv}</td>
              <td>${cafe.pros_ocjena}</td>
              <td>${cafe.broj_recenzija}</td>
              <td>${cafe.radno_vr}</td>
              <td>${cafe.pet_friendly ? "Da" : "Ne"}</td>
              <td>${cafe.wifi ? "Da" : "Ne"}</td>
              <td>${cafe.tipovi_usluga.map(usluga => usluga.TipUsluge).join(", ")}</td>
              <td>${cafe.specijalne_ponude.map(ponuda => ponuda.SpecijalnaPonuda).join(", ")}</td>
            `;
            tableBody.appendChild(row);
          });
        })
        .catch(error => {
          console.error("Greška pri dohvaćanju podataka:", error);
          tableBody.innerHTML = "<tr><td colspan='10'>Greška pri učitavanju podataka.</td></tr>";
        });
    }
  
    function downloadJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "cafes_data.json");
      downloadAnchor.click();
    }
  
    function downloadCSV() {
      const headers = ["Naziv", "Adresa", "Kvart", "Prosječna Ocjena", "Broj Recenzija", "Radno Vrijeme", "Pet Friendly", "WiFi", "Tipovi Usluga", "Specijalne Ponude"];
      const rows = currentData.map(cafe => [
        cafe.naziv,
        cafe.adresa,
        cafe.naziv_kv,
        cafe.pros_ocjena,
        cafe.broj_recenzija,
        cafe.radno_vr,
        cafe.pet_friendly ? "Da" : "Ne",
        cafe.wifi ? "Da" : "Ne",
        cafe.tipovi_usluga.map(usluga => usluga.TipUsluge).join(", "),
        cafe.specijalne_ponude.map(ponuda => ponuda.SpecijalnaPonuda).join(", ")
      ]);
  
      let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", csvContent);
      downloadAnchor.setAttribute("download", "cafes_data.csv");
      downloadAnchor.click();
    }
  
    fetchAndDisplayCafes();
  
    filterForm.addEventListener("submit", event => {
      event.preventDefault();
      const filterValue = filterInput.value;
      const filterBy = filterBySelect.value;
      fetchAndDisplayCafes(filterValue, filterBy);
    });
  
    downloadCsvBtn.addEventListener("click", downloadCSV);
    downloadJsonBtn.addEventListener("click", downloadJSON);
  });
  