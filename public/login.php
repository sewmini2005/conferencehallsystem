<?php

header("Content-Type: application/json");

require 'vendor/autoload.php';
include 'db.php';

use Firebase\JWT\JWT;

$secret_key = "my_secret_key";

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;
$password = $data->password;

$sql = "SELECT * FROM users WHERE email='$email'";
$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result) > 0){

    $user = mysqli_fetch_assoc($result);

    if($password == $user['password']){

        $payload = [
            "id" => $user['id'],
            "email" => $user['email'],
            "exp" => time() + 3600
        ];

        $jwt = JWT::encode($payload, $secret_key, 'HS256');

        echo json_encode([
            "status" => 200,
            "message" => "Login successful",
            "token" => $jwt
        ]);

    } else {

        echo json_encode([
            "status" => 401,
            "message" => "Password incorrect"
        ]);
    }

} else {

    echo json_encode([
        "status" => 404,
        "message" => "User not found"
    ]);
}
?>