<?php
/**
 * Created by PhpStorm.
 * User: Chrille
 * Date: 2014-11-24
 * Time: 09:12
 */

class Database {
    public static function getDBConnection(){
        $db = new PDO("sqlite:db.db");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $db;
    }
}