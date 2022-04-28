<?php

include("authorization.php");
include "news.php";
$news = new News();
$json = file_get_contents('php://input');
$data = json_decode($json);
if (isset($data->id)) {
  $resultat = $news->removeNews($data->id);
  header('Content-Type: application/json');
  echo json_encode($resultat);
} else {
  echo "POST : You need to provide : id";
}