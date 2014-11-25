<?php

/**
 * Called from AJAX to add stuff to DB
 */
require_once "Database.php";

function addToDB($message, $user) {
    $db = null;
    $result = null;

    try {
        $db = Database::getDBConnection();
    } catch (PDOException $e) {
        die("Something went wrong -> " . $e->getMessage());
    }

    try {
        $sth = $db->prepare("SELECT * FROM users WHERE username = ?;");

        $sth->execute(array($user));

        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        if (!$result) {
            echo "Could not find the user";

            return false;
        }
    } catch (PDOException $e) {
        echo("Error creating query: " . $e->getMessage());

        return false;
    }

    $db = Database::getDBConnection();
    try {
        $sth = $db->prepare("INSERT INTO messages (message, name) VALUES(?, ?);");

        if (!$sth->execute(array(htmlspecialchars($message), htmlspecialchars($user)))) {
        }
    } catch (PDOException $e) {
        echo "Error adding the message: " . $e->getMessage();

        return false;
    }


    // Send the message back to the client
    // echo json_encode("Message saved by user: " . $result["username"]);

    return true;
}

