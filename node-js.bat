@echo off
set appdata=%CD%\node-js\cache
set ver=14.17.0
set url=https://nodejs.org/dist/v%ver%/node-v%ver%-win-x64.zip
mkdir %CD%\node-js
title node-js portable version %ver% LTS
PATH=%PATH%;"%CD%\node-js"
if not exist "%CD%\node-js\node.exe" (
    echo installation de node-js portable version %ver% LTS
    mkdir %CD%\cache
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.exe' '%CD%\node-js\7z.exe'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.dll' '%CD%\node-js\7z.dll'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer '%url%' '%CD%\cache\node-js.zip'"
    7z x -o%CD%\cache %CD%\cache\node-js.zip
    move "%CD%\cache\node-v%ver%-win-x64\**\" "%CD%\node-js"
    del %CD%\node-js\7z.exe
    del %CD%\node-js\7z.dll
    del %CD%\cache\node-js.zip
)
cls
cmd
