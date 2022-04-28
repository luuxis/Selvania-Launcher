<?php
header('Content-Type: application/rss+xml');
require('assets/php/bdd.php');
$bdd = new PDO("mysql:host=$db_ip:$db_port;dbname=$db_name", $db_user, $db_password);
$articles = $bdd->query('SELECT * FROM news ORDER BY id DESC');
?>

<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
    <?php while($a = $articles->fetch()) { ?>
        <item>
            <title><?= $a['title'] ?></title>
            <content><?= $a['content'] ?></content>
            <author><?= $a['author'] ?></author>
            <publish_date><?= $a['publish_date'] ?></publish_date>
        </item>
        <?php } ?>
    </channel>
</rss>