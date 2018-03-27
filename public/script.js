$("input[name='activitylist']").change(function(e) {
  console.log(this.value);
  $(".activity").text(this.value);
});

//Visit approval button logic
$(".approvevisit").click(function(e) {
  $.post("", function(data, status) {
    console.log("Data: " + data + "\nStatus: " + status);
    if (data.success) {
      $(".notification").addClass("approved");
    }
  });
});

//User approval button logic
$("button.approveuser").click(function(e) {
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
  let id = $(this)
    .closest("ul")
    .data("userid");
  $.post("/profile/deleteuser", { id: id }, function(data, status) {
    console.log(data);
    $(`[data-userid="${id}"]`).remove();
  });
});

//School deletion button logic
//$("button.deleteschool").click(function(e) {
$('ul.schoollist').on('click', 'button.deleteschool', function(e) {
  let id = $(this)
    .closest("li")
    .data("schoolid");
    console.log(id)
    $.post("/profile/deleteschool", { id: id}, function(data, status) {
      console.log(data);
      $(`[data-schoolid="${id}"]`).remove(); 
    });
});

//Activity deletion button logic
$('ul.activitylist').on('click', 'button.deleteactivity', function(e) {  
    let id = $(this)
    .closest("li")
    .data("activityid");
    console.log(id)
    $.post("/profile/deleteactivity", { id: id}, function(data, status) {
      console.log(data);
      $(`[data-activityid="${id}"]`).remove(); 
    });
});


//View specific students visit history
$("button.pie-student").click(function(e) {
    let id = $(this)
        .closest("ul")
        .data("userid");
        console.log(visData)
        visData=JSON.parse(tempData).filter(function (el) {
            console.log(el)
            return el.userid == id
    })
    reset()  
  console.log(visData);
    change(
        constructData(
        visData,
          dataTitles["activitylist"],
          "activitylist"
        )
      );
    console.log(visData)
});

//Reset to original pie-data
$("button.reload-data").click(function(e) {
window.location.reload()
})

//Visit deletion button logic
$("button.deletevisit").click(function(e) {
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

//Add activity
$("form.activityform").submit(function(e) {
  e.preventDefault();
  console.log($('#activity').val())
  let values = {activity:$('#activity').val()}
  $.post("/profile/addactivity", values, function(data, status) {
    console.log(data);
    let html = 
    `<li data-activityid=${data._id}>
        Activity: ${data.activity}
        <button class="deleteactivity" aria-label="This deletes the activity.">Remove</button>
      </li>
    `
    $(".activitylist").append(html);
    $('#activity').val('');
  });
})

//Add school
$("form.schoolform").submit(function(e) {
  e.preventDefault();
  console.log($('#school').val())
  let values = {school:$('#school').val()}
  $.post("/profile/addschool", values, function(data, status) {
    console.log(data);
    let html = 
    `<li data-schoolid=${school._id}>
        School: ${data.school}
        <button class="deleteschool" aria-label="This deletes the school.">Remove</button>
      </li>
    `
    $(".schoollist").append(html);
    $('#school').val('');
  });
})

//User modification form logic
$("form.modify-user").submit(function(e) {
  e.preventDefault();
  var inputs = $(this)
    .closest("form")
    .find("input");
  var values = {};
  inputs.each(function() {
    if (!$(this).is(":checked") && this.name=="admin")
    {
        console.log(this)
        values[this.name] = "off"
    }
    else 
    {
        values[this.name] = $(this).val()
    }
    
  });
  values['school']=$(this).closest("form").find('.schools').val();
    console.log (JSON.stringify(values));
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
