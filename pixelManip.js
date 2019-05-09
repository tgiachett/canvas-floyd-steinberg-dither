
const picturesArr = ['Maine1.jpg', 'Maine2.jpg', 'Utah1.jpg', 'Profile_Pic.png'];
const changePic = document.getElementById('changePic');
const sub = document.getElementById("dither");
let pictureIndex = 0;
let c = document.getElementById("canvas");
let ctx = c.getContext('2d');
let img = new Image();
img.onload = init; img.crossOrigin = "";
img.src = `./${picturesArr[pictureIndex]}`;

function init() {
    setup(this);
}

function setup(img) {
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);; 
}


document.onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
	e.preventDefault();
	setup(img);
	dither();

	return false;
    }
};

changePic.addEventListener("click", function(event) {
    event.preventDefault();
    if(pictureIndex === picturesArr.length-1) {
	pictureIndex = -1;
	
    }
    pictureIndex++;
    img.src = `./${picturesArr[pictureIndex]}`;
    setup(img);

    
});

sub.addEventListener("click", function(event) {
    event.preventDefault();
    setup(img);
    dither();
    
});

function dither (number) {
    let idataSrc = ctx.getImageData(0,0, c.width, c.height),
	idataTrg = ctx.createImageData(c.width, c.height),
	dataSrc = idataSrc.data,
	dataTrg = idataTrg.data,
	len = dataSrc.length,luma;
    // convert to grayscale
    for (let i = 0;i < len; i += 4) {
	luma = dataSrc[i] * 0.2126 + dataSrc[i+1] * .7152 + dataSrc[i+2] * .0722;
	dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = luma;
	dataTrg[i+3] = dataSrc[i+3];
    }
    

    for (let i = 0; i < len; i += 4) {
	if(dataTrg[i+(c.width * 4)] === -1 || dataTrg[i+4] === -1 ) {
	    console.log("end pixel");
	    break;
	    ;} else {
		let oldPixel = dataTrg[i];
		
		let newPixel = findClosestPalCol(dataTrg[i]);
		
		dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = newPixel;
		let quantError = oldPixel - newPixel;
		dataTrg[i+4] = dataTrg[i+4] + quantError * (7 / 16);
		dataTrg[i+(c.width * 4)] = dataTrg[i+(c.width * 4)] + quantError * (5 / 16);
		dataTrg[i+(c.width* 4 -4)] = dataTrg[i+(c.width*4 -4)] + quantError * (3 / 16);
		dataTrg[i+(c.width* 4 +4)] = dataTrg[i+(c.width * 4 +4)] + quantError * (1 / 16);
	    }

    }

    ctx.putImageData(idataTrg, 0, 0);

};

function findClosestPalCol (srcPx) {
    if(256-srcPx < 256/2) {
	return 255;
    } else {
	return 0;
    }
    
} 


