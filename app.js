document.addEventListener('DOMContentLoaded' , () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const width = 10
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    let timerId
    let score = 0
    const colors = [
        'lightblue',
        'orange',
        'yellow',
        'green',
        'purple',
        'red',
        'blue'
    ]

    //tetraminos using a different rotation from guide
    const iTetromino = [
        [width, width + 1, width + 2, width + 3],
        [2, width + 2, width * 2 + 2, width *3 + 2],
        [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3],
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
    const theTetrominos = [iTetromino, jTetromino, oTetromino, sTetromino, tTetromino, zTetromino, lTetromino]

    //changed center starting point
    let currentPosition = 3
    let currentRotation = 0

    //random is floating point between 0 and 1
    let nextRandom 
    let random 
    let current 
    
    //draw the first rotation 
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            //add colorcoding
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }


    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            //remove colorcoding
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // //move down tetromino every second
    // timerId = setInterval(moveDown, 1000)

    //assign functions to keyCodes, added more controls than tutorial add hold
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotateUp()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 88) {
            //hard drop
            clearInterval(timerId)
            undraw()
            while (!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
                currentPosition += width
            }
            draw()
            freeze()
            timerId = setInterval(moveDown, 1000)

        } else if (e.keyCode === 90) {
            rotateZ()
        } else if (e.keyCode === 32) {
            
        }
    }
    // function holdPress(e) {
    //     if(e.keyCode === 40) {
    //         //soft drop
    //         timerId = setInterval(moveDown, 200)
    //     }
    // }
    document.addEventListener('keyup', control)
    //document.addEventListener('keydown', holdPress)
    
    //move down function
    function moveDown() {
        freeze()
        undraw()
        currentPosition += width
        draw()
        //freeze in move down to check every second/move
    }

    //freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominos.length)
            currentPosition = 3
            currentRotation = 0
            current = theTetrominos[random][currentRotation]
            draw()
            displayShape()
            addScore()
            gameOver()
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
        freeze()
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
        freeze()
    }

    //rotate tetrimino
    function rotateUp() {
        undraw()
        currentRotation ++


        //edge cases: iTetrimino at edge
        if (random === 0) {
            if (current.every(index => (currentPosition + index) % width === width - 1 || (currentPosition + index) % width === 0)) {
                currentRotation --
            }
        }

        //edge cases: j and l tetriminos
        else if (random === 1 || random === 6) {
            let counter = 0
            current.forEach(index => {
                if ((currentPosition + index) % width === width - 1 || (currentPosition + index) % width === 0) {
                    counter ++
                }
            })
            if (counter >= 3) {
                currentRotation --
            }
        }
        else {
            let counter = 0
            current.forEach(index => {
                if ((currentPosition + index) % width === width - 1 || (currentPosition + index) % width === 0) {
                    counter ++
                }
            })
            if (counter >= 2) {
                currentRotation --
            }
        }
        

        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominos[random][currentRotation]
    
        draw()

        //freeze for edge cases
        freeze()
    }

    //extra rotation
    function rotateZ() {
        undraw()
        currentRotation -= 1
        
        //edge cases: iTetrimino at edge
        if (random === 0) {
            if (current.every(index => (currentPosition + index) % width === width - 1 || (currentPosition + index) % width === 0)) {
                currentRotation ++
            }
        }

        //edge cases: j and l tetriminos
        else if (random === 1 || random === 6) {
            let counter = 0
            current.forEach(index => {
                if ((currentPosition + index) % width === width - 1 || (currentPosition + index) % width === 0) {
                    counter ++
                }
            })
            if (counter >= 3) {
                currentRotation ++
            }
        }
        else {
            let counter = 0
            current.forEach(index => {
                if ((currentPosition + index) % width === width - 1 || (currentPosition + index) % width === 0) {
                    counter ++
                }
            })
            if (counter >= 2) {
                currentRotation ++
            }
        }

        if (currentRotation === -1) {
            currentRotation = 3
        }

        current = theTetrominos[random][currentRotation]

        draw()

        //freeze for edge cases
        freeze()
    }

    //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    
    //the Tetrominos without rotations
    const upNextTetrominos = [
        [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3],
        [displayWidth, displayWidth + 1, displayWidth + 2, 2],
        [1, 2, displayWidth + 1, displayWidth + 2],
        [1, 2, displayWidth, displayWidth + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth + 1, displayWidth + 2],
        [0, displayWidth, displayWidth + 1, displayWidth + 2],
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominos[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
        
    }

    startBtn.addEventListener('click', () => {
        //fixed original pause bug
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            if (!nextRandom) {
                nextRandom = Math.floor(Math.random() * theTetrominos.length)
                random = nextRandom
                nextRandom = Math.floor(Math.random() * theTetrominos.length)
                current = theTetrominos[random][0]
            }
            draw()
            timerId = setInterval(moveDown, 1000)
            
            displayShape()
        }
    })

    //add score
    function addScore() {
        //add addScore based on move (tetris, tspin)
        for (let i = 0; i < 199; i+=width) {
            const row = [i, i + 1, i + 2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))

            }

        }
    }

    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }

})