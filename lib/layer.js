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

PixelJS.prototype.Layer = function (engine) {
    "use strict";
    this.engine = engine;
    this._canvas = undefined;
    this.requiresDraw = true;
    
    this._components = [];
    this._backBuffer = undefined;
    this._backBufferCtx = undefined;
    this._ctx = undefined;
    
    this._insertIntoDom();
}

Object.defineProperty(PixelJS.prototype.Layer.prototype, "zIndex", {
    get: function () { return this._canvas.style.zIndex; },
    set: function (val) { this._canvas.style.zIndex = val; },
    configurable: false,
    enumerable: false
});

PixelJS.prototype.Layer.prototype._insertIntoDom = function() {
    var container = this.engine._canvas.parentNode;
    this._canvas = document.createElement('canvas');
    this._canvas.width = this.engine._canvas.width;
    this._canvas.height = this.engine._canvas.height;
    this._canvas.className = 'scene-layer';
    this._ctx = this._canvas.getContext('2d');
    container.appendChild(this._canvas);
    
    this._backBuffer = document.createElement('canvas');
    this._backBuffer.width = this._canvas.width;
    this._backBuffer.height = this._canvas.height;
    this._backBufferCtx = this._backBuffer.getContext('2d');
};

PixelJS.prototype.Layer.prototype.addComponent = function(component) {
    this._components.push(component);
};

PixelJS.prototype.Layer.prototype.update = function(elapsedTime, dt) {
    for (var i = 0; i < this._components.length; i++) {
        this._components[i].update(elapsedTime, dt);
    }
};

PixelJS.prototype.Layer.prototype.draw = function() {
    if (this.requiresDraw) {
        for (var i = 0; i < this._components.length; i++) {
            this._components[i].draw();
        }
        
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.drawImage(this._backBuffer, 0, 0);
        this._backBufferCtx.clearRect(0, 0, this._backBuffer.width, this._backBuffer.height);
    }
};

PixelJS.prototype.Layer.prototype.createSprite = function () {
    var sprite = new this.engine.Sprite(this);
    this._components.push(sprite);
    return sprite;
};

PixelJS.prototype.Layer.prototype.createAnimatedSprite = function () {
    var sprite = new this.engine.AnimatedSprite(this);
    this._components.push(sprite);
    return sprite;
};

PixelJS.prototype.Layer.prototype.createTile = function () {
    var tile = new this.engine.Tile(this);
    this._components.push(tile);
    return tile;
}

PixelJS.prototype.Layer.prototype.createSpriteSheet = function() {
    return new this.engine.SpriteSheet(this);
};

PixelJS.prototype.Layer.prototype.createPlayer = function() {
    var player = new this.engine.Player(this);
    this._components.push(player);
    return player;
};

PixelJS.prototype.Layer.prototype.drawImage = function(img, x, y) {
    this._backBufferCtx.drawImage(img, x, y);
};

PixelJS.prototype.Layer.prototype.drawFromCanvas = function(canvas, x, y) {
    this._backBufferCtx.drawImage(canvas, x, y);
};