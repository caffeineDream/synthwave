// Перенести SVG на 3d-canvas, в канвасе сделать масштаб
document.addEventListener('DOMContentLoaded', getStarted());

document.getElementById('start').addEventListener('click', getPrimordialMatrix)

function getPrimordialMatrix() {
    const rawOrigin = d3.selectAll('rect').data()
    const edgeLength = Math.sqrt(rawOrigin.length);
    var primordialMatrix = [];
    for (let i = 0; i < rawOrigin.length;) {
        primordialMatrix.push(rawOrigin.slice(i, i+=edgeLength))
    };
    console.log(primordialMatrix)
};




function getStarted() {
    var originMatrix = generateRandomArray(8);

    // Playground params, increase k to make grid thicker
    var playground = {
        cellSize: 50,
        k: 0.05,
        deadColor: '#93ACB5',
        aliveColor: '#6DA34D',
        gridColor: '#A9D3FF',
    };
    playground.grid = playground.k * playground.cellSize;
    
    visualizeOrigin(originMatrix, createSvg());

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
        console.log(randomArray);
        return randomArray;
    };

    function createSvg() {
        var svg = d3. select('#playgroundContainer')
                .append('svg')
                .attr('width', playground.cellSize * (originMatrix.length + playground.k * (originMatrix.length + 1)))
                .attr('height', playground.cellSize * (originMatrix.length + playground.k * (originMatrix.length + 1)))
                .attr('id', 'playground');
            document.getElementById('playground').style.background = playground.gridColor;
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
            if (d == 1) { return playground.aliveColor} else if (d==0)  {return playground.deadColor}
            else {return 'black'}
            })
        .on('click', function (d) {
            d3.select(this).datum(function() {
                    if (this.__data__ == 1) {
                        d3.select(this).attr('fill', playground.deadColor);
                        return 0;
                    } else if (this.__data__ == 0) {
                        d3.select(this).attr('fill', playground.aliveColor);
                        return 1;
                    };
            });
            
            })
        .on('mouseover',function(d, i, j) {
                // const was = d3.select(this).style('fill')
                // d3.select(this).attr('fill', playground.hoverColor);
        })
        .on('mouseout',function(d) {

        })
    };
};
