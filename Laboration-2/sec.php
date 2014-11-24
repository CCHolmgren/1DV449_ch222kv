<?php

require_once "Database.php";
/**
 * Just som simple scripts for session handling
 */
function sec_session_start() {
    $session_name = 'sec_session_id'; // Set a custom session name
    $secure = false; // Set to true if using https.
    ini_set('session.use_only_cookies', 1); // Forces sessions to only use cookies.
    $cookieParams = session_get_cookie_params(); // Gets current cookies params.
    $httponly = true; // This stops javascript being able to access the session id.
    session_set_cookie_params(0, $cookieParams["path"], $cookieParams["domain"], $secure, $httponly);
    session_name($session_name); // Sets the session name to the one set above.
    session_start(); // Start the php session
    session_regenerate_id(true); // regenerated the session, delete the old one.
}

function checkUser() {
    if (!session_id()) {
        sec_session_start();
    }

    if (!isset($_SESSION["user"])) {
        header('HTTP/1.1 401 Unauthorized');
        die();
    }

    $user = getUser($_SESSION["user"]);
    $un = $user[0]["password"];

    if (!isset($_SESSION['loggedin'])) {
        header('HTTP/1.1 401 Unauthorized');
        die();
    }

    return true;
}

function isUser($username, $password) {
    $db = null;

    try {
        $db = Database::getDBConnection();
    } catch (PDOException $e) {
        die("Del -> " . $e->getMessage());
    }

    $result = null;
    try {
        $stm = $db->prepare("SELECT password FROM users WHERE username = ?;");
        $stm->execute(array($username));

        $result = $stm->fetch(PDO::FETCH_ASSOC);

        $stm = $db->prepare("SELECT id FROM users WHERE username = ?;");

        if (password_verify($password, $result["password"])) {
            $stm->execute(array($username));
            $result = $stm->fetch(PDO::FETCH_ASSOC);

            if (!$result) {
                echo "Could not find the user";

                return false;
            }
        } else {
            saveUser($username, $password);

            echo "Saved a new user,";

            return true;
        }

    } catch (PDOException $e) {
        echo("Error creating query: " . $e->getMessage());

        return false;
    }

    return true;
}
function saveUser($username, $password){
    $db = null;

    try {
        $db = Database::getDBConnection();
    } catch (PDOException $e) {
        die("Del -> " . $e->getMessage());
    }

    $result = null;
    try {
        $stm = $db->prepare("INSERT INTO users (username, password) VALUES(?,?);");
        $stm->execute(array($username, password_hash($password, PASSWORD_DEFAULT)));
    } catch (PDOException $e) {
        echo("Error creating query: " . $e->getMessage());

        return false;
    }

    return true;
}
function getUser($username) {
    $db = null;

    try {
        $db = Database::getDBConnection();
    } catch (PDOException $e) {
        die("Del -> " . $e->getMessage());
    }

    $result = null;
    try {
        $stm = $db->prepare("SELECT * FROM users WHERE username = ?;");
        $stm->execute(array($username));
        $result = $stm->fetchAll();
    } catch (PDOException $e) {
        echo("Error creating query: " . $e->getMessage());

        return false;
    }

    return $result;
}

function logout() {

    if (!session_id()) {
        sec_session_start();
    }
    session_end();
    header('Location: index.php');
}

function session_end() {
    session_unset();
    session_destroy();
}
