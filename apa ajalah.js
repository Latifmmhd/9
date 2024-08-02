document.addEventListener("DOMContentLoaded", function () {
  let kkData = JSON.parse(localStorage.getItem("kkData")) || [];
  let akteData = JSON.parse(localStorage.getItem("akteData")) || [];
  let bpjsData = JSON.parse(localStorage.getItem("bpjsData")) || [];

  // Save Data to Local Storage
  function saveData() {
    localStorage.setItem("kkData", JSON.stringify(kkData));
    localStorage.setItem("akteData", JSON.stringify(akteData));
    localStorage.setItem("bpjsData", JSON.stringify(bpjsData));
  }

  // Populate Data Table
  function populateTable(data, tableId) {
    const tableBody = document.getElementById(tableId).getElementsByTagName("tbody")[0];
    tableBody.innerHTML = "";
    data.forEach((item, index) => {
      let row = tableBody.insertRow();
      Object.values(item).forEach((val) => {
        let cell = row.insertCell();
        cell.textContent = val;
      });
      let actionsCell = row.insertCell();
      actionsCell.innerHTML = `
                <button class="edit" onclick="editData('${tableId}', ${index})">Edit</button>
                <button class="delete" onclick="deleteData('${tableId}', ${index})">Delete</button>
            `;
    });
  }

  // Handle Form Submissions
  document.getElementById("kkForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("kkName").value;
    const address = document.getElementById("kkAddress").value;
    kkData.push({ name, address });
    saveData();
    document.getElementById("kkResult").innerText = `Data untuk ${name} di ${address} telah dicatat.`;
  });

  document.getElementById("akteForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("akteName").value;
    const dob = document.getElementById("akteDOB").value;
    akteData.push({ name, dob });
    saveData();
    document.getElementById("akteResult").innerText = `Data untuk ${name} lahir pada ${dob} telah dicatat.`;
  });

  document.getElementById("bpjsForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("bpjsName").value;
    const number = document.getElementById("bpjsNumber").value;
    bpjsData.push({ name, number });
    saveData();
    document.getElementById("bpjsResult").innerText = `Data BPJS untuk ${name} dengan nomor ${number} telah dicatat.`;
  });

  // Load Data on Data Page
  if (window.location.pathname.endsWith("data.html")) {
    populateTable(kkData, "kkTable");
    populateTable(akteData, "akteTable");
    populateTable(bpjsData, "bpjsTable");

    // Popup Handling
    const popup = document.getElementById("editPopup");
    const closeBtn = document.querySelector(".popup .close");

    window.editData = function (tableId, index) {
      const data = { kkTable: kkData, akteTable: akteData, bpjsTable: bpjsData }[tableId];
      document.getElementById("editName").value = data[index].name || data[index].kkName || data[index].bpjsName;
      document.getElementById("editField2").value = data[index].address || data[index].dob || data[index].number;
      popup.style.display = "flex";
      document.getElementById("editForm").onsubmit = function (e) {
        e.preventDefault();
        data[index].name = document.getElementById("editName").value;
        data[index].address = data[index].address ? document.getElementById("editField2").value : data[index].address;
        data[index].dob = data[index].dob ? document.getElementById("editField2").value : data[index].dob;
        data[index].number = data[index].number ? document.getElementById("editField2").value : data[index].number;
        saveData();
        populateTable(data, tableId);
        popup.style.display = "none";
      };
    };

    window.deleteData = function (tableId, index) {
      const data = { kkTable: kkData, akteTable: akteData, bpjsTable: bpjsData }[tableId];
      data.splice(index, 1);
      saveData();
      populateTable(data, tableId);
    };

    closeBtn.onclick = function () {
      popup.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == popup) {
        popup.style.display = "none";
      }
    };
  }
});
