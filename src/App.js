import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessRook, faChessKnight, faChessBishop, faChessQueen, faChessKing, faChessPawn } from '@fortawesome/free-solid-svg-icons';

const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const themes = [
  '', // Tema padrão
  'high-contrast', // Alto Contraste
  'color-blind', // Daltonismo
  'black-and-white' // Preto e Branco
];

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [themeIndex, setThemeIndex] = useState(0); // Índice do tema atual
  const [showMenu, setShowMenu] = useState(false); // Estado para mostrar/esconder menu

  useEffect(() => {
    document.body.className = themes[themeIndex];
  }, [themeIndex]);

  const renderPieceIcon = (piece) => {
    const isBlackPiece = piece === piece.toLowerCase();
    const colorStyle = isBlackPiece ? { color: 'black' } : { color: 'white' };

    switch (piece.toLowerCase()) {
      case 'r':
        return <FontAwesomeIcon icon={faChessRook} style={colorStyle} />;
      case 'n':
        return <FontAwesomeIcon icon={faChessKnight} style={colorStyle} />;
      case 'b':
        return <FontAwesomeIcon icon={faChessBishop} style={colorStyle} />;
      case 'q':
        return <FontAwesomeIcon icon={faChessQueen} style={colorStyle} />;
      case 'k':
        return <FontAwesomeIcon icon={faChessKing} style={colorStyle} />;
      case 'p':
        return <FontAwesomeIcon icon={faChessPawn} style={colorStyle} />;
      default:
        return null;
    }
  };

  const isValidMove = (startRow, startCol, targetRow, targetCol) => {
    const piece = board[startRow][startCol];
    const targetPiece = board[targetRow][targetCol];
    const rowDiff = Math.abs(targetRow - startRow);
    const colDiff = Math.abs(targetCol - startCol);

    if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) {
      return false;
    }

    if (targetPiece && piece === targetPiece) {
      return false;
    }

    switch (piece.toLowerCase()) {
      case 'p': // Pawn
        const direction = piece === 'p' ? 1 : -1;
        if (targetCol === startCol) {
          if (!targetPiece) {
            if (rowDiff === 1) {
              return true;
            } else if (rowDiff === 2 && startRow === (piece === 'p' ? 1 : 6)) {
              return !board[startRow + direction][startCol];
            }
          }
        } else {
          return rowDiff === 1 && colDiff === 1 && targetPiece && isOpponentPiece(piece, targetPiece);
        }
        return false;
      case 'r': // Rook
        return (startRow === targetRow || startCol === targetCol) && !isBlocked(startRow, startCol, targetRow, targetCol);
      case 'n': // Knight
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      case 'b': // Bishop
        return rowDiff === colDiff && !isBlockedDiagonal(startRow, startCol, targetRow, targetCol);
      case 'q': // Queen
        return ((startRow === targetRow || startCol === targetCol) || rowDiff === colDiff) && !isBlocked(startRow, startCol, targetRow, targetCol);
      case 'k': // King
        return rowDiff <= 1 && colDiff <= 1;
      default:
        return false;
    }
  };

  const isBlocked = (startRow, startCol, targetRow, targetCol) => {
    const rowStep = startRow === targetRow ? 0 : (targetRow - startRow) / Math.abs(targetRow - startRow);
    const colStep = startCol === targetCol ? 0 : (targetCol - startCol) / Math.abs(targetCol - startCol);
    let row = startRow + rowStep;
    let col = startCol + colStep;
    while (row !== targetRow || col !== targetCol) {
      if (row < 0 || row > 7 || col < 0 || col > 7) return true; // Verificar se estamos fora dos limites
      if (board[Math.round(row)][Math.round(col)]) {
        return true;
      }
      row += rowStep;
      col += colStep;
    }
    return false;
  };

  const isBlockedDiagonal = (startRow, startCol, targetRow, targetCol) => {
    const rowStep = (targetRow - startRow) / Math.abs(targetRow - startRow);
    const colStep = (targetCol - startCol) / Math.abs(targetCol - startCol);
    let row = startRow + rowStep;
    let col = startCol + colStep;
    while (row !== targetRow || col !== targetCol) {
      if (row < 0 || row > 7 || col < 0 || col > 7) return true; // Verificar se estamos fora dos limites
      if (board[Math.round(row)][Math.round(col)]) {
        return true;
      }
      row += rowStep;
      col += colStep;
    }
    return false;
  };

  const isOpponentPiece = (piece, targetPiece) => {
    return (piece === piece.toLowerCase()) !== (targetPiece === targetPiece.toLowerCase());
  };

  const handleSquareClick = (row, col) => {
    if (selectedPiece) {
      const { row: startRow, col: startCol } = selectedPiece;
      if (isValidMove(startRow, startCol, row, col) && !isBlocked(startRow, startCol, row, col)) {
        const newBoard = board.map(row => row.slice());
        newBoard[row][col] = newBoard[startRow][startCol];
        newBoard[startRow][startCol] = null;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setSelectedPiece(null);
      } else {
        setSelectedPiece(null);
      }
    } else {
      const piece = board[row][col];
      if (piece && ((piece === piece.toUpperCase() && currentPlayer === 'white') || (piece === piece.toLowerCase() && currentPlayer === 'black'))) {
        setSelectedPiece({ row, col });
      }
    }
  };

  const handleThemeChange = (index) => {
    setThemeIndex(index);
    setShowMenu(false); // Fechar menu ao selecionar tema
  };

  return (
    <div className="App">
      <h1>Xadrez na Web!</h1>
      <div className="theme-menu-container">
        <button className="theme-button" onClick={() => setShowMenu(!showMenu)}>
          Mudar Tema
        </button>
        {showMenu && (
          <div className="theme-menu">
            {themes.map((theme, index) => (
              <button key={index} onClick={() => handleThemeChange(index)}>
                {theme === '' ? 'Tema Padrão' : 
                 theme === 'high-contrast' ? 'Alto Contraste' : 
                 theme === 'color-blind' ? 'Daltonismo' : 'Preto e Branco'}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="board-container">
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${((rowIndex + colIndex) % 2 === 0) ? 'white' : 'black'} ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected' : ''}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece && renderPieceIcon(piece)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="current-player">
        {`Current Player: ${currentPlayer}`}
      </div>
    </div>
  );
}

export default App;
