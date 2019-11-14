// Сделать заготовку для f маятника
// сделать переключение (только) цвета на hover
// Нулевая  и шестая колонки всегда нули???
// Перенести SVG на 3d-canvas, в канвасе сделать масштаб
var originMatrix = generateRandomArray(10);

// Playground params, increase k to make grid thicker
var playground = {
    cellSize: 50,
    k: 0.05,
    deadColor: '#ffe57a',
    aliveColor: '#00c147',
    gridColor: 'pink'
};
playground.grid = playground.k * playground.cellSize;

visualizeOrigin(originMatrix, createSvg());

document.getElementById('playground').style.background = playground.gridColor;
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
            .attr('width', playground.cellSize * (originMatrix.length + playground.k * (originMatrix.length + 1)))
            .attr('height', playground.cellSize * (originMatrix.length + playground.k * (originMatrix.length + 1)))
            .attr('id', 'playground');
    return svg;
};

function visualizeOrigin(matrix, svg) {
    svg.selectAll('g')
       .data(matrix)
       .enter()
       .append('g')
       .selectAll('rect')
       .data(function(d) {return d;})
       .enter()
       .append('rect')
       .attr('x', (d, i, j) => i * playground.cellSize + playground.grid * (i + 1))
       .attr('y', (d, i, j) => j * playground.cellSize + playground.grid * (j + 1))
       .attr('width', playground.cellSize)
       .attr('height', playground.cellSize)
       .attr('fill', (d) => {
           if (d == 1) { return playground.aliveColor} else {return playground.deadColor}
       })
       .on('click', function (d) {
           d3.select(this).datum(function() {
                console.log('Cell was ' + this.__data__)
                if (this.__data__ == 1) {
                    d3.select(this).attr('fill', playground.deadColor);
                    return 0;
                } else if (this.__data__ == 0) {
                    d3.select(this).attr('fill', playground.aliveColor);
                    return 1;
                };
           })
           
       });
};