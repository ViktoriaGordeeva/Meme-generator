function init() {
    renderImages()
    resizeCanvas()
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
    document.querySelector('.editor').style.display = 'flex';
    document.querySelector('.about').style.display = 'none'
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.user-gallery').style.display = "none";
    updateCurrMeme(+el.dataset.id)
    onRenderCanvas(+el.dataset.id)
    document.querySelector('item1').innerText = ''
}

function onRenderCanvas(id) {
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
function onUpdAlignment(align) {
    updAlignment(align)
    var currId = getCurrMeme().selectedImgId
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
    var offsetX
    var offsetY
    if (ev.type === 'touchstart') {
        ev.preventDefault()
        var rect = ev.target.getBoundingClientRect();
        offsetX = ev.targetTouches[0].pageX - rect.left;
        offsetY = ev.targetTouches[0].pageY - rect.top;
    } else {
        offsetX = ev.offsetX
        offsetY = ev.offsetY
    }
    var clickedLine = canvasClicked(offsetX, offsetY)
    if (clickedLine) {
        updCurrLineIdx(clickedLine)
        document.querySelector('.text-input').value = clickedLine.txt !== 'Enter your text' ? clickedLine.txt : ''
        onRenderCanvas(gMeme.selectedImgId)
        setTimeout(drawRect, 1)
    }
}

function onDownload(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-img.gif';
}
function updPage(page) {
    if (page === 'about') {
        document.querySelector('.about').style.display = 'block'
        document.querySelector('.editor').style.display = 'none';
        document.querySelector('.gallery').style.display = "none";
        document.querySelector('.user-gallery').style.display = "none";
    }
    if (page === 'logo') {
        document.querySelector('.about').style.display = 'none'
        document.querySelector('.editor').style.display = 'none';
        document.querySelector('.gallery').style.display = 'block';
        document.querySelector('.user-gallery').style.display = "none";
    }
    if (page === 'user-gallery') {
        document.querySelector('.about').style.display = 'none'
        document.querySelector('.editor').style.display = 'none';
        document.querySelector('.gallery').style.display = 'none';
        document.querySelector('.user-gallery').style.display = "block";
        onRenderImgs()
    }

}



function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}

function onSave() {
    var num = getSavedImgs()
    saveToStorage(`mem${num + 1}`, getCurrMeme())
    incrSavedImgs()
}

function onSetUserImg(val) {
    var meme = loadFromStorage(val)
    document.querySelector('.editor').style.display = 'flex';
    document.querySelector('.about').style.display = 'none'
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.user-gallery').style.display = "none";
    updateCurrMeme(meme)
    onRenderCanvas(meme.selectedImgId)
}

function onRenderImgs() {
    for(i=1; loadFromStorage(`mem${i}`); i++) {
        onRenderImg(`mem${i}`)
    }
}
function onRenderImg(val) {
    var canvas = document.querySelector(`#${val}`);
    var ctx = canvas.getContext('2d');
    var meme = loadFromStorage(val)
    var img = new Image();
    var url = getImages()[meme.selectedImgId-1].url
    img.src = url;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        meme.lines.map(line => restoreLine(line, ctx))
    }
}
function restoreLine(line, ctx) {
    ctx.strokeStyle = line.colorStroke
    ctx.fillStyle = line.color
    ctx.font = `10px Impact`
    ctx.textAlign = line.align
    var txt = line.txt
    ctx.fillText(txt, 5, 10)
    ctx.strokeText(txt, 5, 10)
}