<?php 
$ini = parse_ini_file('../../../config.ini');

$user = $ini['user'];
$password = $ini['password'];

if(isset(getallheaders()["Authorization"])){
    if(getallheaders()["Authorization"] != $user . $password){
        die('{"status":"Unauthorized"}');
    } 
} else {
    die('{"status":"Unauthorized"}');
}