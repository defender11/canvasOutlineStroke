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

    var pixel = {
        oneLineSize: 0,
        getRedColor : function (i) { return i; },
        getGreenColor : function (i) { return i + 1; },
        getBlueColor : function (i) { return i + 2; },
        getAlphaColor : function (i) { return i + 3; },

        /**
         * посмотрим на пиксель вверх
         *
         * @param i
         * @returns {number}
         */
        getAlphaPixelTop: function (i) {
            return i - this.oneLineSize;
        },

        /**
         * посмотрим на пиксель вниз
         *
         * @param i
         * @returns {number}
         */
        getAlphaPixelBottom: function (i) {
            return i + this.oneLineSize;
        },

        /**
         *  посмотрим на альфа с влево
         *
         * @param i
         * @returns {number}
         */
        getAlphaPixelLeft: function (i) {
            return i - 4;
        },

        /**
         * посмотрим на альфа с право
         *
         * @param i
         * @returns {*}
         */
        getAlphaPixelRight: function (i) {
            return i + 4;
        }
    };

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
        pixel.oneLineSize = param.img.width * 4;
    }

    ImageOutline.prototype.getImageData = function () {

        var imgCount = this.imgData.data.length;

        for (var i = 0; i < imgCount; i += 4) {

            var red   = pixel.getRedColor(i),
                green = pixel.getGreenColor(i),
                blue  = pixel.getBlueColor(i),
                alpha = pixel.getAlphaColor(i);

            var alphaPixel = this.imgData.data[alpha];

            if (alphaPixel === this.searchAlphaPixel) {

                if (this.hasPixel(i)) {
                    this.pixelPositions.push(i);

                    this.imgData.data[red]   = this.color.red;
                    this.imgData.data[green] = this.color.green;
                    this.imgData.data[blue]  = this.color.blue;
                    this.imgData.data[alpha] = this.color.alpha;

                }
            }
        }

        return this.imgData;

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
        var isHasAlphaPixelRight = this.checkSide(pixel.getAlphaPixelRight(i));

        var isHasAlphaPixelLeft = this.checkSide(pixel.getAlphaPixelLeft(i));

        var isHasAlphaPixelBottom = this.checkSide(pixel.getAlphaPixelBottom(i));

        var isHasAlphaPixelTop = this.checkSide(pixel.getAlphaPixelTop(i));

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
    ImageOutline.prototype.checkSide = function (index) {

        if (index < 0) return false;

        // посмотрим на альфа цвет(канал)
        var alphaPixel = this.imgData.data[index];

        // Если есть не прозрачный альфа цвет(канал)
        if (alphaPixel > 0) {
            // Проверим это новый пиксель или ранее заполненный
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
        draw: function (ctx, x,y) {
            ctx.putImageData(imageOutline.getImageData(), x,y);
        },
        toImg: function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            ctx.putImageData(imageOutline.getImageData(), 0, 0);

            imageOutline.img.src = canvas.toDataURL('image/png');

            return imageOutline.img;
        }
    }
}());