@echo off
set ver=14.16.1 LTS
title node-js portable version %ver%
mkdir %CD%\node-js
PATH=%PATH%;"%CD%\node-js"
if not exist "%CD%\node-js\node.exe" (
    echo installation de node-js portable version %ver%
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.exe' '%CD%\node-js\7z.exe'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.dll' '%CD%\node-js\7z.dll'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/dev/node-js.7z' '%CD%\node-js\node-js.7z'"
    7z x -o%CD%\node-js %CD%\node-js\node-js.7z
    del %CD%\node-js\7z.exe
    del %CD%\node-js\7z.dll
    del %CD%\node-js\node-js.7z
)
cls
cmd
