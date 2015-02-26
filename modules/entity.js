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

PixelJS.Entity = function (layer) {
    "use strict";
    
    this._dragAnchorPoint = { x: 0, y: 0 };
    this.asset = undefined;
    this.layer = layer;
    this.opacity = 1.0;
    this.pos = { x: 0, y: 0 };
    this.size = { width: 0, height: 0 };
    this.velocity = { x: 0, y: 0 };
};

PixelJS.Entity.prototype._isClickable = false;
PixelJS.Entity.prototype._isCollidable = false;
PixelJS.Entity.prototype._isDraggable = false;
PixelJS.Entity.prototype._isDragging = false;
PixelJS.Entity.prototype._isMouseDown = false;
PixelJS.Entity.prototype._isHoverable = false;
PixelJS.Entity.prototype._isHovered = false;
PixelJS.Entity.prototype.canMoveLeft = true;
PixelJS.Entity.prototype.canMoveUp = true;
PixelJS.Entity.prototype.canMoveRight = true;
PixelJS.Entity.prototype.canMoveDown = true;
PixelJS.Entity.prototype.dragButton = PixelJS.Buttons.Left;
PixelJS.Entity.prototype.visible = true;

PixelJS.Entity.prototype._onCollide = function (entity) {
};

PixelJS.Entity.prototype._onDrag = function (point) {
    this.pos.x = point.x - this._dragAnchorPoint.x;
    this.pos.y = point.y - this._dragAnchorPoint.y;
    this._onDragCallback(this.pos);
};

PixelJS.Entity.prototype._onDragCallback = function (point) {
};

PixelJS.Entity.prototype._onDrop = function (point) {
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
                this._onMouseDownCallback(point, button);
            }
        }
    }
};

PixelJS.Entity.prototype._onMouseDownCallback = function (point, button) {
};

PixelJS.Entity.prototype._onMouseHover = function (point, isHovering) {
};

PixelJS.Entity.prototype._onMouseUpCallback = function (point, button) {
};


PixelJS.Entity.prototype._onMouseUp = function (point, button) {
    if (this._isDraggable && this._isDragging && button == this.dragButton) {
        this._isDragging = false;
        this._onDrop(this.pos);
    }
    
    if (this._isClickable && this._isMouseDown) {
        this._isMouseDown = false;
        this._onMouseUpCallback(point, button);
    }
}

PixelJS.Entity.prototype._setIsClickable = function (val) {
    this._isClickable = val;
    if (val) {
        var self = this;
           
        // If the entity is already registered as a draggable, the mouse event
        // hooks will already be in place and don't need to be re-added.
        if (!this._isDraggable) {
            this._mousedownHook = function (p, b) { self._onMouseDown(p, b); };
            this._mouseupHook = function (p, b) { self._onMouseUp(p, b); };
            this.layer.engine.on('mousedown', this._mousedownHook);
            this.layer.engine.on('mouseup', this._mouseupHook);
        }
    }
};

PixelJS.Entity.prototype._setIsCollidable = function (val) {
    if (val && !this._isCollidable) {
        this._isCollidable = val;
        this.layer.registerCollidable(this);
    }
    else {
        this._isCollidable = val;
    }
};

PixelJS.Entity.prototype._setIsDraggable = function (val) {
    this._isDraggable = val;
    if (val) {
        var self = this;
        
        // If the entity is already registered as a clickable, the mouse event
        // hooks will already be in place and don't need to be re-added.
        if (!this._isClickable) {
            this._mousedownHook = function (p, b) { self._onMouseDown(p, b); };
            this._mouseupHook = function (p, b) { self._onMouseUp(p, b); };
            this.layer.engine.on('mousedown', this._mousedownHook);
            this.layer.engine.on('mouseup', this._mouseupHook);
        }
        
        this.layer._registerDraggable(this);
    }
};

PixelJS.Entity.prototype.addToLayer = function (layer) {
    this.layer = layer;
    layer.addComponent(this);
    return this;
}

PixelJS.Entity.prototype.collidesWith = function (entity) {
    "use strict";
    return this.pos.x + this.size.width > entity.pos.x &&
        this.pos.x < entity.pos.x + entity.size.width &&
        this.pos.y + this.size.height > entity.pos.y &&
        this.pos.y < entity.pos.y + entity.size.height;
};

PixelJS.Entity.prototype.dispose = function () {
    this.layer.removeComponent(this);
    
    if (this._isHoverable) {
        this.layer.engine.off('mousemove', this._mousemoveHook);
    }
    
    if (this.isClickable || this.isDraggable) {
        this.layer.engine.off('mousedown', this._mousedownHook);
        this.layer.engine.off('mouseup', this._mouseupHook);
    }
    
    return this;
};

PixelJS.Entity.prototype.draw = function() {
    this.asset.draw(this);
    return this;
};

PixelJS.Entity.prototype.fadeTo = function (opacity, duration, callback) {
    duration = duration === undefined ? 1 : duration;

    var animationSpeed = (this.opacity - opacity) / duration;
    var increasingOpacity = this.opacity < opacity;
    var self = this;
    
    if (self._animateOpacity !== undefined) {
        self.layer.engine._unregisterGameLoopCallback(self._animateOpacity);
    }
    
    this._animateOpacity = function (elapsedTime, dt) {
        dt = dt * 1000; // Convert into milliseconds from fractional seconds.
        
        if (increasingOpacity) {
            self.opacity += animationSpeed * dt;
        }
        else {
            self.opacity -= animationSpeed * dt;
        }
        
        if ((self.opacity >= opacity && increasingOpacity) || (self.opacity <= opacity && !increasingOpacity)) {
            self.opacity = opacity;
            self.layer.engine._unregisterGameLoopCallback(self._animateOpacity);
            self._animateOpacity = undefined;
            if (callback !== undefined) {
                PixelJS.proxy(callback, self);
            }
        }
    };
    
    this.layer.engine._registerGameLoopCallback(this._animateOpacity);
    return this;
};

PixelJS.Entity.prototype.moveLeft = function () {
    if (this.canMoveLeft) {
        this.pos.x -= this.velocity.x * this.layer.engine._deltaTime;
    }
    
    return this;
};
    
PixelJS.Entity.prototype.moveRight = function () {
    if (this.canMoveRight) {
        this.pos.x += this.velocity.x * this.layer.engine._deltaTime;
    }
    
    return this;
};
    
PixelJS.Entity.prototype.moveDown = function () {
    if (this.canMoveDown) {
        this.pos.y += this.velocity.y * this.layer.engine._deltaTime;
    }
    
    return this;
};

PixelJS.Entity.prototype.moveTo = function (x, y, duration, callback) {
    duration = duration === undefined ? 1 : duration;
    
    var velocityX = (this.pos.x - x) / duration;
    var velocityY = (this.pos.y - y) / duration;
    var targetIsToTheLeft = x < this.pos.x;
    var targetIsAbove = y < this.pos.y;
    var self = this;
    
    if (this._animateMovement !== undefined) {
        self.layer.engine._unregisterGameLoopCallback(self._animateMovement);
    }
    
    this._animateMovement = function (elapsedTime, dt) {
        dt = dt * 1000; // Convert into milliseconds from fractional seconds.
        if (targetIsToTheLeft) {
            self.pos.x -= velocityX * dt;
        }
        else {
            self.pos.x += (velocityX * -1) * dt;
        }
        
        if (targetIsAbove) {
            self.pos.y -= velocityY * dt;
        }
        else {
            self.pos.y += (velocityY * -1) * dt;
        }
        
        if (((targetIsToTheLeft && self.pos.x <= x) || (!targetIsToTheLeft && self.pos.x >= x)) && ((targetIsAbove && self.pos.y <= y) || (!targetIsAbove && self.pos.y >= y))) {
            self.pos.x = x;
            self.pos.y = y;
            self.layer.engine._unregisterGameLoopCallback(self._animateMovement);
            self._animateMovement = undefined;
            if (callback !== undefined) {
                callback(self);
            }
        }
    };
    
    this.layer.engine._registerGameLoopCallback(this._animateMovement);
    return this;
};

PixelJS.Entity.prototype.moveUp = function () {
    if (this.canMoveUp) {
        this.pos.y -= this.velocity.y * this.layer.engine._deltaTime;
    }
    
    return this;
};

PixelJS.Entity.prototype.onCollide = function (callback) {
    if (!this.isCollidable) {
        this.isCollidable = true;
    }
    
    this._onCollide = callback;
    return this;    
};

PixelJS.Entity.prototype.onDrag = function (callback) {
    if (!this.isDraggable) {
        this.isDraggable = true;
    }
    
    this._onDragCallback = callback;
    return this;
};

PixelJS.Entity.prototype.onDrop = function (callback) {
    if (!this.isDraggable) {
        this.isDraggable = true;
    }
    
    this._onDrop = callback;
    return this;
};

PixelJS.Entity.prototype.onMouseDown = function (callback) {
    if (!this.isClickable) {
        this.isClickable = true;
    }
    
    this._onMouseDownCallback = callback;
    return this;
};

PixelJS.Entity.prototype.onMouseHover = function (callback) {
    if (!this._isHoverable) {
        var self = this;
        this._mousemoveHook = function (point) {
            if (point.x >= self.pos.x && point.x <= self.pos.x + self.size.width) {
                if (point.y >= self.pos.y && point.y <= self.pos.y + self.size.height) {
                    if (!self._isHovered) {
                        self._onMouseHover(point, true);
                        self._isHovered = true;
                    }
                }
                else {
                    if (self._isHovered) {
                        self._onMouseHover(point, false);
                    }
                    self._isHovered = false;
                }
            }
            else {
                if (self._isHovered) {
                    self._onMouseHover(point, false);
                }
                self._isHovered = false;
            }
        };
        
        this.layer.engine.on('mousemove', this._mousemoveHook);
        this._isHoverable = true;
    }
    
    this._onMouseHover = callback;
    return this;
};

PixelJS.Entity.prototype.onMouseUp = function (callback) {
    if (!this.isClickable) {
        this.isClickable = true;
    }
    
    this._onMouseUpCallback = callback;
    return this;
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
