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

      function validate(object, isCorrect) {
        if (isCorrect)
          object.parent().removeClass("has-error").addClass("valid");
        else
          object.parent().removeClass("valid").addClass("has-error");
      }

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
            validate($(this), true);
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

      $('#contact-fullname').on('input', function() {
        validate($(this), true);
      });

      $('#contact-email').on('input', function() {
        validate($(this), true);
      });

      $('#contact-product').on('change', function() {
        validate($(this), true);
      });

      $('#contact-phone').on('input', function() {
        validate($(this), true);
      });

      $('#datetimepicker_to').on('dp.change', function() {
        validate($(this), true);
      });

      $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        // validate 
        var isFullNameValid = $('#contact-fullname').val();
        validate($('#contact-fullname'), isFullNameValid);

        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isEmailValid = emailRegex.test($('#contact-email').val());
        validate($('#contact-email'), isEmailValid);

        var isProductValid = $('#contact-product').val() !== "Wybierz produkt";
        validate($('#contact-product'), isProductValid);

        validate($('#contact-phone'), $('#contact-phone').val());

        var isFromDateValid = $('#datetimepicker_from').data("DateTimePicker").date();
        validate($('#datetimepicker_from'), isFromDateValid);

        var isToDateValid = $('#datetimepicker_to').data("DateTimePicker").date();
        validate($('#datetimepicker_to'), isToDateValid);

        if (!isFullNameValid || !isEmailValid || !isProductValid || !isFromDateValid || !isToDateValid)
          return;
        var dataToSend = "Imię i nazwisko: " + isFullNameValid + '\n'
          + "Email: " + $('#contact-email').val()  + '\n'
          + "Product: " + $('#contact-product').val()  + '\n'
          + "Telefon: " + $('#contact-phone').val()  + '\n'
          + "Data od: " + isFromDateValid.format("MM/DD/YYYY") + " do: " + isToDateValid.format("MM/DD/YYYY") + '\n'
          + "Ilość sztuk: " + $('#contact-count').val()  + '\n'
          + "Tekst: " + $('#contact-question').val();

        // send 
        $.ajax({
            type: "POST",
            url: ".netlify/functions/sendMail",
            data: $(this).serialize(),
            success: function(data, text, xhr) {
              console.log(data);
              console.log(text);
              console.log(xhr);

              var alertBox = '<div id="jelly-alert" class="alert alert-success alert-dismissable alert-fixed"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Wysłano!</div>';
              $('#contact-form').find('.messages').html(alertBox);
              $("#jelly-alert").delay(3000).slideUp(200, function() {
                $(this).alert('close');
              });
              $('#contact-form')[0].reset();
            },
            error: function(data, text, error) {
              console.log(data);
              console.log(text);
              console.log(error);
              var alertBox = '<div id="jelly-alert" class="alert alert-warning alert-dismissable alert-fixed"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Oops, wystąpił błąd, przepraszamy.</div>';
              $('#messages').html(alertBox);
              $("#jelly-alert").delay(3000).slideUp(200, function() {
                $(this).alert('close');
              });
            }
        });
        return false;
      });
    });
})(jQuery);
