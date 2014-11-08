 $(document).ready(function(){

 $('#submit-btn').click(function(submit){
   var name = $('#name').val();
    if (!name.trim()) {
        alert('Please return to form and enter a name.');
        return submit.preventDefault();
    } else {
       		$('#myModal').modal();
			submit.preventDefault();
    }
}); // end ready

 $("#reset").click(function() {
        $('#form').find('input, select').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
    }); //end reset click

});

 $(document).ready(function(){
 	$('#btn-default').hover(function(){
		console.log('The default button was hovered over!');
		$('#btn-default').css({ 
			backgroundColor: #ebebeb
		});// end css
	}, function(){
		console.log('The default button was left behind!');
		$('btn-default').css({ 
			backgroundColor: #fff
		});// end css
	}); //end btn-default hover
	
	}); //end .ready(function() 


	