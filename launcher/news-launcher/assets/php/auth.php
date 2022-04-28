<?php

$ini = parse_ini_file('../../config.ini');

$user = $ini['user'];
$password = $ini['password'];

$json = file_get_contents('php://input');
$data = json_decode($json);

if (isset($_POST['user']) && isset($_POST['password'])) {
    if($user==$_POST['user'] && $password==$_POST['password']){
        die('{"status":"success"}');
    } else {
        die('{"status":"error"}');
    }
} else {
    die('{"status":"Not Found","message":"POST : You need to provide : user, password"}');
}

