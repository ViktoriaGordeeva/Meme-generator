
var gKeywords = { 'happy': 12, 'funny puk': 1 }
var gImgs = [
    { id: 1, url: 'meme/1.jpg', keywords: ['happy'] },
    { id: 2, url: 'meme/2.jpg', keywords: ['happy'] },
    { id: 3, url: 'meme/3.jpg', keywords: ['happy'] },
    { id: 4, url: 'meme/4.jpg', keywords: ['happy'] },
    { id: 5, url: 'meme/5.jpg', keywords: ['happy'] },
    { id: 6, url: 'meme/6.jpg', keywords: ['happy'] },
    { id: 7, url: 'meme/7.jpg', keywords: ['happy'] },
    { id: 8, url: 'meme/8.jpg', keywords: ['happy'] },
    { id: 9, url: 'meme/9.jpg', keywords: ['happy'] },
    { id: 10, url: 'meme/10.jpg', keywords: ['happy'] },
    { id: 11, url: 'meme/11.jpg', keywords: ['happy'] },
    { id: 12, url: 'meme/12.jpg', keywords: ['happy'] },
    { id: 13, url: 'meme/13.jpg', keywords: ['happy'] },
    { id: 14, url: 'meme/14.jpg', keywords: ['happy'] },
    { id: 15, url: 'meme/15.jpg', keywords: ['happy'] },
    { id: 16, url: 'meme/16.jpg', keywords: ['happy'] },
    { id: 17, url: 'meme/17.jpg', keywords: ['happy'] },
    { id: 18, url: 'meme/18.jpg', keywords: ['happy'] },
];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Enter your text',
            size: 40,
            align: 'left',
            color: 'white',
            colorStroke: 'black',
            italic: '',
            caps: '',
            bold: '',
            coords: { x: 20, y: 50 }
        }
    ]
}

var gCanvas = document.querySelector('#canvas');
var gCtx = gCanvas.getContext('2d');

// resizeCanvas()
// fillCanvas()///can be deleted


// function fillCanvas() {///can be deleted
//     gCtx.fillStyle = 'lightblue'
//     gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
// }
// function resizeCanvas() {
//     let elContainer = document.querySelector('.canvas-container');
//     gCanvas.width = elContainer.offsetWidth
//     gCanvas.height = elContainer.offsetHeight
// }


function getImages() {
    return gImgs
}

function drawImage(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
}
function getCurrMeme() {
    return gMeme
}
function updateCurrMeme(id) {
    gMeme.selectedImgId = id
}
// function findIndexOfImg(url) {
//     console.log(url)
//     return gImgs.findIndex(img => img.url === url)
// }
function findImg(id) {
    return gImgs.find(img => img.id === id)
}
function createLines() {
    gMeme.lines.map(line => createLine(line))
}
function createLine(line) {
    // console.log(line)
    gCtx.lineWidth = '1.5'
    gCtx.strokeStyle = line.colorStroke
    gCtx.fillStyle = line.color
    gCtx.font = `${line.italic} ${line.caps} ${line.bold} ${line.size}px Impact`
    // gCtx.font = 'italic small-caps 900 40px serif'
    gCtx.textAlign = line.align
    var txt = line.txt

    gCtx.fillText(txt, line.coords.x, line.coords.y)
    gCtx.strokeText(txt, line.coords.x, line.coords.y)

}

function updateLine(val) {
    gMeme.lines[gMeme.selectedLineIdx].txt = val
    console.log(gCtx.measureText(val))
    if (gCtx.measureText(val).width > (gCanvas.width - 40)) updSize(-1)

    // wrapText()
}


// function wrapText(gCtx, text, x, y, maxWidth, lineHeight) {
//     var words = gMeme.lines[gMeme.selectedLineIdx].txt.split(' ');
//     console.log(words)
//     var line = '';


//     console.log('5',gCanvas)
//     console.log('1',gCanvas.getContext('2d'))
//     for(var n = 0; n < words.length; n++) {
//       var testLine = line + words[n] + ' ';
//       console.log(testLine)
//     //   var metrics = gCtx.measureText(testLine);
//     //   var testWidth = metrics.width;

//       var testWidth = gCanvas.getContext('2d').measureText(testLine).width;

//       if (testWidth > gCanvas.width-40 && n > 0) {
//         gCanvas.getContext('2d').fillText(line, gMeme.lines[gMeme.selectedLineIdx].coords.x, gMeme.lines[gMeme.selectedLineIdx].coords.y);
//         line = words[n] + ' ';
//         // gMeme.lines[gMeme.selectedLineIdx].coords.y += gMeme.lines[gMeme.selectedLineIdx].size;
//         gMeme.lines[gMeme.selectedLineIdx].coords.y += 1.5;
//       }
//       else {
//         line = testLine;
//       }
//     }
//     gCanvas.getContext('2d').fillText(line, gMeme.lines[gMeme.selectedLineIdx].coords.x, gMeme.lines[gMeme.selectedLineIdx].coords.y);
//   }





function addLine() {
    var lineY
    if (gMeme.lines.length === 0) lineY = 50
    if (gMeme.lines.length === 1) lineY = gCanvas.height - 30
    if (gMeme.lines.length >= 2) lineY = gCanvas.height / 2

    gMeme.lines.push({
        txt: 'Enter your text',
        size: 20,
        align: 'left',
        color: 'white',
        colorStroke: 'black',
        italic: '',
        caps: '',
        bold: '',
        coords: { x: 20, y: lineY }
    })
}
function deleteLine() {
    // gMeme.lines[gMeme.selectedLineIdx].txt = ''
    var lineToDel = gMeme.lines[gMeme.selectedLineIdx]
    gMeme.lines.pop(lineToDel)
}
function updColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}
function updColorStroke(color) {
    gMeme.lines[gMeme.selectedLineIdx].colorStroke = color
}
function updSize(val) {
    console.log('size update')
    gMeme.lines[gMeme.selectedLineIdx].size += val
}
function updItalic() {
    gMeme.lines[gMeme.selectedLineIdx].italic = gMeme.lines[gMeme.selectedLineIdx].italic ? '' : 'italic'
}
function updBold() {
    gMeme.lines[gMeme.selectedLineIdx].bold = gMeme.lines[gMeme.selectedLineIdx].bold ? '' : '900'
}
function updCaps() {
    gMeme.lines[gMeme.selectedLineIdx].caps = gMeme.lines[gMeme.selectedLineIdx].caps ? '' : 'small-caps'
}
function moveLine(direct) {
    switch (direct) {
        case 'up':
            gMeme.lines[gMeme.selectedLineIdx].coords.y -= 5
            break
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].coords.x += 5
            break
        case 'down':
            gMeme.lines[gMeme.selectedLineIdx].coords.y += 5
            break
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].coords.x -= 5
            break
    }
}


function updCurrLineIdx(clickedLine) {
    gMeme.selectedLineIdx = gMeme.lines.findIndex(el => el === clickedLine)
}
function canvasClicked(offsetX, offsetY) {
    var clickedLine = gMeme.lines.find(line => {
        return offsetX >= line.coords.x && offsetX <= line.coords.x + gCtx.measureText(line.txt).width
            && offsetY >= line.coords.y - line.size && offsetY <= line.coords.y
    })
    return clickedLine
}
function drawRect() {
    var line = gMeme.lines[gMeme.selectedLineIdx]
    gCtx.beginPath()
    gCtx.strokeStyle = 'white'
    gCtx.rect(line.coords.x, line.coords.y, gCanvas.width - 40, - line.size) // x,y,widht,height
    gCtx.stroke()
}






function updAlignment(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
    switch (align) {
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].coords.x = 10;
            break;
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].coords.x = gCanvas.width / 2;
            break;
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].coords.x = gCanvas.width - 10;
            break;
    }
}