function grader(scores){
    var sum = 0;
    for(var i=0;i<scores.length;i++){
        sum += scores[i];
    }
    return Math.round((sum/scores.length));
}
var scores = [6,6,5,5,5];
console.log(grader(scores));