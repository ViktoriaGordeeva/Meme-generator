
var gKeywords = { 'happy': 12, 'funny puk': 1 }
const gImgs = [
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
    { id: 19, url: 'meme/try.gif', keywords: ['happy'] },
];
var gMeme
// {
//     selectedImgId: 5,
//     selectedLineIdx: 0,
//     lines: [
//         {
//             txt: 'Enter your text',
//             size: 40,
//             align: 'left',
//             color: 'white',
//             colorStroke: 'black',
//             italic: '',
//             caps: '',
//             bold: '',
//             coords: { x: 20, y: 50 }
//         }
//     ]
// }

const gCanvas = document.querySelector('#canvas');
const gCtx = gCanvas.getContext('2d');
var gSavedImgs = 0;
const gStickers = ['🤣', '😊', '😭', '😎', '☠️',
    '👽', '👾', '💩', '🧠', '👀',
    '🙈', '🦥', '☄️', '💥', '🔥',
    '🌟', '🍓', '🚀', '🎉', '💲']
var gSlideIndex = 1;

function resizeCanvas() {
    var canvasSize;
    if (window.innerWidth < 650) canvasSize = window.innerWidth / 1.5;
    if (window.innerWidth > 650) canvasSize = window.innerWidth / 1.8;
    if (window.innerWidth > 900) canvasSize = window.innerWidth / 2;

    gCanvas.width = canvasSize;
    gCanvas.height = canvasSize;
}

function getImages() {
    return gImgs
}
function getSavedImgs() {
    return gSavedImgs
}
function incrSavedImgs() {
    gSavedImgs++
}
function drawImage(img) {
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
}

function getStickers() {
    return gStickers
}
function findSticker(id) {
    return gStickers[id]
}
function getSlideIndex() {
    return gSlideIndex
}
function getCurrMeme() {
    return gMeme
}
function updateCurrMeme(val) {
    gMeme = val
}
function findImg(id) {
    return gImgs.find(img => img.id === id)
}
function drawLines() {
    gMeme.lines.forEach(line => drawLine(line))
}
function drawLine(line) {
    gCtx.lineWidth = '1.5'
    gCtx.strokeStyle = line.colorStroke
    gCtx.fillStyle = line.color
    gCtx.font = `${line.italic} ${line.caps} ${line.bold} ${line.size}px Impact`
    gCtx.textAlign = line.align
    var txt = line.txt

    gCtx.fillText(txt, line.coords.x, line.coords.y)
    gCtx.strokeText(txt, line.coords.x, line.coords.y)

}

function updateLine(val) {
    gMeme.lines[gMeme.selectedLineIdx].txt = val
    if (gCtx.measureText(val).width > (gCanvas.width - 40)) updSize(-1)
}

function createLine(lineY = 50) {
    return {
        txt: 'Enter your text',
        size: 40,
        align: 'left',
        color: 'white',
        colorStroke: 'black',
        italic: '',
        caps: '',
        bold: '',
        coords: { x: 20, y: lineY }
    }
}

function addLine() {
    var lineY
    if (gMeme.lines.length === 0) lineY = 50
    if (gMeme.lines.length === 1) lineY = gCanvas.height - 30
    if (gMeme.lines.length >= 2) lineY = gCanvas.height / 2

    gMeme.lines.push(
        createLine(lineY))
}
function deleteElement() {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        var lineToDel = gMeme.lines[gMeme.selectedLineIdx]
        gMeme.lines.pop(lineToDel)
    } else {
        var stickerToDel = gMeme.stickers[gMeme.selectedStickerIdx]
        gMeme.stickers.pop(stickerToDel)
    }
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
function updColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}
function updColorStroke(color) {
    gMeme.lines[gMeme.selectedLineIdx].colorStroke = color
}
function updSize(val) {
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
    var element
    if (gMeme.selectedLineIdx !== null) {
        element = gMeme.lines[gMeme.selectedLineIdx].coords
    } else {
        element = gMeme.stickers.find(el => el.id = gMeme.selectedStickerIdx)
    }
    switch (direct) {
        case 'up':
            element.y -= 5
            break
        case 'right':
            element.x += 5
            break
        case 'down':
            element.y += 5
            break
        case 'left':
            element.x -= 5
            break
    }
}


function updCurrLineIdx(clickedLine) {
    gMeme.selectedLineIdx = gMeme.lines.findIndex(el => el === clickedLine)
}
function updCurrStickerIdx(clickedSticker) {
    gMeme.selectedStickerIdx = clickedSticker.id
}
function getLineClicked(offsetX, offsetY) {
    var clickedLine = gMeme.lines.find(line => {
        return offsetX >= line.coords.x && offsetX <= line.coords.x + gCtx.measureText(line.txt).width
            && offsetY >= line.coords.y - line.size && offsetY <= line.coords.y
    })
    return clickedLine
}
function getStickerClicked(offsetX, offsetY) {
    var clickedSticker = gMeme.stickers.find(sticker => {
        return offsetX >= sticker.x && offsetX <= sticker.x + (gMeme.lines[0].size * 0.8)
            && offsetY >= sticker.y - (gMeme.lines[0].size * 0.8) && offsetY <= sticker.y
    })
    return clickedSticker
}
function drawRect() {
    if (gMeme.selectedLineIdx !== null) {
        var line = gMeme.lines[gMeme.selectedLineIdx]
        gCtx.beginPath()
        gCtx.strokeStyle = 'white'
        gCtx.rect(line.coords.x, line.coords.y, gCanvas.width - 40, - line.size) // x,y,widht,height
        gCtx.stroke()
    } else {
        var sticker = gMeme.stickers.find(el => el.id === gMeme.selectedStickerIdx)
        gCtx.beginPath()
        gCtx.strokeStyle = 'white'
        gCtx.rect(sticker.x + 5, sticker.y + 5, (gMeme.lines[0].size * 0.8), - (gMeme.lines[0].size * 0.8)) // x,y,widht,height
        gCtx.stroke()
    }
}

function addSticker(id) {
    gMeme.stickers.push({ id: id, x: gCanvas.width / 2, y: gCanvas.height / 2 })
}
function drawStickers() {
    gMeme.stickers.forEach(sticker => {
        drawSticker(sticker)
    })
}
function drawSticker(sticker) {
    var stickerImg = gStickers[sticker.id]
    gCtx.lineWidth = '1.5'
    gCtx.font = `${gMeme.lines[0].size * 0.8}px Impact`
    gCtx.fillText(stickerImg, sticker.x, sticker.y)
}


