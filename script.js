let carriers = [];
document.addEventListener('DOMContentLoaded', () => {

    const productForm = document.getElementById('productForm');
    const productNameInput = document.getElementById('productName');
    const freezingDegreeInput = document.getElementById('freezingDegree');
    const transportTempInput = document.getElementById('temperatureMode');
    const transportDurationInput = document.getElementById('transportTime');
    const coefficientInput = document.getElementById('coefficient');
    const productWeightInput = document.getElementById('productWeight');
    const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const clearTableButton = document.getElementById('clearTableButton');

    document.getElementById("downloadCsvBtn").addEventListener("click", downloadCarrierTable);

    

    function saveProductData() {
        const productData = {
            productName: productNameInput.value,
            freezingDegree: freezingDegreeInput.value,
            transportTemp: transportTempInput.value,
            weight: productWeightInput.value,
            transportDuration: transportDurationInput.value,
            coefficient: coefficientInput.value,
        };

        let data = localStorage.getItem('productData');
        let productDataArray = data ? JSON.parse(data) : [];
        productDataArray.push(productData);
        localStorage.setItem('productData', JSON.stringify(productDataArray));
        productForm.reset();
        displayProductData();
    }

    document.getElementById("downloadProductCsvBtn").addEventListener("click", () => {
    const data = localStorage.getItem('productData');
    if (!data) return;

    const products = JSON.parse(data);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Наименование продукта;Степень заморозки;Температурный режим;Вес (кг);Сроки (дней);Коэффициент\n";

    products.forEach(p => {
        csvContent += `${p.productName};${p.freezingDegree};${p.transportTemp};${p.weight};${p.transportDuration};${p.coefficient}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});



            function displayProductData() {
    productTable.innerHTML = "";

    const savedData = localStorage.getItem('productData');
    if (!savedData) {
        // Если данных нет в localStorage — загружаем из CSV
        fetch("product_data.csv")
            .then(res => {
                if (!res.ok) throw new Error("Ошибка загрузки product_data.csv");
                return res.text();
            })
            .then(csv => {
                const newData = [];
                const lines = csv.split('\n').filter(l => l.trim());
                lines.slice(1).forEach(line => {
                    const [productName, freezingDegree, transportTemp, weight, transportDuration, coefficient] = line.split(';');
                    newData.push({
                        productName: productName.trim(),
                        freezingDegree: freezingDegree.trim(),
                        transportTemp: transportTemp.trim(),
                        weight: parseFloat(weight),
                        transportDuration: parseFloat(transportDuration),
                        coefficient: parseFloat(coefficient)
                    });
                });
                localStorage.setItem("productData", JSON.stringify(newData));
                displayProductData(); // Повторный вызов, теперь с данными
            })
            .catch(err => {
                console.error("Не удалось загрузить product_data.csv:", err);
                let row = productTable.insertRow();
                let cell = row.insertCell();
                cell.colSpan = 6;
                cell.textContent = 'Не удалось загрузить данные.';
            });
        return;
    }

    const productDataArray = JSON.parse(savedData);
    if (productDataArray.length === 0) {
        let row = productTable.insertRow();
        let cell = row.insertCell();
        cell.colSpan = 6;
        cell.textContent = 'Данные о продукте не найдены.';
        return;
    }

    productDataArray.forEach((productData, index) => {
        let row = productTable.insertRow();
        row.insertCell().innerHTML = index + 1;
        row.insertCell().innerHTML = productData.productName;
        row.insertCell().innerHTML = productData.freezingDegree;
        row.insertCell().innerHTML = productData.transportTemp;
        row.insertCell().innerHTML = productData.weight;
        row.insertCell().innerHTML = productData.transportDuration;
        row.insertCell().innerHTML = productData.coefficient;

        const deleteCell = row.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.className = "delete-button";
        deleteBtn.addEventListener("click", () => {
            let productDataArray = JSON.parse(localStorage.getItem('productData'));
            productDataArray.splice(index, 1);
            localStorage.setItem('productData', JSON.stringify(productDataArray));
            displayProductData();
        });
        deleteCell.appendChild(deleteBtn);
    });
}

    

    document.getElementById("productCsvInput").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split('\n').filter(l => l.trim());
        const newData = [];

        lines.slice(1).forEach(line => {
            const [productName, freezingDegree, transportTemp, weight, transportDuration, coefficient] = line.split(';');
            newData.push({
                productName: productName.trim(),
                freezingDegree: freezingDegree.trim(),
                transportTemp: transportTemp.trim(),
                weight: parseFloat(weight),
                transportDuration: parseFloat(transportDuration),
                coefficient: parseFloat(coefficient)
            });
        });

        localStorage.setItem("productData", JSON.stringify(newData));
        // Всегда загружаем продуктовую базу из product_data.csv
        fetch("product_data.csv")
            .then(res => {
                if (!res.ok) throw new Error("Ошибка загрузки product_data.csv");
                return res.text();
            })
            .then(csv => {
                const newData = [];
                const lines = csv.split('\n').filter(l => l.trim());
                lines.slice(1).forEach(line => {
                    const [productName, freezingDegree, transportTemp, weight, transportDuration, coefficient] = line.split(';');
                    newData.push({
                        productName: productName.trim(),
                        freezingDegree: freezingDegree.trim(),
                        transportTemp: transportTemp.trim(),
                        weight: parseFloat(weight),
                        transportDuration: parseFloat(transportDuration),
                        coefficient: parseFloat(coefficient)
                    });
                });
                localStorage.setItem("productData", JSON.stringify(newData)); // Можно убрать, если не нужно сохранять
                displayProductData();

            })
            .catch(err => {
                console.error("Не удалось загрузить product_data.csv:", err);
            });
            };
            reader.readAsText(file);
        });


    productForm.addEventListener('submit', e => {
        e.preventDefault();
        saveProductData();
    });

    clearTableButton.addEventListener('click', () => {
        localStorage.removeItem('productData');
        displayProductData();
    });

    displayProductData();


    // База перевозчиков
    const carrierControls = document.getElementById("carrierControls");
    const carrierTableBody = document.querySelector("#carrierTable tbody");

    function renderCarrierTable() {
    carrierTableBody.innerHTML = "";

    // Сортируем перевозчиков по убыванию рейтинга
    carriers.sort((a, b) => b.rat - a.rat);

    carriers.forEach((c, index) => {
        const row = carrierTableBody.insertRow();

        row.insertCell().textContent = c.NP;
        row.insertCell().textContent = Object.entries(c.Kc).map(([k, v]) => `${k}:${v}`).join(', ');
        row.insertCell().textContent = c.Ref.join(', ');
        row.insertCell().textContent = c.rat.toFixed(1);

        // Кнопка удаления
        const deleteCell = row.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.className = "delete-button";
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "none";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.fontSize = "20px"; 
        deleteBtn.title = "Удалить перевозчика";

        deleteBtn.addEventListener("click", () => {
            carriers.splice(index, 1); // Удаляем перевозчика из массива
            localStorage.setItem("carCarriers", JSON.stringify(carriers)); // Обновляем в localStorage
            renderCarrierTable(); // Перерисовываем таблицу
        });

        deleteCell.appendChild(deleteBtn);
    });
}


    document.getElementById("addCarrierForm").addEventListener("submit", e => {
        e.preventDefault();
        const form = e.target;
        const newCarrier = {
            NP: form.NP.value,
            Kc: {
                "<150": parseFloat(form.t150.value),
                "<500": parseFloat(form.t500.value),
                "<1500": parseFloat(form.t1500.value),
                "<3000": parseFloat(form.t3000.value),
                ">5000": parseFloat(form.t5000.value),
            },
            Ref: form.Ref.value.split(',').map(r => r.trim().toUpperCase()),
            rat: Math.min(Math.max(parseFloat(form.rat.value), 1.1), 5.0)
        };
        carriers.push(newCarrier);
        localStorage.setItem("carCarriers", JSON.stringify(carriers));
        form.reset();
        renderCarrierTable();
    });

    document.getElementById("carrierCsvInput").addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            carriers = [];
            const lines = e.target.result.split('\n').filter(l => l.trim());
            lines.slice(1).forEach(line => {
                const [NP, tariffsRaw, refRaw, ratRaw] = line.split(';');
                const Kc = Object.fromEntries(tariffsRaw.split(',').map(t => {
                    const [range, price] = t.split(':');
                    return [range.trim(), parseFloat(price)];
                }));
                const Ref = refRaw.split(',').map(r => r.trim().toUpperCase());
                const rat = parseFloat(ratRaw);
                carriers.push({ NP, Kc, Ref, rat });
            });
            localStorage.setItem("carCarriers", JSON.stringify(carriers));
            renderCarrierTable();
        };
        reader.readAsText(file);
    });
            const savedCarriers = localStorage.getItem("carCarriers");
                if (savedCarriers) {
                carriers = JSON.parse(savedCarriers);
            renderCarrierTable();
            } else {
            fetch('carriers.csv')
            .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки carriers.csv');
            }
            return response.text();
            })
                .then(csvText => {
                carriers = [];
                const lines = csvText.split('\n').filter(l => l.trim());
                lines.slice(1).forEach(line => { // пропускаем заголовок
                const [NP, tariffsRaw, refRaw, ratRaw] = line.split(';');
                const Kc = Object.fromEntries(tariffsRaw.split(',').map(t => {
                    const [range, price] = t.split(':');
                    return [range.trim(), parseFloat(price)];
                }));
                const Ref = refRaw.split(',').map(r => r.trim().toUpperCase());
                const rat = parseFloat(ratRaw);
                carriers.push({ NP, Kc, Ref, rat });
            });
            localStorage.setItem("carCarriers", JSON.stringify(carriers));
            renderCarrierTable();
        })
        .catch(error => {
            console.error('Не удалось загрузить carriers.csv:', error);
        });
}

    document.getElementById("toggleCarrierBlock").addEventListener("click", () => {
        const container = document.getElementById("carrierControls");
        const toggleBtn = document.getElementById("toggleCarrierBlock");
        const isVisible = container.style.display === "block";
        container.style.display = isVisible ? "none" : "block";
        toggleBtn.textContent = isVisible ? "➕" : "➖";
    });

});
        //кнопка скачки CSV //
        function downloadCarrierTable() {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Название перевозчика;Тарифы;Классы рефрижераторов;Рейтинг\n";

            carriers.forEach(c => {
                const tariffs = Object.entries(c.Kc).map(([k, v]) => `${k}:${v}`).join(', ');
                const ref = c.Ref.join(', ');
                csvContent += `${c.NP};${tariffs};${ref};${c.rat}\n`;
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "carriers.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
                // =================== База маршрутов ЖД =================== //
        let railCarriers = [];

        function renderRailCarrierTable() {
          const tbody = document.querySelector("#railCarrierTable tbody");
          tbody.innerHTML = "";

          railCarriers.forEach((c, index) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = c.route;
            row.insertCell().textContent = c.kcj;
            row.insertCell().textContent = c.tj;
            row.insertCell().textContent = c.sj;

            const deleteCell = row.insertCell();
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑️";
            deleteBtn.className = "delete-button";
            deleteBtn.addEventListener("click", () => {
              railCarriers.splice(index, 1);
              localStorage.setItem("railCarriers", JSON.stringify(railCarriers));
              renderRailCarrierTable();
            });
            deleteCell.appendChild(deleteBtn);
          });
        }

        document.getElementById("addRailCarrierForm").addEventListener("submit", e => {
          e.preventDefault();
          const form = e.target;
          const newRailCarrier = {
            route: form.route.value,
            kcj: parseFloat(form.kcj.value),
            tj: parseFloat(form.tj.value),
            sj: parseFloat(form.sj.value),
          };
          railCarriers.push(newRailCarrier);
          localStorage.setItem("railCarriers", JSON.stringify(railCarriers));
          form.reset();
          renderRailCarrierTable();
        });

        document.getElementById("railCarrierCsvInput").addEventListener("change", function () {
          const file = this.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function (e) {
            railCarriers = [];
            const lines = e.target.result.split('\n').filter(l => l.trim());
            lines.slice(1).forEach(line => {
              const [route, kcj, tj, sj] = line.split(';');
              railCarriers.push({ route, kcj: parseFloat(kcj), tj: parseFloat(tj), sj: parseFloat(sj) });
            });
            localStorage.setItem("railCarriers", JSON.stringify(railCarriers));
            renderRailCarrierTable();
          };
          reader.readAsText(file);
        });

        function downloadRailCarrierTable() {
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += "Маршрут;Тариф (Kcj);Время в пути (Tj);Расстояние (Sj)\n";

          railCarriers.forEach(c => {
            csvContent += `${c.route};${c.kcj};${c.tj};${c.sj}\n`;
          });

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "rail_carriers.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        document.getElementById("downloadRailCsvBtn").addEventListener("click", downloadRailCarrierTable);

        const savedRailCarriers = localStorage.getItem("railCarriers");
        if (savedRailCarriers) {
        railCarriers = JSON.parse(savedRailCarriers);
        renderRailCarrierTable();
            } else {
            fetch("rail_carriers.csv")
            .then(res => {
            if (!res.ok) throw new Error("Ошибка загрузки rail_carriers.csv");
              return res.text();
            })
            .then(csv => {
              railCarriers = [];
              const lines = csv.split('\n').filter(l => l.trim());
              lines.slice(1).forEach(line => {
                const [route, kcj, tj, sj] = line.split(';');
                railCarriers.push({
                  route: route.trim(),
                  kcj: parseFloat(kcj),
                  tj: parseFloat(tj),
                  sj: parseFloat(sj)
                });
              });
              localStorage.setItem("railCarriers", JSON.stringify(railCarriers));
              renderRailCarrierTable();
            })
            .catch(err => {
              console.error("Не удалось загрузить rail_carriers.csv:", err);
            });
        }


        // Кнопка сворачивания базы маршрутов
        document.getElementById("toggleRailCarrierBlock").addEventListener("click", () => {
          const container = document.getElementById("railCarrierControls");
          const toggleBtn = document.getElementById("toggleRailCarrierBlock");
          const isVisible = container.style.display === "block";
          container.style.display = isVisible ? "none" : "block";
          toggleBtn.textContent = isVisible ? "➕" : "➖";
        });


        // =================== База вагонов =================== //
        let wagons = [];

        function renderWagonTable() {
          const tbody = document.querySelector("#wagonTable tbody");
          tbody.innerHTML = "";

          wagons.forEach((w, index) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = w.type;
            row.insertCell().textContent = `от ${w.t_min}°C до ${w.t_max}°C`;
            row.insertCell().textContent = `${w.fv} руб.`;

            const deleteCell = row.insertCell();
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑️";
            deleteBtn.className = "delete-button";
            deleteBtn.addEventListener("click", () => {
              wagons.splice(index, 1);
              localStorage.setItem("wagons", JSON.stringify(wagons));
              renderWagonTable();
            });
            deleteCell.appendChild(deleteBtn);
          });
        }


        document.getElementById("addWagonForm").addEventListener("submit", e => {
          e.preventDefault();
          const form = e.target;
          const newWagon = {
            type: form.type.value,
            t_min: parseFloat(form.t_min.value),
            t_max: parseFloat(form.t_max.value),
            fv: parseFloat(form.fv.value),
          };
          wagons.push(newWagon);
          localStorage.setItem("wagons", JSON.stringify(wagons));
          form.reset();
          renderWagonTable();
        });


        document.getElementById("wagonCsvInput").addEventListener("change", function () {
          const file = this.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function (e) {
            wagons = [];
            const lines = e.target.result.split('\n').filter(l => l.trim());
            lines.slice(1).forEach(line => {
              const [type, t, fv] = line.split(';');
              wagons.push({ type, t, fv: parseFloat(fv) });
            });
            localStorage.setItem("wagons", JSON.stringify(wagons));
            renderWagonTable();
          };
          reader.readAsText(file);
        });

        function downloadWagonTable() {
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += "Тип вагона;Температурный режим (t);Стоимость вагона (Fv)\n";

          wagons.forEach(w => {
            csvContent += `${w.type};${w.t};${w.fv}\n`;
          });

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "wagons.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        document.getElementById("downloadWagonCsvBtn").addEventListener("click", downloadWagonTable);

        const savedWagons = localStorage.getItem("wagons");
        if (savedWagons) {
          wagons = JSON.parse(savedWagons);
          renderWagonTable();
        } else {
          fetch("wagons.csv")
            .then(res => {
              if (!res.ok) throw new Error("Ошибка загрузки wagons.csv");
              return res.text();
            })
            .then(csv => {
              wagons = [];
              const lines = csv.split('\n').filter(l => l.trim());
              lines.slice(1).forEach(line => {
                const [type, tempRange, fv] = line.split(';');
                const match = tempRange.match(/(-?\d+(?:\.\d+)?)°C.*(-?\d+(?:\.\d+)?)°C/);
                wagons.push({
                  type: type.trim(),
                  t_min: match ? parseFloat(match[1]) : null,
                  t_max: match ? parseFloat(match[2]) : null,
                  fv: parseFloat(fv)
                });
              });
              localStorage.setItem("wagons", JSON.stringify(wagons));
              renderWagonTable();
            })
            .catch(err => {
              console.error("Не удалось загрузить wagons.csv:", err);
            });
        }


        // Кнопка сворачивания базы вагонов
        document.getElementById("toggleWagonBlock").addEventListener("click", () => {
          const container = document.getElementById("wagonControls");
          const toggleBtn = document.getElementById("toggleWagonBlock");
          const isVisible = container.style.display === "block";
          container.style.display = isVisible ? "none" : "block";
          toggleBtn.textContent = isVisible ? "➕" : "➖";
        });

// =================== База перевозчиков морского транспорта =================== //
let seaCarriers = [];

function renderSeaCarrierTable() {
  const tbody = document.querySelector("#seaCarrierTable tbody");
  tbody.innerHTML = "";

  // Сначала Владивосток-Санкт-Петербург по рейтингу ↓
  const vladSPb = seaCarriers
    .filter(c => c.route === "Владивосток-Санкт-Петербург")
    .sort((a, b) => b.rating - a.rating);

  // Потом Владивосток-Новороссийск по рейтингу ↓
  const vladNov = seaCarriers
    .filter(c => c.route === "Владивосток-Новороссийск")
    .sort((a, b) => b.rating - a.rating);

  [...vladSPb, ...vladNov].forEach((c, index) => {
    const row = tbody.insertRow();
    row.insertCell().textContent = c.route;
    row.insertCell().textContent = c.line;
    row.insertCell().textContent = `${c.freightCost} руб.`;
    row.insertCell().textContent = `${c.transitTime} дней`;
    row.insertCell().textContent = `${c.reefSurcharge} руб.`;
    row.insertCell().textContent = c.rating.toFixed(1);

    const deleteCell = row.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-button";
    deleteBtn.addEventListener("click", () => {
      seaCarriers.splice(index, 1);
      localStorage.setItem("seaCarriers", JSON.stringify(seaCarriers));
      renderSeaCarrierTable();
    });
    deleteCell.appendChild(deleteBtn);
  });
}

document.getElementById("addSeaCarrierForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const newSeaCarrier = {
    route: form.route.value,
    line: form.line.value,
    freightCost: parseFloat(form.freightCost.value),
    transitTime: parseFloat(form.transitTime.value),
    reefSurcharge: parseFloat(form.reefSurcharge.value),
    rating: Math.min(Math.max(parseFloat(form.rating.value), 1.1), 5.0)
  };
  seaCarriers.push(newSeaCarrier);
  localStorage.setItem("seaCarriers", JSON.stringify(seaCarriers));
  form.reset();
  renderSeaCarrierTable();
});

document.getElementById("seaCarrierCsvInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    seaCarriers = [];
    const lines = e.target.result.split('\n').filter(l => l.trim());
    lines.slice(1).forEach(line => {
      const [route, lineName, freightCost, transitTime, reefSurcharge, rating] = line.split(';');
      seaCarriers.push({
        route: route.trim(),
        line: lineName.trim(),
        freightCost: parseFloat(freightCost),
        transitTime: parseFloat(transitTime),
        reefSurcharge: parseFloat(reefSurcharge),
        rating: parseFloat(rating)
      });
    });
    localStorage.setItem("seaCarriers", JSON.stringify(seaCarriers));
    renderSeaCarrierTable();
  };
  reader.readAsText(file);
});

function downloadSeaCarrierTable() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Маршрут;Линия;Стоимость фрахта;Время в пути;Надбавка за реф-контейнер;Рейтинг\n";

  seaCarriers.forEach(c => {
    csvContent += `${c.route};${c.line};${c.freightCost};${c.transitTime};${c.reefSurcharge};${c.rating}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "sea_carriers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("downloadSeaCsvBtn").addEventListener("click", downloadSeaCarrierTable);

// Загрузка при старте страницы
const savedSeaCarriers = localStorage.getItem("seaCarriers");
if (savedSeaCarriers) {
  seaCarriers = JSON.parse(savedSeaCarriers);
  renderSeaCarrierTable();
} else {
  fetch("sea_carriers.csv")
    .then(res => {
      if (!res.ok) throw new Error("Ошибка загрузки sea_carriers.csv");
      return res.text();
    })
    .then(csv => {
      seaCarriers = [];
      const lines = csv.split('\n').filter(l => l.trim());
      lines.slice(1).forEach(line => {
        const [route, lineName, freightCost, transitTime, reefSurcharge, rating] = line.split(';');
        seaCarriers.push({
          route: route.trim(),
          line: lineName.trim(),
          freightCost: parseFloat(freightCost),
          transitTime: parseFloat(transitTime),
          reefSurcharge: parseFloat(reefSurcharge),
          rating: parseFloat(rating)
        });
      });
      localStorage.setItem("seaCarriers", JSON.stringify(seaCarriers));
      renderSeaCarrierTable();
    })
    .catch(err => {
      console.error("Не удалось загрузить sea_carriers.csv:", err);
    });
}


// Кнопка сворачивания базы морских перевозчиков
document.getElementById("toggleSeaCarrierBlock").addEventListener("click", () => {
  const container = document.getElementById("seaCarrierControls");
  const toggleBtn = document.getElementById("toggleSeaCarrierBlock");
  const isVisible = container.style.display === "block";
  container.style.display = isVisible ? "none" : "block";
  toggleBtn.textContent = isVisible ? "➕" : "➖";
});

// =================== База перевозчиков авиационного транспорта =================== //
let airCarriers = [];

function renderAirCarrierTable() {
  const tbody = document.querySelector("#airCarrierTable tbody");
  tbody.innerHTML = "";  // Очищаем таблицу перед отображением новых данных

  const airCarriers = JSON.parse(localStorage.getItem("airCarriers") || "[]");
  airCarriers.forEach((c, index) => {
    const row = tbody.insertRow();
    row.insertCell().textContent = c.route;
    row.insertCell().textContent = c.company;
    row.insertCell().textContent = c.kca;
    row.insertCell().textContent = c.kns;
    row.insertCell().textContent = c.avcont;
    row.insertCell().textContent = c.ksbor;
    row.insertCell().textContent = c.flightTime + " ч";  // Отображаем время полета

    const deleteCell = row.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-button";
    deleteBtn.addEventListener("click", () => {
      airCarriers.splice(index, 1);  // Удаляем элемент из массива
      localStorage.setItem("airCarriers", JSON.stringify(airCarriers));  // Сохраняем изменения в localStorage
      renderAirCarrierTable();  // Перерисовываем таблицу
    });
    deleteCell.appendChild(deleteBtn);
  });
}

document.getElementById("addAirCarrierForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = e.target;
  const newAirCarrier = {
    route: form.route.value,
    company: form.company.value,
    kca: parseFloat(form.kca.value),
    kns: parseFloat(form.kns.value),
    avcont: parseFloat(form.avcont.value),
    ksbor: parseFloat(form.ksbor.value),
    flightTime: parseFloat(form.flightTime.value),
  };
  let airCarriers = JSON.parse(localStorage.getItem("airCarriers") || "[]");
  airCarriers.push(newAirCarrier);
  localStorage.setItem("airCarriers", JSON.stringify(airCarriers));
  form.reset();
  renderAirCarrierTable();
});

document.getElementById("airCarrierCsvInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split('\n').filter(l => l.trim() !== "");  // Убираем пустые строки
    let airCarriers = [];
    lines.slice(1).forEach(line => {  // Пропускаем заголовок
      const [route, company, kca, kns, avcont, ksbor, flightTime] = line.split(';');
      airCarriers.push({
        route: route.trim(),
        company: company.trim(),
        kca: parseFloat(kca),
        kns: parseFloat(kns),
        avcont: parseFloat(avcont),
        ksbor: parseFloat(ksbor),
        flightTime: parseFloat(flightTime)
      });
    });
    localStorage.setItem("airCarriers", JSON.stringify(airCarriers));
    renderAirCarrierTable();
  };
  reader.readAsText(file);
});

function downloadAirCarrierTable() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Маршрут;Авиакомпания;Базовый тариф (Kca);Надбавка за скоропорт (Kns);Аренда контейнера (avcont);Сборы (Ksbor)\n;Время полета (ч)\n";

  airCarriers.forEach(c => {
    csvContent += `${c.route};${c.company};${c.kca};${c.kns};${c.avcont};${c.ksbor};${c.flightTime}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "air_carriers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("downloadAirCsvBtn").addEventListener("click", downloadAirCarrierTable);

// Загрузка при старте страницы
const savedAirCarriers = localStorage.getItem("airCarriers");
if (savedAirCarriers) {
  airCarriers = JSON.parse(savedAirCarriers);
  renderAirCarrierTable();
} else {
  fetch("air_carriers.csv")
    .then(res => {
      if (!res.ok) throw new Error("Ошибка загрузки air_carriers.csv");
      return res.text();
    })
    .then(csv => {
      airCarriers = [];
      const lines = csv.split('\n').filter(l => l.trim());
      lines.slice(1).forEach(line => {
        const [route, company, kca, kns, avcont, ksbor,flightTime] = line.split(';');
        airCarriers.push({
          route: route.trim(),
          company: company.trim(),
          kca: parseFloat(kca),
          kns: parseFloat(kns),
          avcont: parseFloat(avcont),
          ksbor: parseFloat(ksbor),
          flightTime: parseFloat(flightTime)
        });
      });
      localStorage.setItem("airCarriers", JSON.stringify(airCarriers));
      renderAirCarrierTable();
    })
    .catch(err => {
      console.error("Не удалось загрузить air_carriers.csv:", err);
    });
}

// Кнопка сворачивания базы авиаперевозчиков
document.getElementById("toggleAirCarrierBlock").addEventListener("click", () => {
  const container = document.getElementById("airCarrierControls");
  const toggleBtn = document.getElementById("toggleAirCarrierBlock");
  const isVisible = container.style.display === "block";
  container.style.display = isVisible ? "none" : "block";
  toggleBtn.textContent = isVisible ? "➕" : "➖";
});


