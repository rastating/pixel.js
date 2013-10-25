// Copyright (C) 2013 rastating
//
// Version 0.0.3
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

PixelJS.Layer = function (engine) {
    "use strict";
    
    this._backBuffer = undefined;
    this._backBufferCtx = undefined;
    this._canvas = undefined;
    this._ctx = undefined;
    this._components = [];
    this._collidables = [];
    this.engine = engine;
    
    this._insertIntoDom();
};

PixelJS.Layer.prototype.redraw = true;
PixelJS.Layer.prototype.visible = true;

PixelJS.Layer.prototype._insertIntoDom = function() {
    var container = this.engine.scene.container;
    this._canvas = document.createElement('canvas');
    this._canvas.width = this.engine.scene.width;
    this._canvas.height = this.engine.scene.height;
    this._canvas.className = 'scene-layer';
    this._ctx = this._canvas.getContext('2d');
    container.appendChild(this._canvas);
    
    this._backBuffer = document.createElement('canvas');
    this._backBuffer.width = this._canvas.width;
    this._backBuffer.height = this._canvas.height;
    this._backBufferCtx = this._backBuffer.getContext('2d');
};

PixelJS.Layer.prototype.registerCollidable = function(collidable) {
    this._collidables.push(collidable);
};

PixelJS.Layer.prototype.addComponent = function(component) {
    this._components.push(component);
};

PixelJS.Layer.prototype.createEntity = function () {
    var entity = new PixelJS.Entity(this);
    this._components.push(entity);
    
    return entity;
};

PixelJS.Layer.prototype.draw = function() {
    if (this.redraw) {
        if (this.visible) {
            for (var i = 0; i < this._components.length; i++) {
                this._components[i].draw();
            }
        }
        
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.drawImage(this._backBuffer, 0, 0);
        this._backBufferCtx.clearRect(0, 0, this._backBuffer.width, this._backBuffer.height);
    }
};

PixelJS.Layer.prototype.drawImage = function(img, x, y) {
    this._backBufferCtx.drawImage(img, x, y);
};

PixelJS.Layer.prototype.drawFromCanvas = function(canvas, x, y) {
    this._backBufferCtx.drawImage(canvas, x, y);
};

PixelJS.Layer.prototype.drawText = function (text, x, y, font, fillStyle) {
    this._backBufferCtx.save();
    this._backBufferCtx.font = font;
    this._backBufferCtx.fillStyle = fillStyle;
    this._backBufferCtx.fillText(text, x, y);
    this._backBufferCtx.restore();
};

PixelJS.Layer.prototype.update = function(elapsedTime, dt) {
    for (var i = 0; i < this._components.length; i++) {
        this._components[i].update(elapsedTime, dt);
    }
};

Object.defineProperty(PixelJS.Layer.prototype, "zIndex", {
    get: function () { return this._canvas.style.zIndex; },
    set: function (val) { this._canvas.style.zIndex = val; },
    configurable: false,
    enumerable: false
});