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

PixelJS.Layer = function (engine) {
    "use strict";
    
    this._backBuffer = undefined;
    this._backBufferCtx = undefined;
    this._canvas = undefined;
    this._ctx = undefined;
    this._components = [];
    this._collidables = [];
    this._draggables = [];
    this.engine = engine;
    
    this._insertIntoDom();
};

PixelJS.Layer.prototype.redraw = true;
PixelJS.Layer.prototype.static = false;
PixelJS.Layer.prototype.visible = true;

PixelJS.Layer.prototype._insertIntoDom = function() {
    var container = this.engine.scene.container;
    this._canvas = document.createElement('canvas');
    this._canvas.width = this.engine.scene.width;
    this._canvas.height = this.engine.scene.height;
    this._canvas.style.position = 'absolute';
    this._canvas.style.top = 0;
    this._canvas.style.left = 0;
    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';
    this._canvas.className = 'scene-layer';
    this._ctx = this._canvas.getContext('2d');
    container.appendChild(this._canvas);
    
    this._backBuffer = document.createElement('canvas');
    this._backBuffer.width = this._canvas.width;
    this._backBuffer.height = this._canvas.height;
    this._backBufferCtx = this._backBuffer.getContext('2d');
};

PixelJS.Layer.prototype._registerDraggable = function (draggable) {
    if (this._draggables.length == 0) {
        var self = this;
        this.engine.on('mousemove', function (point) {
            for (var i = 0; i < self._draggables.length; i++) {
                if (self._draggables[i].isDragging) {
                    self._draggables[i]._onDrag(point);
                }
            }
        });
    }
    
    if (!PixelJS.existsInArray(draggable, this._draggables)) {
        this._draggables.push(draggable);
    }
    
    return this;
};

PixelJS.Layer.prototype._unregisterDraggable = function (draggable) {
    for (var i = this._draggables.length - 1; i >= 0; i--) {
        if (this._draggables[i] == draggable) {
            this._draggables.splice(i, 1);
        }
    }
    
    return this;
};

PixelJS.Layer.prototype.addComponent = function (component) {
    this._components.push(component);
    return this;
};

PixelJS.Layer.prototype.createEntity = function () {
    var entity = new PixelJS.Entity(this);
    this._components.push(entity);
    
    return entity;
};

PixelJS.Layer.prototype.draw = function () {
    if (this.redraw) {
        if (this.visible) {
            for (var i = 0; i < this._components.length; i++) {
                this._components[i].draw();
            }
        }
        
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.drawImage(this._backBuffer, 0, 0);
        this._backBufferCtx.clearRect(0, 0, this._backBuffer.width, this._backBuffer.height);
        
        if (this.static) {
            this.redraw = false;
        }
    }
    
    return this;
};

PixelJS.Layer.prototype.drawImage = function (img, x, y, rotation, opacity, hFlip) {
    this._backBufferCtx.save();

    if (hFlip) {
        this._backBufferCtx.translate(this._canvas.width, 0);
        this._backBufferCtx.scale(-1, 1);
        x = this._canvas.width - (x + img.width);
    }

    if (rotation == undefined || rotation == 0) {    
        if (opacity < 1) {
            this._backBufferCtx.globalAlpha = opacity;
        }
        
        this._backBufferCtx.drawImage(img, x, y);
    }
    else {
        this._backBufferCtx.translate(x + (img.width / 2), y + (img.height / 2));
        this._backBufferCtx.rotate(rotation * Math.PI / 180);
        if (opacity < 1) {
            this._backBufferCtx.globalAlpha = opacity;
        }
        this._backBufferCtx.drawImage(img, (img.width / 2) * -1, (img.height / 2) * -1);
    }
    
    this._backBufferCtx.restore();
    return this;
};

PixelJS.Layer.prototype.drawFromCanvas = function (canvas, x, y) {
    this._backBufferCtx.drawImage(canvas, x, y);
    return this;
};

PixelJS.Layer.prototype.drawRectangle = function (x, y, width, height, style) {
    this._backBufferCtx.save();
    this._backBufferCtx.beginPath();
    this._backBufferCtx.rect(x, y, width, height);
    
    if (style.fill !== undefined) {
        this._backBufferCtx.fillStyle = style.fill;
        this._backBufferCtx.fill();
    }
    
    if (style.stroke !== undefined) {
        this._backBufferCtx.strokeStyle = style.stroke;
        this._backBufferCtx.stroke();
    }
    
    this._backBufferCtx.closePath();
    this._backBufferCtx.restore();
    return this;
};

PixelJS.Layer.prototype.drawText = function (text, x, y, font, fillStyle, textAlign) {
    this._backBufferCtx.save();
    this._backBufferCtx.font = font;
    this._backBufferCtx.fillStyle = fillStyle;
    this._backBufferCtx.textAlign = textAlign;
    this._backBufferCtx.fillText(text, x, y);
    this._backBufferCtx.restore();
    return this;
};

PixelJS.Layer.prototype.load = function (callback) {
    var loading = this._components.length;
    if (loading === 0) {
        callback();
    }
    else {
        for (var i = 0; i < this._components.length; i++) {
            var c = this._components[i];
            if (c.asset !== undefined && c.asset._prepInfo !== undefined) {
                c.asset.load(c.asset._prepInfo, function () {
                    loading -= 1;
                    if (loading === 0) {
                        callback();
                    }
                });
            }
            else {
                loading -= 1;
                if (loading === 0) {
                    callback();
                }
            }
        }
    }
    return this;
};

PixelJS.Layer.prototype.registerCollidable = function (collidable) {
    if (!PixelJS.existsInArray(collidable, this._collidables)) {
        this._collidables.push(collidable);
    }
    
    return this;
};

PixelJS.Layer.prototype.removeComponent = function (component) {
  for (var i = this._components.length - 1; i >= 0; i--) {
        if (this._components[i] == component) {
            this._components.splice(i, 1);
            
            if (component.isCollidable) {
                this.unregisterCollidable(component);
            }
            
            if (component.isDraggable) {
                this._unregisterDraggable(component);
            }
        }
    }
    
    return this;
};

PixelJS.Layer.prototype.unregisterCollidable = function (collidable) {
    for (var i = this._collidables.length - 1; i >= 0; i--) {
        if (this._collidables[i] == collidable) {
            this._collidables.splice(i, 1);
        }
    }
    
    return this;
};

PixelJS.Layer.prototype.update = function(elapsedTime, dt) {
    for (var i = 0; i < this._components.length; i++) {
        this._components[i].update(elapsedTime, dt);
    }
    
    return this;
};

Object.defineProperty(PixelJS.Layer.prototype, "zIndex", {
    get: function () { return this._canvas.style.zIndex; },
    set: function (val) { this._canvas.style.zIndex = val; },
    configurable: false,
    enumerable: false
});