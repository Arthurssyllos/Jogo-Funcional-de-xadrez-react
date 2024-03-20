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

  const handleClick = (row, col) => {
    const piece = board[row][col];
    
    // Se a peça selecionada for nula ou não pertencer ao jogador atual, retorna
    if (!piece || (piece.toLowerCase() !== currentPlayer)) {
      setSelectedPiece(null);
      return;
    }
  
    // Se uma peça já estiver selecionada e for o turno do jogador atual, move a peça selecionada para a nova posição
    if (selectedPiece && currentPlayer === selectedPiece.piece.toLowerCase()) {
      const newBoard = [...board];
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      newBoard[row][col] = selectedPiece.piece;
      setBoard(newBoard);
      setSelectedPiece(null);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white'); // Alterna o jogador após a jogada
      return;
    }
  
    // Seleciona a peça se não houver nenhuma peça selecionada e for o turno do jogador atual
    if (!selectedPiece && currentPlayer === piece.toLowerCase()) {
      setSelectedPiece({ piece, row, col });
    }
  };

  return (
    <div className="App">
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${((rowIndex + colIndex) % 2 === 0) ? 'white' : 'black'} ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected' : ''}`}
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {piece && renderPieceIcon(piece)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="current-player">
        {`Current Player: ${currentPlayer}`}
      </div>
    </div>
  );
}

export default App;
