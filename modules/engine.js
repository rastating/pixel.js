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

PixelJS.Engine = function () {
    "use strict";

    this.scene = { container: undefined, width: 0, height: 0 };
    this._deltaTime = 0; // _deltaTime contains the time in fractional seconds since the last update
    this._fullscreenRequested = false;
    this._events = { keydown: [], keyup: [], mousemove: [], mousedown: [], mouseup: [] };
    this._inputLayer = [];
    this._layerKeys = [];
    this._layers = {};
    this._originalContainerStyle = {};
    this._previousElapsedTime = 0;
    this._size = { width: 0, height: 0 };
    this._soundKeys = [];
    this._sounds = {};
    this._gameLoopCallbacks = [];

    var self = this;
    document.onkeydown = function (e) {
        e = e || event; // Small hack to get the event args in IE
        var keyCode = e.keyCode;
        var listeners = self._events.keydown;
        if (listeners.length > 0) {
            e.preventDefault();
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
            e.preventDefault();
            listeners.forEach(function(listener) {
                listener(keyCode);
            });
        }
    };

    this._resizeHandler = function () {
        self.scene.container.style.width =  window.innerWidth + "px";
        self.scene.container.style.height = window.innerHeight + "px";
    };

    this._screenModeChangeHandler = function () {
        if (!self._fullscreenRequested) {
            var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
            var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;

            if (fullscreenElement === null || fullscreenElement === undefined) {
                document.removeEventListener("fullscreenchange", self._screenModeChangeHandler, false);
                document.removeEventListener("webkitfullscreenchange", self._screenModeChangeHandler, false);
                document.removeEventListener("mozfullscreenchange", self._screenModeChangeHandler, false);
                self.fullscreen = false;
            }
        }
        else {
            self._fullscreenRequested = false;
        }
    }
};

PixelJS.Engine.prototype._checkForCollissions = function () {
    for (var keyIndex = 0; keyIndex < this._layerKeys.length; keyIndex++) {
        // Check for collisions within the layer's own collidables
        var collidables = this._layers[this._layerKeys[keyIndex]]._collidables;
        for (var s = 0; s < collidables.length; s++) {
            for (var t = 0; t < collidables.length; t++) {
                if (s !== t) {
                    if (collidables[s].collidesWith(collidables[t])) {
                        collidables[s]._onCollide(collidables[t]);
                    }
                }
            }
        }

        // Check for collisions with the other layers' collidables
        for (var k = 0; k < this._layerKeys.length; k++) {
            if (k !== keyIndex) {
                var otherCollidables = this._layers[this._layerKeys[k]]._collidables;
                for (var s = 0; s < collidables.length; s++) {
                    for (var t = 0; t < otherCollidables.length; t++) {
                        if (collidables[s].collidesWith(otherCollidables[t])) {
                            collidables[s]._onCollide(otherCollidables[t]);
                        }
                    }
                }
            }
        }
    }
};

PixelJS.Engine.prototype._displayFPS = false;
PixelJS.Engine.prototype._fullscreen = false;
PixelJS.Engine.prototype.maxDeltaTime = 33;

PixelJS.Engine.prototype._registerGameLoopCallback = function (callback) {
    this._gameLoopCallbacks.push(callback);
};

PixelJS.Engine.prototype._unregisterGameLoopCallback = function (callback) {
    for (var i = this._gameLoopCallbacks.length - 1; i >= 0; i--) {
        if (this._gameLoopCallbacks[i] == callback) {
            this._gameLoopCallbacks.splice(i, 1);
        }
    }
};

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
};

PixelJS.Engine.prototype._updateScreenMode = function () {
    if (this._fullscreen) {
        this._fullscreenRequested = true;

        if (this.scene.container.requestFullScreen) {
            this.scene.container.requestFullScreen();
        }
        else if (this.scene.container.webkitRequestFullScreen) {
            this.scene.container.webkitRequestFullScreen();
        }
        else {
            this.scene.container.mozRequestFullScreen();
        }

        this.scene.container.style.position = 'absolute';
        this.scene.container.style.top = 0;
        this.scene.container.style.left = 0;
        window.addEventListener('resize', this._resizeHandler);

        document.addEventListener("fullscreenchange", this._screenModeChangeHandler, false);
        document.addEventListener("webkitfullscreenchange", this._screenModeChangeHandler, false);
        document.addEventListener("mozfullscreenchange", this._screenModeChangeHandler, false);
    }
    else {
        window.removeEventListener('resize', this._resizeHandler);

        this.scene.container.style.position = this._originalContainerStyle.position;
        this.scene.container.style.width = this._originalContainerStyle.width;
        this.scene.container.style.height = this._originalContainerStyle.height;

        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
};

PixelJS.Engine.prototype.addSound = function (key, sound) {
    this._sounds[key] = sound;
    return this;
};

PixelJS.Engine.prototype.createLayer = function (name) {
    var layer = new PixelJS.Layer(this);
    this._layers[name] = layer;
    this._layerKeys.push(name);
    return layer;
};

PixelJS.Engine.prototype.createSound = function (name) {
    var sound = new PixelJS.Sound();
    this._sounds[name] = sound;
    this._soundKeys.push(name);
    return sound;
}

PixelJS.Engine.prototype.init = function (info) {
    this.scene.container = document.getElementById(info.container);
    this.scene.width = info.width;
    this.scene.height = info.height;

    this._originalContainerStyle.position = this.scene.container.style.position;
    this._originalContainerStyle.width = this.scene.container.style.width;
    this._originalContainerStyle.height = this.scene.container.style.height;
    this._originalContainerStyle.top = this.scene.container.style.top;
    this._originalContainerStyle.left = this.scene.container.style.left;

    if (info.maxDeltaTime !== undefined) {
        this.maxDeltaTime = info.maxDeltaTime;
    }
    
    var self = this;
    this._inputLayer = document.createElement('div');
    this._inputLayer.width = this.scene.width;
    this._inputLayer.height = this.scene.height;
    this._inputLayer.style.position = 'absolute';
    this._inputLayer.style.top = 0;
    this._inputLayer.style.left = 0;
    this._inputLayer.style.width = '100%';
    this._inputLayer.style.height = '100%';
    this._inputLayer.className = 'scene-layer';
    this._inputLayer.style.zIndex = '9999';
    this._inputLayer.onmousemove = function (e) {
        var listeners = self._events.mousemove;
        if (listeners.length > 0) {
            var point = self._inputLayer.relMouseCoords(e);
            listeners.forEach(function(listener) {
                listener(point);
            });
        }
    };
    
    this._inputLayer.onmousedown = function (e) {
        var listeners = self._events.mousedown;
        if (listeners.length > 0) {
            // The middle button is usually 1 but should be dispatched
            // as 4 to allow bitwise operations in the future.
            var button = e.button == 1 ? 4 : e.button == 0 ? 1 : 2;
            var point = self._inputLayer.relMouseCoords(e);
            
            listeners.forEach(function(listener) {
                listener(point, button);
            });
        }
    };
    
    this._inputLayer.onmouseup = function (e) {
        var listeners = self._events.mouseup;
        if (listeners.length > 0) {
            // The middle button is usually 1 but should be dispatched
            // as 4 to allow bitwise operations in the future.
            var button = e.button == 1 ? 4 : e.button == 0 ? 1 : 2;
            var point = self._inputLayer.relMouseCoords(e);
            
            listeners.forEach(function(listener) {
                listener(point, button);
            });
        }
    };
    
    this.scene.container.appendChild(this._inputLayer);
    return this;
};

PixelJS.Engine.prototype.loadAndRun = function (gameLoop) {
    var self = this;
    self.loadScene(function () {
        self.loadSounds(function () {
            self.run(gameLoop);
        });
    });
    
    return this;
};

PixelJS.Engine.prototype.loadScene = function (callback) {
    var loading = this._layerKeys.length;
    for (var k = 0; k < this._layerKeys.length; k++) {
        this._layers[this._layerKeys[k]].load(function () {
            loading -= 1;
            if (loading === 0) {
                callback();
            }
        });
    }
    
    return this;
};

PixelJS.Engine.prototype.loadSounds = function (callback) {
    var loading = this._soundKeys.length;
    if (loading === 0) {
        callback();
    }
    else {
        for (var k = 0; k < this._soundKeys.length; k++) {
            var key = this._soundKeys[k];
            if (this._sounds[key]._canPlay || this._sounds[key]._prepInfo === undefined) {
                loading -= 1;
                if (loading === 0) {
                    callback();
                }
            }
            else {
                this._sounds[key].load(this._sounds[key]._prepInfo, function () {
                    loading -= 1;
                    if (loading === 0) {
                        callback();
                    }
                });
            }
        }
    }
    
    return this;
};

PixelJS.Engine.prototype.off = function (event, callback) {
    for (var i = this._events[event.toLowerCase()].length - 1; i >= 0; i--) {
        if (this._events[event.toLowerCase()][i] == callback) {
            this._events[event.toLowerCase()].splice(i, 1);
        }
    }

    return this;
};

PixelJS.Engine.prototype.on = function (event, callback) {
    this._events[event.toLowerCase()].push(callback);
    return this;
};

PixelJS.Engine.prototype.playSound = function (key) {
    this._sounds[key].play();
    return this;
}

PixelJS.Engine.prototype.run = function (gameLoop) {
    var self = this;
    (function loop(elapsedTime) {
        requestAnimationFrame(loop);
        self._deltaTime = Math.min(elapsedTime - self._previousElapsedTime, self.maxDeltaTime) / 1000;

        if (!isNaN(self._deltaTime)) {
            for (var i = 0; i < self._layerKeys.length; i++) {
                self._layers[self._layerKeys[i]].update(elapsedTime, self._deltaTime);
            }
            
            for (var i = 0; i < self._gameLoopCallbacks.length; i++) {
                self._gameLoopCallbacks[i](elapsedTime, self._deltaTime);
            }

            self._checkForCollissions();

            gameLoop(elapsedTime, self._deltaTime);

            for (var i = 0; i < self._layerKeys.length; i++) {
                self._layers[self._layerKeys[i]].draw();
            }
        }

        self._previousElapsedTime = elapsedTime;
    }());
    
    return this;
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

Object.defineProperty(PixelJS.Engine.prototype, "fullscreen", {
    get: function () { return this._fullscreen; },
    set: function (val) {
        if (this._fullscreen !== val) {
            this._fullscreen = val;
            this._updateScreenMode();
        }
    },
    configurable: false,
    enumerable: true
});
