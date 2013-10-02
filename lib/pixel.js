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

/* global document, console, window, alert, requestAnimationFrame, event, Image*/

function PixelJS() {
    "use strict";
    var self = this;
    
    this._events = { keydown: [], keyup: [] };
    this._previousElapsedTime = 0;
    this._deltaTime = 0;
    this._canvas = undefined;
    this._ctx = undefined;
    this._sprites = [];
    this._tiles = [];
    this._buffer = undefined;
    
    this.configuration = this.Configurations.Custom;
    
    Object.defineProperty(this, "deltaTime", {
        get: function () { return _deltaTime; },
        configurable: false,
        enumerable: false
    });
    
    document.onkeydown = function (e) {
        e = e || event; // Small hack to get the event args in IE
        
        var keyCode = e.keyCode;
        var listeners = self._events.keydown;
        if (listeners.length > 0) {
            listeners.forEach(function(listener) {
                listener(keyCode);
            });
        }
    };
    
    document.onkeyup = function (e) {
        e = e || event; // Small hack to get the event args in IE
        
        var keyCode = e.keyCode;
        var listeners = self._events.keyup;
        if (listeners.length > 0) {
            listeners.forEach(function(listener) {
                listener(keyCode);
            });
        }
    };
}

PixelJS.prototype.init = function (args) {
    var canvasID = args.canvas;
    this._canvas = document.getElementById(canvasID);
    this._ctx = this._canvas.getContext('2d');
    this._buffer = document.createElement('canvas');
    this._buffer.width = this._canvas.width;
    this._buffer.height = this._canvas.height;
};

PixelJS.prototype.on = function (event, callback) {
    this._events[event].push(callback);
};

PixelJS.prototype.run = function (gameLoop) {
    var self = this;
    (function loop(elapsedTime) {
        requestAnimationFrame(loop);
        self._ctx.clearRect(0, 0, self._canvas.width, self._canvas.height);
        self._buffer.getContext('2d').clearRect(0, 0, self._buffer.width, self._buffer.height);
        self._deltaTime = elapsedTime - self._previousElapsedTime;
        gameLoop(elapsedTime, self._deltaTime);
        
        for (var i = 0; i < self._tiles.length; i++) {
            self._tiles[i].draw();   
        }
        
        for (var i = 0; i < self._sprites.length; i++) {
            if (self._sprites[i].visible) {
                self._sprites[i].draw();
            }
        }
        
        self._previousElapsedTime = elapsedTime;
    }());
};

PixelJS.prototype.createSprite = function () {
    var sprite = new this.Sprite(this);
    this._sprites.push(sprite);
    return sprite;
};

PixelJS.prototype.createAnimatedSprite = function () {
    var sprite = new this.AnimatedSprite(this);
    this._sprites.push(sprite);
    return sprite;
};

PixelJS.prototype.createTile = function () {
    var tile = new this.Tile(this);
    this._tiles.push(tile);
    return tile;
}

PixelJS.prototype.createSpriteSheet = function() {
    return new this.SpriteSheet(this);
};

PixelJS.prototype.Keys = {
    Space: 32,
    Backspace: 8,
    Tab: 9,
    Enter: 13,
    Shift: 16,
    Control: 17,
    Alt: 18,
    Pause: 19,
    Break: 19,
    CapsLock: 20,
    Escape: 27,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    Insert: 45,
    Delete: 46,
    Zero: 48,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
    Five: 53,
    Six: 54,
    Seven: 55,
    Eight: 56,
    Nine: 57,
    Colon: 59,
    NumPadFour: 100,
    NumPadFive: 101,
    NumPadSix: 102,
    NumPadSeven: 103,
    NumPadEight: 104,
    NumPadNine: 105,
    NumPadAsterisk: 106,
    NumPadPlus: 107,
    NumPadMinus: 109,
    Equals: 61,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    NumPadPeriod: 110,
    NumPadSlash: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    Windows: 91,
    ContextMenu: 93,
    NumPadZero: 96,
    NumPadOne: 97,
    NumPadTwo: 98,
    NumPadThree: 99,
    NumLock: 144,
    ScrollLock: 145,
    Pipe: 220,
    BackSlash: 220,
    OpeningSquareBracket: 219,
    OpeningCurlyBracket: 219,
    ClosingSquareBracket: 221,
    ClosingCurlyBracket: 221,
    Comma: 188,
    Period: 190,
    ForwardSlash: 191,
    Tilde: 222,
    Hash: 222
};

PixelJS.prototype.Directions = {
    Left: 1,
    Right: 2,
    Up: 4,
    Down: 8
}

PixelJS.prototype.Configurations = {
    Custom: 0,
    RPG: 1,
    Platform: 2
};