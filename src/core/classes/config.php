<?php
$is_debug = true; // Debug mode for switching the DB

$dbConfig = array(
    "dbHost"=> getenv("MARIADB_HOST"),
    "dbName"=> getenv("MARIADB_DATABASE"),
    "dbUsername"=> getenv("MARIADB_USER"),
    "dbPassword"=> getenv("MARIADB_PASSWORD")
);

?>
