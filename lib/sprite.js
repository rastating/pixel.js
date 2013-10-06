// Copyright (C) 2013 rastating
//
// Version 0.0.2
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

/* global document, Image, PixelJS */

PixelJS.prototype.Sprite = function (engine) {
    "use strict";
    
    this._assetName = '';
    this._assetImage = new Image();
    this._assetLoaded = false;
    this._assetData = null;
    
    this.engine = engine;
    this.pos = { x: 0, y: 0 };
    this.speed = 0.2;
    this.visible = true;
    this.hasTransparentBackground = false;
    
    Object.defineProperty(this, "width", {
        get: function () { return this._assetImage.width; },
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty(this, "height", {
        get: function () { return this._assetImage.height; },
        configurable: false,
        enumerable: false
    });
};

PixelJS.prototype.Sprite.prototype._getAssetData = function (transparencyKey) {
    "use strict";
    
    var canvas = document.createElement('canvas');
    canvas.width = this._assetImage.width;
    canvas.height = this._assetImage.height;
    
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this._assetImage, 0, 0);
    
    var pixels = ctx.getImageData(0, 0, this._assetImage.width, this._assetImage.height);
    if (transparencyKey !== undefined) {
        // Each pixel consists of 4 integers to represent the RGBA value, hence stepping by 4.
        for (var i = 0, len = pixels.data.length; i < len; i += 4) {
            var r = pixels.data[i];
            var g = pixels.data[i + 1];
            var b = pixels.data[i + 2];
            
            // If the RGB values match, set the alpha pixel to zero (i.e. transparent).
            if (r === transparencyKey.r && g === transparencyKey.g && b === transparencyKey.b) {
                pixels.data[i + 3] = 0;
            }
        }
    }
    
    return pixels;
};
    
PixelJS.prototype.Sprite.prototype.load = function (info, callback) {
    var self = this;
    this._assetName = info.name;
    this._assetImage.src = 'assets/sprites/' + this._assetName;
    this._assetImage.onload = function () {
        self._assetData = self._getAssetData(info.transparencyKey);
        self._assetLoaded = true;
        callback();
    };
};
    
PixelJS.prototype.Sprite.prototype.draw = function (args) {
    if (this._assetLoaded) {
        if (this.hasTransparentBackground) {
            this.engine.drawTransparentImage(this._assetData, this.pos.x, this.pos.y);
        }
        else {
            this.engine.drawImage(this._assetData, this.pos.x, this.pos.y);
        }
    }
};
    
PixelJS.prototype.Sprite.prototype.moveLeft = function () {
    this.pos.x -= this.speed * this.engine._deltaTime;
};
    
PixelJS.prototype.Sprite.prototype.moveRight = function () {
    this.pos.x += this.speed * this.engine._deltaTime;
};
    
PixelJS.prototype.Sprite.prototype.moveDown = function () {
    this.pos.y += this.speed * this.engine._deltaTime;
};
    
PixelJS.prototype.Sprite.prototype.moveUp = function () {
    this.pos.y -= this.speed * this.engine._deltaTime;
};