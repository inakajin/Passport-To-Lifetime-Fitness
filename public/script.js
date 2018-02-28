$( "input[name='activitylist']" ).change(function(e){ 
    console.log(this.value) 
    $('.activity').text(this.value)
})
//alert("testing");
//Approval button logic
$("button.approve").click(function (e) {
    //console.log("Approval Test")
    $.post("", function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
        if (data.success){
            $(".notification").addClass("approved")            
        }
    });
});


$('button.approveuser').click(function(e) {
    //let id=$(this).parent().data('userid');
    let id=$(this).closest('ul').data('userid')
    $.post("/profile/approveuser", {id: id}, function(data, status){
        console.log(data);
        if (data.success){window.location.reload()}
    })
});

$('button.deleteuser').click(function(e) {
    //let id=$(this).parent().data('userid');
    let id=$(this).closest('ul').data('userid')
    $.post("/profile/deleteuser", {id: id}, function(data, status){
        console.log(data);
        $(`[data-userid="${id}"]`).remove();
    })
});

$('button.deletevisit').click(function(e) {
    //let id=$(this).parent().data('userid');
    let id=$(this).closest('ul').data('visitid')
    $.post("/deletevisit", {id: id}, function(data, status){
        console.log(data);
        $(`[data-userid="${id}"]`).remove();
    })
});

$('button.modifyuser').click(function(e) {
    window.t=this;
    console.log(this);
   e.stopPropagation();
  $(this).parent().find('.modify-user').toggleClass('hide');
    return false;
})

$('button.cancel-update').click(function(e) {
    $(this).parent().toggleClass('hide');
})

$('form.modify-user').submit(function(e) {
    e.preventDefault();
    //var values = $(this);
    // var input = $(this).closest("form").find("input").val(); // This is the jquery object of the input, do what you will
    //console.log(input)
    //console.log($(this).attr("data-studentid"));
    var inputs = $(this).closest("form").find("input");
    var values = {};
    inputs.each(function() {
        values[this.name] = $(this).val();
    });
    console.log(values);
    let id=$(this).closest('ul').data('userid')
    //$(this).parent().parent().data('userid');
    console.log(id);
    values.id=id;
    //console.log($(this));
    $.post("/profile/updateuser", values, function(data, status){
        console.log(data);
        window.location.reload();
    })
})

$(document).on("keyup","#studentid",function(){
    if($(this).val().length>=7) {
        $('form')[0].reportValidity();
    }
 });

 function openCity(cityName) {
    var i;
    var x = document.getElementsByClassName("city");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none"; 
    }
    document.getElementById(cityName).style.display = "block";
    $("input.myInput").val("").trigger("keyup") 
}
 

$(document).ready(function(){
  $(".myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".userlist-container ul").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});


//var input = document.getElementById('studentid');
//input.oninvalid = function(event) {
//    event.target.setCustomValidity('The Student ID must be 7 numbers.');
//}