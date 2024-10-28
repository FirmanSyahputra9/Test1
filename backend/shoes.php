<?php
require_once 'config.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'add') {
        $name = $conn->real_escape_string($_POST['name']);
        $type = $conn->real_escape_string($_POST['type']);
        $category = $conn->real_escape_string($_POST['category']);
        $price = floatval($_POST['price']);
        $stock = intval($_POST['stock']);
        $seller_id = $_SESSION['user_id'];

        // Handle image upload
        $target_dir = "../uploads/";
        $file_extension = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
        $image_name = uniqid() . '.' . $file_extension;
        $target_file = $target_dir . $image_name;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $image_path = 'uploads/' . $image_name;
            
            $sql = "INSERT INTO shoes (name, image_path, type, category, price, stock, seller_id) 
                    VALUES ('$name', '$image_path', '$type', '$category', $price, $stock, $seller_id)";

            if ($conn->query($sql) === TRUE) {
                header('Location: /index.html?added=1');
                exit();
            }
        }

        header('Location: /index.html?error=upload');
        exit();
    }
}

else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? 'list';

    if ($action === 'list') {
        $search = $conn->real_escape_string($_GET['search'] ?? '');
        
        $sql = "SELECT * FROM shoes WHERE name LIKE '%$search%' OR type LIKE '%$search%'";
        $result = $conn->query($sql);
        
        $shoes = [];
        while($row = $result->fetch_assoc()) {
            $shoes[] = $row;
        }
        
        header('Content-Type: application/json');
        echo json_encode($shoes);
        exit();
    }
}
?>