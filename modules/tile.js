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

PixelJS.Tile = function () {
    "use strict";
    this._scaledTile = new Image();
};

PixelJS.extend(PixelJS.Tile, PixelJS.Asset);
    
PixelJS.Tile.prototype.load = function (info, callback) {
    var self = this;
    
    if (info !== undefined) {
        if (info.name !== undefined) {
            this.name = info.name;
        }
        
        if (info.size !== undefined) {
            this.size = info.size;
        }
        
        if (info.callback !== undefined) {
            this.onLoad(info.callback);
        }
    }
    
    if (callback !== undefined) {
        this.onLoad(callback);
    }
    
    var img = new Image();
    img.onload = function () {
        var buffer = document.createElement('canvas');
        var ctx = buffer.getContext('2d');
        var pattern = ctx.createPattern(this, "repeat");

        buffer.width = self.size.width;
        buffer.height = self.size.height;
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, self.size.width, self.size.height);
        
        self._scaledTile.onload = function () {
            self.loaded = true;
        };
        
        self._scaledTile.src = buffer.toDataURL();
    };
    
    img.src = PixelJS.assetPath + '/tiles/' + this.name;
    return this;
};

PixelJS.Tile.prototype.update = function (elapsedTime, dt) {
};
    
PixelJS.Tile.prototype.draw = function (entity) {
    if (this.loaded) {
        entity.layer.drawImage(this._scaledTile, entity.pos.x, entity.pos.y, undefined, entity.opacity);
    }
    
    return this;
};