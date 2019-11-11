
// Как завернуть Svg в функцию, но потом норально передать его в visualize?
var originMatrix = generateRandomArray(10);

var playground = {
    length: originMatrix.length,
    cellSize: 50
};

var svg = d3.select('#playgroundContainer')
                .append('svg')
                .attr('width', playground.length * playground.cellSize)
                .attr('height', playground.length * playground.cellSize);
var rect = svg.append('rect')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'pink');

visualize(originMatrix);

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

// Takes array and fills svg with it
function visualize(matrix) {

    svg.append("g")
                .selectAll("g")                 
                .data(matrix)
                .enter()
                .append("g") //removing
                .selectAll("text") // these
                .data( function(d,i,j) { return d; } ) //lines
                .enter() //text displays normally
                .append("text")
                .text( function(d,i,j) { return d; } )
                .attr("x", function(d,i,j) {
                			return (i * 20) + 40; 
                })
                .attr("y", function(d,i,j) { return (j * 20) + 40; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
};