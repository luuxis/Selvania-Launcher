<?php
if(file_exists("../../config.ini")){
    die('{
        "status": "error",
        "message": "panel already setup"
    }');
}

if(isset($_POST['adress']) && $_POST['adress']!=""){
    $adress = $_POST['adress'];
}

if(isset($_POST['port']) && $_POST['port']!=""){
    $port = $_POST['port'];
}

if(isset($_POST['name']) && $_POST['name']!=""){
    $name = $_POST['name'];
}

if(isset($_POST['user'] ) && $_POST['user']!=""){
    $user = $_POST['user'];
}

if(isset($_POST['password']) && $_POST['password']!=""){
    $password = $_POST['password'];
}

if(isset($_POST['user_name']) && $_POST['user_name']!=""){
    $user_name = $_POST['user_name'];
}

if(isset($_POST['user_password']) && $_POST['user_password']!=""){
    $user_password = $_POST['user_password'];
}

if ($_POST['type'] == "check_db") {
    try {
        $bdd = new PDO("mysql:host=$adress:$port;dbname=$name", $user, $password);
        die('{"status": "success"}');
      }
      catch(PDOException $ex){
          die($ex->getMessage());
      }
} else if($_POST['type'] == "valide_db") {
    try {
        $bdd = new PDO("mysql:host=$adress:$port;dbname=$name", $user, $password);
        $file = fopen("../../config.ini","w");

        fwrite($file, "[database]\n");
        fwrite($file, "db_ip       = " . $adress . "\n");
        fwrite($file, "db_port     = " . $port . "\n");
        fwrite($file, "db_name     = " . $name . "\n");
        fwrite($file, "db_user     = " . $user . "\n");
        fwrite($file, "db_password = " . $password . "\n\n");

        fwrite($file, "[user]\n");
        fwrite($file, "user        = " . $user_name . "\n");
        fwrite($file, "password    = " . $user_password . "\n");
        fclose($file);

        $bdd->query("CREATE TABLE IF NOT EXISTS `news` (
            id INT(7) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            content TEXT NOT NULL,
            author VARCHAR(30) NOT NULL,
            publish_date DATETIME NOT NULL DEFAULT '00-00-0000'
        )");
        die('{"status": "success"}');
    }
    catch(PDOException $ex){
        die('{
            "status": "error",
            "message": "'.$ex->getMessage().'"
        }');
    }
}
