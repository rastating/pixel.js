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

PixelJS.Sound = function () {
    this._element = undefined;
    this._canPlay = false;
    this._prepInfo = { };
};

PixelJS.Sound.prototype.load = function (info, callback) {
    var self = this;
    this._element = document.createElement('audio');
    this._element.setAttribute('src', 'assets/sounds/' + info.name);
    this._element.addEventListener('canplaythrough', function () {
        self._canPlay = true;
        if (callback !== undefined) {
            callback(self);
        }
    }, true);
    this._element.load();
};

PixelJS.Sound.prototype.pause = function () {
    if (this._canPlay) {
        this._element.pause();
    }
};

PixelJS.Sound.prototype.play = function () {
    if (this._canPlay) {
        this._element.play();
    }
};

PixelJS.Sound.prototype.prepare = function (info) {
    this._prepInfo = info;
};

PixelJS.Sound.prototype.seek = function (time) {
    if (this._canPlay) {
        this._element.currentTime = time;
    }
};

Object.defineProperty(PixelJS.Sound.prototype, "duration", {
    get: function () { return this._element.duration; },
    configurable: false,
    enumerable: true
});

Object.defineProperty(PixelJS.Sound.prototype, "loop", {
    get: function () { return this._element.loop; },
    set: function (val) { this._element.loop = val; },
    configurable: false,
    enumerable: true
});

Object.defineProperty(PixelJS.Sound.prototype, "muted", {
    get: function () { return this._element.muted; },
    set: function (val) { this._element.muted = val; },
    configurable: false,
    enumerable: true
});

Object.defineProperty(PixelJS.Sound.prototype, "paused", {
    get: function () { return this._element.paused; },
    configurable: false,
    enumerable: true
});

Object.defineProperty(PixelJS.Sound.prototype, "playbackRate", {
    get: function () { return this._element.defaultPlaybackRate; },
    set: function (val) { this._element.defaultPlaybackRate = Math.max(val, 0.1); },
    configurable: false,
    enumerable: true
});

Object.defineProperty(PixelJS.Sound.prototype, "volume", {
    get: function () { return this._element.volume; },
    set: function (val) { this._element.volume = val; },
    configurable: false,
    enumerable: true
});