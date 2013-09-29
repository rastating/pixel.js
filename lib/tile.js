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

PixelJS.prototype.Tile = function (engine) {
    "use strict";
    
    this._assetName = '';
    this._assetImage = new Image();
    this._assetLoaded = false;
    this._pattern = undefined;
    this._buffer = undefined;
    
    this.engine = engine;
    this.pos = { x: 0, y: 0 };
    this.size = { width: 0, height: 0 };
};
    
PixelJS.prototype.Tile.prototype.load = function (info, callback) {
    var self = this;
    this._assetName = info.name;
    this._assetImage.src = 'assets/tiles/' + this._assetName;
    this._assetImage.onload = function () {
        self._pattern = self.engine._ctx.createPattern(self._assetImage, "repeat");
        self._assetLoaded = true;
        
        self._buffer = document.createElement('canvas');
        var ctx = self._buffer.getContext('2d');
        self._buffer.width = self.size.width;
        self._buffer.height = self.size.height;
        ctx.fillStyle = self._pattern;
        ctx.fillRect(0, 0, self.size.width, self.size.height);
        
        callback();
    };
};
    
PixelJS.prototype.Tile.prototype.draw = function (args) {
    if (this._assetLoaded) {
        this.engine._ctx.drawImage(this._buffer, this.pos.x, this.pos.y);
    }
};