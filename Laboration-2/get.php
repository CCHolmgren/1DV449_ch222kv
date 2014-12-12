<?php

// get the specific message
require_once "Database.php";
function getMessages($lastSeen = 0) {
    $db = null;

    try {
        $db = Database::getDBConnection();
    } catch (PDOException $e) {
        echo "Error in connecting to the database: " . $e->getMessage();

        return null;
    }

    $result = null;
    while(true){
        try {
            $sth = $db->prepare("SELECT * FROM messages WHERE serial > ?;");
            $sth->execute(array($lastSeen));
            $result = [];
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);
            if($result){
                return $result;
            }
            usleep(100000);
            continue;
        } catch (PDOException $e) {
            echo("Error creating query: " . $e->getMessage());

            return $result;
        }
    }
}