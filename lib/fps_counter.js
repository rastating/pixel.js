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

PixelJS.prototype.FPSCounter = function (engine) {
    var self = this;
    this.engine = engine;
    this.pos = {x: 5, y: 20};
    this.fps = 0;
    this._lastUpdate = 1000;
};

PixelJS.prototype.FPSCounter.prototype.update = function (elapsedTime, dt) {
    if (this._lastUpdate >= 1000) {
        this.fps = 1 / (dt / 1000);
        this._lastUpdate = 0;
    }
    else {
        this._lastUpdate += dt;   
    }
};

PixelJS.prototype.FPSCounter.prototype.draw = function () {
    
    var ctx = this.engine._ctx;
    ctx.save();
    ctx.font = '18px "Courier New", Courier, monospace';
    ctx.fillStyle = '#00FF00';
    ctx.fillText('FPS: ' + Math.round(this.fps, 2), this.pos.x, this.pos.y);
    ctx.restore();
};