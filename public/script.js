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
