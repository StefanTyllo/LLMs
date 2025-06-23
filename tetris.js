const stageWidth = 320;
const stageHeight = 320;
const cellSize = 32;
const cols = stageWidth / cellSize;
const rows = stageHeight / cellSize;

const SHAPES = {
  I: [[0,0],[1,0],[2,0],[3,0]],
  O: [[0,0],[1,0],[0,1],[1,1]],
  T: [[0,0],[1,0],[2,0],[1,1]],
  L: [[0,0],[0,1],[0,2],[1,2]],
  J: [[1,0],[1,1],[1,2],[0,2]],
  S: [[1,0],[2,0],[0,1],[1,1]],
  Z: [[0,0],[1,0],[1,1],[2,1]],
};

const stage = new Konva.Stage({
  container: 'container',
  width: stageWidth,
  height: stageHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

// draw grid
for (let x = 0; x < cols; x++) {
  for (let y = 0; y < rows; y++) {
    const rect = new Konva.Rect({
      x: x * cellSize,
      y: y * cellSize,
      width: cellSize,
      height: cellSize,
      stroke: '#555',
    });
    layer.add(rect);
  }
}

let board = Array.from({ length: rows }, () => Array(cols).fill(false));
let currentPiece = null;
let music = document.getElementById('bg-music');

function randomShape() {
  const keys = Object.keys(SHAPES);
  const name = keys[Math.floor(Math.random() * keys.length)];
  return { name, blocks: SHAPES[name].map(p => ({ x: p[0], y: p[1] })) };
}

function createPiece() {
  const { name, blocks } = randomShape();
  const group = new Konva.Group({ draggable: true });
  blocks.forEach(p => {
    const rect = new Konva.Rect({
      x: p.x * cellSize,
      y: p.y * cellSize,
      width: cellSize,
      height: cellSize,
      fill: 'cyan',
      stroke: '#000',
    });
    group.add(rect);
  });
  group.offset({ x: cellSize / 2, y: cellSize / 2 });
  group.position({ x: stageWidth / 2, y: cellSize });
  group.on('dragend', () => tryPlace(group));
  layer.add(group);
  layer.draw();
  currentPiece = { group, blocks };
}

function rotatePiece() {
  if (!currentPiece) return;
  currentPiece.group.rotate(90);
  layer.draw();
}

function tryPlace(group) {
  const pos = group.position();
  const angle = ((group.rotation() % 360) + 360) % 360;
  const rotatedBlocks = currentPiece.blocks.map(p => rotate(p, angle));
  const gridX = Math.round((pos.x - cellSize / 2) / cellSize);
  const gridY = Math.round((pos.y - cellSize / 2) / cellSize);

  if (canPlace(rotatedBlocks, gridX, gridY)) {
    placeBlocks(rotatedBlocks, gridX, gridY);
    group.destroy();
    layer.draw();
    checkEnd();
    createPiece();
  } else {
    group.position({ x: stageWidth / 2, y: cellSize });
    layer.draw();
  }
}

function rotate(p, angle) {
  let { x, y } = p;
  switch (angle) {
    case 90: return { x: -y, y: x };
    case 180: return { x: -x, y: -y };
    case 270: return { x: y, y: -x };
    default: return { x, y };
  }
}

function canPlace(blocks, gx, gy) {
  return blocks.every(b => {
    const x = gx + b.x;
    const y = gy + b.y;
    return x >= 0 && x < cols && y >= 0 && y < rows && !board[y][x];
  });
}

function placeBlocks(blocks, gx, gy) {
  blocks.forEach(b => {
    const x = gx + b.x;
    const y = gy + b.y;
    board[y][x] = true;
    const rect = new Konva.Rect({
      x: x * cellSize,
      y: y * cellSize,
      width: cellSize,
      height: cellSize,
      fill: 'orange',
      stroke: '#000',
    });
    layer.add(rect);
  });
}

function checkEnd() {
  if (hasMove()) return;
  const total = rows * cols;
  const occupied = board.flat().filter(v => v).length;
  const percent = Math.round((occupied / total) * 100);
  alert(`Koniec gry! Zajętość planszy: ${percent}%`);
  balloonAnimation();
}

function hasMove() {
  const keys = Object.keys(SHAPES);
  for (let name of keys) {
    const blocks = SHAPES[name];
    for (let angle of [0,90,180,270]) {
      const rotated = blocks.map(p => rotate({x:p[0],y:p[1]}, angle));
      for (let x=0;x<cols;x++) {
        for (let y=0;y<rows;y++) {
          if (canPlace(rotated, x, y)) return true;
        }
      }
    }
  }
  return false;
}

function balloonAnimation() {
  for (let i=0; i<20; i++) {
    const circle = new Konva.Circle({
      x: Math.random() * stageWidth,
      y: stageHeight + Math.random() * 50,
      radius: 10,
      fill: Konva.Util.getRandomColor(),
    });
    layer.add(circle);
    const anim = new Konva.Animation(frame => {
      circle.y(circle.y() - 30 * (frame.timeDiff / 1000));
      if (circle.y() < -20) anim.stop();
    }, layer);
    anim.start();
  }
}

document.getElementById('rotateBtn').addEventListener('click', rotatePiece);
document.getElementById('nextBtn').addEventListener('click', () => {
  if (currentPiece) currentPiece.group.destroy();
  createPiece();
});

music.volume = 0.5;
music.play().catch(() => {});

createPiece();
