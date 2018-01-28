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
    let id=$(this).parent().data('userid');
    $.post("/profile/approveuser", {id: id}, function(data, status){
        console.log(data);
    })
});

$('button.deleteuser').click(function(e) {
    let id=$(this).parent().data('userid');
    $.post("/profile/deleteuser", {id: id}, function(data, status){
        console.log(data);
        $(`[data-userid="${id}"]`).remove();
    })
});

$('button.modifyuser').click(function(e) {
    $(this).parent().find('.modify-user').toggleClass('hide');
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
    let id=$(this).closest('li').data('userid')
    //$(this).parent().parent().data('userid');
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

//var input = document.getElementById('studentid');
//input.oninvalid = function(event) {
//    event.target.setCustomValidity('The Student ID must be 7 numbers.');
//}