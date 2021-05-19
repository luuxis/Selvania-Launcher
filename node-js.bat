@echo off
set ver=14.17.0
set appdata=%CD%\node-v%ver%-win-x64\cache
set url=https://nodejs.org/dist/v%ver%/node-v%ver%-win-x64.zip

mkdir %CD%\node-v%ver%-win-x64
PATH=%PATH%;"%CD%\node-v%ver%-win-x64"
title node-js portable version %ver% LTS

if not exist "%CD%\node-v%ver%-win-x64\node.exe" (
    echo installation de node-js portable version %ver% LTS
    mkdir %CD%\cache

    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.exe' '%CD%\node-v%ver%-win-x64\7z.exe'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.dll' '%CD%\node-v%ver%-win-x64\7z.dll'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer '%url%' '%CD%\cache\node-js.zip'"

    7z x -o%CD%\ %CD%\cache\node-js.zip
    del %CD%\node-v%ver%-win-x64\7z.exe
    del %CD%\node-v%ver%-win-x64\7z.dll
    rmdir "%CD%\cache" /S /Q
)

cls
cmd
