function game() {

    var data, score, key, answer, buzz, value, pc = 1;
    var one, two, three; 

    this.start = function(){

        $("button.start").click(function() { 
           getCategories();

           $("#gameplay>div").fadeIn();
        }); 

        pc = $("#pc:selected").val();

        score = new ScoreTracker(pc);
    }  

    function getCategories(){

                $.ajax({
                    url: "http://jservice.io/api/categories",
                    dataType: "json",
                    data: { count: 6 }
                })
                .done(function (response) {
                    displayCategories(response)
                    data = response;
                });
            }
        
    function displayCategories(response){
        
        for (let i= 0; i <= 5; i++) {
                
            if (response) {
                var $categories = $("#categories .category").clone();
                $(".title", $categories).attr("data-id", response[i].id);
                $("#main>#game").append($categories);
                $("[data-id=" + response[i].id + "]").text(response[i].title);               
            }
        }
        $(".category .value").click(function(){
            buzz = 0;
            var $value = $(this).data("value");
            var $id = $(this).siblings(".title").data("id");
            var answer = getQuestion($value, $id);
            $(this).addClass("question");
            // $("body").keydown(function(e){
            //     key = e;
            //     getAnswer();
            // });
            
            buzzerOn();
            
        });
    }

    function getQuestion($value, $id){
        var $categoryID;
        $.ajax({
            url: "http://jservice.io/api/clues",
            data: {category: $id, value: $value},
            dataType: "json"
        })
        .done(function (data) {
            $categoryID = $("[data-id=" + data[0].category_id +"]");
            $categoryID.siblings("[data-value=" +$value+ "]").text(data[0].question);
            answer = data[0].answer;
            value = data[0].value;
        });
        
        // $(".value question").keydown(function(e){
        //     getAnswer(e, $(this), $value, object.answer)
        // });
    }

    function getAnswer(){
        var guess;
        var array = [pc]
        //buzzerOff();
        $("body").off("keydown");
        

        switch (key.which) {
            case 90:
                if(one)
                    $("#gameplay .player1").show().keypress(function(e){
                        if(e.which==13){
                        guess = $(this).val();
                        array[0] = "i";
                        if(guess == answer){
                            score.score(value, 0, true);
                            $(".value.question").empty().removeClass("question");
                            $(this).fadeOut();
                            $(this).val("");
                        }
                        else {
                            score.score(value, 0, false);
                            $(this).fadeOut();
                            $(this).val("");
                            one = false;
                            buzzerOn();
                        }
                        }        
                    });
                
                break;

            case 66:
                if(two){
                    $("#gameplay .player2").show().keypress(function(e){
                        if(e.which==13){
                            guess = $(this).val();
                            array[1] = "i";
                            if(guess == answer){
                                score.score(value, 1, true);
                                $(".value.question").empty().removeClass("question");
                                $(this).fadeOut();
                                $(this).val("");
                                newClue();
                            }
                            else {
                                score.score(value, 1, false);
                                $(this).hide();
                                $(this).val("");
                                two = false;
                                buzzerOn();
                            }
                        }
                        
                    });
                }
                
                break;
            
            case 191:
                if(three){
                    $("#gameplay .player3").show().keypress(function(e){
                            if(e.which==13){
                                guess = $(this).val();
                                array[2] = "i";
                                if(guess == answer){
                                    score.score(value, 2);
                                    $(".value.question").empty().removeClass("question");
                                    $(this).fadeOut();
                                    $(this).val("");
                                    newClue();
                                }
                                else {
                                    score.score(value, 2, false);
                                    $(this).fadeOut();
                                    $(this).val("");
                                    three = false;
                                    buzzerOn();
                                }
                            }
                        });
                    break;
                }
        
            default:
                break;
        }
        //$(".value.question").empty().removeClass("question");
    }

    function newClue(){
        one = true;
        two = true;
        three = true;
    }

    function buzzerOn(){
        newClue();
        $("body").keydown(function(e){
            if(e.which == 90){
                key = e;
                getAnswer();                
            }
            else if( e.which == 66){
                key = e;
               getAnswer();
            }
            else if(e.which == 191 ){
                key = e;
                getAnswer();
            }
            else{
                key = e;
                getAnswer();
            }
        });
        //return who;
    }

    function buzzerOff(){
        $(document).off("keydown");
    }
    
}

$(document).ready(function () {
    window.app = new game();
    window.app.start();
});