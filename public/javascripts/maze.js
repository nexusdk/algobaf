let wait_time = 10;
let maze;
let width;
let height;
let canvas;
let ctx;
let cell_size = 10;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solve_rec(x, y) {
    let el = maze[y][x];
    el.visited = true;
    ctx.fillStyle="#00FF00";
    ctx.fillRect((x * cell_size) + 1, (y * cell_size) + 1, cell_size - 2, cell_size - 2);
    await sleep(10);
    let up = y > 0 ? maze[(y - 1)][x] : false;
    let down = y < height - 1 ? maze[(y + 1)][x] : false;
    let left = x > 0 ? maze[y][(x - 1)] : false;
    let right = x < width - 1 ? maze[y][(x + 1)] : false;
    let res = !right && !down;
    if (!el.right && right && !right.visited) {
        res = res || await solve_rec(x + 1, y);
        await sleep(10);
    }
    if (!el.down && down && !down.visited) {
        res = res || await solve_rec(x, y + 1);
        await sleep(10);
    }
    if (left && !left.right && !left.visited) {
        res = res || await solve_rec(x - 1, y);
        await sleep(10);
    }
    if (up && !up.down && !up.visited) {
        res = res || await solve_rec(x, y - 1);
        await sleep(10);
    }
    if (!res) {
        el.visited = false;
        ctx.fillStyle="#FFFFFF";
        ctx.fillRect((x * cell_size) + 1, (y * cell_size) + 1, cell_size - 2, cell_size - 2);
    }
    return res;
}

function solve() {
    solve_rec(0, 0);
}

function r(f) {
    /in/.test(document.readyState) ? setTimeout('r(' + f + ')', 9) : f()
}

r(function () {
    let xmlHttp = new XMLHttpRequest();
    canvas = document.getElementById('maze');
    ctx = canvas.getContext("2d");
    let url = new URL(window.location.href);
    width = url.searchParams.get('width');
    height = url.searchParams.get('height');
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            maze = JSON.parse(xmlHttp.responseText);
            canvas.width = width * cell_size;
            canvas.height = height * cell_size;
            ctx.beginPath();
            ctx.moveTo(width * cell_size, 0);
            ctx.lineTo(0, 0);
            ctx.lineTo(0, height * cell_size);
            ctx.stroke();
            ctx.beginPath();
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (maze[y][x].right) {
                        ctx.moveTo((x + 1) * cell_size, y * cell_size);
                        ctx.lineTo((x + 1) * cell_size, (y + 1) * cell_size);
                    }
                    if (maze[y][x].down) {
                        ctx.moveTo(x * cell_size, (y + 1) * cell_size);
                        ctx.lineTo((x + 1) * cell_size, (y + 1) * cell_size);
                    }
                }
            }
            ctx.stroke();
        }
    };
    xmlHttp.open("GET", '/maze-gen?width=' + width + '&height=' + height, true); // true for asynchronous
    xmlHttp.send(JSON.stringify(null));
});
