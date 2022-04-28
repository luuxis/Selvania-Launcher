<?php

include("authorization.php");
include "news.php";
$news = new News();
$json = file_get_contents('php://input');
$data = json_decode($json);
if (isset($data->id) && isset($data->title) && isset($data->content) && isset($data->author)) {
  $resultat = $news->putNews($data->id, $data->title, $data->content, $data->author);
  header('Content-Type: application/json');
  echo json_encode($resultat);
} else {
  echo "POST : You need to provide : id, title, content, author";
}
