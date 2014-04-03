# Requires the Slimit JavaScript minifier, see https://pypi.python.org/pypi/slimit

import os
from slimit import minify

root = os.path.dirname(os.path.realpath(__file__))
modules = [
    'pixel.js', 
    'asset.js', 
    'engine.js', 
    'entity.js', 
    'fps_counter.js',
    'layer.js', 
    'player.js', 
    'polyfills.js', 
    'sound.js', 
    'sprite.js', 
    'animated_sprite.js',
    'sprite_sheet.js', 
    'tile.js'
]

compiled = ''
processed_first_file = False
copyright_block = """// Copyright (C) 2013-2014 rastating
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
// along with this program.  If not, see http://www.gnu.org/licenses/."""

with open(root + '/pixel.js', 'w') as outfile:
    for name in modules:
        with open(root + '/../modules/' + name) as module:
            if processed_first_file:
                compiled = compiled + module.read().replace(copyright_block, "") + "\r\n"
            else:
                compiled = compiled + module.read() + "\r\n"
            processed_first_file = True
    outfile.write(compiled)
    
with open(root + '/pixel.min.js', 'w') as outfile:
    outfile.write(minify(compiled, mangle=False, mangle_toplevel=False))