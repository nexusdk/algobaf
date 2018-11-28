let wait_time = 10;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solve_rec(x, y) {
    let el = document.getElementById(y + '_' + x);
    el.classList.add('visited');
    await sleep(10);
    let up = document.getElementById((y - 1) + '_' + x);
    let down = document.getElementById((y + 1) + '_' + x);
    let left = document.getElementById(y + '_' + (x - 1));
    let right = document.getElementById(y + '_' + (x + 1));
    let res = !right && !down;
    if (!el.classList.contains('right') && right && !right.classList.contains('visited')) {
        res = res || await solve_rec(x + 1, y);
        await sleep(10);
    }
    if (!el.classList.contains('down') && down && !down.classList.contains('visited')) {
        res = res || await solve_rec(x, y + 1);
        await sleep(10);
    }
    if (left && !left.classList.contains('right') && !left.classList.contains('visited')) {
        res = res || await solve_rec(x - 1, y);
        await sleep(10);
    }
    if (up && !up.classList.contains('down') && !up.classList.contains('visited')) {
        res = res || await solve_rec(x, y - 1);
        await sleep(10);
    }
    if (!res) {
        el.classList.remove('visited');
    }
    return res;
}

function solve() {
    solve_rec(0, 0);
}
