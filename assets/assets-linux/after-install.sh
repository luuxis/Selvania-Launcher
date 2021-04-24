#!/bin/bash

# Link to the binary
ln -sf /opt/starter/Starter /usr/local/bin/starter

# Launcher icon
desktop-file-install /opt/starter/starter.desktop
