@echo off
set ver=16.13.1
set arch=64
set appdata=%CD%\AppData

if not exist "%CD%\node-v%ver%-win-x%arch%" mkdir "%CD%\node-v%ver%-win-x%arch%"
PATH=%PATH%;"%CD%\node-v%ver%-win-x%arch%"
title node-js portable version %ver% LTS

if not exist "%CD%\node-v%ver%-win-x%arch%\node.exe" (
    echo installation de node-js portable version %ver% LTS
    if not exist "%CD%\cache" mkdir "%CD%\cache"

    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.exe' '%CD%\node-v%ver%-win-x%arch%\7z.exe'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.dll' '%CD%\node-v%ver%-win-x%arch%\7z.dll'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://nodejs.org/dist/v%ver%/node-v%ver%-win-x%arch%.zip' '%CD%\cache\node-js.zip'"

    7z x -o"%CD%\" "%CD%\cache\node-js.zip"
    del "%CD%\node-v%ver%-win-x%arch%\7z.exe"
    del "%CD%\node-v%ver%-win-x%arch%\7z.dll"
    rmdir "%CD%\cache" /S /Q
)
:launch
cls
echo "node":   start nodejs
echo "start":  start launcher
echo "win":    build launcher windows
echo "mac":    build launcher MACos
echo "linux":  build launcher linux
echo "all":    build launcher all platform
set /P c=enter your choice: 
if /I "%c%" EQU "node" cls && cmd
if /I "%c%" EQU "start" cls && npm install && npm start
if /I "%c%" EQU "win" cls && npm run build:win
if /I "%c%" EQU "mac" cls && npm run build:mac
if /I "%c%" EQU "linux" cls && npm run build:linux
if /I "%c%" EQU "all" cls && npm run build:all
goto :launch

