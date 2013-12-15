// Copyright (C) 2013 rastating
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

PixelJS.Entity.prototype._isClickable = false;
PixelJS.Entity.prototype._isCollidable = false;
PixelJS.Entity.prototype._isDraggable = false;
PixelJS.Entity.prototype._isDragging = false;
PixelJS.Entity.prototype._isMouseDown = false;
PixelJS.Entity.prototype.canMoveLeft = true;
PixelJS.Entity.prototype.canMoveUp = true;
PixelJS.Entity.prototype.canMoveRight = true;
PixelJS.Entity.prototype.canMoveDown = true;
PixelJS.Entity.prototype.dragButton = PixelJS.Buttons.Left;
PixelJS.Entity.prototype.visible = true;

PixelJS.Entity.prototype._onDrag = function (point) {
    this.pos.x = point.x - this._dragAnchorPoint.x;
    this.pos.y = point.y - this._dragAnchorPoint.y;
    this.onDrag(this.pos);
};

PixelJS.Entity.prototype._onMouseDown = function (point, button) {
    if (point.x >= this.pos.x && point.x <= this.pos.x + this.size.width) {
        if (point.y >= this.pos.y && point.y <= this.pos.y + this.size.height) {            
            if (this._isDraggable && button == this.dragButton) {
                this._dragAnchorPoint.x = point.x - this.pos.x;
                this._dragAnchorPoint.y = point.y - this.pos.y;
                this._isDragging = true;
            }
            
            if (this._isClickable) {
                this._isMouseDown = true;
                this.onMouseDown(point, button);
            }
        }
    }
};

PixelJS.Entity.prototype._onMouseUp = function (point, button) {
    if (this._isDraggable && this._isDragging && button == this.dragButton) {
        this._isDragging = false;
        this.onDrop(this.pos);
    }
    
    if (this._isClickable && this._isMouseDown) {
        this._isMouseDown = false;
        this.onMouseUp(point, button);
    }
}

PixelJS.Entity.prototype._setIsClickable = function (val) {
    this._isClickable = val;
    if (val) {
        var self = this;
           
        // If the entity is already registered as a draggable, the mouse event
        // hooks will already be in place and don't need to be re-added.
        if (!this._isDraggable) {
            this.layer.engine.on('mousedown', function (p, b) {
                self._onMouseDown(p, b);
            });
            this.layer.engine.on('mouseup', function (p, b) {
                self._onMouseUp(p, b);
            });
        }
    }
};

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
        
        // If the entity is already registered as a clickable, the mouse event
        // hooks will already be in place and don't need to be re-added.
        if (!this._isClickable) {
            this.layer.engine.on('mousedown', function (p, b) {
                self._onMouseDown(p, b);
            });
            this.layer.engine.on('mouseup', function (p, b) {
                self._onMouseUp(p, b);
            });
        }
        
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
}

PixelJS.Entity.prototype.onDrop = function (point) {
};

PixelJS.Entity.prototype.onMouseDown = function (point, button) {
};

PixelJS.Entity.prototype.onMouseUp = function (point, button) {
};

PixelJS.Entity.prototype.update = function(elapsedTime, dt) {
};

Object.defineProperty(PixelJS.Entity.prototype, "isClickable", {
    get: function () { return this._isClickable; },
    set: function (val) { this._setIsClickable(val) },
    configurable: false,
    enumerable: false
});

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