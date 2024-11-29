<?php
$instance['test01'] = array_merge($instance['test01'], array(
    "loadder" => array(
        "minecraft_version" => "1.18.2",
        "loadder_type" => "forge",
        "loadder_version" => "latest"
    ),
    "verify" => true,
    "ignored" => array(
        'config',
        'options.txt'
    ),
    "whitelist" => array(),
    "whitelistActive" => false,
    "status" => array(
        "nameServer" => "NightCraft",
        "ip" => "nightcraft.fr",
        "port" => 25565
    )
));