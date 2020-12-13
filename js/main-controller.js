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
    updPage('editor')
    var meme = {
        selectedImgId: +el.dataset.id,
        selectedLineIdx: 0,
        selectedStickerIdx: null,
        lines: [
            createLine()
        ],
        stickers: []
    }
    updateCurrMeme(meme)
    renderCanvas(+el.dataset.id)
    renderStickers()
}

function renderCanvas(id) {
    var sourceImg = findImg(id)
    var img = new Image();
    img.src = sourceImg.url;
    img.onload = () => {
        drawImage(img)
        drawLines()
        drawStickers()
    }
}

function onUpdateLine(val) {
    var currId = getCurrMeme().selectedImgId
    updateLine(val)
    renderCanvas(currId)
}
function onAddLine() {
    var currId = getCurrMeme().selectedImgId
    addLine()
    renderCanvas(currId)
}
function onDeleteElement() {
    var currId = getCurrMeme().selectedImgId
    deleteElement()
    renderCanvas(currId)
}
function onUpdAlignment(align) {
    updAlignment(align)
    var currId = getCurrMeme().selectedImgId
    renderCanvas(currId)
}
function onUpdColor(color) {
    var input = document.querySelector('.color');
    input.focus();
    input.click();
    input.addEventListener('input', () => {
        updColor(input.value)
        var currId = getCurrMeme().selectedImgId
        renderCanvas(currId)
    })
}
function onUpdColorStroke(color) {
    var input = document.querySelector('.colorStr');
    input.focus();
    input.click();
    input.addEventListener('input', () => {
        updColorStroke(input.value)
        var currId = getCurrMeme().selectedImgId
        renderCanvas(currId)
    })
}
function onUpdSize(val) {
    var currId = getCurrMeme().selectedImgId
    updSize(val)
    renderCanvas(currId)
}
function onupdFontAttr(el) {
    if (el.name === 'italic') updItalic()
    if (el.name === 'bold') updBold()
    if (el.name === 'caps') updCaps()
    var currId = getCurrMeme().selectedImgId
    renderCanvas(currId)
}
function onMoveLine(direct) {
    moveLine(direct)
    var currId = getCurrMeme().selectedImgId
    renderCanvas(currId)
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
    console.log('offsets',  offsetX,  offsetY)
    var clickedLine = getLineClicked(offsetX, offsetY)
    var clickedSticker = getStickerClicked(offsetX, offsetY)
    if (clickedLine) {
        updCurrLineIdx(clickedLine)
        gMeme.selectedStickerIdx = null
        document.querySelector('.text-input').value = clickedLine.txt !== 'Enter your text' ? clickedLine.txt : ''
        renderCanvas(gMeme.selectedImgId)
        setTimeout(drawRect, 0)
    } else if (clickedSticker) {
        updCurrStickerIdx(clickedSticker)
        gMeme.selectedLineIdx = null
        document.querySelector('.text-input').value = ''
        renderCanvas(gMeme.selectedImgId)
        setTimeout(drawRect, 0)
    } else return
}

function onDownload(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-img.png';
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
    if (page === 'editor') {
        document.querySelector('.editor').style.display = 'flex';
        document.querySelector('.about').style.display = 'none'
        document.querySelector('.gallery').style.display = 'none';
        document.querySelector('.user-gallery').style.display = "none";
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
    renderCanvas(meme.selectedImgId)
}

function onRenderImgs() {
    for (i = 1; loadFromStorage(`mem${i}`); i++) {
        onRenderImg(`mem${i}`)
    }
}
function onRenderImg(val) {
    var canvas = document.querySelector(`#${val}`);
    var ctx = canvas.getContext('2d');
    var meme = loadFromStorage(val)
    var img = new Image();
    var url = getImages()[meme.selectedImgId - 1].url
    img.src = url;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        meme.lines.forEach(line => restoreLine(line, ctx))
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


function renderStickers() {
    var strHTMLs = ''
    var stickers = getStickers()
    for (let i = 0; stickers[i]; i += 5) {
        strHTMLs += `
        <div class="mySlides fade">
        <p><span data-id="${i}" onclick="onAddSticker(this)">${stickers[i]}</span> 
        <span data-id="${i + 1}" onclick="onAddSticker(this)">${stickers[i + 1]}</span> 
        <span data-id="${i + 2}" onclick="onAddSticker(this)">${stickers[i + 2]}</span> 
        <span data-id="${i + 3}" onclick="onAddSticker(this)">${stickers[i + 3]}</span> 
        <span data-id="${i + 4}" onclick="onAddSticker(this)">${stickers[i + 4]}</span></p>
        </div>`
    }
    document.querySelector('.stickers').innerHTML = strHTMLs
    showSlides(getSlideIndex())
}
function plusSlides(n) {
    showSlides(gSlideIndex += n);
}
function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { gSlideIndex = 1 }
    if (n < 1) { gSlideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[gSlideIndex - 1].style.display = "block";
}

function onAddSticker(el) {
    var stickerId = +el.dataset.id
    addSticker(stickerId)
    drawSticker(stickerId)
    var currId = getCurrMeme().selectedImgId
    renderCanvas(currId)
}
