$( "input[name='activitylist']" ).change(function(e){ 
    console.log(this.value) 
    $('.activity').text(this.value)
})