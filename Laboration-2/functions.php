<?php
require_once("get.php");
require_once("post.php");
require_once("sec.php");
sec_session_start();

/*
* It's here all the ajax calls goes
*/
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["function"]) && $_POST["function"] == "add") {
        $name = $_POST["name"];
        $message = $_POST["message"];
        if(addToDB($message, $name)){
            echo "Successfully added the message.";
        }
        else {
            header("HTTP/1.1 400 Bad Request");
        }
        //header("Location: test/debug.php");
    }
    else {
        echo "The function requested does not support that request method.";
    }
} else {
    if (isset($_GET['function'])) {

        if ($_GET['function'] == 'logout') {
            logout();
        } /*elseif($_GET['function'] == 'add') {
	    $name = $_GET["name"];
		$message = $_GET["message"];
		addToDB($message, $name);
		header("Location: test/debug.php");
    }*/
        elseif ($_GET['function'] == 'getMessages') {
            //header('Content-type: application/json');
            echo(json_encode(getMessages()));
        }
    }
}