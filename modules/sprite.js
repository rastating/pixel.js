// Copyright (C) 2013-2014 rastating
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

PixelJS.Sprite = function () {
    "use strict";
    this.image = new Image();
};

PixelJS.extend(PixelJS.Sprite, PixelJS.Asset);

PixelJS.Sprite.prototype.hFlip = false;
PixelJS.Sprite.prototype.rotation = undefined;
PixelJS.Sprite.prototype.transparencyKey = undefined;

PixelJS.Sprite.prototype._applyTransparencyKey = function (img, transparencyKey) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    var pixels = ctx.getImageData(0, 0, img.width, img.height);
    var pixelData = pixels.data;
    
    // Each pixel consists of 4 integers to represent the RGBA value, hence stepping by 4.
    for (var i = 0, len = pixels.data.length; i < len; i += 4) {
        var r = pixelData[i];
        var g = pixelData[i + 1];
        var b = pixelData[i + 2];
        
        // If the RGB values match, set the alpha pixel to zero (i.e. transparent).
        if (r === transparencyKey.r && g === transparencyKey.g && b === transparencyKey.b) {
            pixelData[i + 3] = 0;
        }
        
        // Data is supposed to be read only and thus this line will fail
        // in strict mode. A work around for this needs to be looked at.
        pixels.data = pixelData;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(pixels, 0, 0);
    
    img.src = canvas.toDataURL();
};

PixelJS.Sprite.prototype.load = function (info, callback) {
    "use strict";
    var self = this;
    
    if (info !== undefined) {
        if (info.name !== undefined) {
            this.name = info.name;
        }
        
        if (info.transparencyKey !== undefined) {
            this.transparencyKey = info.transparencyKey;
        }
        
        if (info.callback !== undefined) {
            this.onLoad(info.callback);
        }
    }
    
    if (callback !== undefined) {
        this.onLoad(callback);
    }
    
    this.image.src = PixelJS.assetPath + '/sprites/' + this.name;
    this.image.onload = function () {
        self.image.onload = undefined;
        
        if (self.transparencyKey !== undefined) {
            self._applyTransparencyKey(self.image, self.transparencyKey);
        }
        
        self.loaded = true;
    };
    
    return this;
};

PixelJS.Sprite.prototype.draw = function (entity) {
    if (this.loaded && entity.visible) {
        entity.layer.drawImage(this.image, entity.pos.x, entity.pos.y, this.rotation, entity.opacity);
    }
    
    return this;
};
