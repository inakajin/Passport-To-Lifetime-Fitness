$("input[name='activitylist']").change(function(e) {
  console.log(this.value);
  $(".activity").text(this.value);
});

//Visit approval button logic
$(".approvevisit").click(function(e) {
  //console.log("Approval Test")
  $.post("", function(data, status) {
    console.log("Data: " + data + "\nStatus: " + status);
    if (data.success) {
      $(".notification").addClass("approved");
    }
  });
});

//User approval button logic
$("button.approveuser").click(function(e) {
  //let id=$(this).parent().data('userid');
  let id = $(this)
    .closest("ul")
    .data("userid");
  $.post("/profile/approveuser", { id: id }, function(data, status) {
    console.log(data);
    if (data.success) {
      window.location.reload();
    }
  });
});

//User deletion button logic
$("button.deleteuser").click(function(e) {
  //let id=$(this).parent().data('userid');
  let id = $(this)
    .closest("ul")
    .data("userid");
  $.post("/profile/deleteuser", { id: id }, function(data, status) {
    console.log(data);
    $(`[data-userid="${id}"]`).remove();
  });
});

//Visit deletion button logic
$("button.deletevisit").click(function(e) {
  //let id=$(this).parent().data('userid');
  let par = $(this).closest("ul");
  let id = par.data("visitid");
  console.log(id);
  $.post("/profile/deletevisit", { id: id }, function(data, status) {
    console.log(data);
    par.remove();
  });
});

//User modification button logic
$("button.modifyuser").click(function(e) {
  window.t = this;
  console.log(this);
  e.stopPropagation();
  $(this)
    .parent()
    .find(".modify-user")
    .toggleClass("hide");
  return false;
});

//Cancel user modification
$("button.cancel-update").click(function(e) {
  $(this)
    .parent()
    .toggleClass("hide");
});

//User modification form logic
$("form.modify-user").submit(function(e) {
  e.preventDefault();
  var inputs = $(this)
    .closest("form")
    .find("input");
  var values = {};
  inputs.each(function() {
    values[this.name] = $(this).val();
  });
  console.log(values);
  let id = $(this)
    .closest("ul")
    .data("userid");
  console.log(id);
  values.id = id;
  $.post("/profile/updateuser", values, function(data, status) {
    console.log(data);
    window.location.reload();
  });
});

//Logic to display admin options for admins
$(document).on("keyup", "#studentid", function() {
  if ($(this).val().length >= 7) {
    $("form")[0].reportValidity();
  }
});

function openCity(cityName) {
  var i;
  var x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(cityName).style.display = "block";
  $("input.myInput")
    .val("")
    .trigger("keyup");
}

$(document).ready(function() {
  $(".myInput").on("keyup", function() {
    var value = $(this)
      .val()
      .toLowerCase();
    $(".userlist-container ul").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      );
    });
  });
});
