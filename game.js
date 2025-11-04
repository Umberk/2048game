class Game2048 {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.username = '';
        this.gameStarted = false;
        this.gameOver = false;
        this.won = false;
        
        this.initElements();
        this.initEventListeners();
        this.updateScoreDisplay();
    }

    initElements() {
        this.usernameSection = document.getElementById('username-section');
        this.usernameInput = document.getElementById('username-input');
        this.startButton = document.getElementById('start-button');
        this.gameContainer = document.getElementById('game-container');
        this.gridContainer = document.getElementById('grid-container');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.gameOverElement = document.getElementById('game-over');
        this.gameMessage = document.getElementById('game-message');
        this.restartButton = document.getElementById('restart-button');
        this.newGameButton = document.getElementById('new-game');
        this.scoreboardList = document.getElementById('scoreboard-list');
    }

    initEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });
        
        this.restartButton.addEventListener('click', () => this.restart());
        this.newGameButton.addEventListener('click', () => this.restart());
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        const username = this.usernameInput.value.trim();
        if (username.length === 0 || username.length > 5) {
            alert('请输入1-5个字符的用户名！');
            return;
        }
        
        this.username = username;
        this.usernameSection.style.display = 'none';
        this.gameContainer.style.display = 'block';
        this.gameStarted = true;
        
        this.initBoard();
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
        this.loadScoreboard();
    }

    initBoard() {
        this.board = [];
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = 0;
            }
        }
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        this.updateScoreDisplay();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    renderBoard() {
        this.gridContainer.innerHTML = '';
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                const value = this.board[i][j];
                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add(`tile-${value}`);
                }
                
                this.gridContainer.appendChild(cell);
            }
        }
    }

    handleKeyPress(e) {
        if (!this.gameStarted || this.gameOver) return;

        let moved = false;
        const key = e.key.toLowerCase();

        switch(key) {
            case 'arrowup':
            case 'w':
                moved = this.moveUp();
                break;
            case 'arrowdown':
            case 's':
                moved = this.moveDown();
                break;
            case 'arrowleft':
            case 'a':
                moved = this.moveLeft();
                break;
            case 'arrowright':
            case 'd':
                moved = this.moveRight();
                break;
            default:
                return;
        }

        if (moved) {
            this.addRandomTile();
            this.renderBoard();
            this.updateScoreDisplay();
            
            if (this.checkWin()) {
                this.endGame(true);
            } else if (this.checkGameOver()) {
                this.endGame(false);
            }
        }

        e.preventDefault();
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            const row = this.board[i].filter(val => val !== 0);
            const newRow = [];
            
            for (let j = 0; j < row.length; j++) {
                if (j < row.length - 1 && row[j] === row[j + 1]) {
                    newRow.push(row[j] * 2);
                    this.score += row[j] * 2;
                    j++;
                } else {
                    newRow.push(row[j]);
                }
            }
            
            while (newRow.length < this.size) {
                newRow.push(0);
            }
            
            if (JSON.stringify(this.board[i]) !== JSON.stringify(newRow)) {
                moved = true;
                this.board[i] = newRow;
            }
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            const row = this.board[i].filter(val => val !== 0);
            const newRow = [];
            
            for (let j = row.length - 1; j >= 0; j--) {
                if (j > 0 && row[j] === row[j - 1]) {
                    newRow.unshift(row[j] * 2);
                    this.score += row[j] * 2;
                    j--;
                } else {
                    newRow.unshift(row[j]);
                }
            }
            
            while (newRow.length < this.size) {
                newRow.unshift(0);
            }
            
            if (JSON.stringify(this.board[i]) !== JSON.stringify(newRow)) {
                moved = true;
                this.board[i] = newRow;
            }
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            const col = [];
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== 0) {
                    col.push(this.board[i][j]);
                }
            }
            
            const newCol = [];
            for (let i = 0; i < col.length; i++) {
                if (i < col.length - 1 && col[i] === col[i + 1]) {
                    newCol.push(col[i] * 2);
                    this.score += col[i] * 2;
                    i++;
                } else {
                    newCol.push(col[i]);
                }
            }
            
            while (newCol.length < this.size) {
                newCol.push(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== newCol[i]) {
                    moved = true;
                    this.board[i][j] = newCol[i];
                }
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            const col = [];
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== 0) {
                    col.push(this.board[i][j]);
                }
            }
            
            const newCol = [];
            for (let i = col.length - 1; i >= 0; i--) {
                if (i > 0 && col[i] === col[i - 1]) {
                    newCol.unshift(col[i] * 2);
                    this.score += col[i] * 2;
                    i--;
                } else {
                    newCol.unshift(col[i]);
                }
            }
            
            while (newCol.length < this.size) {
                newCol.unshift(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== newCol[i]) {
                    moved = true;
                    this.board[i][j] = newCol[i];
                }
            }
        }
        return moved;
    }

    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 2048 && !this.won) {
                    return true;
                }
            }
        }
        return false;
    }

    checkGameOver() {
        // 检查是否有空格
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) return false;
            }
        }

        // 检查是否有相邻的相同数字
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (i < this.size - 1 && this.board[i][j] === this.board[i + 1][j]) {
                    return false;
                }
                if (j < this.size - 1 && this.board[i][j] === this.board[i][j + 1]) {
                    return false;
                }
            }
        }

        return true;
    }

    endGame(won) {
        this.gameOver = true;
        this.won = won;
        
        this.gameMessage.textContent = won ? '你赢了！' : '游戏结束！';
        this.gameOverElement.style.display = 'flex';
        
        this.saveScore();
        this.loadScoreboard();
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
    }

    restart() {
        this.gameOverElement.style.display = 'none';
        this.initBoard();
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }

    updateScoreDisplay() {
        this.scoreElement.textContent = this.score;
        this.bestScoreElement.textContent = this.bestScore;
    }

    saveScore() {
        const scores = this.loadScores();
        scores.push({
            username: this.username,
            score: this.score,
            date: new Date().toISOString()
        });
        localStorage.setItem('game2048_scores', JSON.stringify(scores));
    }

    loadScores() {
        const scores = localStorage.getItem('game2048_scores');
        return scores ? JSON.parse(scores) : [];
    }

    saveBestScore() {
        localStorage.setItem('game2048_best', this.bestScore);
    }

    loadBestScore() {
        const best = localStorage.getItem('game2048_best');
        return best ? parseInt(best) : 0;
    }

    loadScoreboard() {
        const scores = this.loadScores();
        scores.sort((a, b) => b.score - a.score);
        
        this.scoreboardList.innerHTML = '';
        
        const topScores = scores.slice(0, 10);
        topScores.forEach((item, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'scoreboard-item';
            scoreItem.innerHTML = `
                <span class="name">${index + 1}. ${item.username}</span>
                <span class="score-value">${item.score}</span>
            `;
            this.scoreboardList.appendChild(scoreItem);
        });
    }
}

// 初始化游戏
const game = new Game2048();

