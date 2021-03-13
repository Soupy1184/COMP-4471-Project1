class Bacteria {
    

    constructor(isActive, colour, minAngle, maxAngle, rgba, radius){
        this.isActive = isActive;
        this.colour = colour; //colour of bacteria
        this.minAngle = minAngle; 
        this.maxAngle = maxAngle;
        this.rgba = rgba;
        this.growthVerts = []; //stores side vertices
        this.edges = []; //edge circles
        this.radius = radius;
        this.originCoords = []; //store only the origin coords for each circle in positions array
        console.log("bacteria radius: " + this.radius + ", " + radius);
    }

    kill(target){
        //take out the target value
        var array1 = this.originCoords.slice(0, target);
        var array2 = this.originCoords.slice(target, this.originCoords.length);
        array2.shift();
        array1.concat(array2);

        //do the same for circles


        //

        //check to see if the bacteria growth is 0
        if(this.originCoords == 0){
            this.isActive = false;
        }
    }

    addFirstPosition() {
        //minAngle == maxAngle
        //store first edge circles
        this.edges[0] = StoreCircle((0.5*Math.cos(this.minAngle)) + 0.0, (0.5*Math.sin(this.minAngle)) + 0.0, this.radius, 12);
        this.edges[1] = StoreCircle((0.5*Math.cos(this.maxAngle)) + 0.0, (0.5*Math.sin(this.maxAngle)) + 0.0, this.radius, 12);
        
        //store first growth verts
        this.growthVerts.push((0.5 - this.radius) * Math.cos(this.minAngle));
        this.growthVerts.push((0.5 - this.radius) * Math.sin(this.minAngle));
        this.growthVerts.push((0.5 + this.radius) * Math.cos(this.minAngle));
        this.growthVerts.push((0.5 + this.radius) * Math.sin(this.minAngle));
    }

    growthFunction(elapsed) {
        this.minAngle -= 0.0001 * elapsed;
        this.maxAngle += 0.0001 * elapsed;

        /*
        //grow min angle
        this.positions.push(StoreCircle((0.5*Math.cos(this.minAngle)) + 0.0, (0.5*Math.sin(this.minAngle)) + 0.0, 0.05, 12));
        //this.originCoords.push([(0.5*Math.cos(this.minAngle)) + 0.0, (0.5*Math.sin(this.minAngle)) + 0.0, 0.05, 12]);
        this.growth++;

        //grow max angle
        this.positions.push(StoreCircle((0.5*Math.cos(this.maxAngle)) + 0.0, (0.5*Math.sin(this.maxAngle)) + 0.0, 0.05, 12));
        //this.originCoords.push([(0.5*Math.cos(this.maxAngle)) + 0.0, (0.5*Math.sin(this.maxAngle)) + 0.0, 0.05, 12]);
        this.growth++;*/
        if (this.isActive){
            //move edge circles
            this.edges[0] = StoreCircle((0.5*Math.cos(this.minAngle)) + 0.0, (0.5*Math.sin(this.minAngle)) + 0.0, this.radius, 12);
            this.edges[1] = StoreCircle((0.5*Math.cos(this.maxAngle)) + 0.0, (0.5*Math.sin(this.maxAngle)) + 0.0, this.radius, 12);

            //add min growth verts
            this.growthVerts.push((0.5 - this.radius) * Math.cos(this.minAngle));
            this.growthVerts.push((0.5 - this.radius) * Math.sin(this.minAngle));
            this.growthVerts.push((0.5 + this.radius) * Math.cos(this.minAngle));
            this.growthVerts.push((0.5 + this.radius) * Math.sin(this.minAngle));

            //add max growth verts
            this.growthVerts.unshift((0.5 + this.radius) * Math.sin(this.maxAngle));
            this.growthVerts.unshift((0.5 + this.radius) * Math.cos(this.maxAngle));
            this.growthVerts.unshift((0.5 - this.radius) * Math.sin(this.maxAngle));
            this.growthVerts.unshift((0.5 - this.radius) * Math.cos(this.maxAngle));
        }
        
        
        /*
        this.growthVerts.push((0.5 - radius) * Math.sin(this.maxAngle));
        this.growthVerts.push((0.5 + radius) * Math.cos(this.maxAngle));
        this.growthVerts.push((0.5 + radius) * Math.sin(this.maxAngle));*/
        
    }

    // consumeBacteria(bacteriaPositions, originCoords, newMaxAngle, newMinAngle){
    //     this.positions.concat(bacteriaPositions);
    //     this.originCoords.concat(originCoords);
    //     this.maxAngle = newMaxAngle;
    //     this.minAngle = newMinAngle;
    // }

    getConsumed(){
        this.isActive = false;
        this.minAngle = 0;
        this.maxAngle = 0;
        this.growthVerts = [];
        //this.originCoords = [];
        this.edges = [];
    }

}