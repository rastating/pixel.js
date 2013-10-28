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
    
    this.asset = undefined;
    this.layer = layer;
    this.pos = { x: 0, y: 0 };
    this.size = { width: 0, height: 0 };
    this.velocity = { x: 0, y: 0 };
};

PixelJS.Entity.prototype._isCollidable = false;
PixelJS.Entity.prototype.canMoveLeft = true;
PixelJS.Entity.prototype.canMoveUp = true;
PixelJS.Entity.prototype.canMoveRight = true;
PixelJS.Entity.prototype.canMoveDown = true;
PixelJS.Entity.prototype.visible = true;

PixelJS.Entity.prototype._setIsCollidable = function (val) {
    this._isCollidable = val;
    if (val) {
        this.layer._registerCollidable(this);
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

PixelJS.Entity.prototype.update = function(elapsedTime, dt) {
};

Object.defineProperty(PixelJS.Entity.prototype, "isCollidable", {
    get: function () { return this._isCollidable; },
    set: function (val) { this._setIsCollidable(val) },
    configurable: false,
    enumerable: false
});