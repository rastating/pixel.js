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

PixelJS.prototype.Player = function (engine) {
    var self = this;
    this._sprite = engine.createAnimatedSprite();
    this.direction = 0;
    this.engine = engine;
    
    this.engine.on('keydown', function (keyCode) {
        switch (keyCode) {
            case self.engine.Keys.Left:
                self.direction |= self.engine.Directions.Left;
                break;
                
            case self.engine.Keys.Up:
                self.direction |= self.engine.Directions.Up;
                break;
                
            case self.engine.Keys.Right:
                self.direction |= self.engine.Directions.Right;
                break;
                
            case self.engine.Keys.Down:
                self.direction |= self.engine.Directions.Down;
                break;
        }
    });
        
    this.engine.on('keyup', function (keyCode) {
        switch (keyCode) {
            case self.engine.Keys.Left:
                self.direction &= ~self.engine.Directions.Left;
                break;
                
            case self.engine.Keys.Up:
                self.direction &= ~self.engine.Directions.Up;
                break;
                
            case self.engine.Keys.Right:
                self.direction &= ~self.engine.Directions.Right;
                break;
                
            case self.engine.Keys.Down:
                self.direction &= ~self.engine.Directions.Down;
                break;
        }
    });
};

Object.defineProperty(PixelJS.prototype.Player.prototype, "animationSpeed", {
    get: function () { return this._sprite.animationSpeed; },
    set: function (value) { this._sprite.animationSpeed = value; },
    configurable: false,
    enumerable: false
});

PixelJS.prototype.Player.prototype.load = function (info, callback) {
    var self = this;
    this._sprite.load(info, function () {
        self._loaded = true;
        callback(self);
        
    });
};

PixelJS.prototype.Player.prototype.update = function (elapsedTime, dt) {
    if ((this.direction & this.engine.Directions.Right) != 0) {
        this._sprite.moveRight();
    }
    
    if ((this.direction & this.engine.Directions.Left) != 0) {
        this._sprite.moveLeft();
    }
    
    if ((this.direction & this.engine.Directions.Up) != 0) {
        this._sprite.moveUp();
    }
    
    if ((this.direction & this.engine.Directions.Down) != 0) {
        this._sprite.moveDown();
    }
};