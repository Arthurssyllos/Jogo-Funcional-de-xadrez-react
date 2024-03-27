import React, { useState } from 'react';
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

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');

  const renderPieceIcon = (piece) => {
    const isBlackPiece = piece === piece.toLowerCase();
    const colorStyleBlack = isBlackPiece ? { color: 'black' } : {}; // Estilo para peças pretas
    const colorStyleWhite = !isBlackPiece ? { color: 'white' } : {}; // Estilo para peças brancas
  
    switch (piece.toLowerCase()) {
      case 'r':
        return <FontAwesomeIcon icon={faChessRook} style={{...colorStyleBlack, ...colorStyleWhite}} />;
      case 'n':
        return <FontAwesomeIcon icon={faChessKnight} style={{...colorStyleBlack, ...colorStyleWhite}} />;
      case 'b':
        return <FontAwesomeIcon icon={faChessBishop} style={{...colorStyleBlack, ...colorStyleWhite}} />;
      case 'q':
        return <FontAwesomeIcon icon={faChessQueen} style={{...colorStyleBlack, ...colorStyleWhite}} />;
      case 'k':
        return <FontAwesomeIcon icon={faChessKing} style={{...colorStyleBlack, ...colorStyleWhite}} />;
      case 'p':
        return <FontAwesomeIcon icon={faChessPawn} style={{...colorStyleBlack, ...colorStyleWhite}} />;
      default:
        return null;
    }
  };

  const isValidMove = (startRow, startCol, targetRow, targetCol) => {
    const piece = board[startRow][startCol];
    const targetPiece = board[targetRow][targetCol];
    const rowDiff = Math.abs(targetRow - startRow);
    const colDiff = Math.abs(targetCol - startCol);
  
    // Check if the target position is within the board bounds
    if (targetRow < 0 || targetRow > 7 || targetCol < 0 || targetCol > 7) {
      return false;
    }
  
    // Check if the target position is occupied by own piece
    if (targetPiece && piece === targetPiece) {
      return false;
    }
  
    // Rules for each piece type
    switch (piece.toLowerCase()) {
      case 'p': // Pawn
        // Basic forward move or double forward move on the first move, diagonal capture
        const direction = piece === 'p' ? 1 : -1; // Pawn direction (white or black)
        if (targetCol === startCol) {
          // Forward move
          if (!targetPiece) {
            if (rowDiff === 1) {
              return true;
            } else if (rowDiff === 2 && startRow === (piece === 'p' ? 1 : 6)) {
              // Double forward move on the first move
              return !board[startRow + direction][startCol];
            }
          }
        } else {
          // Diagonal capture
          return rowDiff === 1 && colDiff === 1 && targetPiece && isOpponentPiece(piece, targetPiece);
        }
        return false;
      case 'r': // Rook
        // Horizontal or vertical moves
        return (startRow === targetRow || startCol === targetCol) && !isBlocked(startRow, startCol, targetRow, targetCol);
      case 'n': // Knight
        // L-shaped moves
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      case 'b': // Bishop
        // Diagonal moves
        return rowDiff === colDiff && !isBlockedDiagonal(startRow, startCol, targetRow, targetCol);
      case 'q': // Queen
        // Horizontal, vertical, or diagonal moves
        return ((startRow === targetRow || startCol === targetCol) || rowDiff === colDiff) && !isBlocked(startRow, startCol, targetRow, targetCol);
      case 'k': // King
        // Single-square moves in any direction
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
      if (board[row][col]) {
        return true; // There is a piece blocking the path
      }
      row += rowStep;
      col += colStep;
    }
    return false; // The path is unobstructed
  };

  const isBlockedDiagonal = (startRow, startCol, targetRow, targetCol) => {
    const rowStep = targetRow > startRow ? 1 : -1;
    const colStep = targetCol > startCol ? 1 : -1;
    let row = startRow + rowStep;
    let col = startCol + colStep;
    while (row !== targetRow || col !== targetCol) {
      if (board[row][col]) {
        return true; // There is a piece blocking the path
      }
      row += rowStep;
      col += colStep;
    }
    return false; // The path is unobstructed
  };

  const isOpponentPiece = (piece, targetPiece) => {
    return piece.toLowerCase() !== targetPiece.toLowerCase();
  };

  const handleSquareClick = (row, col) => {
    if (!selectedPiece) {
      // If no piece is selected, select the piece at the clicked position
      if (board[row][col] && (currentPlayer === 'white' ? board[row][col] === board[row][col].toUpperCase() : board[row][col] === board[row][col].toLowerCase())) {
        setSelectedPiece({ row, col, piece: board[row][col] });
      }
    } else {
      // If a piece is selected, attempt to move it to the clicked position
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = selectedPiece.piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      } else {
        // If the move is not valid, deselect the piece
        setSelectedPiece(null);
      }
    }
  };

  return (
    <div className="App">
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
