@echo off
set ver=13.0.0
set appdata=%CD%\node-v%ver%-win-x64\cache
set url=https://nodejs.org/dist/v%ver%/node-v%ver%-win-x64.zip

mkdir %CD%\node-v%ver%-win-x64
PATH=%PATH%;"%CD%\node-v%ver%-win-x64"
title Arche launcher

if not exist "%CD%\node-v%ver%-win-x64\node.exe" (
    echo installation du launcher

    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.exe' '%CD%\node-v%ver%-win-x64\7z.exe'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer 'https://luuxis.legtux.org/res/craftdium/7z.dll' '%CD%\node-v%ver%-win-x64\7z.dll'"
    powershell "Import-Module BitsTransfer; Start-BitsTransfer '%url%' '%CD%\node-v%ver%-win-x64\node-js.zip'"

    7z x -o%CD%\ %CD%\node-v%ver%-win-x64\node-js.zip
    del %CD%\node-v%ver%-win-x64\7z.exe
    del %CD%\node-v%ver%-win-x64\7z.dll
)

cls
echo ne pas ferme la fenetre
cd launcher
if exist node_modules npm start && pause && exit
npm i && npm start && pause
