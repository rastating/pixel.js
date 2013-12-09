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

PixelJS.Entity = function (layer) {
    "use strict";
    
    this._dragAnchorPoint = { x: 0, y: 0 };
    this.asset = undefined;
    this.layer = layer;
    this.pos = { x: 0, y: 0 };
    this.size = { width: 0, height: 0 };
    this.velocity = { x: 0, y: 0 };
};

PixelJS.Entity.prototype._isCollidable = false;
PixelJS.Entity.prototype._isDraggable = false;
PixelJS.Entity.prototype._isDragging = false;
PixelJS.Entity.prototype.canMoveLeft = true;
PixelJS.Entity.prototype.canMoveUp = true;
PixelJS.Entity.prototype.canMoveRight = true;
PixelJS.Entity.prototype.canMoveDown = true;
PixelJS.Entity.prototype.visible = true;

PixelJS.Entity.prototype._onMouseDown = function (e, point) {
    if (point.x >= this.pos.x && point.x <= this.pos.x + this.size.width) {
        if (point.y >= this.pos.y && point.y <= this.pos.y + this.size.height) {
            this._dragAnchorPoint.x = point.x - this.pos.x;
            this._dragAnchorPoint.y = point.y - this.pos.y;
            this._isDragging = true;
        }
    }
};

PixelJS.Entity.prototype._onMouseUp = function (e, point) {
    this._isDragging = false;
}

PixelJS.Entity.prototype._setIsCollidable = function (val) {
    this._isCollidable = val;
    if (val) {
        this.layer.registerCollidable(this);
    }
};

PixelJS.Entity.prototype._setIsDraggable = function (val) {
    this._isDraggable = val;
    if (val) {
        var self = this;
        this.layer.engine.on('mousedown', function (e, p) {
            self._onMouseDown(e, p);
        });
        this.layer.engine.on('mouseup', function (e, p) {
            self._onMouseUp(e, p);
        });
        this.layer._registerDraggable(this);
    }
};

PixelJS.Entity.prototype.addToLayer = function (layer) {
    this.layer = layer;
    layer.addComponent(this);
}

PixelJS.Entity.prototype.collidesWith = function (entity) {
    "use strict";
    return this.pos.x + this.size.width > entity.pos.x &&
        this.pos.x < entity.pos.x + entity.size.width &&
        this.pos.y + this.size.height > entity.pos.y &&
        this.pos.y < entity.pos.y + entity.size.height;
};

PixelJS.Entity.prototype.draw = function() {
    this.asset.draw(this);
};

PixelJS.Entity.prototype.moveLeft = function () {
    if (this.canMoveLeft) {
        this.pos.x -= this.velocity.x * this.layer.engine._deltaTime;
    }
};
    
PixelJS.Entity.prototype.moveRight = function () {
    if (this.canMoveRight) {
        this.pos.x += this.velocity.x * this.layer.engine._deltaTime;
    }
};
    
PixelJS.Entity.prototype.moveDown = function () {
    if (this.canMoveDown) {
        this.pos.y += this.velocity.y * this.layer.engine._deltaTime;
    }
};

PixelJS.Entity.prototype.moveUp = function () {
    if (this.canMoveUp) {
        this.pos.y -= this.velocity.y * this.layer.engine._deltaTime;
    }
};

PixelJS.Entity.prototype.onCollide = function (entity) {
};

PixelJS.Entity.prototype.onDrag = function (point) {
    this.pos.x = point.x - this._dragAnchorPoint.x;
    this.pos.y = point.y - this._dragAnchorPoint.y;
};

PixelJS.Entity.prototype.update = function(elapsedTime, dt) {
};

Object.defineProperty(PixelJS.Entity.prototype, "isCollidable", {
    get: function () { return this._isCollidable; },
    set: function (val) { this._setIsCollidable(val) },
    configurable: false,
    enumerable: false
});

Object.defineProperty(PixelJS.Entity.prototype, "isDraggable", {
    get: function () { return this._isDraggable; },
    set: function (val) { this._setIsDraggable(val) },
    configurable: false,
    enumerable: false
});

Object.defineProperty(PixelJS.Entity.prototype, "isDragging", {
    get: function () { return this._isDragging; },
    configurable: false,
    enumerable: false
});