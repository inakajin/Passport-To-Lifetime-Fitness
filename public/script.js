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