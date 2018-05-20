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
              if (min)
                $('#datetimepicker_to').data("DateTimePicker").maxDate(min);
            }
            $('#datetimepicker_to').data("DateTimePicker").minDate(e.date);
        });
      });

      function validate(object, isCorrect) {
        if (isCorrect)
          object.removeClass("has-error").addClass("valid");
        else
          object.removeClass("valid").addClass("has-error");
      }

      $('#contact-fullname').on('input', function() {
        validate($(this), $(this).val());
      });

      $('#contact-email').on('input', function() {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        validate($(this), regex.test($(this).val()));
      });

      $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        var contactData = $(this).serializeArray();
        for (var index in contactData) {
          var element = $("#contact-" + contactData[index]['name']);
          console.log(element);
          var valid = element.hasClass("valid");
          var error_element = $("span", element.parent());
        }
        /*var messageAlert = 'alert-' + data.type;
        var messageText = data.message;
        var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
        
        if (messageAlert && messageText) {
          $('#contact-form').find('.messages').html(alertBox);
          $('#contact-form')[0].reset();
        }*/
        var elements = $(this)[0].elements;
        for (var index in elements) {
          console.log(elements[index].value);
        }
        /*$.ajax({
            type: "POST",
            url: "https://thirsty-euler-c41f2b.netlify.com/.netlify/functions/sendMail",
            data: $(this).serialize(),
            success: function(data, text, xhr) {
              console.log(data);
              console.log(text);
              console.log(xhr);

              var messageAlert = 'alert-' + data.type;
              var messageText = data.message;
              var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
              
              if (messageAlert && messageText) {
                $('#contact-form').find('.messages').html(alertBox);
                $('#contact-form')[0].reset();
              }
            },
            error: function(data, text, error) {
              console.log(data);
              console.log(text);
              console.log(error);
              $('#contact-form')[0].reset();
            }
          });*/
        return false;
      });
    });
})(jQuery);
