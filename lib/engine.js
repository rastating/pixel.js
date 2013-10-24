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

PixelJS.Engine = function () {
    "use strict";
    
    this.scene = { container: undefined, width: 0, height: 0 };
    this._deltaTime = 0;
    this._events = { keydown: [], keyup: [] };
    this._layerKeys = [];
    this._layers = {};
    this._previousElapsedTime = 0;
    this._size = { width: 0, height: 0 };
    
    var self = this;
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
};

PixelJS.Engine.prototype._displayFPS = false;

PixelJS.Engine.prototype._toggleFPSLayer = function () {
    if (this._displayFPS) {
        if (this._layers["__pixeljs_performanceLayer"] === undefined) {
            var layer = this.createLayer("__pixeljs_performanceLayer");
            var counter = new PixelJS.FPSCounter(layer);
            counter.pos = { x: 5, y: 20 };
            layer.addComponent(counter);
            layer.zIndex = 9999;
        }
        else {
            this._layers["__pixeljs_performanceLayer"].visible = true;
        }
    }
    else {
        if (this._layers["__pixeljs_performanceLayer"] !== undefined) {
            this._layers["__pixeljs_performanceLayer"].visible = false;
        }
    }
}

PixelJS.Engine.prototype.createLayer = function (name) {
    var layer = new PixelJS.Layer(this);
    this._layers[name] = layer;
    this._layerKeys.push(name);
    return layer;
};

PixelJS.Engine.prototype.init = function (info) {
    this.scene.container = document.getElementById(info.container);
    this.scene.width = info.width;
    this.scene.height = info.height;
};

PixelJS.Engine.prototype.on = function (event, callback) {
    this._events[event].push(callback);
};

PixelJS.Engine.prototype.run = function (gameLoop) {
    var self = this;
    (function loop(elapsedTime) {
        requestAnimationFrame(loop);
        self._deltaTime = elapsedTime - self._previousElapsedTime;
         
        if (!isNaN(self._deltaTime)) {
            for (var i = 0; i < self._layerKeys.length; i++) {
                self._layers[self._layerKeys[i]].update(elapsedTime, self._deltaTime);
            }
            
            gameLoop(elapsedTime, self._deltaTime);
            
            for (var i = 0; i < self._layerKeys.length; i++) {
                self._layers[self._layerKeys[i]].draw();
            }
        }
        
        self._previousElapsedTime = elapsedTime;
    }());
};

Object.defineProperty(PixelJS.Engine.prototype, "deltaTime", {
    get: function () { return this._deltaTime; },
    configurable: false,
    enumerable: false
});

Object.defineProperty(PixelJS.Engine.prototype, "displayFPS", {
    get: function () { return this._displayFPS; },
    set: function (val) {
        this._displayFPS = val;
        this._toggleFPSLayer();
    },
    configurable: false,
    enumerable: false
});