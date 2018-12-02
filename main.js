var input = [];
var output = [];
var model = [];

var x_rep = 4;
var y_rep = 5;
var inputChanged = false;
var clickState = 0;

setBoardDimensions(x_rep, y_rep);

// Document Setup
inputBoard = document.getElementById('input-board');
outputBoard = document.getElementById('output-board');

populateCells();

document.documentElement.addEventListener('mouseup', () => {
  clickState = 0;
});

document.getElementById('cols').addEventListener('input', (e) => {
  x_rep = e.target.value;
  setBoardDimensions(x_rep, y_rep);
  populateCells();
});
document.getElementById('rows').addEventListener('input', (e) => {
  y_rep = e.target.value;
  setBoardDimensions(x_rep, y_rep);
  populateCells();
});

document.getElementById('async1').addEventListener('click', () => {
  transform(1, async);
});
document.getElementById('async10').addEventListener('click', () => {
  transform(10, async);
});
document.getElementById('async100').addEventListener('click', () => {
  transform(100, async);
});
document.getElementById('sync').addEventListener('click', () => {
  transform(0, sync);
});

document.getElementById('clear').addEventListener('click', () => {
  inputChanged = true;
  clearArray(input);
  fillBoard(input, 'input-board')
});
document.getElementById('train').addEventListener('click', () => {
  inputChanged = true;
  train(input);
  copyArray(input, output);
  fillBoard(output, 'output-board');
  clearArray(input);
  fillBoard(input, 'input-board');
});

function transform(n, fn) {
  if (inputChanged) {
    copyArray(input, output);
    clearArray(input);
    fillBoard(input, 'input-board');
  }
  inputChanged = false;
  fn(output, n);
  fillBoard(output, 'output-board');
}

function populateCells() {
  input = [];
  output = [];
  model = [];

  while (inputBoard.firstChild) {
    inputBoard.removeChild(inputBoard.firstChild);
    outputBoard.removeChild(outputBoard.firstChild);
  }

  for (let i = 0; i < x_rep * y_rep; i++) {
    let inputDiv = document.createElement('div');
    inputDiv.classList.add('cell');
    inputDiv.addEventListener('mousedown', () => {
      clickState = -2 * input[i] + 1;
      if (clickState == 1) {
        inputChanged = true;
        if (!inputDiv.classList.contains('on')) {
          inputDiv.classList.add('on');
        }
        input[i] = 1;
      } else if (clickState == -1) {
        inputChanged = true;
        if (inputDiv.classList.contains('on')) {
          inputDiv.classList.remove('on');
        }
        input[i] = 0;
      }
    });
    inputDiv.addEventListener('mouseenter', () => {
      if (clickState == 1) {
        inputChanged = true;
        if (!inputDiv.classList.contains('on')) {
          inputDiv.classList.add('on');
        }
        input[i] = 1;
      } else if (clickState == -1) {
        inputChanged = true;
        if (inputDiv.classList.contains('on')) {
          inputDiv.classList.remove('on');
        }
        input[i] = 0;
      }
    });

    let outputDiv = document.createElement('div');
    outputDiv.classList.add('cell');

    input.push(0);
    output.push(0);
    model.push([]);
    for (let j = 0; j < x_rep * y_rep; j++) {
      model[i].push(0);
    }
    inputBoard.append(inputDiv);
    outputBoard.append(outputDiv);
  }
}

function setBoardDimensions(x_rep, y_rep) {
  document.documentElement.style.setProperty('--x-rep', x_rep);
  document.documentElement.style.setProperty('--y-rep', y_rep);

  let cd;
  if (window.innerWidth / (4 * x_rep) <= window.innerHeight / (2 * y_rep)) {
    cd = (100 / (4 * x_rep)) + 'vw';
  } else {
    cd = (100 / (2 * y_rep)) + 'vh';
  }

  document.documentElement.style.setProperty('--cell-dimension', cd);
}

function async(arr, n) {
  for (let i = 0; i < n; i++) {
    let u = Math.floor(arr.length * Math.random());
    let v_in = arr.reduce((acc, val, v) => {
      return acc + model[u][v] * val;
    });
    if (v_in >= 0) {
      arr[u] = 1;
    } else {
      arr[u] = 0;
    }
  }
}
function sync(arr) {
  let done = false;
  let indexes = []
  for (let i = 0; i < arr.length; i++) {
    indexes.push(i);
  }
  while (!done) {
    done = true;
    shuffleArray(indexes);
    for (let u of indexes) {
      let v_in = arr.reduce((acc, val, v) => {
        return acc + model[u][v] * val;
      }, 0);
      if (v_in >= 0 && arr[u] === 0) {
        arr[u] = 1;
        done = false;
      } else if (v_in < 0 && arr[u] === 1) {
        arr[u] = 0;
        done = false;
      }
    }
  }
}

function train(arr) {
  for (let i in arr) {
    for (let j in arr) {
      if (i == j) {
        model[i][j] += 0;
      } else {
        model[i][j] += (2 * arr[i] - 1) * (2 * arr[j] - 1);
      }
    }
  }
}

function copyArray(from_arr, to_arr) {
  for (let i in to_arr) {
    to_arr[i] = from_arr[i];
  }
}

function fillBoard(arr, board_id) {
  document.getElementById(board_id).childNodes.forEach((cell, i) => {
    if (arr[i] === 1 && !cell.classList.contains('on')) {
      cell.classList.add('on');
    } else if (arr[i] === 0 && cell.classList.contains('on')) {
      cell.classList.remove('on');
    }
  });
}

function clearArray(arr) {
  for (let i in arr) {
    arr[i] = 0;
  }
}

function shuffleArray(arr) {
  for (i = arr.length - 1; i >= 0; i--) {
    let rnd = Math.floor(Math.random() * (i + 1));
    let tmp = arr[i];
    arr[i] = arr[rnd];
    arr[rnd] = tmp;
  }
}