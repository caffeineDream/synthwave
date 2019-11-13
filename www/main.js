// Перенести SVG на 3d-canvas, в канвасе сделать масштаб
// Закинуть параметры playground в объект, там же сохранить все цвета (в т.ч. сделать ссылку в css)
var originMatrix = generateRandomArray(10);

// Playground size, increase k to make grid thicker
const cellSize = 50;
const k = 0.05;
const grid = k * cellSize;

visualize(originMatrix, createSvg());

//-------------------------------------------------------------
// Generate 2D-array, populate it with dead and living cells
function generateRandomArray(N) {
    // Create empty 2D-array 
    var randomArray = new Array(N);
    for (let i = 0; i < randomArray.length; i++) {
        randomArray[i] = new Array(N);
    };
    // Populating array with dead and living cells ~ 50/50
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N ; j++) {
            randomArray[i][j] = Math.round(Math.random());
        };
    };
    // Thin out living cells. Place counter increment inside if statement
    // to increase amout of living cells.
    var counter = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N ; j++) {
          if (randomArray[i][j] == 1 && counter % 2 == 0) {
             randomArray[i][j] = 0;
          };
          counter += 1;
        };
    };  
    console.log(randomArray);
    return randomArray;
};

function createSvg() {
    var svg = d3.select('#playgroundContainer')
            .append('svg')
            .attr('width', cellSize * (originMatrix.length + k * (originMatrix.length + 1)))
            .attr('height', cellSize * (originMatrix.length + k * (originMatrix.length + 1)))
            .attr('class', 'svg_background');
    return svg;
};

// Takes array and fills svg with it
function visualize(matrix, svg) {
    svg.selectAll('g')
       .data(matrix)
       .enter()
       .append('g')
       .selectAll('rect')
       .data(function(d) {return d;})
       .enter()
       .append('rect')
       .attr('x', (d, i, j) => i * cellSize + grid * (i + 1))
       .attr('y', (d, i, j) => j * cellSize + grid * (j + 1))
       .attr('width', cellSize)
       .attr('height', cellSize)
       .attr('fill', (d) => {
           if (d == 1) { return '#00c147'} else {return '#ffe57a'}
       })
};