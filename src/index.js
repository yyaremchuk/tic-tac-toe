import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    const className = props.highlight ? 'square highlight' : 'square';
    return (
      <button className={ className } onClick={ props.onClick }>
        { props.value }
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square
            value={ this.props.squares[i] }
            key={ i }
            highlight={ this.props.winner && this.props.winner.indexOf(i) > -1 }
            onClick={ () => this.props.onClick(i) }/>
        );
  }

  render() {
    let rows = [];

    for (let i = 0; i < 3; i++) {
        let cells = [];

        for (let j = 0; j < 3; j++) {
            cells.push(this.renderSquare(i * 3 + j));
        }

        rows.push(<div className="board-row" key={i}>{cells}</div>)
    }

    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
              col: 0,
              row: 0,
          }],
          stepNumber: 0,
          xIsNext: true,
          ascdending: true,
      };
  }

  handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      if (calculateWinner(squares) || squares[i]) {
          return;
      }

      const row = Math.floor(i / 3);
      const col = i - (row * 3);

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{
              squares: squares,
              row: row,
              col: col,
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext
      });
  }

  jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
      });
  }

  toggleMoves() {
      const ascdending = !this.state.ascdending;
      this.setState({
          ascdending: ascdending
      });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            `Go to move #${ move } (${ step.col + 1 }, ${ step.row + 1 })` :
            `Go to game start`;
        const className = move === this.state.stepNumber ? 'selected' : 'item';

        return (
            <li key={ move }>
                <button className={className} onClick={ () => this.jumpTo(move) }>{ desc }</button>
            </li>
        );
    });

    let status;

    if (winner) {
        status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else if (this.state.stepNumber === 9) {
        status = 'It is a draw';
    } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O' );
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            winner={ winner }
            onClick={ (i) => this.handleClick(i) }
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{ this.state.ascdending ? moves : moves.reverse() }</ol>
          <button onClick={ () => this.toggleMoves() }>Re-order moves</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }

    return null;
}
