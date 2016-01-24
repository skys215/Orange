<?php
    $host = 'localhost';
    $username ='root';
    $password = '';
    $database = 'nonefree';

    $_mysqli=mysqli_connect( $host, $username, $password );
    $_mysqli->query('SET NAMES UTF8');
    $_mysqli->query( 'use '.$database );
