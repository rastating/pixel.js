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

PixelJS.Player = function () {
    this._directionRowMap = {
        down: 0,
        left: 1,
        right: 2,
        up: 3
    };
    
    this.direction = 0;
    this.allowDiagonalMovement = false;
};

PixelJS.extend(PixelJS.Player, PixelJS.Entity);
PixelJS.Player.prototype.isAnimatedSprite = true;

PixelJS.Player.prototype.addToLayer = function (layer) {
    var self = this;
    layer.addComponent(this);
    this.layer = layer;
    
    this.layer.engine.on('keydown', function (keyCode) {
        switch (keyCode) {
            case PixelJS.Keys.Left:
                self.direction |= PixelJS.Directions.Left;
                break;
                
            case PixelJS.Keys.Up:
                self.direction |= PixelJS.Directions.Up;
                break;
                
            case PixelJS.Keys.Right:
                self.direction |= PixelJS.Directions.Right;
                break;
                
            case PixelJS.Keys.Down:
                self.direction |= PixelJS.Directions.Down;
                break;
        }
        
        self.layer.requiresDraw = true;
    });
        
    this.layer.engine.on('keyup', function (keyCode) {
        switch (keyCode) {
            case PixelJS.Keys.Left:
                self.direction &= ~PixelJS.Directions.Left;
                break;
                
            case PixelJS.Keys.Up:
                self.direction &= ~PixelJS.Directions.Up;
                break;
                
            case PixelJS.Keys.Right:
                self.direction &= ~PixelJS.Directions.Right;
                break;
                
            case PixelJS.Keys.Down:
                self.direction &= ~PixelJS.Directions.Down;
                break;
        }
        
        self.layer.requiresDraw = true;
    });
    
    return this;
}

PixelJS.Player.prototype.update = function (elapsedTime, dt) {
    if (this.allowDiagonalMovement) {
        if ((this.direction & PixelJS.Directions.Right) != 0) {
            this.moveRight();
        }
        
        if ((this.direction & PixelJS.Directions.Left) != 0) {
            this.moveLeft();
        }
        
        if ((this.direction & PixelJS.Directions.Up) != 0) {
            this.moveUp();
        }
        
        if ((this.direction & PixelJS.Directions.Down) != 0) {
            this.moveDown();
        }
    }
    else {
        if ((this.direction & PixelJS.Directions.Right) != 0) {
            if (this.isAnimatedSprite) {
                this.asset.startAnimating();
                this.asset.row = this._directionRowMap.right;
            }
            this.moveRight();
        }
        else if ((this.direction & PixelJS.Directions.Up) != 0) {
            if (this.isAnimatedSprite) {
                this.asset.row = this._directionRowMap.up;
                this.asset.startAnimating();
            }
            this.moveUp();
        }
        else if ((this.direction & PixelJS.Directions.Left) != 0) {
            if (this.isAnimatedSprite) {
                this.asset.row = this._directionRowMap.left;
                this.asset.startAnimating();
            }
            this.moveLeft();
        }
        else if ((this.direction & PixelJS.Directions.Down) != 0) {
            if (this.isAnimatedSprite) {
                this.asset.row = this._directionRowMap.down;
                this.asset.startAnimating();
            }
            this.moveDown();
        }
        else {
            if (this.isAnimatedSprite) {
                this.asset.stopAnimating();
            }
        }
    }
    
    return this;
};