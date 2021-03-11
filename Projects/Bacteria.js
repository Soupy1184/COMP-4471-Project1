class Bacteria {
    

    constructor(colour, minAngle, maxAngle, growth, rgba){
        this.colour = colour; //colour of bacteria
        this.minAngle = minAngle; //
        this.maxAngle = maxAngle;
        this.growth = growth; //number of bacteria in the object
        this.rgba = rgba;
        this.positions = [];
        this.originCoords = [];
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

}