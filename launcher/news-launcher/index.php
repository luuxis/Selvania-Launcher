<?php
if(file_exists("config.ini")){
    require("assets/php/panel.php");
} else {
    require("assets/php/install.php");
}
?>


