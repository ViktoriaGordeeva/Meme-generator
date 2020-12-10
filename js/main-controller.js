function init() {
    renderImages()
}

function renderImages() {
    images = getImages()
    var strHTMLs = images.map(image => {
        return `
        <img src="${image.url}" data-id="${image.id}" class="item" alt="" onclick="onSetImg(this)">
        `
    });
    document.querySelector('.container').innerHTML = strHTMLs.join('')
}

function onSetImg(el) {
    // document.querySelector('.editor').style.display = 'flex'; ///!!!!!
    // document.querySelector('.gallery').style.display = "none"; ///!!!!!
    onRenderCanvas(+el.dataset.id)
    updateCurrMeme(+el.dataset.id)

}

function onRenderCanvas(id) {
    console.log('tried')
    var sourceImg = findImg(id)
    var img = new Image();
    img.src = sourceImg.url;
    img.onload = () => {
        console.log('after onload img')
        drawImage(img)
        createLines()
    }
}

function onUpdateLine(val) {
    var currId = getCurrMeme().selectedImgId
    updateLine(val)
    onRenderCanvas(currId)
}
function onAddLine() {
    var currId = getCurrMeme().selectedImgId
    addLine()
    onRenderCanvas(currId)
}
function onDeleteLine() {
    var currId = getCurrMeme().selectedImgId
    deleteLine()
    onRenderCanvas(currId)
}
function onUpdColor(color) {
    var currId = getCurrMeme().selectedImgId
    updColor(color)
    onRenderCanvas(currId)
}
function onUpdColorStroke(color) {
    var currId = getCurrMeme().selectedImgId
    updColorStroke(color)
    onRenderCanvas(currId)
}
function onUpdSize(val) {
    var currId = getCurrMeme().selectedImgId
    updSize(val)
    onRenderCanvas(currId)
}
function onupdFontAttr(el) {
    if (el.name === 'italic') updItalic()
    if (el.name === 'bold') updBold()
    if (el.name === 'caps') updCaps()
    var currId = getCurrMeme().selectedImgId
    onRenderCanvas(currId)
}
function onMoveLine(direct) {
    moveLine(direct)
    var currId = getCurrMeme().selectedImgId
    onRenderCanvas(currId)
}
function onCanvasClicked(ev) {
    var { offsetX, offsetY } = ev;
    var clickedLine = canvasClicked(offsetX, offsetY)
    if (clickedLine) {
        updCurrLineIdx(clickedLine)
        document.querySelector('.text-input').value = clickedLine.txt !== 'Enter your text' ? clickedLine.txt : ''
        onRenderCanvas(gMeme.selectedImgId)
        setTimeout(drawRect, 1)
    }
}



function onUpdAlignment(align) {
    updAlignment(align)
    var currId = getCurrMeme().selectedImgId
    onRenderCanvas(currId)
}
function onDownload(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-img.jpg';
}