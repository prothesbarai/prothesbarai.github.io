let categories = [];
let currentItems = [];
const lockedCategories = { "Cyber Security": "NzQyNjcy", "Bat Files": "NzQyNjcy", "GoLang": "U2hyZXlhc2lQcm90aGVzQW5na2Fu" };
//let jsonSource = "../document.json";
let sp = "aHR0cHM6Ly9wcm90aGVzYmFyYWkuZ2l0aHViLmlvL2NvbGxlY3QvSGVscC9kb2N1bWVudC5qc29u";
let asp = atob(sp);

 

$(document).ready(function () {

  // ================= Load JSON Data =================
  $.getJSON(asp, function (data) {
    categories = data;

    let categoryContainer = $("#categoryContainer");
    categories.forEach((cat, index) => {
      categoryContainer.append(`
        <div class="col-md-4 col-sm-6 mb-3">
          <div class="card text-center shadow-sm border-0 text-white category-card" data-index="${index}" style="background-color:#0bceaf;">
            <div class="card-body">
              <a href="#" class="stretched-link text-decoration-none text-white font-weight-medium">
                ${cat.name} [${cat.items.length}] ${lockedCategories[cat.name] ? '🔒' : ''}
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
  // $(document).on("click", ".category-card", function (e) {
  //   e.preventDefault();
  //   let index = $(this).data("index");
  //   let categoryName = categories[index].name;

  //   // Check if category is locked
  //   if (lockedCategories[categoryName]) {
  //     let correctPassword = atob(lockedCategories[categoryName]);
  //     let userPassword = "";

  //     while (true) {
  //       userPassword = prompt(`"${categoryName}" দেখতে password দিন:`);

  //       // যদি user Cancel press করে
  //       if (userPassword === null) {
  //         return; // modal open হবে না
  //       }

  //       // password ঠিক হলে break
  //       if (userPassword === correctPassword) {
  //         break; // password ঠিক, modal চলবে
  //       } else {
  //         alert("Password ভুল! আবার চেষ্টা করুন।");
  //       }
  //     }
  //   }

  //   currentItems = categories[index].items;
  //   $("#categoryModalLabel").text(categoryName);
  //   let list = $("#modalList");
  //   list.empty();

  //   currentItems.forEach((item, i) => {
  //     list.append(`<li class="list-group-item item-clickable" data-index="${i}">${item.title}</li>`);
  //   });

  //   $("#categoryModal").modal("show");
  // });


  $(document).on("click", ".category-card", function (e) {
    e.preventDefault();
    let index = $(this).data("index");
    let categoryName = categories[index].name;
    let correctPassword = lockedCategories[categoryName] ? atob(lockedCategories[categoryName]) : null;

    function openCategory() {
      currentItems = categories[index].items;
      $("#categoryModalLabel").text(categoryName);
      let list = $("#modalList");
      list.empty();

      currentItems.forEach((item, i) => {
        list.append(`<li class="list-group-item item-clickable" data-index="${i}">${item.title}</li>`);
      });

      $("#categoryModal").modal("show");
    }

    // যদি locked category হয়
    if (correctPassword) {
      $("#passwordInput").val(""); // reset
      $("#passwordError").hide(); // hide error

      $("#passwordModal").modal("show");

      $("#passwordSubmit").off("click").on("click", function () {
        let entered = $("#passwordInput").val();
        if (entered === correctPassword) {
          $("#passwordModal").modal("hide");

          // Wait until modal পুরোপুরি hide হয়
          $("#passwordModal").one("hidden.bs.modal", function () {
            openCategory();
          });
        } else {
          $("#passwordError").show();
        }
      });
    } else {
      openCategory();
    }
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
