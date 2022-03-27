<?php
function dirToArray($dir) {
   $res = array();
   $cdir = scandir($dir);
   foreach ($cdir as $key => $value){
      if (!in_array($value,array(".",".."))){
         if (is_dir(str_replace("\\", "/", $dir . DIRECTORY_SEPARATOR . $value))) {
            dirToArray(str_replace("\\", "/", $dir . DIRECTORY_SEPARATOR . $value));
         } else {
            $hash = hash_file('sha1', $dir . "/" . $value);
            $size = filesize($dir . "/" . $value);
            $path = str_replace("files/", "", $dir . "/" . $value);
            $url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] . $dir . "/" . $value;
            if (strpos($path, "libraries") !== false) {
               $type = "LIBRARY";
            } else if (strpos($path, "mods") !== false) {
               $type = "MOD";
            } else if (strpos($path, "versions") !== false) {
               if (substr($path, -5) == ".json") {
                  $type = "VERIONSCUSTOM";
               } else if(substr($path, -4) == ".jar"){
                  $type = "VERIONS";
               } else {
                  $type = "FILE";
               }
            } else {
               $type = "FILE";
            }
            echo "{\"path\":\"$path\",\"size\":$size,\"sha1\":\"$hash\",\"url\":\"$url\",\"type\":\"$type\"},";
         }
      }
   }
}

header("Content-Type: application/json; charset=UTF-8");
echo "[", dirToArray("files"), "\"\"]";
?>
