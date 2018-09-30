//生成数独游戏
import Generator from './generator';

export class Sudoku {
    
    private _solutionMatrix: number[][]|null;

    public _puzzleMatrix: number[][]|null = null;
    
    constructor() {
        const generate = new Generator();
        generate.generate();
        this._solutionMatrix = generate.matrix;
    }

    get puzzleMatrix(): number[][]|null {
        return this._puzzleMatrix;
    }

    make(level: number = 5): void {
        this._puzzleMatrix = this._solutionMatrix && this._solutionMatrix.map(row => row.map(cell => {
            return Math.random() * 9 < level ? 0 : cell;
        }))
    }
}

export default Sudoku;