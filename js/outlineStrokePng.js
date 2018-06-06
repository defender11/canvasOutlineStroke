/**
 * Set image outline stroke for transparent picture
 * -----------------------
 * @User: o.l [Oganesov Levon]
 * @mail: levon.oganesov@mail.ru
 * @Date: 06.06.18
 * @LastUpdate: 07.06.2018
 * @Version: 1.0.0
 * -----------------------
 */

function ImageOutline(param) {
    this.img = new Image();
    this.img.src = param.img.src;

    this.imgW = param.img.W;
    this.imgH = param.img.H;
    this.imgX = param.img.X;
    this.imgY = param.img.Y;
    this.findAlpha = param.img.findAlpha;

    this.outLineColorRed = param.outlineColor.red;
    this.outLineColorGreen = param.outlineColor.green;
    this.outLineColorBlue = param.outlineColor.blue;
    this.outLineColorAlpha = param.outlineColor.alpha;

    this.ctx = param.ctx;

    this.pixelPositions = [];
}

ImageOutline.prototype.draw = function () {
    let this_o = this;

    this.img.onload = function () {

        // нарисуем картинку для разбора
        this_o.ctx.drawImage(this, this_o.imgX, this_o.imgY, this_o.imgW, this_o.imgH);

        // Получим нарисованное изображение ввиде массива
        let imgData = this_o.ctx.getImageData(this_o.imgX, this_o.imgY, this_o.imgW, this_o.imgH);

        let imgCount = imgData.data.length;
        // let row = 0;
        // let pixelCount = 0;

        for (let i = 0; i < imgCount; i += 4) {

            // переход на новую строчку
            // if (pixelCount === this_o.imgW) {
            //     pixelCount = 0;
            //     row++;
            // }

            // let red = imgData.data[i],
            //     green = imgData.data[i + 1],
            //     blue = imgData.data[i + 2],
            //     alpha = imgData.data[i + 3];

            // console.log('--row', row);
            // console.log('--pixelCount', pixelCount);
            // console.log('--index', i);
            // console.log('--------------');

            if (imgData.data[i + 3] === this_o.findAlpha) {

                // посмотрим на pixel вправо
                let alphaPixelRight = this_o.checkSide(imgData.data, (i + 8));

                // посмотрим на пиксель влево
                let alphaPixelLeft = this_o.checkSide(imgData.data, (i - 8));

                // вычеслим такую же позицию пикселя только строчкой ниже
                let line = this_o.imgW * 4;

                // посмотрим на пиксель вниз
                let alphaPixelBottom = this_o.checkSide(imgData.data, (i + (line + 3)));

                // посмотрим на пиксель вверх
                let alphaPixelTop = this_o.checkSide(imgData.data, (i - (line - 3)));

                if (
                    alphaPixelLeft
                    ||
                    alphaPixelRight
                    ||
                    alphaPixelBottom
                    ||
                    alphaPixelTop
                ) {

                    this_o.pixelPositions.push((i + 3));

                    imgData.data[i] = this_o.outLineColorRed;
                    imgData.data[i + 1] = this_o.outLineColorGreen;
                    imgData.data[i + 2] = this_o.outLineColorBlue;
                    imgData.data[i + 3] = this_o.outLineColorAlpha;

                }
            }

            // pixelCount++;
        }

        this_o.ctx.putImageData(imgData, 0, 0);
    }
};

/**
 * Проверим сторону
 *
 * @LastUpdate: 07.06.2018
 *
 * @param imgData
 * @param index
 * @returns {*}
 */
ImageOutline.prototype.checkSide = function (imgData, index) {

    if (index < 0) return false;

    // посмотрим на pixel
    let alphaPixel = imgData[index];

    if (alphaPixel > 0) {
        return this.isPixelNew(index);
    }

    return false;
};

/**
 * Проверим, на наличе пикселя в массиве
 *
 * @LastUpdate: 07.06.2018
 *
 * @param i
 * @returns {boolean}
 */
ImageOutline.prototype.isPixelNew = function (i) {
    let idx = this.pixelPositions.indexOf(i);

    return idx === -1;
};