function newArray(N) {
    // 2D array 
    var base = new Array(N);
    for (let i = 0; i < base.length; i++) {
        base[i] = new Array(N);
    };
    // Populating array with random ones and zeroes
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N ; j++) {
            base[i][j] = Math.round(Math.random());
        };
    };
    return base;
};

var matrix = newArray(5);
console.log(matrix);

var cols = matrix.length;
var rows = matrix[0].length;
var cellSize = 50;

var svg = d3.select("#playground")
                .append("svg")
                .attr("width", cols * cellSize)
                .attr("height", rows * cellSize);
    svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "pink");

    svg.append("g")
                .selectAll("g")                 
                .data(matrix)
                .enter()
                .append("g")
                .attr('transform', function (d, i) {
                    return 'translate(' + i * cellSize + ')'
                })
                .selectAll("text")
                .data( function(d) { return d; } )
                .enter()
                .append("text")
                .text( function(d,i,j) { return d; } )
                .attr("x", function(d, i, j) {
                    return 30;
                })
                .attr('y', function(d, i) {
                    return i * cellSize + 30;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px");