<?php
$instance['Badlands_V2'] = array_merge($instance['Badlands_V2'], array(
    "loadder" => array(
        "minecraft_version" => "1.19.3",
        "loadder_type" => "fabric",
        "loadder_version" => "latest"
    ),
    "verify" => false,
    "ignored" => array(
        'config',
        'essential',
        'logs',
        'resourcepacks',
        'saves',
        'screenshots',
        'shaderpacks',
        'W-OVERFLOW',
        'options.txt',
        'optionsof.txt'
    ),
    "whitelist" => array(),
    "whitelistActive" => false,
    "status" => array(
        "nameServer" => "Badlands_V2",
        "ip" => "mc.Badlands.fr",
        "port" => 25565
    )
));

$instance['PokeMoonX'] = array_merge($instance['PokeMoonX'], array(
    "loadder" => array(
        "minecraft_version" => "1.16.5",
        "loadder_type" => "forge",
        "loadder_version" => "1.16.5-36.2.35"
    ),
    "verify" => false,
    "ignored" => array(),
    "whitelist" => array(),
    "whitelistActive" => false,
    "status" => array(
        "nameServer" => "PokeMoonX",
        "ip" => "178.32.106.234",
        "port" => 25599
    )
));
?>
