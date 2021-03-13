class Bacteria {
    

    constructor(angle,  rgba, radius){
        this.minAngle = angle; 
        this.maxAngle = angle;
        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        this.a = rgba[3];
        this.growthVerts = []; //stores side vertices
        this.edges = []; //edge circles
        this.radius = radius;
        this.originCoords = []; //store only the origin coords for each circle in positions array
    }

    kill(target){
        //take out the target value
        var array1 = this.originCoords.slice(0, target);
        var array2 = this.originCoords.slice(target, this.originCoords.length);
        array2.shift();
        this.originCoords = array1.concat(array2);

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

    getAngle() {
        return "" + this.minAngle + " and <br>" + this.maxAngle;
    }

    getSize() {
        if(this.minAngle > this.maxAngle) {
            return this.maxAngle - (this.minAngle - (2*Math.PI));
        } else {
            return this.maxAngle - this.minAngle;
        }
    }

    //get whether an angle 
    isWithin(angleNum) {
        if(angleNum >= this.minAngle && angleNum <= this.maxAngle) {
            return true;
        } else if(this.maxAngle < this.minAngle && (angleNum >= this.minAngle || angleNum <= this.maxAngle)) {
            return true;
        } else {
            return false;
        }
    }

    growthFunction(elapsed) {
        this.minAngle -= 0.1 * elapsed;
        this.maxAngle += 0.1 * elapsed;

        if(this.minAngle < 0) {
            this.minAngle += 2 * Math.PI;
        }
        if(this.maxAngle > 2 * Math.PI) {
            this.maxAngle -= 2 * Math.PI;
        }

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