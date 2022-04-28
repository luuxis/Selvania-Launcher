<?php

class News {
    private $connexion;
    
    function __construct() {
        $ini = parse_ini_file('../../../config.ini');
        $db_ip = $ini['db_ip'];
        $db_port = $ini['db_port'];
        $db_user = $ini['db_user'];
        $db_password = $ini['db_password'];
        $db_name = $ini['db_name'];
        $this->connexion = new PDO("mysql:host=$db_ip:$db_port;dbname=$db_name",$db_user,$db_password);
  }

  public function getAllNews() {
      $requete = 'SELECT * FROM news ORDER BY id DESC';
      $dataResultat = $this->connexion->query($requete);

    $tableauResultat = $dataResultat->fetchall(PDO::FETCH_ASSOC);

    return $tableauResultat;
  }

  public function postNews($title, $content, $author)
  {
 
    $requete = "INSERT INTO `news`(`title`, `content`,`author`,`publish_date`) VALUES ('$title','$content','$author',NOW())";
    $dataResultat = $this->connexion->exec($requete);

    return $dataResultat;
  }

  public function putNews($id, $title, $content)
  {
 
    $requete = "UPDATE `news` set title = '$title', content = '$content' WHERE id =  '$id'";
    $dataResultat = $this->connexion->exec($requete);

    return $dataResultat;
  }

  public function removeNews($id)
  {
 
    $requete = "DELETE FROM `news` WHERE id =  '$id'";
    $dataResultat = $this->connexion->exec($requete);

    return $dataResultat;
  }
}
