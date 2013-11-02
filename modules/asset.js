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

PixelJS.Asset = function () {
    "use strict";
    this._prepInfo = { };
};

PixelJS.Asset.prototype._loaded = false;
PixelJS.Asset.prototype.load = function (info, callback) { };
PixelJS.Asset.prototype.name = '';
PixelJS.Asset.prototype.onLoad = undefined;

PixelJS.Asset.prototype.prepare = function (info) {
    this._prepInfo = info;
};

Object.defineProperty(PixelJS.Asset.prototype, "loaded", {
    get: function () { 
        return this._loaded; 
    },
    set: function (val) { 
        this._loaded = val;
        if (this.onLoad !== undefined) {
            this.onLoad(this);
        }
    },
    configurable: false,
    enumerable: false
});