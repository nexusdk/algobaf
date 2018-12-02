let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

function Node(val, next) {
    this.value = val || null;
    this.next = next || null;
}

function LinkedList (head, tail) {
    this.head = head || null;
    this.tail = tail || null;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function merge_set(sets, set1, set2) {
    let node = sets[set1].head;
    while (node) {
        node.value.set = set2;
        node = node.next;
    }
    sets[set2].tail.next = sets[set1].head;
    sets[set2].tail = sets[set1].tail;
    delete sets[set1];
}

function go_left(cell, maze, sets, width, height) {
    if (cell.x > 0 && maze[cell.y][cell.x - 1].set !== cell.set) {
        maze[cell.y][cell.x - 1].right = false;
        merge_set(sets, cell.set, maze[cell.y][cell.x - 1].set);
    }
}

function go_right(cell, maze, sets, width, height) {
    if (cell.x < (width - 1) && maze[cell.y][cell.x + 1].set !== cell.set) {
        cell.right = false;
        merge_set(sets, cell.set, maze[cell.y][cell.x + 1].set);
    }
}

function go_up(cell, maze, sets, width, height) {
    if (cell.y > 0 && maze[cell.y - 1][cell.x].set !== cell.set) {
        maze[cell.y - 1][cell.x].down = false;
        merge_set(sets, cell.set, maze[cell.y - 1][cell.x].set);
    }
}

function go_down(cell, maze, sets, width, height) {
    if (cell.y < (height - 1) && maze[cell.y + 1][cell.x].set !== cell.set) {
        cell.down = false;
        merge_set(sets, cell.set, maze[cell.y + 1][cell.x].set);
    }
}

router.get('/maze', function (req, res, next) {
    let width = parseInt(req.query.width);
    let height = parseInt(req.query.height);
    // if (width * height > 30000) {
    //     res.render('error', {message: "Maze size too large.", error: {status: "Parameters too large.", stack: "Not enough peanuts.."}});
    //     return;
    // }
    let sets = [];
    let maze = [];
    let cells = [];
    for (let y = 0; y < height; y++) {
        row = [];
        for (let x = 0; x < width; x++) {
            let set_id = sets.length;
            let cell = {'right': true, 'down': true, 'gens': [go_left, go_right, go_up, go_down], 'set': set_id, 'x': x, 'y': y, id: y + '_' + x};
            shuffle(cell.gens);
            row.push(cell);
            let node = new Node(cell);
            sets.push(new LinkedList(node, node));
            cells.push(cell);
        }
        maze.push(row);
    }
    for (let y = 0; y < height; y++) maze[y][0].left = true;
    for (let x = 0; x < width; x++) maze[0][x].up = true;
    maze[height - 1][width - 1].right = false;
    shuffle(cells);
    while (cells.length > 1) {
        let cell = cells[0];
        cell.gens.pop()(cell, maze, sets, width, height);
        if (cell.gens.length === 0) {
            cells.shift();

        } else {
            cells.splice(getRandomInt(cells.length), 0, cells.shift());
        }
    }
    res.render('maze', {maze: maze});
});

module.exports = router;
