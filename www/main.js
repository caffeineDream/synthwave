// Перенести SVG на 3d-canvas, в канвасе сделать масштаб
// Две разных Visualize переделать в одну?
// generateRandomArray теперь в глобалке =(

var playgroundParams = {
    matrixSize: 8,
    cellSize: 50,
    // increase k to make grid thicker
    k: 0.05,
    deadColor: '#93ACB5',
    aliveColor: '#6DA34D',
    gridColor: '#A9D3FF',
    cycleSpeed: 125
};
playgroundParams.grid = playgroundParams.k * playgroundParams.cellSize;

var currentMatrixState;
var paused = false;

var buttonActionStore = {
    pause: function() {
        paused = true;
    },
    resume: function() {
        currentMatrixState = getMatrixFromSvg();
        paused = false;
        manageCycles(currentMatrixState);
    },
    clear: function() {
        currentMatrixState = currentMatrixState.map((subArray, i) => {
            return subArray.map((cell, j) => {
                    return 0;
                });
        });
        visualizeMatrixAnew(currentMatrixState);
    },
    randomize: function() {
         currentMatrixState = generateRandomArray(playgroundParams.matrixSize)
         visualizeMatrixAnew(currentMatrixState);
    }
};

document.addEventListener('DOMContentLoaded', getStarted(playgroundParams));
document.getElementById('start').addEventListener('click', startCycle);
document.getElementById('pause').addEventListener('click', buttonActionStore.pause);
document.getElementById('resume').addEventListener('click', buttonActionStore.resume);
document.getElementById('clear').addEventListener('click', buttonActionStore.clear);
document.getElementById('randomize').addEventListener('click', buttonActionStore.randomize);

function startCycle() {
    currentMatrixState = getMatrixFromSvg();
    var zeroGenMatrix = currentMatrixState;
    var firstGenMatrix = lifeLogic(zeroGenMatrix);
    visualizeMatrixAnew(firstGenMatrix);
    manageCycles(firstGenMatrix);
};

function manageCycles(matrix) {
    var nextGenMatrix = lifeLogic(matrix);;
    visualizeMatrixAnew(nextGenMatrix);
    if (!paused) {
        setTimeout(function() {
            manageCycles(nextGenMatrix);
        }, playgroundParams.cycleSpeed);
    };

};

function lifeLogic(currentMatrix) {
    function countNeighbors(currentMatrix, iCell, jCell) {
        function isUndefined(array, i, j) {
            try {
                return array[i][j] == undefined;
            } catch(e) { 
                return true; 
            };
        };
        
        let counter = -1; // for loop includes the cell being observed
        for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
                if (!isUndefined(currentMatrix, iCell + x, jCell + y )) {
                    if (currentMatrix[iCell + x][jCell + y] == 1) {
                        counter++;
                    };
                };
            };

        };
        return counter;
    };
    var nextGenMatrix = currentMatrix.map((subArray, i) => {
        return subArray.map((cell, j) => {
                if (cell == 1) {
                    var neighbors = countNeighbors(currentMatrix, i, j);
                    if (neighbors < 2 || neighbors > 3) {
                        return 0;
                    } else { return 1; };
                } else if (cell == 0) {
                    var neighbors = countNeighbors(currentMatrix, i, j) + 1;
                    if (neighbors == 3) {
                        return 1;
                    } else { return 0; }
                }; 
            });
    });
    currentMatrixState = nextGenMatrix;
    return nextGenMatrix;
};

function visualizeMatrixAnew(matrix) {
    var svg = d3.select('#playground');
    svg.selectAll('g').remove();

    svg.selectAll('g')
    .data(matrix)
    .enter()
    .append('g')
    .selectAll('rect')
    .data(function(d) {return d;})
    .enter()
    .append('rect')
    .attr('x', (d, i, j) => i * playgroundParams.cellSize + playgroundParams.grid * (i + 1))
    .attr('y', (d, i, j) => j * playgroundParams.cellSize + playgroundParams.grid * (j + 1))
    .attr('width', playgroundParams.cellSize)
    .attr('height', playgroundParams.cellSize)
    .attr('fill', (d) => {
        if (d == 1) { return playgroundParams.aliveColor} else if (d==0)  {return playgroundParams.deadColor}
        else {return 'black'}
        })
    .on('click', function (d) {
        d3.select(this).datum(function() {
                if (this.__data__ == 1) {
                    d3.select(this).attr('fill', playgroundParams.deadColor);
                    return 0;
                } else if (this.__data__ == 0) {
                    d3.select(this).attr('fill', playgroundParams.aliveColor);
                    return 1;
                };
        });   
    });
};

function getMatrixFromSvg() {
    const rawOrigin = d3.selectAll('rect').data()
    const edgeLength = Math.sqrt(rawOrigin.length);
    var zeroGenMatrix = [];
    for (let i = 0; i < rawOrigin.length;) {
        zeroGenMatrix.push(rawOrigin.slice(i, i+=edgeLength))
    };
    return zeroGenMatrix;
};
// Generate 2D-array, populate it with dead and living cells 50/50
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

function getStarted(playgroundParams) {
    currentMatrixState = generateRandomArray(playgroundParams.matrixSize);
    const originMatrix = currentMatrixState;

    visualizeOrigin(originMatrix, createSvg(playgroundParams), playgroundParams);

    function createSvg(playgroundParams) {
        var svg = d3. select('#playgroundContainer')
                .append('svg')
                .attr('width', playgroundParams.cellSize * (originMatrix.length + playgroundParams.k * (originMatrix.length + 1)))
                .attr('height', playgroundParams.cellSize * (originMatrix.length + playgroundParams.k * (originMatrix.length + 1)))
                .attr('id', 'playground');
            document.getElementById('playground').style.background = playgroundParams.gridColor;
        return svg;
    };

    function visualizeOrigin(matrix, svg, playgroundParams) {
        svg.selectAll('g')
        .data(matrix)
        .enter()
        .append('g')
        .selectAll('rect')
        .data(function(d) {return d;})
        .enter()
        .append('rect')
        .attr('x', (d, i, j) => i * playgroundParams.cellSize + playgroundParams.grid * (i + 1))
        .attr('y', (d, i, j) => j * playgroundParams.cellSize + playgroundParams.grid * (j + 1))
        .attr('width', playgroundParams.cellSize)
        .attr('height', playgroundParams.cellSize)
        .attr('fill', (d) => {
            if (d == 1) { return playgroundParams.aliveColor} else if (d==0)  {return playgroundParams.deadColor}
            else {return 'black'}
            })
        .on('click', function (d) {
            d3.select(this).datum(function() {
                    if (this.__data__ == 1) {
                        d3.select(this).attr('fill', playgroundParams.deadColor);
                        return 0;
                    } else if (this.__data__ == 0) {
                        d3.select(this).attr('fill', playgroundParams.aliveColor);
                        return 1;
                    };
            });   
        });
    };
};
