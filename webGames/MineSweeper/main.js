let main_grid = document.querySelector('.mainGrid');

let generate_button =      document.querySelector('.generateButton');
let grid_column_picker =   document.querySelector("#columnInput");
let grid_row_picker =      document.querySelector("#rowInput");
let mines_amount_picker =  document.querySelector("#mineInput");
let timer_label =          document.querySelector("#timerLabel")
var mine_counter_label =   document.querySelector("#mineCounterLabel")

var alphabet              = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S"];
var string_numbers        = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight"];
var grid_array            = [];
var grid_mines_array      = [];
var grid_free_tiles_array = [];
var grid_numbers_array    = [];
var grid_flagged_tiles    = [];
var opened_spaces         = [];

var first_click = false;

var max_columns = 9;
var max_rows = 9;
var max_mines = 10;
var current_mines;

var timer_interval_id;
var current_time = 0, minutes, seconds;

window.addEventListener("DOMContentLoaded", ready());

function ready(){
    generate_button.addEventListener("click", function(){
        /*var column_input = grid_column_picker.value;
        var row_input = grid_row_picker.value;*/
        gen_grid(max_columns, max_rows);
    } );

    main_grid.addEventListener("click", function(event){
        on_grid_clicked(event);
    });

    main_grid.addEventListener("contextmenu", function(event){
        on_grid_right_clicked(event);
    })
    gen_grid(max_columns, max_rows)
}

function gen_grid(columns, rows){
    first_click = false;
    clear_timer();

    max_columns = columns;
    max_rows = rows;
    clear_grid();

    main_grid.style.gridTemplateColumns = `repeat(${columns},${100 / columns}%)`;
    main_grid.style.gridTemplateRows    = `repeat(${rows},${100 / rows}%)`;

    /* Populate the grid with tiles */
    for(let column_idx = 1; column_idx <= columns; column_idx++){
        for(let row_idx = 1; row_idx <= rows; row_idx++){
            var tile = document.createElement('div');
            var tile_idx = alphabet[column_idx-1] + row_idx;
            tile.classList.add('tile');
            /*tile.textContent = tile_idx;*/
            tile.id = tile_idx;
            main_grid.appendChild(tile);

            grid_array.push(tile_idx);
        }
    }

    grid_array.forEach((tile, idx) => {
        var tile_instance = document.getElementById(tile)
        var tile_block_instance = document.createElement("div");
        tile_block_instance.classList.add("tile_block");

        tile_instance.appendChild(tile_block_instance);
    });

    grid_free_tiles_array = _.clone(grid_array);


    //var mines_amount = mines_amount_picker.value;
    gen_mines(max_mines);

    //We generate the numbers after the first click
    //gen_numbers();
}

function gen_mines(amount){
    /* Generating the random mines */
    grid_mines_array = _.sampleSize(grid_array, amount);

    grid_mines_array.forEach((tile, idx) => {
        var mine_tile = document.getElementById(tile);
        mine_tile.classList.add('mine');

        var mine_icon = document.createElement("img");
        mine_icon.src = "Assets/mine.gif";
        mine_icon.classList.add("mine_icon");
        mine_tile.appendChild(mine_icon);

        _.pull(grid_free_tiles_array, tile);
    });
    current_mines = max_mines;
}

function gen_numbers(){
    grid_free_tiles_array.forEach((free_tile, idx) => {
        var nearby_mines_count = 0;
        var nearby_tiles = scan(free_tile);

        /* Count every mine nearby */
        nearby_tiles.forEach((near_tile, idx) => {
            if(_.includes(grid_mines_array, near_tile)){
                nearby_mines_count++;
            }
        });

        if(nearby_mines_count > 0){
            var tile_instance = document.getElementById(free_tile);
            tile_instance.classList.add("number");
            grid_numbers_array.push(free_tile);
            
            var number_instance = document.createElement("p");
            number_instance.textContent = nearby_mines_count;
            number_instance.classList.add(string_numbers[nearby_mines_count]);
            tile_instance.appendChild(number_instance);
        }
    });
}

function scan(tile_id){
    /* We separate the column and the row of the ID */
    /* IMPORTANT! The tile row MUST be sliced to not be mistaken by the first digit of the index IE:10 = 1*/ 
    var tile_column = tile_id.charAt(0);
    var tile_row = parseInt(tile_id.slice(1));
    /* alert(tile_column + tile_row); */
    /* Output: A1 */
    var tile_column_idx = _.indexOf(alphabet, tile_column);
    var alphabet_length = alphabet.length;

    var nearby_tiles = []
    const directions = [
        [-1, -1],  //Top left
        [-1,  0], //Top
        [-1,  1], //Top Right
        [ 0, -1], //Left
        [ 0,  1], //Right
        [ 1, -1], //Down left
        [ 1,  0], //Down
        [ 1,  1] //Down right
    ]

    /*This gets the index of the column in the alphabet */
    /*To sum the string as numbers, i use unary plus operator (+stringNumber + ...) */
    directions.forEach((direction, idx) => {
        const new_column_idx =  tile_column_idx +  direction[0];
        const new_row_idx    = +tile_row        + +direction[1];

        const is_valid_col = new_column_idx >= 0 && new_column_idx <= alphabet_length;
        const is_valid_row = new_row_idx >= 1    && new_row_idx <= max_rows;

        if(is_valid_col && is_valid_row){
            const near_tile = alphabet[new_column_idx] + new_row_idx;
            nearby_tiles.push(near_tile);
        }
    })
    return nearby_tiles;
}

function on_grid_clicked(event){
    var target = event.target;

    if(target.classList.contains("tile_block")){
        if(!first_click){
            first_click = true;
            start_timer(timer_label);
            safe_first_click(target);
            return;
        }
        open_tile_block(target);
    }
    if(target.classList.contains("number")){
        chord_number(target);
    }
}

function safe_first_click(block){
    var block_tile = block.parentElement;
    var near_tiles = scan(block_tile.id);
    var near_mines = [];

    near_tiles.push(block_tile.id);
    near_tiles.forEach((tile, idx) => {
        if(_.includes(grid_mines_array, tile)){
            near_mines.push(tile);
        }
    });
    near_mines.forEach((tile, idx) => {
        teleport_mine(tile, near_tiles);
    });

    gen_numbers();
    open_tile_block(block);
}

function teleport_mine(tile_mine_id, safe_spaces = []){
    var tile_instance = document.getElementById(tile_mine_id);
    _.pull(grid_mines_array, tile_mine_id)
    grid_free_tiles_array.push(tile_mine_id);
    tile_instance.classList.remove("mine");

    var mine_icon = tile_instance.querySelector(".mine_icon");
    tile_instance.removeChild(mine_icon);

    var grid_free_tiles_array_safe = _.difference(grid_free_tiles_array, safe_spaces);
    var new_random_tile = _.sample(grid_free_tiles_array_safe);
    var random_tile_instance = document.getElementById(new_random_tile);

    random_tile_instance.classList.add('mine');
    var new_mine_icon = document.createElement("img");
    new_mine_icon.src = "Assets/mine.gif";
    random_tile_instance.appendChild(new_mine_icon);
    grid_mines_array.push(random_tile_instance.id);
    _.pull(grid_free_tiles_array, random_tile_instance.id);
}

function start_timer(timerLabel){
    current_time = 0, minutes, seconds;
    timer_interval_id = setInterval(function(){
        minutes = parseInt(current_time / 60, 10);
        seconds = parseInt(current_time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerLabel.textContent = minutes + ":" + seconds;

        current_time++;
    }, 1000);
}

function stop_timer(){
    clearInterval(timer_interval_id);
}

function clear_timer(){
    stop_timer();
    current_time = 0, minutes, seconds;
    timer_label.textContent = "0:00"
}

function chord_number(tile){
    var near_tiles = scan(tile.id);
    var tile_number = tile.querySelector("p").textContent;

    var flag_count = 0;
    near_tiles.forEach((near_tile, idx) => {
        if(_.includes(grid_flagged_tiles, near_tile)){
            flag_count++;
        }
    });

    near_tiles = _.difference(near_tiles, grid_flagged_tiles);
    if(flag_count >= tile_number){
        near_tiles.forEach((near_tile, idx)=>{
            var near_tile_instance = document.getElementById(near_tile);
            if(near_tile_instance == null){ return; }
            var tile_block = near_tile_instance.querySelector(".tile_block");
            open_tile_block(tile_block);
        })
    }
}

function on_grid_right_clicked(event){
    event.preventDefault();
    var target = event.target;

    if(target.classList.contains("tile_block")){
        toggle_tile_block_flag(target);  
    }
    update_mine_counter();
}

function toggle_tile_block_flag(target, always_flag = false){
    var block_tile = target.parentElement;
    var flag = target.querySelector(".flag");
    if(flag){
        /* If the parameter to always flag is set, for example when winning, it will skip the removal of flag*/
        if(always_flag){ return; }

        /*Remove flag*/
        if(target.classList.contains("flagged")){
            target.classList.remove("flagged");
            _.pull(grid_flagged_tiles, block_tile.id);
        }
        /*Reshow flag*/
        else{
            target.classList.add("flagged");
            grid_flagged_tiles.push(block_tile.id);
        }
    }
    else{
        /* If it doesnt have a flag, it means it has never been flagged */
        target.classList.add("flagged");
        const flag_instance = document.createElement("img");
        flag_instance.src = "Assets/flagDrawn.png";
        flag_instance.classList.add("flag");
        target.appendChild(flag_instance);

        grid_flagged_tiles.push(block_tile.id);
    }
}

function open_tile_block(block_instance){

    var tile = block_instance.parentElement;
    if(_.includes(opened_spaces, tile.id)){ return; }

    block_instance.classList.add("clear");
    opened_spaces.push(tile.id);

    /* The tile underneath had a number */
    if(tile.classList.contains("number")){
    }
    /* The tile underneath had a mine*/
    else if(tile.classList.contains("mine")){
        game_over();
    }
    /* The tile was free */ 
    else{
        open_free_spaces(tile.id);
    }
    verify_win_state()
}

function update_mine_counter(){
    var current_flags = grid_flagged_tiles.length;
    var mine_counter = max_mines - current_flags;
    mine_counter_label.textContent = mine_counter;
}

function open_free_spaces(tile){
    /*if(_.includes(opened_free_spaces, tile)){
        return;
    }*/
    var nearby_tiles = scan(tile);

    /*Exclude any mines from the near tiles */
    nearby_tiles = _.difference(nearby_tiles, grid_mines_array);
    /*Exclude any already opened mines from the free spaces*/
    nearby_tiles = _.difference(nearby_tiles, opened_spaces);

    /* Every tile working in this iteration wont be a mine or an already open space */
    nearby_tiles.forEach((near_tile, idx) => {
        setTimeout(() => {
            var tile_instance = document.getElementById(near_tile);
            if(!tile_instance) { return };
            var block_tile = tile_instance.querySelector(".tile_block")

            if(_.includes(opened_spaces, near_tile)){
                return;
            }
            /*opened_free_spaces.push(near_tile);*/
            open_tile_block(block_tile);
        }, idx*50);
        
    });
}

function verify_win_state(){
    if(_.isEqual(_.sortBy(opened_spaces), _.sortBy(grid_free_tiles_array))){
        alert("Ganaste! Yupi!");
        reveal_grid(true);
        stop_timer();
    }
}

function game_over(){
    alert("Game over!");
    reveal_grid()
    stop_timer();
}

function reveal_grid(flag_bool = false){
    grid_free_tiles_array.forEach((tile, idx) => {
        var tile_instance = document.getElementById(tile);
        var tile_block_instance = tile_instance.querySelector(".tile_block");
        if(tile_block_instance){
            tile_block_instance.classList.add("clear");
        }
    })

    grid_mines_array.forEach((tile, idx) => {
        var tile_instance = document.getElementById(tile);
        var tile_block_instance = tile_instance.querySelector(".tile_block");
        if(flag_bool){
            toggle_tile_block_flag(tile_block_instance, true);
        }
        else{
            tile_block_instance.classList.add("clear");
        }
    })
}

function clear_grid(){
    grid_array = [];
    grid_mines_array = [];
    grid_free_tiles_array = [];
    grid_numbers_array = []
    opened_spaces = [];
    grid_flagged_tiles = [];
    main_grid.innerHTML = null;

}

