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

/* global extend, Image, PixelJS*/

PixelJS.prototype.AnimatedSprite = function (engine) {
    this._loaded = false;
    this._frameTickCount = 0;
    this._currentFrame = 0;
    this._isAnimating = true;
    
    this.spriteSheet = {};
    this.defaultFrame = 0;
    this.engine = engine;
    this.pos = { x: 0, y: 0 };
    this.speed = 0.2;
    this.animationSpeed = 0;
    this.visible = true;
};

extend(PixelJS.prototype.AnimatedSprite, PixelJS.prototype.Sprite);

Object.defineProperty(PixelJS.prototype.AnimatedSprite.prototype, "isAnimating", {
    get: function () { return this._isAnimating; },
    configurable: false,
    enumerable: false
});

PixelJS.prototype.AnimatedSprite.prototype.startAnimating = function () {
    this._isAnimating = true;
}

PixelJS.prototype.AnimatedSprite.prototype.stopAnimating = function () {
    this._isAnimating = false;
}

PixelJS.prototype.AnimatedSprite.prototype.load = function (info, callback) {
    var self = this;
    this.spriteSheet = this.engine.createSpriteSheet();
    this.spriteSheet.load(info, function () {
        self._loaded = true;
        callback(self);
    });
};
                          
PixelJS.prototype.AnimatedSprite.prototype.draw = function (args) {
    "use strict";
    
    if (this._loaded) {
        if (this.animationSpeed > 0 && this._isAnimating) {
            if (!isNaN(this.engine._deltaTime)) {
                this._frameTickCount += (this.engine._deltaTime / 1000);
                if (this._frameTickCount >= this.animationSpeed) {
                    this._frameTickCount = 0;
                    this._currentFrame = this._currentFrame == this.spriteSheet._frameData.length - 1 ? 0 : this._currentFrame + 1;
                }
            }
        }
        else {
            this._currentFrame = this.defaultFrame;   
        }
        
        this.engine._buffer.getContext('2d').putImageData(this.spriteSheet._frameData[this._currentFrame], this.pos.x, this.pos.y);
        
        this.engine._ctx.drawImage(this.engine._buffer, 0, 0);
    }
};