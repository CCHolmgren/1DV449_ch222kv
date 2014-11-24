<?php

// get the specific message
require_once "Database.php";
function getMessages() {
    $db = null;

    try {
        $db = Database::getDBConnection();
    } catch (PDOException $e) {
        echo "Error in connecting to the database: " . $e->getMessage();

        return null;
    }

    $result = null;
    try {
        $sth = $db->prepare("SELECT * FROM messages;");
        $sth->execute();
        $result = [];
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo("Error creating query: " . $e->getMessage());

        return $result;
    }

    return $result;
}