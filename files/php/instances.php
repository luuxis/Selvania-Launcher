<?php
$instance['zoneatlas'] = array_merge($instance['zoneatlas'], array(
    "loadder" => array(
        "minecraft_version" => "1.12.2",
        "loadder_type" => "forge",
        "loadder_version" => "latest"
    ),
    "verify" => true,
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
        'optionsof.txt',
        'mods'
    ),
    "whitelist" => array(),
    "whitelistActive" => false,
    "status" => array(
        "nameServer" => "Hypixel",
        "ip" => "91.197.5.218",
        "port" => 27792
    )
));
?>
