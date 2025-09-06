let categories = [];
let currentItems = [];

$(document).ready(function () {

  // ================= Load JSON Data =================
  $.getJSON("../document.json", function (data) {
    categories = data;

    let categoryContainer = $("#categoryContainer");
    categories.forEach((cat, index) => {
      categoryContainer.append(`
        <div class="col-md-4 col-sm-6 mb-3">
          <div class="card text-center shadow-sm border-0 bg-info text-dark category-card" data-index="${index}">
            <div class="card-body">
              <a href="#" class="stretched-link text-decoration-none text-dark font-weight-medium">
                ${cat.name} [${cat.items.length}]
              </a>
            </div>
          </div>
        </div>
      `);
    });
  }).fail(function () {
    console.error("document.json লোড হয়নি");
  });

  // ================= Category Click =================
  $(document).on("click", ".category-card", function (e) {
    e.preventDefault();
    let index = $(this).data("index");
    currentItems = categories[index].items;

    $("#categoryModalLabel").text(categories[index].name);
    let list = $("#modalList");
    list.empty();

    currentItems.forEach((item, i) => {
      list.append(`<li class="list-group-item item-clickable" data-index="${i}">${item.title}</li>`);
    });

    $("#categoryModal").modal("show");
  });

  // ================= Item Click =================
  $(document).on("click", ".item-clickable", function () {
    let index = $(this).data("index");
    let item = currentItems[index];

    $("#itemModalLabel").text(item.title);
    let modalBody = $("#itemModalBody");
    modalBody.empty(); // clear previous content

    item.sections.forEach((sec, i) => {
      // First description
      modalBody.append(`
      <div style="background:#fff; color:#000; padding:10px; border-radius:4px; margin-bottom:10px;">
        <p style="margin:0;">${sec.description}</p>
      </div>
    `);

      // Only show code if exists
      if (sec.code && sec.code.trim() !== "") {
        modalBody.append(`
        <div style="position:relative; margin-bottom:15px;">
          <pre style="background:#000; color:#fff; padding:10px; border-radius:4px; white-space: pre-wrap; word-wrap: break-word; overflow-x:hidden; overflow-y:auto; max-height:200px;" class="code-block">${sec.code}</pre>
          <i class="fa-regular fa-copy" style="position:absolute; top:10px; right:10px; cursor:pointer; color:#fff;" title="Copy code"></i>
        </div>
      `);
      }
    });

    $("#categoryModal").modal("hide");
    $("#itemModal").modal("show");
  });



  // ================= Copy Code per Block =================
  $(document).on("click", "#itemModalBody i.fa-copy", function () {
    let codeText = $(this).siblings("pre.code-block").text();
    navigator.clipboard.writeText(codeText).then(() => {
      alert("Code copied!");
    });
  });


});
