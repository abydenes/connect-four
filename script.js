const Cell = () => {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
};

const gameBoard = (() => {
  const rows = 6;
  const columns = 7;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (column, player) => {
    const availableCells = board.filter((row) => row[column].getValue() === 0);

    if (!availableCells.length) return;

    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].addToken(player);

  };

  return { getBoard, dropToken };
})();

const gameController = (() => {
  const players = [
    {
      name: "playerOneName",
      token: 1,
    },
    {
      name: "playerTwoName",
      token: 2,
    },
  ];

  let gameEnd = false;

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const checkWinner = () => {
    const board = gameBoard.getBoard();
    const token = getActivePlayer().token;

    for (let row = 0; row < board.length; row++) {
      let consecutiveCount = 0;
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col].getValue() === token) {
          consecutiveCount++;
          if (consecutiveCount === 4) {
            screenController.setMessage(
              `${getActivePlayer().name} won horizontally`
            );
            return true;
          }
        } else {
          consecutiveCount = 0;
        }
      }
    }

    for (let row = 0; row < 7; row++) {
      let consecutiveCount = 0;
      for (let col = 0; col < 6; col++) {
        if (board[col][row].getValue() === token) {
          consecutiveCount++;
          if (consecutiveCount === 4) {
            screenController.setMessage(
              `${getActivePlayer().name} won vertically`
            );
            return true;
          }
        } else {
          consecutiveCount = 0;
        }
      }
    }

    // Check for diagonal wins (top left to bottom right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col].getValue() === token &&
          board[row + 1][col + 1].getValue() === token &&
          board[row + 2][col + 2].getValue() === token &&
          board[row + 3][col + 3].getValue() === token
        ) {
          screenController.setMessage(
            `${getActivePlayer().name} won diagonally`
          );
          return true;
        }
      }
    }

    // Check for diagonal wins (top right to bottom left)
    for (let row = 0; row < 3; row++) {
      for (let col = 6; col > 2; col--) {
        if (
          board[row][col].getValue() === token &&
          board[row + 1][col - 1].getValue() === token &&
          board[row + 2][col - 2].getValue() === token &&
          board[row + 3][col - 3].getValue() === token
        ) {
          screenController.setMessage(
            `${getActivePlayer().name} won diagonally`
          );
          return true;
        }
      }
    }
  };

  const playRound = (column) => {
    if (!gameEnd) {
      gameBoard.dropToken(column, getActivePlayer().token);
      if (checkWinner()) {
        gameEnd = true;
        return;
      }
      switchPlayerTurn();
      screenController.setMessage(`${getActivePlayer().name}'s turn.`);
    }
  };

  return {
    playRound,
    getActivePlayer,
  };
})();

const screenController = (() => {
  const boardContainer = document.querySelector(".board-container");
  const turnAnnouncer = document.querySelector("p");

  const createBoard = () => {
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("button");
        cell.dataset.index = j;
        cell.textContent = `${gameBoard.getBoard()[i][j].getValue()}`;
        cell.classList.add("cell");
        row.appendChild(cell);
      }
      boardContainer.appendChild(row);
    }
  };

  const handleClick = (e) => {
    gameController.playRound(e.target.dataset.index);
    updateScreen();
  };

  const updateScreen = () => {
    cleanBoardContainer();
    createBoard();
  };

  const setMessage = (msg) => {
    turnAnnouncer.textContent = msg;
  };

  const cleanBoardContainer = () => {
    boardContainer.textContent = "";
  };

  boardContainer.addEventListener("click", (e) => {
    handleClick(e);
  });

  return { updateScreen, setMessage };
})();
