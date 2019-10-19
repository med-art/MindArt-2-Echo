// TODO:
// add screen rotation functionality
// map the scale value to max out at 1x1

let colArray = ["#e02027", "#d64389", "#943390", "#0b52a0", "#499ed7", "#16ac84", "#0b7c40", "#135741", "#f8e400", "#f0b51d", "#f78f26", "#ed6623", "#ffffff", "#ddcba5", "#b05938", "#050606"];
//red, magenta, purple, darkblue, lightblue, bluegreen, green, darkgreen, yellow, mustard, wax, orange, white, sand, brown, black

// increment from

let fillCol = 0;
let paintCol = 0;

let backdrop, paint, foreground;

let faderStart = 0;

let button, newButton, saveButton;
let swatch1, swatch2, swatch3, swatch4;

let eraseBool = 0;

let vW, vMin, vMax;

let appCol = "#244c6f";

let horizCount = 1,
  vertCount = 3;

  let pixelCount

let brushSelected = 1;
let colSelected = "#ffffff";
let colArrayNum = 8;

let selColour;

let colShift = 0;

let gridLineSize = 12;

let stage = 0;

let gridVStextureBool = 0;

let tileNum = 1;



function setup() {

  createCanvas(windowWidth - 6, windowHeight - 6);

  calcDimensions();


  background(51);
  backdrop = createGraphics(width, height);
  backdrop.colorMode(RGB, 255, 255, 255, 1000);
  paint = createGraphics(width, height);
  paint.colorMode(RGB, 255, 255, 255, 1000);
  foreground = createGraphics(width, height);
  foreground.colorMode(RGB, 255, 255, 255, 1000);
  sliderImg = createGraphics(width, height);
  backdrop.noStroke();
  paint.noStroke();

  makeSwatch();
  newGrid();

}


function calcDimensions() {
  vW = width / 100;

  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }
}

function makeSwatch() {

  button = createImg('assets/eraseOn.png');
  button.remove();
  button = createImg('assets/eraseOff.png');
  button.position(1.5 * vMax, height - (14 * vMax));
  button.size(14 * vMax, 14 * vMax);
  button.mousePressed(invertButton);



  swatch1 = createButton("");
  swatch1.position(15 * vMax, height - (11.5 * vMax));
  swatch1.size(8 * vMax, 9 * vMax);
  swatch1.style("background-color", "White");
  swatch1.class("box");
  swatch1.mousePressed(function() {
    changeBrush(1, 12, 0)
  });

  swatch2 = createButton("");
  swatch2.position(23 * vMax, height - (11.5 * vMax));
  swatch2.size(8 * vMax, 9 * vMax);
  swatch2.style("background-color", "Black");
  swatch2.class("box");
  swatch2.mousePressed(function() {
    changeBrush(5, 15, 1)
  });

  swatch3 = createButton("");
  swatch3.position(31 * vMax, height - (11.5 * vMax));
  swatch3.size(8 * vMax, 9 * vMax);
  swatch3.style('background-color', colArray[(colShift * 4) + 0]);
  swatch3.class("box");
  swatch3.mousePressed(function() {
    changeBrush(4, (colShift * 4) + 0, 2)
  });

  swatch4 = createButton("");
  swatch4.position(39 * vMax, height - (11.5 * vMax));
  swatch4.size(8 * vMax, 9 * vMax);
  swatch4.style("background-color", colArray[(colShift * 4) + 3]);
  swatch4.class("box");
  swatch4.mousePressed(function() {
    changeBrush(2, (colShift * 4) + 3, 3)
  });
  console.log(colArray[(colShift * 4) + 3]);



  selColour = createImg('assets/colSelected.png');
  selColour.position(15 * vMax, height - (13.5 * vMax));
  selColour.size(8 * vMax, 13.5 * vMax);
  selColour.mousePressed();

  saveNext();



}

function saveNext() {

  newButton = createButton("Next")
  newButton.class("select");
  newButton.position(width - (15 * vMax), height - (12.5 * vMax));
  newButton.style('font-size', '2.6vmax');
  newButton.style('height', '4.5vmax');
  newButton.mousePressed(gridVStexture);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.style('font-size', '2.6vmax');
  saveButton.style('height', '4.5vmax');
  saveButton.position(width - (15 * vMax), height - (6.5 * vMax));
  saveButton.mousePressed(saveImg);
}

function changeBrush(brushSel, col, order) {

  if (eraseBool === 1) {

    invertButton();
  }
  brushSelected = brushSel;
  colArrayNum = col;
  colSelected = colArray[colArrayNum];

  selColour.remove();
  selColour = createImg('assets/colSelected.png');
  selColour.position((15 + (order * 8)) * vMax, height - (13.5 * vMax));
  selColour.size(8 * vMax, 13.5 * vMax);
  selColour.mousePressed();




}




function invertButton() {





  if (eraseBool === 0) {
    selColour.remove();
    button.remove();
    button = createImg('assets/eraseOn.png')
    button.position(1.5 * vMax, height - (14 * vMax));
    button.size(14 * vMax, 14 * vMax);
    button.mousePressed(invertButton);
    eraseBool = 1;
  } else {
    selColour.remove();
    button.remove();
    button = createImg('assets/eraseOff.png')
    button.position(1.5 * vMax, height - (14 * vMax));
    button.size(14 * vMax, 14 * vMax);
    button.mousePressed(invertButton);
    eraseBool = 0;
  }



}

function removeSwatch() {
  button.remove();
  swatch1.remove();
  swatch2.remove();
  swatch3.remove();
  swatch4.remove();
  selColour.remove();
}

function gridVStexture() {

  gridVStextureBool = !gridVStextureBool;


  if (gridVStextureBool) {
    removeSwatch();
    makeSlider(width / 2);
    newButton.html("Next");
  } else {
    newGrid();
    newButton.html("Next");
  }

}

function makeSlider(_mouseX) {


  sliderImg.clear();
  sliderImg.stroke(255);
  sliderImg.strokeWeight(5);
  sliderImg.line(50, height - (6 * vMax), width - (16 * vMax), height - (6 * vMax));
  sliderImg.rectMode(RADIUS);
  sliderImg.fill(appCol);
  sliderImg.noStroke();
  sliderImg.rect(constrain(_mouseX, width * 0.04, width * 0.82), height - (6 * vMax), 1 * vMax, 5 * vMax);


}

function newGrid() {

  stage++;

  if (stage === 8) {
    vertCount = 3;
    horizCount = 2;
    stage = 0;
    gridLineSize = 12;
  }

  fillCol = 5;
  paintCol = 0;

  vertCount += 2;
  horizCount += 1;
  gridLineSize -= 2;
  colShift++;
  if (colShift === 4) {
    colShift = 0;
  }


  colSelected = colArray[12];
  brushSelected = 1;

  removeSwatch();
  eraseBool = 0;
  makeSwatch();


  backdrop.clear();
  backdrop.fill(colArray[(colShift * 4) + 1]);
  backdrop.rect(0, 0, width, height);

  paint.clear();
  paint.fill(colArray[(colShift * 4) + 1]);
  paint.rect(-10, -10, width + 20, height + 20); // reason for extra width = strange paint layer on boundary.

  foreground.clear();
  foreground.stroke(colArray[(colShift * 4) + 1]);
  foreground.strokeWeight(gridLineSize * 2);

  for (let i = 0; i < vertCount; i++) {
    foreground.line((width / vertCount) * i, 0, (width / vertCount) * i, height);
  }

  for (let i = 0; i < horizCount; i++) {
    foreground.line(0, (height / horizCount) * i, width, (height / horizCount) * i);
  }
}

function draw() {

  // none of this needs to be in draw - move to a static function.

  blendMode(BLEND);
  if (gridVStextureBool) {

    for (let i = 0; i < tileNum; i++) {
      for (let j = 0; j < tileNum; j++) {
        image(backdrop, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        image(paint, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        image(foreground, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
      }
    }

    image(sliderImg, 0, 0, width, height);

  } else {
    image(backdrop, 0, 0, width, height);
    image(paint, 0, 0, width, height);
    image(foreground, 0, 0, width, height);
  }

}

function touchStarted() {
  //brushSelected = int(random(0,6));
  faderStart = 0;

}


function touchMoved() {

  if (gridVStextureBool) {
    tileNum = constrain(((width / (mouseX + 20))), 1, 20);

    makeSlider(winMouseX);

  } else {
    if (eraseBool === 0) {
      brushIt(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
    } else {
      eraser(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
    }
  }



  return false;
}


function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function eraser(_x, _y, _px, _py) {
  paint.strokeWeight(80);
  paint.stroke(colorAlpha(colArray[(colShift * 4) + 1], 0.5));
  paint.line(_x, _y, _px, _py);
}

function brushIt(_x, _y, pX, pY) {

  if (brushSelected === 0) {
    paint.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 1, 4)); // for line work
    paint.stroke(colorAlpha(colSelected, .9));
    paint.strokeCap(SQUARE);
    paint.line(_x, _y, pX, pY);

  } else if (brushSelected === 1) {
    paint.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 4, 20)); // for line work
    paint.stroke(colorAlpha(colSelected, .8));
    paint.strokeCap(PROJECT);
    paint.line(_x, _y, pX, pY);




  } else if (brushSelected === 2) {
    paint.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 0.1, 2.2)); // for line work
    paint.stroke(colorAlpha(colSelected, 0.7));
    for (i = 0; i < 30; i++) {
      let randX = randomGaussian(-15, 15);
      let randY = randomGaussian(-15, 15);
      paint.line(_x + randX, _y + randY, pX + randX, pY + randY);
    }

  } else if (brushSelected === 3) {
    paint.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 50, 60)); // for line work
    if (faderStart <= 0) {
      brushBool = 0;
    }
    if (faderStart >= 1000) {
      brushBool = 1;
    }
    if (brushBool === 0) {
      paint.stroke(colorAlpha(colSelected, .2));

      //  paint.stroke(100, 100, 100, (faderStart += 20) / 5);
    }
    if (brushBool === 1) {
      paint.stroke(colorAlpha(colSelected, .2));
      //  paint.stroke(100, 100, 100, (faderStart -= 20) / 5);
    }
    paint.line(_x, _y, pX, pY);

  } else if (brushSelected === 4) {
    paint.strokeWeight(abs(random(4, 20)));
    for (i = 0; i < 30; i++) {
      paint.stroke(colorAlpha(colSelected, 0.8));
      paint.point(_x + randomGaussian(-10, 10), _y + randomGaussian(-10, 10));
    }

  } else if (brushSelected === 5) {
    paint.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 10, 25)); // for line work
    paint.stroke(colorAlpha(colSelected, .7));
    paint.strokeCap(PROJECT);
    paint.line(_x, _y, pX, pY);

  } else if (brushSelected === 6) {
    paint.loadPixels();
    for (let y = (_y - 60); y < (_y + 60); y++) {
      for (let x = (_x - 60); x < (_x + 60); x++) {
        if (dist(x, y, _x, _y) < 30) {
          paint.set(x, y, color(0, 0));
        }
      }
    }
    paint.updatePixels();
  }
}

function saveImg() {

  blendMode(BLEND);
  if (gridVStextureBool) {

    for (let i = 0; i < tileNum; i++) {
      for (let j = 0; j < tileNum; j++) {
        image(backdrop, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        image(paint, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        image(foreground, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
      }
    }



  } else {
    image(backdrop, 0, 0, width, height);
    image(paint, 0, 0, width, height);
    image(foreground, 0, 0, width, height);
  }
  save('linescape' + month() + day() + hour() + second() + '.jpg');
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  newButton.remove();
  saveButton.remove();
  calcDimensions();
  removeSwatch();
  makeSwatch();
}
