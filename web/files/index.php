<?php
function dirToArray($dir) {

   $res = array();

   $cdir = scandir($dir);
   foreach ($cdir as $key => $value)
   {
      if (!in_array($value,array(".","..")))
      {
         if (is_dir($dir . DIRECTORY_SEPARATOR . $value))
         {
            dirToArray($dir . DIRECTORY_SEPARATOR . $value);
         }
         else
         {
            echo $dir . "/" . $value . "<br>";
         }
      }
   }
}

dirToArray("files");
?>