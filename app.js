document.addEventListener('DOMContentLoaded' , () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')

    //tetraminos using a different rotation from guide
    const iTetromino = [
        [width, width + 1, width + 2, width + 3],
        [2, width + 2, width * 2 + 2, width *3 + 2],
        [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3]
        [1, width + 1, width * 2 + 1, width * 3 + 1]
    ]
    const jTetromino = [
        [width, width + 1, width + 2, 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width + 1, width + 2, width * 2],
        [0, 1, width + 1, width * 2 + 1]
    ]
    //o is different matrix
    const oTetromino = [
        [1, 2, width + 1, width + 2],
        [1, 2, width + 1, width + 2],
        [1, 2, width + 1, width + 2],
        [1, 2, width + 1, width + 2]
    ]
    const sTetromino = [
        [1, 2, width, width + 1],
        [1, width + 1, width + 2, width * 2 + 2],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1]
    ]
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]
    const zTetromino = [
        [0, 1, width + 1, width + 2],
        [2, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
        [1, width, width + 1, width * 2]
    ]
    const lTetromino = [
        [0, width, width + 1, width + 2],
        [1, 2, width + 1, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2, width * 2 + 1]
    ]

    //added 2 more tetrominos as opposed to tutorial
    const theTetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, jTetromino, sTetromino]

    //changed center starting point
    let currentPosition = 3
    let currentRotation = 0

    //random is floating point between 0 and 1
    let random = Math.floor(Math.random() * theTetrominos.length)
    let current = theTetrominos[random][0]

    //draw the first rotation 
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }


    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    //move down tetromino every second
    timerId = setInterval(moveDown, 1000)

    //assign functions to keyCodes, added more controls than tutorial add hold
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            //rotate
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            //fastfall
        } else if (e.KeyCode === 90) {
            //rotate counter clockwise
        } else if (e.keyCode === 32) {
            //harddrop
        }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        //freeze in move down to check every second/move
        freeze()
    }

    //freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = Math.floor(Math.random() * theTetrominos.length)
            currentPosition = 3
            current = theTetrominos[random][currentRotation]
            draw()
        }
    }

    //move tetrimino left unless at edge
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) {
            currentPosition -= 1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    //move tetrimino left unless at edge
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % 10 === width - 1)
        if (!isAtRightEdge) {
            currentPosition += 1
        }

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        
        draw()
    }

    //rotate tetrimino
    function rotate() {
        undraw()
        currentRotation += 1
    }
})