document
  .querySelector(".dark-mode-toggle")
  .addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("isDarkMode", isDarkMode);
    //change mobile theme
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute("content", isDarkMode ? "#1a1a2e" : "#e6e1e1");
  });


  
  
const start_screen = document.querySelector("#start-screen");
const game_screen = document.querySelector("#game-screen");
const pause_screen = document.querySelector("#pause-screen");
const result_screen = document.querySelector("#result-screen");

let cells = document.querySelectorAll(".main-grid-cell");

const name_input = document.querySelector("#input-name");

const number_input = document.querySelectorAll(".number");

const player_name = document.querySelector("#player-name");
const game_level = document.querySelector("#game-level");
const game_time = document.querySelector("#game-time");

const result_time = document.querySelector("#result-time");

let level_index = 0;
let level = CONSTANT.LEVEL[level_index];

let timmer = null;
let seconds = 0;
let pause = false;

let su = undefined;
let su_solved = undefined;

let selected_cell = -1;
 
const getGameInfo = () => JSON.parse(localStorage.getItem("game"));

  const initGameGrid = () =>{
    let index = 0;
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
      let row = Math.floor(i/CONSTANT.GRID_SIZE);
      let col = i % CONSTANT.GRID_SIZE;
      if (row === 2 || row === 5 ) cells[index].style.marginBottom = "10px";
      if (col === 2 || col === 5) cells[index].style.marginRight = "10px";
      index++;   
  }
};

const setPlayerName = (name) => localStorage.setItem("player_name", name);
const getPlayerName = () => localStorage.getItem("player_name");

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

const clearSudoku = () => {
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    cells[i].innerHTML = "";
    cells[i].classList.remove("filled");
    cells[i].classList.remove("selected");
  }
}

const initSudoku = () => {
  clearSudoku();
  resetBg();
  //generate sudoku
  su = generateSudoku(level);
  su_solved = [...su.question];

saveGameInfo();

// show sudoku in div 
for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE , 2 ); i++) {
  let row = Math.floor(i/CONSTANT.GRID_SIZE);
  let col = i % CONSTANT.GRID_SIZE;

  cells[i].setAttribute("data-value", su.question[row][col]);

 if (su.question[row][col] !== CONSTANT.UNASSIGNED) {
    cells[i].classList.add("filled");
    cells[i].innerHTML = su.question[row][col];
  }

  
}
  
  
}
const loadSudoku = () => {
  let game = getGameInfo();
  game_level.innerHTML = CONSTANT.LEVEL[game.level];

  su = game.su;

  su_solved =  su.solved;
  seconds = game.seconds;
 
  game_time.innerHTML = showTime(seconds);

  level_index = game.level;

  // show sudoku in div 
for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE , 2 ); i++) {
  let row = Math.floor(i/CONSTANT.GRID_SIZE);
  let col = i % CONSTANT.GRID_SIZE;

  cells[i].setAttribute("data-value", su_solved[row][col]);
  cells[i].innerHTML = su_solved[row][col] !== 0 ? su_solved[row][col] : ""; 

  if (su.question[row][col] !== CONSTANT.UNASSIGNED) {
    cells[i].classList.add("filled");
 
   }


}
}
const hoverbg = (index) => {
  let row =  Math.floor(index/CONSTANT.GRID_SIZE);
  let col = index % CONSTANT.GRID_SIZE;

  let box_start_row = row - row % 3;
  let box_start_row_col = col - col % 3;
  
  for (let i = 0 ; i < CONSTANT.BOX_SIZE ; i++) {
    for (let j = 0 ; j < CONSTANT.BOX_SIZE ; j++) {
      let cell = cells[ 9 * (box_start_row + i) +(box_start_row_col + j)];
            cell.classList.add("hover");
    }
  }

  let step = 9
  while ( index - step >= 0) {
    cells[index - step].classList.add("hover");
    step += 9;
  }
  step = 9;
  while (index + step < 81) {
    cells[index + step].classList.add("hover");
    step += 9;
  }
  step = 1;
  while (index - step >= 9*row) {
    cells[index - step].classList.add("hover");
    step += 1;
  }
  step = 1;
  while (index + step < 9*row + 9) {
    cells[index + step].classList.add("hover");
    step += 1;
  }
}

const resetBg = () => cells.forEach(e => e.classList.remove("hover"));


const checkError = (value) => {
  const addErr = (cell) => {
    if (parseInt(cell.getAttribute("data-value")) === value) {
      cell.classList.add("err");
      cell.classList.add('cell-err');
      setTimeout(() => {
        cell.classList.remove("cell-err");
      },500); 
    }
  }
  let index = selected_cell;


  let row = Math.floor(index / CONSTANT.GRID_SIZE);
  let col = index % CONSTANT.GRID_SIZE;

  let box_start_row = row - (row % 3);
  let box_start_row_col = col - (col % 3);

  for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
    for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
      let cell = cells[9 * (box_start_row + i) + (box_start_row_col + j)];
      if (!cell.classList.contains("selected")) addErr(cell);
    }
  }

  let step = 9;
  while (index - step >= 0) {
    addErr(cells[index - step]);
    step += 9;
  }
  step = 9;
  while (index + step < 81) {
    addErr(cells[index + step]);
    step += 9;
  }
  step = 1;
  while (index - step >= 9 * row) {
    addErr(cells[index - step]);
    step += 1;
  }
  step = 1;
  while (index + step < 9 * row + 9) {
    addErr(cells[index + step]);
    step += 1;
  }
}
const removeErr = () => {
cells.forEach(e => e.classList.remove("err"));
}
const saveGameInfo = () => {
  let game = {
    level: level_index,
    seconds: seconds,
    su : {
      original : su.original,
      question : su.question,
      solved : su_solved
    }
  }
  localStorage.setItem("game" , JSON.stringify(game));
}
const removeGameInfo = () => {
  localStorage.removeItem("game");
  document.querySelector("#btn-continue").style.display = "none";
}
const isGameWin = () => sudokuCheck(su_solved);
const showResult = () => {
  clearInterval(timmer);
  result_screen.classList.add("active");
  result_time.innerHTML = showTime(seconds);
}

const  initNumberInputEvents = () => {
  number_input.forEach((e , index) => {
    e.addEventListener("click", () => {
      if (!cells[selected_cell].classList.contains("filled")) {
        cells[selected_cell].innerHTML = index + 1;
        cells[selected_cell].setAttribute("data-value", index + 1);
        // add to answer
        let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
        let col = selected_cell % CONSTANT.GRID_SIZE;
        su_solved[row][col] = index + 1;
        // save game
        saveGameInfo();
        //-----------
        removeErr();
        checkError(index + 1);
        cells[selected_cell].classList.add("zoom-in");
        setTimeout(() => {
          cells[selected_cell].classList.remove("zoom-in"); 
        }, 500);
        // check game win
        if (isGameWin()) {
          removeGameInfo();
          showResult();
        }
        
      }
    })
  })
  
}

const initCellsEvents = () => {
  cells.forEach((e , index ) => {
      e.addEventListener("click", () => {
       if (!e.classList.contains("filled")) {
        cells.forEach(e => e.classList.remove("selected"));

        selected_cell = index ;
        e.classList.remove("err");
        e.classList.add("selected");
        resetBg();
        hoverbg(index);
       }
      });

  })
}
  


const startGame = () => {
  start_screen.classList.remove("active");
  game_screen.classList.add("active");

  player_name.innerHTML = name_input.value.trim();
  setPlayerName(name_input.value.trim());

  game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];

  seconds = 0;
  showTime(seconds);


  timmer = setInterval(() => {
    if (!pause){
      seconds = seconds + 1;
      
        game_time.innerHTML = showTime(seconds);
      
    }
    
  }, 1000);

}

const returnToStartScreen = () => {
  clearInterval(timmer);
  pause = false;
  seconds = 0;
  start_screen.classList.add("active");
  game_screen.classList.remove("active");
  pause_screen.classList.remove("active");
  result_screen.classList.remove("active");
}

//add button event
 document.querySelector("#btn-level").addEventListener("click", (e) => {
   level_index =
     level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
   level = CONSTANT.LEVEL[level_index];
   e.target.innerText = CONSTANT.LEVEL_NAME[level_index];
 });
 document.querySelector("#btn-start").addEventListener("click", () => {
   if (name_input.value.trim().length > 0) {
      initSudoku();
      startGame();
   } else {
     name_input.classList.add("error");
     setTimeout(() => {
       name_input.classList.remove("error");
       name_input.focus();
     }, 500);
   }
 });

  document.querySelector("#btn-continue").addEventListener("click", () => {
    if (name_input.value.trim().length > 0) {
      loadSudoku();
      startGame();
    } else {
      name_input.classList.add("error");
      setTimeout(() => {
        name_input.classList.remove("error");
        name_input.focus();
      }, 500);
    }
  });
 document.querySelector("#btn-pause").addEventListener("click", () => {
   pause_screen.classList.add("active");
   pause = true;
 })

  document.querySelector("#btn-resume").addEventListener("click", () => {
    pause_screen.classList.remove("active");
    pause = false;
  });

 document.querySelector("#btn-new-game").addEventListener("click", () => {   
      returnToStartScreen();
  });
   document.querySelector("#btn-new-game-2").addEventListener("click", () => {
     returnToStartScreen();
   });
  document.querySelector("#btn-delete").addEventListener("click", () => {
     cells[selected_cell].innerHTML = "";
     cells[selected_cell].setAttribute("data-value", 0);

     let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
     let col = selected_cell % CONSTANT.GRID_SIZE;
     su_solved[row][col] = 0;
     removeErr();

  })

const init = () => {
  const isDarkMode = JSON.parse(localStorage.getItem("isDarkMode")); // Corrected variable name
  document.body.classList.add(isDarkMode ? "dark-mode" : "light-mode"); // Corrected variable name
  document.querySelector("meta[name='theme-color']").setAttribute("content", isDarkMode ? "#1a1a2e" : "#e6e1e1");

  const game = getGameInfo();

  document.querySelector("#btn-continue").style.display = game ? "grid" : "none";


  initGameGrid();
  initCellsEvents(); 
  initNumberInputEvents();


  if (getPlayerName()) {
    name_input.value = getPlayerName();
    
  }else {
    name_input.focus();
  }
};

init();
