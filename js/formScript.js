 $(document).ready(function() {

     $('#submit-btn').click(function(submit) {
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

 }); //end .ready(function()