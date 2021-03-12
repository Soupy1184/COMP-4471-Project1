class Bacteria {
    

    constructor(isActive, colour, minAngle, maxAngle, growth, rgba){
        this.isActive = isActive;
        this.colour = colour; //colour of bacteria
        this.minAngle = minAngle; 
        this.maxAngle = maxAngle;
        this.growth = growth; //number of bacteria in the object
        this.rgba = rgba;
        this.positions = []; //stores vertices for circles
        this.originCoords = []; //store only the origin coords for each circle in positions array
    }

    addFirstPosition(firstPosition) {
        this.positions.push(firstPosition);
        this.originCoords.push([firstPosition[0], firstPosition[1]]);
    }

    growthFunction(){
        this.minAngle -= 0.01;
        this.maxAngle += 0.01;

        //grow min angle
        this.positions.push(StoreCircle((0.5*Math.cos(this.minAngle)) + 0.0, (0.5*Math.sin(this.minAngle)) + 0.0, 0.05, 64));
        this.originCoords.push([(0.5*Math.cos(this.minAngle)) + 0.0, (0.5*Math.sin(this.minAngle)) + 0.0, 0.05, 64]);
        this.growth++;

        //grow max angle
        this.positions.push(StoreCircle((0.5*Math.cos(this.maxAngle)) + 0.0, (0.5*Math.sin(this.maxAngle)) + 0.0, 0.05, 64));
        this.originCoords.push([(0.5*Math.cos(this.maxAngle)) + 0.0, (0.5*Math.sin(this.maxAngle)) + 0.0, 0.05, 64]);
        this.growth++;
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
        this.growth = 0;
        this.positions = [];
        this.originCoords = [];
    }

}