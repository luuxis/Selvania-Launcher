<?php
include "news.php";
$news = new News();
$resultat  = $news->getAllNews();
//print_r ($resultat);
header('Content-Type: application/json');
echo json_encode($resultat);
