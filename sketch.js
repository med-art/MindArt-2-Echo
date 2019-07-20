  // images
  let bg;

  //p5 graphics, including a resized version
  let pg = [];
  let pgResize = [];

  // array of Brushes, perhaps only 1 used, but can vary?
  let brush = [];

  // COLOUR VARAIABLES
  let red;
  let green;
  let blue;
  const drift = 25;
  const rotateDrift = 0.1;

  //graphics controller
  const numOfGraphics = 25;
  const numOfLayers = 5;
  let currentLayer = 1;
  let currentGraphic = 0;
  let randomInt; // divides brush array

  //ImageMask
  let maskImg = [];
  let layer = [];
  var randWidth = [];
  var randHeight = [];
  const strokeSize = 50;

  let arrow = [];

  let swatch1 = [
    [188, 179, 164],
    [131, 114, 104],
    [95, 79, 66],
    [57, 45, 33],
    [37, 34, 29]
  ]; // ref all swatch docs in the assets folder for reference imagery
  let swatch2 = [
    [16, 32, 13],
    [34, 54, 44],
    [34, 55, 68],
    [35, 51, 81],
    [40, 38, 91]
  ];
  let swatch3 = [
    [252, 19, 11],
    [290, 10, 23],
    [32, 13, 45],
    [34, 24, 56],
    [30, 36, 76]
  ];
  let swatch4 = [
    [249, 59, 18],
    [240, 56, 35],
    [140, 148, 169],
    [280, 2, 72],
    [12, 5, 79]
  ];

  let scalar = 0;

  let title, interTextCurrent;

  let fader = 1000;


  let introState = 1,
    intermissionState = 0,
    endState = 0;
  let tempMillis;
  let timer = 0; // ignore intro text for now

  let introTitle = "Welcome to the ‘Echo’ drawing digital application";
  let introSub = "Echo definition: (noun) to repeat; (verb) to come back, to reaffirm";
  let introText = "This programme uses a 5 step process to explore repetitive gesture, breathing and sound to create textural watercolour landscapes. \n Slowing us down ‘to bring us back’ to nature, the joy of painting, body awareness and ultimately our inner selves. \n Please touch to continue.";

  let inter1title = "Let’s start here.";
  let inter1text = "1) Slowly draw a line from one dot to the other while exhaling and inhaling (there will be prompts to help).\n You will do this 10 times to create your first landscape texture.";

  let inter2title = "";
  let inter2text = "2) Now imagine a line in the wind and draw a line from one dot to the other while exhaling and inhaling (there will be prompts to help). \n You will do this 10 times to create your second landscape texture"

  let inter3title = "";
  let inter3text = "3) This time imagine the wind has changed direction and draw a line from one dot to the other while exhaling and inhaling (there will be prompts to help). \n You will do this 10 times  to create your third landscape texture.";

  let inter4title = "";
  let inter4text = "4) This time you have three dots to draw lines to. You can go in any direction but remember to inhale and exhale as you draw. \n You will do this 10 times to create your 4'th landscape texture";

  let inter5title = "";
  let inter5text = "5) For the 5 th step you have 5 dots to draw lines to. You can go in any direction but remember to inhale and exhale as you draw. \n You will do this 10 times to create your 5'th  landscape texture";

  let confirmationText = "Congratulations this is your ‘Echo’ landscape";

  let wmax, hmax;

  let dotDimen = [
    [50, 10, 50, 90],
    [80, 10, 30, 90],
    [50, 10, 50, 90, 35, 50, 65, 50],
    [20, 10, 80, 10, 50, 90],
    [10, 50, 30, 10, 70, 10, 50, 90, 90, 50],
  ] // dots are defined by X then Y coordinates. If 2 dots, then X,Y,X,Y, etc.

let arrowDimen = [
  [1, 55, 90],
  [2, 35, 90],
  [3, 45, 10, 4, 55, 90],
  [1, 110,110],
  [1, 110,110]
] // for now, last two are false dimensions, until v.02. ALSO, first value is always which version of arrow. Again, a cheat for now.

  let dotTempArray = [];

  let dotLayer;

  let layerState = 1;

  let brushSize = 8;

  let breathState = 0;

  let maskVer = 1; // tracks which landscape version

  let breath;


  //_________________________________________________________

  function preload() {
    bg = loadImage('assets/paper.jpg'); // background paper
    // image masks

    for (let i = 1; i < 4; i++){
      maskImg[i] = [];
      for (let j = 1; j < 6; j++) {
      maskImg[i][j] = loadImage('assets/m'+ i + '-' + j + '.png') // brush loader
      }
    }
    // brush set
    for (let i = 1; i < 26; i++) {
      brush[i] = loadImage('assets/br-' + i + '.png') // brush loader
    }

    for (let i = 1; i < 5; i++) {
      arrow[i] = loadImage('assets/arrow' + i + '.png') // brush loader
    }

   audio = loadSound('assets/audio.mp3');

  }

  function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1); // Ignores retina displays

    blendMode(BLEND);
    colorMode(RGB, 255, 255, 255, 1);
    // Set initial colour
    red = swatch1[0][0];
    green = swatch1[0][1];
    blue = swatch1[0][2];

    breathLayer = createGraphics(width, height);

    dotLayer = createGraphics(width, height);

    // create the layers to store landscape figures
    for (let i = 0; i < numOfLayers; i++) {
      layer[i + 1] = createGraphics(width, height);
    }

    // createGraphics
    for (let i = 0; i < numOfGraphics; i++) {

      pgResize[i] = createGraphics(width / 20, height / 20);
    }

    pg = createGraphics(width, height); // only need one of these, to store current brush, later cleared.

    //resize layers // replace the stop with list length
    for (let i = 1; i < 3; i++) {
          for (j = 1; j < 6; j++){
      maskImg[i][j].resize(width, height); // brush loader
    }
  }

    wmax = width / 100;
    hmax = height / 100;
    brushSize = wmax * 7;
    title = inter5title;
    interTextCurrent = inter5text;
    rectMode(CENTER);
    randomCoord();
    backdrop();
    findLongEdge();
    writeTextUI();
    textAlign(CENTER, CENTER);

    //  onScreenText();
  }

  function makeDots() {
    dotLayer.fill(180, 175, 190);
    dotLayer.noStroke();
    dotTempArray = dotDimen[layerState];
    for (let i = 0; i < dotDimen[layerState].length; i += 2) {
      dotLayer.circle(int(wmax * dotDimen[layerState][i]), int(hmax * dotDimen[layerState][i + 1]), wmax * 1.5);
    }

dotLayer.image(arrow[arrowDimen[layerState][0]], int(wmax * arrowDimen[layerState][1]), int(hmax * arrowDimen[layerState][2]), wmax, wmax*2);

if(arrowDimen[layerState].length > 3 ){
  dotLayer.image(arrow[arrowDimen[layerState][3]], int(wmax * arrowDimen[layerState][4]), int(hmax * arrowDimen[layerState][5]), wmax, wmax*2);

}



    image(dotLayer, 0, 0);

  }

  function endText(){


    textSize(wmax*2.5);
        fill(50, 50, 50, 0.01);
        textStyle(NORMAL);
        text(confirmationText, width / 2, hmax * 55, width * 0.8, height);
  }



  // function draw() {
  //
  //   if (introState) {
  // textSize(wmax*2.5);
  //     fill(50, 50, 50, 0.01);
  //     //textAlign(CENTER, CENTER); - WTF?
  //     textStyle(BOLD);
  //     text(introTitle, windowWidth / 2, hmax * 20, width * 0.8, height);
  //     textStyle(ITALIC);
  //     text(introSub, width / 2, hmax * 35, width * 0.8, height);
  //     textStyle(NORMAL);
  //     text(introText, width / 2, hmax * 55, width * 0.8, height);
  //
  //   }
  //   if (intermissionState) {
  //
  //     timer = millis() - tempMillis;
  //
  //
  //     textSize(wmax*2.5);
  //     fill(40, 35, 30, 0.01);
  //     textStyle(BOLD);
  //     text(title, windowWidth / 2, height / 2.5, width * 0.5, height);
  //     textStyle(NORMAL);
  //     text(interTextCurrent, width / 2, height / 2, width * 0.8, height);
  //
  //
  //   }
  //
  // }

  function breathe(breath) {

    breathLayer.fill(150);
    breathLayer.textStyle(NORMAL);
    breathLayer.textAlign(RIGHT);
    breathLayer.textSize(wmax*2.5);

if (breath === "exhale"){
    breathLayer.text(breath, width-50, height / 1.9);
}

else if (breath === "inhale"){
    breathLayer.text(breath, width-50, height / 2.1);
}
image(breathLayer, 0, 0, width, height);


  }


  function findLongEdge() {
    if (width > height) {
      longEdge = width;
    } else {
      longEdge = height;
    }
  }

  function randomCoord() {
    for (let i = 0; i < 100000; i++) {
      randWidth[i] = int(randomGaussian(-300, width));
      randHeight[i] = int(randomGaussian(-300, height));
    }
  }

  function backdrop() {
    blendMode(BLEND);


    image(bg, 0, 0, width, height); // display backgrond
  }

  function touchStarted() {



    if (introState === 1) {
      backdrop();
      tempMillis = millis();
      stateChanger();
      introState = 0;
      audio.loop();

    } else {
      if (timer > 999 && endState === 0) {

        backdrop();
        breathLayer.clear();

      if (layerState <3){breathe("inhale");}

        intermissionState = 0;
        image(dotLayer, 0, 0, width, height);
      }
    }
  }

  // function touchMoved() {
  //
  //   if (timer > 999 && endState === 0) {
  //
  //
  //     intermissionState = 0;
  //     if (currentGraphic < numOfGraphics + 2) {
  //
  //       let randDrift = random(-drift, drift);
  //
  //       pg.tint(red + randDrift, green + randDrift, blue + randDrift); // Display at half opacity
  //
  //       pg.push();
  //       let scalarsmoother = scalar;
  //       scalar = (scalarsmoother + (constrain(100 * (random(3, abs(winMouseX - pwinMouseX)) / windowWidth), 0.3, 3))) / 2;
  //
  //
  //       pg.translate(winMouseX, winMouseY);
  //
  //       pg.rotate(random(-rotateDrift, rotateDrift));
  //
  //     //  pg.image(brush[9], 0 - (scalar * brushSize / 2), 0 - (scalar * brushSize / 2), scalar * brushSize, scalar * brushSize);
  //     pg.image(brush[9], 0-brushSize / 2, 0-brushSize / 2, brushSize, brushSize);
  //
  //       pg.pop();
  //
  //       image(pg, 0, 0, width, height);
  //
  //
  //
  //     }
  //   }
  //
  //   return false;
  // }
  //
  // function touchEnded() {
  //
  //
  //   if (timer > 999 && endState === 0) {
  //     // need to include - https://stackoverflow.com/questions/47363844/how-do-i-resize-a-p5-graphic-object
  //     noTint();
  //     if (currentGraphic === numOfGraphics - 2) {
  //       updateGraphics();
  //       backdrop();
  //       blendMode(DARKEST);
  //       endText();
  //       makeLandscape();
  //
  //
  //     } else {
  //
  //       updateGraphics();
  //
  //     }
  //   }
  //
  //   return false;
  // }

  function makeLandscape(){
    for (let i = 0; i < 80000; i++) {
      randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
      layer[1].image(pgResize[randomInt], randWidth[i], randHeight[i], 70, 70); // replace with scalar
    }
    for (let i = 0; i < 40000; i++) {
      randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
      layer[2].image(pgResize[randomInt + 5], randWidth[i], randHeight[i], 70, 70); // replace with scalar
    }
    for (let i = 0; i < 30000; i++) {
      randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
      layer[3].image(pgResize[randomInt + 10], randWidth[i], randHeight[i], 70, 70); // replace with scalar
    }
    for (let i = 0; i < 20000; i++) {
      randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
      layer[4].image(pgResize[randomInt + 15], randWidth[i], randHeight[i], 70, 70); // replace with scalar
    }
    for (let i = 0; i < 20000; i++) {
      randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
      layer[5].image(pgResize[randomInt + 20], randWidth[i], randHeight[i], 70, 70); // replace with scalar
    }

    layer[1].image(maskImg[maskVer][1], 0, 0);
    image(layer[1], 0, 0);
    layer[2].image(maskImg[maskVer][2], 0, 0);
    image(layer[2], 0, 0);
    layer[3].image(maskImg[maskVer][3], 0, 0);
    image(layer[3], 0, 0);
    layer[4].image(maskImg[maskVer][4], 0, 0);
    image(layer[4], 0, 0);
    layer[5].image(maskImg[maskVer][5], 0, 0);
    image(layer[5], 0, 0);
    randomCoord();
    endState = 1;
  }

  function updateGraphics() {
    pgResize[currentGraphic].copy(pg, 0, 0, windowWidth, windowHeight, 0, 0, int(width / 20), int(height / 20));
    currentGraphic++ // save the image
    pg.clear();

    backdrop(); // display backgrond
breathLayer.clear();

    tempMillis = millis();

    stateChanger();

    textSize(wmax * 3);
    fill(80);
    image(dotLayer, 0, 0, width, height);
  }

  function stateChanger() {



    if (currentGraphic === 0) {
      dotLayer.clear();
      title = inter1title;
      layerState = 0;
      interTextCurrent = inter1text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 7;
      red = swatch1[0][0];
      green = swatch1[0][1];
      blue = swatch1[0][2];
    }

    else if (currentGraphic === 5) {
      dotLayer.clear();
      title = inter2title;
      layerState = 1;
      interTextCurrent = inter2text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 6;
      red = swatch1[1][0];
      green = swatch1[1][1];
      blue = swatch1[1][2];
    }
    else if (currentGraphic === 10) {
      dotLayer.clear();
      title = inter3title;
      layerState = 2;
      interTextCurrent = inter3text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 5;
      red = swatch1[2][0];
      green = swatch1[2][1];
      blue = swatch1[2][2];
    }
  else if (currentGraphic === 15) {
      dotLayer.clear();
      title = inter4title;
      layerState = 3;
      interTextCurrent = inter4text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 4;
      red = swatch1[3][0];
      green = swatch1[3][1];
      blue = swatch1[3][2];
    }
    else if (currentGraphic === 20) {
      dotLayer.clear();
      title = inter5title;
      layerState = 4;
      interTextCurrent = inter5text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 3;
      red = swatch1[4][0];
      green = swatch1[4][1];
      blue = swatch1[4][2];
    }

else{
      if (layerState <3){breathe("exhale");}
}

    image(dotLayer, 0, 0, width, height);


  }


  function fadeText() {
    noLoop();
    setTimeout(releaseText, 10000);
  }

  function releaseText() {
    loop();
  }


  function writeTextUI() {
    textSize(longEdge / 50);
    fill(0);
    noStroke();

    let vmax = longEdge / 100; // suspect we may have issue here with IOS in terms of rotation and measuring height, etc
    let textMargin = longEdge / 100; // consolidate into above - no point having 2

    button3 = createButton('Restart');
    button3.position(windowWidth - (10 * vmax) - (textMargin * 5), windowHeight - vmax * 6);
    colH3 = color(355, 87, 74);

    button3.style('background-color', colH3);
    button3.style('font-size', '1.75vmax');
    button3.style('color', 'white');
    button3.style('border-radius', '0.5vmax')
    button3.style('width', '12vmax')
    button3.mousePressed(restart);
  }

function swatchSwitch(){
swatchCount++;


}

  function restart() {

    currentGraphic = 0;
    introState = 1;
    intermissionState = 0
    endState = 0;
    for (let i = 0; i < numOfGraphics; i++) {
      pgResize[i].clear();
    }
    for (let i = 0; i < numOfLayers; i++) {
      layer[i + 1].clear();
    }
    maskVer++;
    if (maskVer === 4){
      maskVer = 1;
    }
    backdrop();
    stateChanger();
    swatchSwitch();





  }

  function windowResized() {
    setup(); // need to rewrite this to ensure image is saved
  }
