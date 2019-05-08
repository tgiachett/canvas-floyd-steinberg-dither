
// let img = new Image();
// img.src = 'Saturn.jpg';
// let c = document.getElementById('canvas');
// let ctx = canvas.getContext('2d');
// // img.crossOrigin = "Anonymous";


// img.addEventListener('load', function() {
//     //drawImage statements go here
//     c.width = img.width;
//     c.height = img.height;
//     ctx.drawImage(img, 0, 0, 1200, 675);
// }, false);
// let demo = document.getElementById("demo");
const sub = document.getElementById("dither");
// let test = document.getElementById("stepsTest");
// let btn = document.getElementById("btn");
let c = document.getElementById("canvas");
let ctx = c.getContext('2d');
let img = new Image();
let brightest = 0;
let darkest = 255;
img.onload = init; img.crossOrigin = "";
img.src = './Profile_Pic.png';

function init() {
    setup(this);
}

function setup(img) {
    console.log(img);
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
	// Enter pressed
      return false;
    }
};

// sub.onclick = function() {
//     let  brightnessVal = document.getElementById("brightnessVal").value;
//     reset(img);
//     dither(brightnessVal);
    
// };

sub.addEventListener("click", function(event) {
    event.preventDefault();
    setup(img);
    dither();
    
});

// btn.onclick = function() {
//     let idataSrc = ctx.getImageData(0,0, c.width, c.height),
// 	idataTrg = ctx.createImageData(c.width, c.height),
// 	dataSrc = idataSrc.data,
// 	dataTrg = idataTrg.data,
// 	len = dataSrc.length, i = 0, luma;
    
//     //convert by iteratiing over each pixel each representing RGBA
//     for (;i < len; i += 4) {
// 	luma = dataSrc[i] * 0.2126 + dataSrc[i+1] * .7152 + dataSrc[i+2] * .0722;
// 	if(luma > brightest) {
// 	    brightest = luma;
// 	}
// 	if(luma < darkest) {
// 	    darkest = luma;
// 	}
// 	dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = luma;
// 	dataTrg[i+3] = dataSrc[i+3];
//     }

    
//     ctx.putImageData(idataTrg, 0, 0);
//     // demo.src = c.toDataURL();

//     //restore backupdata
//     // ctx.putImageData(idataSrc, 0, 0);
    
// };

function dither (number) {
    let idataSrc = ctx.getImageData(0,0, c.width, c.height),
	idataTrg = ctx.createImageData(c.width, c.height),
	dataSrc = idataSrc.data,
	dataTrg = idataTrg.data,
	len = dataSrc.length,luma;
    
    
    
    //convert by iteratiing over each pixel each representing RGBA
    for (let i = 0;i < len; i += 4) {
	luma = dataSrc[i] * 0.2126 + dataSrc[i+1] * .7152 + dataSrc[i+2] * .0722;
	if(luma > brightest) {
	    brightest = luma;
	}
	if(luma < darkest) {
	    darkest = luma;
	}
	dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = luma;
	dataTrg[i+3] = dataSrc[i+3];
    }
    let range = brightest - darkest;
    let step = range / number;
    let pal = [0, 255];

       for (let i = 0; i < len; i += 4) {
	   // what are the addresses I need
	   //next pixel i + 4 7/16
	   //pixel down + c.width * 4 5/16
	   // pixel down left (c.width * 4) -4 3/16
	   //pixel down right 1/16
	   // find and handle edges

	   //(i % c.width * 4 === 0 && i != 0) ||
	   if(dataTrg[i+(c.width * 4)] === -1 || dataTrg[i+4] === -1 ) {
	       console.log("end pixel");
	       break;
	       ;} else {
		   let oldPixel = dataTrg[i];
		  
		   let newPixel = findClosestPalCol(dataTrg[i], pal);
		  
		   dataTrg[i] = dataTrg[i+1] = dataTrg[i+2] = newPixel;
		   let quantError = oldPixel - newPixel;
		   dataTrg[i+4] = dataTrg[i+4] + quantError * (7 / 16);
		   // console.log(dataTrg[i+4]);
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


