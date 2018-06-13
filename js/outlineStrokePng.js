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
var ImageOutline = (function () {

    var imageOutline;

    function ImageOutline(param) {

        this.img = param.img;
        this.imgData = param.imgData;
        this.searchAlphaPixel = param.searchAlphaPixel;

        this.color = param.color;

        this.pixelPositions = [];
    }

    ImageOutline.prototype.getData = function () {

        var imgCount = this.imgData.data.length;

        for (var i = 0; i < imgCount; i += 4) {

            var red   = i,
                green = i + 1,
                blue  = i + 2,
                alpha = i + 3;

            var alphaPixel = this.imgData.data[alpha];

            if (alphaPixel === this.searchAlphaPixel) {

                // посмотрим на pixel вправо
                var alphaPixelRight = this.checkSide(this.imgData.data, (i + 8));

                // посмотрим на пиксель влево
                var alphaPixelLeft = this.checkSide(this.imgData.data, (i + 8));

                // вычеслим такую же позицию пикселя только строчкой ниже
                var line = this.img.width * 4;

                console.log(line);
                console.log((line + 3));
                console.log(i + (line + 3));
                console.log('-------------');

                // посмотрим на пиксель вниз
                var alphaPixelBottom = this.checkSide(this.imgData.data, (i + (line + 3)));

                // посмотрим на пиксель вверх
                var alphaPixelTop = this.checkSide(this.imgData.data, (i - (line - 3)));

                if (
                    alphaPixelLeft
                    ||
                    alphaPixelRight
                    ||
                    alphaPixelBottom
                    ||
                    alphaPixelTop
                ) {

                    this.pixelPositions.push((i + 3));

                    this.imgData.data[red] = this.color.red;
                    this.imgData.data[green] = this.color.green;
                    this.imgData.data[blue] = this.color.blue;
                    this.imgData.data[alpha] = 255;

                }
            }
        }

        return this.imgData;

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
        getData: function () {
            return imageOutline.getData();
        }
    }
}());