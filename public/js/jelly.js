(function($) {
    "use strict";

    $('#makeitNav').affix({
        offset: {
            top: 100
        }
    })

    $('.carousel').carousel({
  		interval: false
	})

    $(document).ready(function () {
    	var my_json;
  		$.getJSON("", function(json) {
  		  my_json = json;
  		});
      $("#makeit-calendar").zabuto_calendar(
      	{
      		ajax: {
                url: "index.json"
              },
			    nav_icon: {
			      prev: '<p>&#8592</p>',
			      next: '<p>&#8594</p>'
			    }
  		  }
	    );

      var galleryOptions = {
        width: '90%',
        height: '90%',
        top: '2%',
        rel:function() {
          return $(this).data('rel');
        }
      }

      $("[class^='group']").colorbox(galleryOptions);

      $(window).resize(function() {
          $.colorbox.resize({
            width: window.innerWidth > parseInt(galleryOptions.maxWidth) ? galleryOptions.maxWidth : galleryOptions.width,
            height: window.innerHeight > parseInt(galleryOptions.maxHeight) ? galleryOptions.maxHeight : galleryOptions.height
          });
      });
    });
    var dateTimeOptions = {

    }
    $(function () {
      $('#datetimepicker6').datetimepicker({
        format: 'DD/MM/YYYY',
        minDate: moment()
      });
      $('#datetimepicker7').datetimepicker({
        format: 'DD/MM/YYYY',
        useCurrent: false //Important! See issue #1075
      });

      $("#datetimepicker6").on("dp.show", function (e) {
          $('#datetimepicker6').data("DateTimePicker").clear();
          $('#datetimepicker7').data("DateTimePicker").clear();
      });
      $("#datetimepicker6").on("dp.change", function (e) {
          $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
      });
      $("#datetimepicker7").on("dp.change", function (e) {
          $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
      });
    });
})(jQuery);
