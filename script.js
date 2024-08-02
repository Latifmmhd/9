document.addEventListener("DOMContentLoaded", function () {
  const kkData = JSON.parse(localStorage.getItem("kkData")) || [];
  const akteData = JSON.parse(localStorage.getItem("akteData")) || [];
  const bpjsData = JSON.parse(localStorage.getItem("bpjsData")) || [];
  let currentEditIndex = null;
  let currentEditTable = null;

  function updateStorage() {
    localStorage.setItem("kkData", JSON.stringify(kkData));
    localStorage.setItem("akteData", JSON.stringify(akteData));
    localStorage.setItem("bpjsData", JSON.stringify(bpjsData));
  }

  function renderTable(tableId, data, keys) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";
    data.forEach((item, index) => {
      const row = document.createElement("tr");
      keys.forEach((key) => {
        const cell = document.createElement("td");
        cell.textContent = item[key];
        row.appendChild(cell);
      });
      const actions = document.createElement("td");

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("btn", "btn-warning", "me-2");
      editButton.addEventListener("click", () => openEditModal(tableId, index));
      actions.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.addEventListener("click", () => deleteItem(tableId, index));
      actions.appendChild(deleteButton);

      row.appendChild(actions);
      tbody.appendChild(row);
    });
  }

  function openEditModal(tableId, index) {
    currentEditIndex = index;
    currentEditTable = tableId;

    const data = getDataByTableId(tableId)[index];
    document.getElementById("editName").value = data.name;
    document.getElementById("editAddress").value = data.address || data.dob || data.number;

    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
  }

  function updateItem(tableId, index, newData) {
    const data = getDataByTableId(tableId);
    data[index] = newData;
    updateStorage();
    renderTable(tableId, data, getKeysByTableId(tableId));
  }

  function deleteItem(tableId, index) {
    const data = getDataByTableId(tableId);
    data.splice(index, 1);
    updateStorage();
    renderTable(tableId, data, getKeysByTableId(tableId));
  }

  function getDataByTableId(tableId) {
    switch (tableId) {
      case "kkTable":
        return kkData;
      case "akteTable":
        return akteData;
      case "bpjsTable":
        return bpjsData;
      default:
        return [];
    }
  }

  function getKeysByTableId(tableId) {
    switch (tableId) {
      case "kkTable":
        return ["name", "address"];
      case "akteTable":
        return ["name", "dob"];
      case "bpjsTable":
        return ["name", "number"];
      default:
        return [];
    }
  }

  // Menangani form submit untuk Kartu Keluarga
  document.getElementById("kkForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("kkName").value;
    const address = document.getElementById("kkAddress").value;
    kkData.push({ name, address });
    updateStorage();
    // alert("Data Kartu Keluarga berhasil ditambahkan!");
    // document.getElementById("kkForm").reset();
    document.getElementById("kkResult").innerText = `Data untuk ${name} di ${address} telah dicatat.`;
  });

  // Menangani form submit untuk Akte Kelahiran
  document.getElementById("akteForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("akteName").value;
    const dob = document.getElementById("akteDOB").value;
    akteData.push({ name, dob });
    updateStorage();
    // alert("Data Akte Kelahiran berhasil ditambahkan!");
    // document.getElementById("akteForm").reset();
    document.getElementById("kkResult").innerText = `Data untuk ${name} di ${address} telah dicatat.`;
  });

  // Menangani form submit untuk BPJS
  document.getElementById("bpjsForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("bpjsName").value;
    const number = document.getElementById("bpjsNumber").value;
    bpjsData.push({ name, number });
    updateStorage();
    // alert("Data BPJS berhasil ditambahkan!");
    // document.getElementById("bpjsForm").reset();
    document.getElementById("kkResult").innerText = `Data untuk ${name} di ${address} telah dicatat.`;
  });

  // Menangani form submit untuk edit data
  document.getElementById("editForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("editName").value;
    const address = document.getElementById("editAddress").value;

    const newData = { name };
    if (currentEditTable === "kkTable") {
      newData.address = address;
    } else if (currentEditTable === "akteTable") {
      newData.dob = address;
    } else if (currentEditTable === "bpjsTable") {
      newData.number = address;
    }

    updateItem(currentEditTable, currentEditIndex, newData);

    const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    editModal.hide();
  });

  // Render tabel pada halaman view.html
  renderTable("kkTable", kkData, ["name", "address"]);
  renderTable("akteTable", akteData, ["name", "dob"]);
  renderTable("bpjsTable", bpjsData, ["name", "number"]);
});
