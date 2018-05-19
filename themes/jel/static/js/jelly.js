(function($) {
    var cacheMap = {};
    var current;

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

      $(function () {
        $('#product').on('change', function(e) {
            $('#datetimepicker_from').data("DateTimePicker").clear();
            $('#datetimepicker_to').data("DateTimePicker").clear();
            var url = this.options[this.selectedIndex].getAttribute("data") + "index.json";
            console.log(url);
            current = url;
            if (cacheMap[url])
            {
              $('#datetimepicker_from').data("DateTimePicker").disabledDates(cacheMap[url]);
              $('#datetimepicker_to').data("DateTimePicker").disabledDates(cacheMap[url]);
            }
            else
            {
              $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json'
              }).done(function (response) {
                $.each(response, function (k, v) {
                  response[k] = moment(response[k]);
                });
                cacheMap[url] = response;
                $('#datetimepicker_from').data("DateTimePicker").disabledDates(response);
                $('#datetimepicker_to').data("DateTimePicker").disabledDates(response);
              });
            }
        });

        $('#datetimepicker_from').datetimepicker({
          format: 'DD/MM/YYYY',
          minDate: moment()
        });

        $('#datetimepicker_to').datetimepicker({
          format: 'DD/MM/YYYY',
          minDate: moment(),
          useCurrent: false //Important! See issue #1075
        });

        $("#datetimepicker_from").on("dp.change", function (e) {
            $('#datetimepicker_to').data("DateTimePicker").clear();
            if (cacheMap[current]) 
            {
              var list = cacheMap[current];
              var min = null;
              for (var val in list) {
                if (list[val] > e.date && (min == null || list[val] < min))
                  min = list[val];
              }
              console.log(min);
              if (min)
                $('#datetimepicker_to').data("DateTimePicker").maxDate(min);
            }
            $('#datetimepicker_to').data("DateTimePicker").minDate(e.date);
        });
      });
    });
})(jQuery);
