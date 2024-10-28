<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'login') {
        $username = $conn->real_escape_string($_POST['username']);
        $password = $_POST['password'];

        $sql = "SELECT id, username, password FROM users WHERE username = '$username'";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                header('Location: /index.html');
                exit();
            }
        }

        header('Location: /login.html?error=invalid');
        exit();
    }

    else if ($action === 'register') {
        $username = $conn->real_escape_string($_POST['username']);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $email = $conn->real_escape_string($_POST['email']);
        $full_name = $conn->real_escape_string($_POST['full_name']);

        $sql = "INSERT INTO users (username, password, email, full_name) 
                VALUES ('$username', '$password', '$email', '$full_name')";

        if ($conn->query($sql) === TRUE) {
            header('Location: /login.html?registered=1');
            exit();
        } else {
            header('Location: /register.html?error=exists');
            exit();
        }
    }

    else if ($action === 'logout') {
        session_destroy();
        header('Location: /login.html');
        exit();
    }
}
?>