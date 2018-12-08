import { PuckTracking } from "./tracking/puck-tracking";
import { Coordinate } from "./tracking/coordinate";

export class HockeyOfficial {
    private tracking: PuckTracking = new PuckTracking();
    constructor(){}
        
    public initialize(){
        console.log("initializing hockey official");
        if (this.tracking) {
            this.tracking.on('found', (coord) => this.puckFound(coord));
            this.tracking.on('lost', (coord) => this.puckLost(coord));
            this.tracking.on('moved', (coord) => this.puckLocChanged(coord));
            
            this.tracking.initialize();   
        }
    }

    public shutdown() {
        console.log("Shutting down");  
        if (this.tracking) {
            this.tracking.shutdown();
        }      
    }

    public puckFound(coord: Coordinate) :void {
        console.log(`Puck is found at ${coord.x},${coord.y}`);
    }

    public puckLost(coord: Coordinate) :void {
        console.log(`Puck lost at ${coord.x},${coord.y}`);
    }

    public puckLocChanged(coord: Coordinate): void {
        console.log(`Puck moved to ${coord.x},${coord.y}`);
    }
}
