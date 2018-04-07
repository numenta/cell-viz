/* From http://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage */
function getGreenToRed(percent){
    var r, g;
    percent = 100 - percent;
    r = percent < 50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
    g = percent > 50 ? 255 : Math.floor((percent*2)*255/100);
    return rgbToHex(r, g, 0);
}

/* From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
function rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

let defaultOpts = {
    width: 400,
    height: 400,
    cellSize: 10,
    rowLength: 100,
    threshold: 0.5,
    onColor: 'skyblue',
    offColor: 'white',
    connectionColor: 'cornflowerblue'
}

function ReceptiveField(permanences, threshold, element) {
    this.permanences = permanences
    this.threshold = threshold
    this.el = element
}

ReceptiveField.prototype.draw = function(options) {
    let threshold = this.threshold
    let opts = Object.assign(defaultOpts, options)
    let perms = this.permanences
    let svg = d3.select('#' + this.el)
        .attr('width', opts.width)
        .attr('height', opts.height)

    svg.html('')

    function renderCell(r, c) {
        r.attr('fill', (d) => {
                if (d !== null) return opts.onColor
                return opts.offColor
            })
            .attr('stroke', 'darkgrey')
            .attr('stroke-width', 0.5)
            .attr('fill-opacity', 1)
            .attr('x', function(d, i) {
                let offset = i % opts.rowLength;
                return offset * opts.cellSize;
            })
            .attr('y', function(d, i) {
                let offset = Math.floor(i / opts.rowLength);
                return offset * opts.cellSize;
            })
            .attr('width', opts.cellSize)
            .attr('height', opts.cellSize)
        c.attr('fill', (d, i) => {
                if (perms[i] === null) return 'none'
                if (d < threshold) return 'none'
                //return '#' + getGreenToRed(d * 100)
                return opts.connectionColor
            })
            .attr('fill-opacity', 1)
            .attr('cx', function(d, i) {
                let offset = i % opts.rowLength;
                return offset * opts.cellSize + (opts.cellSize / 2);
            })
            .attr('cy', function(d, i) {
                let offset = Math.floor(i / opts.rowLength);
                return offset * opts.cellSize + (opts.cellSize / 2);
            })
            .attr('r', opts.cellSize / 4)
    }

    // Update
    let rects = svg.selectAll('rect').data(perms)
    let circs = svg.selectAll('circles').data(perms)
    renderCell(rects, circs)

    // Enter
    let newRects = rects.enter().append('rect')
    let newCircs = circs.enter().append('circle')
    renderCell(newRects, newCircs)

    // Exit
    rects.exit().remove()
    circs.exit().remove()

}

module.exports = ReceptiveField