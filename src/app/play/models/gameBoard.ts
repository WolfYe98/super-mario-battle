export class GameBoard {
    static getGameBoardWidth(): number {
        return (document.getElementById('game-board')?.getBoundingClientRect().width ?? 1) - 1;
    }
    static getGameBoardHeight(): number {
        return (document.getElementById('game-board')?.getBoundingClientRect().height ?? 1) - 2;
    }
}