# Requires the Slimit JavaScript minifier, see https://pypi.python.org/pypi/slimit

import os
from slimit import minify

root = os.path.dirname(os.path.realpath(__file__))
modules = [
    'pixel.js', 
    'animated_sprite.js', 
    'asset.js', 
    'engine.js', 
    'entity.js', 
    'fps_counter.js',
    'layer.js', 
    'player.js', 
    'polyfills.js', 
    'sound.js', 
    'sprite.js', 
    'sprite_sheet.js', 
    'tile.js'
]

compiled = ''
with open(root + '/pixel.js', 'w') as outfile:
    for name in modules:
        with open(root + '/../modules/' + name) as module:
            compiled = compiled + module.read() + "\r\n"
    outfile.write(compiled)
    
with open(root + '/pixel.min.js', 'w') as outfile:
    outfile.write(minify(compiled, mangle=False, mangle_toplevel=False))