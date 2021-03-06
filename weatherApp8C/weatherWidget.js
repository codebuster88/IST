function WeatherWidget ($widget)
{
    //var metadata, forecast;
    this.update = function(){
        $(".results", $widget).hide();
        $(".loading", $widget).show();
        getCurrentWeather();
    };

    function getWeatherReport(lat, lon, callback){
        var coords = lat + "," + lon;
        
        $.when(
        $.ajax({
            url: "https://api.weather.gov/points/" + coords + "/forecast",
            dataType : "json"
        }),
        $.ajax({
            url: "https://api.weather.gov/points/" + coords,
            dataType : "json"
        }))
        .done(function(data1, data2){
            //populateWeather(data);
            callback(data1, data2);
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            showError(errorThrown);
        });
        
    }

    function getCurrentWeather(){
        var lat = $("#latitude").val();
        var lon = $("#longitude").val();
        if((lat && lon) != ""){
            $("#weather-widget").fadeIn();
            getWeatherReport(lat, lon, function(forecast, metadata){
                // if(forecast && metadata){}
                    populateWeather(forecast, metadata);
            });
        }
        else {
            showError("Location not found");
        }
        
            //WeatherWidget.update(lat, lon);
        
    }

    function showError(showError){
        $(".errorGet").toggle();
        $(".errorGet>span").text(showError);
    }

    function populateWeather(forecast, metadata){
        if(forecast && metadata){
            $(".results header img", $widget)
                .attr("src", forecast["0"].properties.periods["0"].icon);
            $(".location>span", $widget)
                .text(metadata["0"].properties.relativeLocation.properties.city + ", " + metadata["0"].properties.relativeLocation.properties.state);

            $(".conditions>span").each(function(i, e){
                var $span = $(this);
                var field = $span.data("field");
                $(this).text(forecast["0"].properties.periods["0"][field]);
            });

            $(".loading", $widget).fadeOut(function (){
                $(".results", $widget).fadeIn();
            });
        }
    }

    this.getLocation = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position){
                    $("#latitude").val(position.coords.latitude);
                    $("#longitude").val(position.coords.longitude);
                },
                function(error){
                    $(".errorLocation").show();
                    $("#controls .errorLocation span").text(error.message)
                    .slideDown();
                });
        }
    }

}