const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pixelSize = 4;
const rootPixelSize = 2;
const text = "Pixelate";
const font = "30px Arial";

canvas.width = 120;
canvas.height = 80;

ctx.font = font;
ctx.fillStyle = "#000000";
ctx.fillText(text, canvas.width / 2 - ctx.measureText(text).width / 2, canvas.height / 2);

const canvasSize = canvas.width * canvas.height;

const decay = 0.99;

const decayCoefficient = 20;

function getRandomBoolean(threshold = decay) {
    return Math.random() > threshold;
}

function isPixelVisible(data, index) {
    return data.slice(index, index + pixelSize).reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    }, 0) > 0;
}

function erasePixel(data, index) {
    for (let i = index; i < index + pixelSize; i++) {
        data[i] = 0;
    }
}

let pixelIndices = [];

function dissolve() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let hasVisiblePixels = false;

    if (pixelIndices.length > 0) {
        console.log(pixelIndices);
        let newPixelIndices = [];

        for (let pair of pixelIndices) {
            console.log(pair)
            const [x, y] = pair;
            console.log(x, y)
            const i = (y * canvas.width + x) * pixelSize;

            if (isPixelVisible(data, i)) {
                hasVisiblePixels = true;

                if (getRandomBoolean(decay - (pixelIndices.length / canvasSize) * decayCoefficient * (1 - decay))) {
                    for (let py = 0; py < pixelSize; py++) {
                        for (let px = 0; px < pixelSize; px++) {
                            const pi = ((y + py) * canvas.width + (x + px)) * 4;
                            erasePixel(data, pi);
                        }
                    }
                } else {
                    newPixelIndices.push([x, y]);
                }
            }

        }
        pixelIndices = newPixelIndices;
    } else {
        for (let y = 0; y < canvas.height; y += 1) {
            for (let x = 0; x < canvas.width; x += 1) {
                const i = (y * canvas.width + x) * pixelSize;

                if (isPixelVisible(data, i)) {
                    hasVisiblePixels = true;

                    if (getRandomBoolean()) {
                        for (let py = 0; py < pixelSize; py++) {
                            for (let px = 0; px < pixelSize; px++) {
                                const pi = ((y + py) * canvas.width + (x + px)) * 4;
                                erasePixel(data, pi);
                            }
                        }
                    } else {
                        pixelIndices.push([x, y]);
                    }
                }
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Continue the animation if there are still visible pixels.
    if (hasVisiblePixels) {
        requestAnimationFrame(dissolve);
    } else {
        console.log('done!')
    }
}

// Start the dissolve effect.
requestAnimationFrame(dissolve);