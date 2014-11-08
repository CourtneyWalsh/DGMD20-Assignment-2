$(document).ready(function() {


    //Form Element 1 

    $("#submit").click(function() {
        $('#myModal').modal();
        submit.preventDefault();
    }); //end click

    //Form Element 2

    $("#reset").click(function() {
        $('#form').find('input, select').not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');
    }); //end click



    // Click Effect

    $('.myGallery').click(function() {
        $(this).css('width', function(_, cur) {
            return cur === '100px' ? '100%' : '100px'
        }); // original width is 500px 
    }); //end click


    // Hover Effect 

    $('#btn-default').hover(function() {
        console.log('The default button was hovered over!');
        $('#btn-default').css({
            backgroundColor: # ebebeb
        }); // end css
    }, function() {
        console.log('The default button was left behind!');
        $('btn-default').css({
            backgroundColor: # fff
        })
    }); //end click

    // If/Else

    $('#submit-btn').click(function(submit) {
        var name = $('#name').val();
        if (!name.trim()) {
            alert('Please return to form and enter a name.');
            return submit.preventDefault();
        } else {
            $('#myModal').modal();
            submit.preventDefault();
        }
    }); //end click

    // Filter


    // Extra Effect 1

    $('.thumbnail').hover(function() {
        var caption = image.attr('data-ngdesc')

        caption_font_size: '18px',
        caption_color: 'white',
        caption_bold: true,
    }); //end hover

    //Extra Effect 2

    $('.thumbnail').hover(function() {
        $(this).children('a').children('img').animate({
            height: '150',
            left: '0',
            top: '0',
            width: 'auto'
        }, 100);
        $(this).children('a').children('span').fadeout(150);
    }); //end hover


}); // end ready