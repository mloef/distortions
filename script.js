const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pixelSize = 4;
const rootPixelSize = 2;
const font = "30px Arial";
ctx.font = font;
ctx.fillStyle = "#000000";

var text = wrapText(ctx, "This is a test of the dissolve effect on a much longer input, as user input is expected to be rather long");
console.log(text)

canvas.height = 30 * (text.split('\n').length + 2);
const textWidth = ctx.measureText(text).width * pixelSize;
canvas.width = textWidth + 20;
ctx.font = font;

i = Math.floor(text.split('\n').length / 2) * -1;
for (var line of text.split('\n')) {
    ctx.fillText(line, canvas.width / 2 - ctx.measureText(line).width / 2, canvas.height / 2 + i * 30);
    i += 1;
}


const pixelsProportionPerIteration = 0.005;

function wrapText(context, text) {
    var words = text.split(' ');
    var line = '';
    var wrappedText = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        var maxWidth = window.innerWidth;
        if (testWidth > maxWidth && n > 0) {
            wrappedText += line + '\n';
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }

    wrappedText += line;
    return wrappedText;
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
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data;

for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
        const i = (y * canvas.width + x) * pixelSize;

        if (isPixelVisible(data, i)) {
            pixelIndices.push([x, y]);
        }
    }
}

const pixelsPerIteration = pixelsProportionPerIteration * pixelIndices.length;

function dissolve() {
    for (let i = 0; i < pixelsPerIteration && pixelIndices.length; i++) {
        const index = Math.floor(Math.random() * pixelIndices.length);
        const [x, y] = pixelIndices[index];
        erasePixel(data, (y * canvas.width + x) * pixelSize);
        pixelIndices.splice(index, 1);
    }


    ctx.putImageData(imageData, 0, 0);

    // Continue the animation if there are still visible pixels.
    if (pixelIndices.length) {
        requestAnimationFrame(dissolve);
    } else {
        console.log('done!')
    }
}

// Start the dissolve effect.
requestAnimationFrame(dissolve);