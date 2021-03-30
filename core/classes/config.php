<?php
$is_debug = true; // Debug mode for switching the DB

$dbConfig = array(
    "dbHost"=>"localhost",
    "dbName"=>"books",
    "dbUsername"=>($is_debug)?"root":"stagingUser",
    "dbPassword"=>($is_debug)?"":"stagingPassw0rd!1",
);

?>
