/*
Author:         Daniel Mallia
Date started:   November 26, 2023

Todo:

Wishlist:
- Ability to easily insert special patterns, such as glider guns
- (Much) Better sound generation
- Convert to TypeScript

Note to self: if not using a server, Safari and Chrome will deny loading of
p5.sound
*/


/* 
Need to use "on-demand global mode" so we can use functons like p5's random()
outside of setup/draw
See: https://github.com/processing/p5.js/wiki/p5.js-overview
*/
new p5();

// Define canvas height, width and minimum Game of Life cell size in pixels
const MIN_CELL_SIZE = 8;
const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 800;

/*
Implements Conway's Game of Life as a class dependent on a p5 canvas with
methods to reset the state with p5's random() (allowing seeding), displaying
the state on the canvas, alter an individual cell with a mouse click, and
retrieve the number of live cells for content generation, as with musical notes
here. The version implemented here is the common toroidal array approach, where
the grid wraps vertically and horizontally.
*/
class GameOfLife {
    constructor(grid_width, grid_height) {
        this.curr_state = [];
        this.num_rows = grid_height / MIN_CELL_SIZE;
        this.num_cols = grid_width / MIN_CELL_SIZE;
        this.reset(); // Initialize state
        // Trick to achieve a deep copy of curr_state, which is a 2D array
        // next_state is the update buffer
        this.next_state = JSON.parse(JSON.stringify(this.curr_state));
    }

    // Randomly resets the game state.
    reset() {
        this.curr_state = [];
        for(let i = 0; i < this.num_rows; i++) {
            let row = [];
            for(let j = 0; j < this.num_cols; j++){
                row.push(random() > 0.5);
            }
            this.curr_state.push(row);
        }
    }

    // Display game state
    display() {
        noStroke(); // Disable grid border lines
        let x = 0;
        let y = 0;
        let row, cell;
        for(row of this.curr_state) {
            for(cell of row){
                if(cell){ // Live cell - green
                    fill(color(0,200,0));
                } else { // Dead - black
                    fill(color(0,0,0));
                }
                square(x,y,MIN_CELL_SIZE);
                x += MIN_CELL_SIZE;
            }
            x=0;
            y += MIN_CELL_SIZE;
        }
    }

    /*
    Implements the "egocentric" update, where we count live cells in each 3x3
    neighborhood to determine the status for the center cell.
    See: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Variations
    */
    update() {
        let sum, r, c;
        // For each cell
        for(let i = 0; i < this.num_rows; i++) {
            for(let j = 0; j < this.num_cols; j++) {
                sum = 0;

                // Iterate over neighborhood
                for(let k = -1; k <= 1; k++) {
                    for(let m = -1; m <= 1; m++) {
                        r = i + k;
                        c = j + m;

                        // Wrap row if necessary
                        if(r < 0) {
                            r = this.num_rows - 1;
                        } else if (r == this.num_rows) {
                            r = 0;
                        }

                        // Wrap col if necessary
                        if(c < 0) {
                            c = this.num_cols - 1;
                        } else if (c == this.num_cols) {
                            c = 0;
                        }
                        sum += this.curr_state[r][c];
                    }
                }

                // "egocentric" update
                switch(sum) {
                    case 3:
                        this.next_state[i][j] = true;
                        break;
                    case 4:
                        this.next_state[i][j] = this.curr_state[i][j];
                        break;
                    default:
                        this.next_state[i][j] = false;
                }
            }
        }

        // Update current state from next state buffer
        this.curr_state = JSON.parse(JSON.stringify(this.next_state));
    }

    // Allow "flipping" the state of a cell based on a position given in grid
    // x,y coordinates.
    alter_cell(x, y) {
        let row = floor(y / MIN_CELL_SIZE);
        let col = floor(x / MIN_CELL_SIZE);
        this.curr_state[row][col] = this.curr_state[row][col] ? false : true;
    }

    clear() {
        for(let i = 0; i < this.num_rows; i++) {
            for(let j = 0; j < this.num_cols; j++){
                this.curr_state[i][j] = false;
            }
        }
    }

    // Retrieve the number of live cells
    get_num_live() {
        let sum = 0;
        for(let i = 0; i < this.num_rows; i++) {
            for(let j = 0; j < this.num_cols; j++){
                if(this.curr_state[i][j]){
                    sum += 1;
                }
            }
        }
        return sum;
    }
}

// Some needed global declarations - reserving p5 element setup to setup
// function
let canvas; // p5 canvas
let controls_div; // Div to hold controls below canvas
let sim = new GameOfLife(CANVAS_WIDTH, CANVAS_HEIGHT);
let start = 0; // Sketch start time
let simulate = true; // Run simulation
let give_instr = true; // Start by giving instructions
let stop_res_btn; // Simulation stop/start button
let play_sound = false; // Run sound (off by default)
let play_stop_sound_btn; // Sound start/stop button
let seed_field; // 
let polySynth; // p5.sound synthesizer.
let audio_started = false; // Audio initialized (see callback)
let last_note_time; // Time of last musical note played

// Callback for simulation stop/start button pressed
function stop_resume () {
    // Update text
    stop_res_btn.html((stop_res_btn.html() == "Stop") ? "Resume" : "Stop");
    simulate = simulate ? false : true;
    sim.display(); // Run display as last call in draw is to update
}

// Callback for clearing state
function clear_state() {
    sim.clear();
    sim.display();
}

// Callback for seed button pressed
function seed_reset () {
    randomSeed(seed_field.value());
    sim.reset()
    sim.display();
}

// Callback for mouse pressed to update cell
function mousePressed() {
    let x = mouseX;
    let y = mouseY;
    // Check within environment bounds
    if( x >= 0 && x <= CANVAS_WIDTH && y >= 0 && y <= CANVAS_HEIGHT) {
        sim.alter_cell(x, y);
        sim.display();
    }
}

// Callback for sound start/stop button
function play_stop_audio() {
    if(!audio_started) {
        // Per this issue, userStartAudio should be in a callback such as this
        // so as to meet the requirement of user input before playing sound
        // https://github.com/processing/p5.js-website/issues/396
        userStartAudio();
        audio_started = true;
        last_note_time = millis();
    }
    // Update text
    play_stop_sound_btn.html(
        (play_stop_sound_btn.html() == "Stop Sound") ? "Start Sound" : "Stop Sound")
    play_sound = play_sound ? false : true;

}

/*
Per the following, can define windowResized() for handling browser window
resizing; center_canvas should be a reusable function, for setup and any
resizing
https://github.com/processing/p5.js/wiki/Positioning-your-canvas
Returns the criteria used for canvas positioning - number of pixels from the
top and the left side of the screen, so other elements may be positioned
relative to the canvas.
*/
function center_canvas(){
    let top = Math.floor((windowHeight - CANVAS_HEIGHT) / 2);
    let left = Math.floor((windowWidth - CANVAS_WIDTH) / 2);
    canvas.position(left, top);
    return [left, top];
}

function center_controls(left, top){
    controls_div.position(left, top+CANVAS_HEIGHT)
}

function windowResized() {
    let [left, top] = center_canvas();
    center_controls(left, top);
}

// p5 setup function
function setup() {
    canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    let [left, top] = center_canvas();

    // Instantiate all controls - controls declared here do not need to be
    // accessed elsewhere
    stop_res_btn = createButton("Stop");
    stop_res_btn.mousePressed(stop_resume);

    let clear_btn = createButton("Clear"); // Button to wipe the state clear
    clear_btn.mousePressed(clear_state);

    seed_field = createInput(1, "number");

     // Button to apply seed and reset the state accordingly
    let seed_btn = createButton("Seed and Reset");
    seed_btn.mousePressed(seed_reset);

    play_stop_sound_btn = createButton("Start Sound");
    play_stop_sound_btn.mousePressed(play_stop_audio)

    // Create a Div to hold the controls
    controls_div = createDiv("");
    controls_div.size(CANVAS_WIDTH, 20);
    center_controls(left, top); // Position below canvas
    controls_div.style("display:flex"); // Use flex styling to display controls in a row
    controls_div.style("flex-direction:row");
    controls_div.style("justify-content:center");
    controls_div.style("align-items:center");
    stop_res_btn.parent(controls_div);
    clear_btn.parent(controls_div);
    seed_field.parent(controls_div);
    seed_btn.parent(controls_div);
    play_stop_sound_btn.parent(controls_div);

    polySynth = new p5.PolySynth();
    polySynth.setADSR(0.1, 0.5);
}

// Main p5 function
function draw() {
    // Only display note that you can change cells for ~3 seconds
    if(give_instr) {
        if(millis() > 3000) {
            give_instr = false;
        }
        fill(255);
        stroke(0);
        strokeWeight(4);
        textSize(32);
        text("Click anywhere to change a cell!", 0.25 * CANVAS_WIDTH,
            CANVAS_HEIGHT / 2);
    }

    if(simulate) {
        if(millis() - start > 100) { // Only update after every 100 milliseconds
            start = millis();
            sim.display();
            sim.update();
            // Only play a note after every 500 milliseconds
            if(audio_started && play_sound && 
                (millis() - last_note_time > 500)) {
                // Play a note based on number of live cells mod 500 (to avoid
                // very high notes, as would be the case immediately after
                // seeding and resetting the simulation)
                polySynth.play(sim.get_num_live() % 500, 0.5, 0, 1);
                last_note_time = millis();
            }
        }
    }
}



