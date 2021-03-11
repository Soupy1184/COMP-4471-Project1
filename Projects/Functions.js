//enumerates the colours
function EnumerateBacteria(e){
    e++;
      if(e > 3){
        e = 0;
    }
    return e;
}

//calculates euclid distance
function EuclideanDistance(a, b){
    distance = 0;
    distance = Math.pow((a[0] - b[0]), 2) + Math.pow((a[1] - b[1]), 2);
        
    return Math.sqrt(distance);
  }