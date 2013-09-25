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
    
    var m_events = {
            keydown: undefined,
            keyup: undefined
        },
        m_previousElapsedTime = 0,
        m_timeSinceLastUpdate = 0,
        m_canvas,
        m_ctx;
    
    Object.defineProperty(this, "events", {
        get: function () { return m_events; },
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty(this, "canvas", {
        get: function () { return m_canvas; },
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty(this, "ctx", {
        get: function () { return m_ctx; },
        configurable: false,
        enumerable: false
    });
    
    Object.defineProperty(this, "timeSinceLastUpdate", {
        get: function () { return m_timeSinceLastUpdate; },
        configurable: false,
        enumerable: false
    });
    
    this.init = function (args) {
        var canvasID = args.canvas;
        m_canvas = document.getElementById(canvasID);
        m_ctx = m_canvas.getContext('2d');
    };
    
    this.on = function (event, callback) {
        m_events[event] = callback;
    };
    
    this.run = function (gameLoop) {
        (function loop(elapsedTime) {
            requestAnimationFrame(loop);
            m_ctx.clearRect(0, 0, m_canvas.width, m_canvas.height);
            m_timeSinceLastUpdate = elapsedTime - m_previousElapsedTime;
            gameLoop(elapsedTime, m_timeSinceLastUpdate);
            m_previousElapsedTime = elapsedTime;
        }());
    };
    
    document.onkeydown = function (e) {
        e = e || event; // Small hack to get the event args in IE
        
        var keyCode = e.keyCode, callback = m_events.keydown;
        if (callback !== undefined) {
            callback(keyCode);
        }
    };
    
    document.onkeyup = function (e) {
        e = e || event; // Small hack to get the event args in IE
        
        var keyCode = e.keyCode, callback = m_events.keyup;
        if (callback !== undefined) {
            callback(keyCode);
        }
    };
}

PixelJS.prototype.Keys = {
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