import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const isSelect = props.isSelect ? 'selected' : '';
    return (
        <button className={`square ${isSelect}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const isSelect = this.props.currentChoice === i;
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} isSelect={isSelect} />;
    }

    render() {
        const items = [];
        let items2 = [];

        for(let y = 0;y <3; y++) {
            items2= [];
            for (let x = 0; x < 3; x++) {
                items2.push(
                    this.renderSquare(y * 3 + x)
                )
            }
            items.push(React.createElement('div',{className:"board-row"},items2));
        }

        return (
            <div>
                    {
                        items
                    }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history:[{
                squares: Array(9).fill(null),
                choice: null,
            }],
            xIsNext: true,
            stepNumber:0,
            sort:false,
        };
    }
    sortClick(){
        this.setState({
            sort:!this.state.sort
        })
    }
    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            history:history.concat([{
                squares: squares,
                choice: i,
            }]),
            stepNumber: history.length,
            xIsNext:!this.state.xIsNext,
        })
    }
    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext: (step % 2 ) === 0,
        })
    }
    render() {
        let history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const draw = calculateDraw(current.squares);
        if(this.state.sort){
            history = history.reverse()
        }
        let moves = history.map((h,move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const pos = h.choice === null ? '' :
                            '(' + ((h.choice % 3) + 1) + ',' + (Math.floor(h.choice / 3) + 1) +')';
            return (
                <li key={move}>
                    {pos} <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner:' + winner
        } else if(draw){
            status = 'Draw'
        }else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        const reversed = this.state.sort;

        return (
            <div className="game">
                <div className="game-board">
                    <Board currentChoice={current.choice} squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><button onClick={() => this.sortClick() }>sort</button></div>
                    <ol reversed={reversed}>{moves}</ol>
                </div>
            </div>
        );
    }
}

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
            return squares[a];
        }
    }
    return null;
}

function calculateDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        if(squares[i] === null){
            return false
        }
    }
    return true
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
