function ScoreTracker(number){
    var players = [number];

    for(var i in players){
        i = 0;
    }

    this.score = function(value, id, correct){
        
        if(correct){
            players[id] += value;
        }
        
        else{
            if(players[id] <= value){
                players[id] -= value;
            }
            else players[id] = 0;
            
        }
            
        
    }
}