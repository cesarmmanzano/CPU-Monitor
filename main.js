let express = require('express')
let app = express()
let http = require('http').Server(app)
let io = require('socket.io')(http)
let os = require('os-utils')

app.use(express.static('html'))

let cpuHistogram = []
let histogramLength = 60.1
let loadInterval = 750
http.listen(80, function () {

    for (let i = 0; i < histogramLength; i++) {
        cpuHistogram[i] = [i, 0]
    }

    setInterval(function () {
        os.cpuUsage(function (val) {
            updateCPUHistogram(Math.round(val * 100))
            io.emit('cpu histogram', cpuHistogram)
        })
    }, loadInterval)

})

function updateCPUHistogram(cpuLoad) {

    if (cpuHistogram.length >= histogramLength) {
        cpuHistogram.shift()
    }

    cpuHistogram.push([0, cpuLoad])

    for (let i = 0; i < histogramLength; i++) {
        cpuHistogram[i][0] = i
    }

}