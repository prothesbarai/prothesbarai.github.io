let categories = [];
let currentItems = [];

$(document).ready(function(){
  $.getJSON("categories.json", function(data){
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
  }).fail(function(){
    console.error("categories.json লোড হয়নি");
  });

  $(document).on("click", ".category-card", function(e){
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

  $(document).on("click", ".item-clickable", function(){
    let index = $(this).data("index");
    let item = currentItems[index];

    $("#itemModalLabel").text(item.title);
    $("#itemDescription").text(item.description);
    $("#itemCode").text(item.code);

    $("#categoryModal").modal("hide");
    $("#itemModal").modal("show");
  });

  $("#copyCodeBtn").click(function(){
    let code = $("#itemCode").text();
    navigator.clipboard.writeText(code).then(()=>{
      alert("Code copied!");
    });
  });
});
