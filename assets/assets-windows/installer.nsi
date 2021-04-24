!include "MUI2.nsh"

Name "Starter"
BrandingText "aluxian.com"

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "..\dist\StarterSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\Starter\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start Starter"
!define MUI_FINISHPAGE_RUN "$INSTDIR\Starter.exe"

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

# default section start
Section

  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r ..\build\Starter\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall Starter.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\Starter.lnk" "$INSTDIR\Starter.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall Starter.lnk" "$INSTDIR\Uninstall Starter.exe"
  CreateShortCut "$DESKTOP\Starter.lnk" "$INSTDIR\Starter.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\Starter.lnk"
  Delete "$SMPROGRAMS\Uninstall Starter.lnk"
  Delete "$DESKTOP\Starter.lnk"

SectionEnd
