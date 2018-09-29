//生成数独解决方案

import Toolkit from './toolkit';

export class Generator {

    public matrix: number[][]|null = null;
    
    private orders: number[][]|null = null;

    //入口
    generate(): void {
        while(!this.internalGenerate()) {
            console.warn('try again');
        }
    }

    private internalGenerate(): boolean {
        this.matrix = Toolkit.matrix.makeMatrix();
        this.orders = Toolkit.matrix.makeMatrix()
            .map(row => row.map((v,i) => i))
            .map(row => Toolkit.matrix.shuffle(row));

        for (let i = 1; i <= 9; i++) {
           if(!this.fillNumber(i)){
                return false;
           }
        }
        return true;
    }

    private fillNumber(n: number): boolean {
        return this.fillRow(n,0);
    }

    private fillRow(n: number, rowIndex: number): boolean {
        if(rowIndex > 8) {
            return true;
        }

        const row: number[]|null= this.matrix && this.matrix[rowIndex];
        const order: number[]|null = this.orders && this.orders[rowIndex];
        for(let i = 0; i < 9; i++) {
            const colIndex: number|null = order && order[i];
            //有值跳过
            if(row && colIndex && row[colIndex] !== 0) {
                continue;
            }

            //不能填跳过
            if(!Toolkit.matrix.checkFillable(this.matrix,n,rowIndex,colIndex)) {
                continue;
            }

            //填写
            row[colIndex] = n;

            //当前行填写n成功，递归调用下一行
            if(!this.fillRow(n, rowIndex + 1)) {
                row[colIndex] = 0;
                continue;
            }
            return true;
        }
        return false;

    }

}

export default Generator;