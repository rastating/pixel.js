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

PixelJS.FPSCounter = function (layer) {
    var self = this;
    this.fps = 0;
    this._lastUpdate = 1;
    this.layer = layer;
};

PixelJS.extend(PixelJS.FPSCounter, PixelJS.Entity);

PixelJS.FPSCounter.prototype.update = function (elapsedTime, dt) {
    if (this._lastUpdate >= 1) {
        this.fps = 1 / dt;
        this._lastUpdate = 0;
    }
    else {
        this._lastUpdate += dt;   
    }
    
    return this;
};

PixelJS.FPSCounter.prototype.draw = function () {
    this.layer.drawText('FPS: ' + Math.round(this.fps, 2), 
        this.pos.x, 
        this.pos.y, 
        '18px "Courier New", Courier, monospace',
        '#00FF00'
    );
    
    return this;
};