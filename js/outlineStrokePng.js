/**
 * Set image outline stroke for transparent picture
 * -----------------------
 * @User: o.l [Oganesov Levon]
 * @mail: levon.oganesov@mail.ru
 * @Date: 06.06.18
 * @LastUpdate: 14.06.2018
 * @Version: 1.0.1
 * -----------------------
 */
var ImageOutline = (function () {

    var imageOutline;

    function ImageOutline(param) {

        this.img = param.img;
        this.imgData = param.imgData;
        this.imgDataOut = param.imgData;
        this.searchAlphaPixel = param.searchAlphaPixel;

        this.color = param.color;

        /**
         * Массив с уже имеющимися альфа индексами
         * в которох уже пискель обводки проставили
         */
        this.pixelPositions = [];

        /**
        * получим количевство индексов в одной строчке
        */
        this.oneLineSize = param.img.width * 4;
    }

    ImageOutline.prototype.getImageData = function () {

        var imgCount = this.imgData.data.length;

        for (var i = 0; i < imgCount; i += 4) {

            var red   = i,
                green = i + 1,
                blue  = i + 2,
                alpha = i + 3;

            var alphaPixel = this.imgData.data[alpha];

            if (alphaPixel === this.searchAlphaPixel) {

                if (this.hasPixel(i)) {
                    this.pixelPositions.push(alpha);

                    this.imgDataOut.data[red] = this.color.red;
                    this.imgDataOut.data[green] = this.color.green;
                    this.imgDataOut.data[blue] = this.color.blue;
                    this.imgDataOut.data[alpha] = this.color.alpha;

                }
            }
        }

        return this.imgDataOut;

    };

    /**
     * Проверим на наличие нужного нам пикселя
     *
     * @LastUpdate: 14.06.2018
     *
     * @param i
     * @returns {boolean}
     */
    ImageOutline.prototype.hasPixel = function (i) {

        // посмотрим на pixel вправо
        var alphaPixelRight = (i + 8);
        var isHasAlphaPixelRight = this.checkSide(this.imgData.data, alphaPixelRight);

        // посмотрим на пиксель влево
        var alphaPixelLeft = (i - 8);
        var isHasAlphaPixelLeft = this.checkSide(this.imgData.data, alphaPixelLeft);

        // посмотрим на пиксель вниз
        var alphaPixelBottom = (i + (this.oneLineSize + 3));
        var isHasAlphaPixelBottom = this.checkSide(this.imgData.data, alphaPixelBottom);

        // посмотрим на пиксель вверх
        var alphaPixelTop = (i - (this.oneLineSize - 3));
        var isHasAlphaPixelTop = this.checkSide(this.imgData.data, alphaPixelTop);

        if (
            isHasAlphaPixelLeft
            ||
            isHasAlphaPixelRight
            ||
            isHasAlphaPixelBottom
            ||
            isHasAlphaPixelTop
        ) {
            return true;
        }

        return false;

    };

    /**
     * Проверим сторону
     *
     * @LastUpdate: 07.06.2018
     *
     * @param imgData
     * @param index
     * @returns {boolean}
     */
    ImageOutline.prototype.checkSide = function (imgData, index) {

        if (index < 0) return false;

        // посмотрим на pixel
        var alphaPixel = imgData[index];

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
        var idx = this.pixelPositions.indexOf(i);

        return idx === -1;
    };

    return {
        init: function (param) {
            if (!imageOutline) {
                imageOutline = new ImageOutline(param);
            }
        },
        getImageData: function () {
            return imageOutline.getImageData();
        },
        draw: function (ctx) {
            ctx.putImageData(imageOutline.getImageData(), 0, 0);
        },
        toFile: function (ctx) {
            console.log(ctx);
            // ctx.putImageData(imageOutline.getImageData(), 0, 0);
            // ctx.toDataURL('image/png').replace(/data:image\/png;base64,/, '');
            // ctx.toDataURL();
        }
    }
}());