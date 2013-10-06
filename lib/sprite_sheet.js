// Copyright (C) 2013 rastating
//
// Version 0.0.1
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.

/*global document, PixelJS, Image*/

PixelJS.prototype.SpriteSheet = function (engine) {
    "use strict";
    
    this._assetName = '';
    this._assetImage = new Image();
    this._assetLoaded = false;
    this._frameImages = [];
    this._frameSize = { width: 0, height: 0 };
    this._frameCount = 0;
    this._rowCount = 1;
    
    this.engine = engine;
};

Object.defineProperty(PixelJS.prototype.SpriteSheet.prototype, "frameSize", {
    get: function () { return this._frameSize; },
    configurable: false,
    enumerable: false
});

Object.defineProperty(PixelJS.prototype.SpriteSheet.prototype, "frameCount", {
    get: function () { return this._frameCount; },
    configurable: false,
    enumerable: false
});

Object.defineProperty(PixelJS.prototype.SpriteSheet.prototype, "rowCount", {
    get: function () { return this._rowCount; },
    configurable: false,
    enumerable: false
});

PixelJS.prototype.SpriteSheet.prototype._getFrameData = function (row, frame, transparencyKey) {
    "use strict";
    
    var canvas = document.createElement('canvas');
    canvas.width = this._frameSize.width;
    canvas.height = this._frameSize.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(
        this._assetImage, 
        0 + Math.ceil(this._frameSize.width * frame),
        0 + Math.ceil(this._frameSize.height * row),
        this._frameSize.width, this._frameSize.height,
        0, 
        0, 
        this._frameSize.width, this._frameSize.height
    );
    
    var pixels = ctx.getImageData(0, 0, this._frameSize.width, this._frameSize.height);
    if (transparencyKey !== undefined) {
        // Each pixel consists of 4 integers to represent the RGBA value, hence stepping by 4.
        var pixelData = pixels.data;
        
        for (var i = 0, len = pixels.data.length; i < len; i += 4) {
            var r = pixelData[i];
            var g = pixelData[i + 1];
            var b = pixelData[i + 2];
            
            // If the RGB values match, set the alpha pixel to zero (i.e. transparent).
            if (r === transparencyKey.r && g === transparencyKey.g && b === transparencyKey.b) {
                pixelData[i + 3] = 0;
            }
        }
        
        pixels.data = pixelData;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(pixels, 0, 0);
    
    var retval = new Image();
    retval.src = canvas.toDataURL();
    
    return retval;
};

PixelJS.prototype.SpriteSheet.prototype.load = function (info, callback) {
    "use strict";
    
    var self = this;
    var rows = info.rows != undefined ? info.rows : 1;
    this._rowCount = rows;
    this._frameCount = info.frames;
    this._assetName = info.name;
    this._assetImage.src = 'assets/sprite_sheets/' + this._assetName;
    this._assetImage.onload = function () {
        self._frameSize.width = Math.floor(self._assetImage.width / info.frames);
        self._frameSize.height = Math.floor(self._assetImage.height / rows);
        
        for (var r = 0; r < rows; r++) {
            self._frameImages[r] = [];
            for (var f = 0; f < info.frames; f++) {
                self._frameImages[r][f] = self._getFrameData(r, f, info.transparencyKey);
            }
        }
        
        self._assetLoaded = true;
        callback(self);
    };
};