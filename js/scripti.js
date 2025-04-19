const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const audio = new Audio("./assets/audio.mp3")
const size = 30
const score = document.querySelector(".score")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-scren")
const buttonPlay = document.querySelector(".btn-play")

let snake = [{x: 270, y: 240 }]

const incrementScore = () => {
    const current = parseInt(score.innerText) || 0
    score.innerText = current + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb( ${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let drawFood = () => {
    const { x, y, color } = food
    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = food.color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

let direction, loopId

const chackColistion = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const mackIndex = snake.length - 2
    const smallColistion =
        head.x < 0 || canvasLimit.x > 570 || head.y < 0 || canvasLimit.y > 570

    const selfColisition = snake.find((position, index) => {
        return index < mackIndex && position.x == head.x && position.y == head.y
    })

    if (smallColistion || selfColisition) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
     canvas.style.filter = "blur(2px)"
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const movesnake = () => {
    if (!direction) return


    const head = snake[snake.length - 1]

    snake.shift()

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

}

const chackEach = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()


        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}


const gameloop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)
    drawFood()
    drawSnake()
    movesnake()
    chackEach()
    chackColistion()

    loopId = setInterval(() => {
        gameloop()
    }, 300);

}

gameloop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }

})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [{x: 270, y: 240 }]
})