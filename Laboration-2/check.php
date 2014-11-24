<?php
require_once("sec.php");

// check tha POST parameters
if (isset($_POST['username'])) {
    $username = $_POST['username'];
} else {
    $username = "";
}
if (isset($_POST['password'])) {
    $password = $_POST['password'];
} else {
    $password = "";
}
//$username = $_POST['username'];
//$password = $_POST['password'];

// Check if user is OK
if ($username && $password && isUser($username, $password)) {
    // Set the session
    sec_session_start();
    $_SESSION['username'] = $username;
    $_SESSION['loggedin'] = true;//hash('sha512', "123456" . $u);

    header("Location: mess.php");
} else {
    // Too bad
    header('HTTP/1.1 401 Unauthorized');
    die("could not call");
}