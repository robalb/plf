<?php
require_once(__DIR__ ."/pdo.php");
$instance = connectdb::getInstance();
$pdo = $instance->getConnection();

class books{
    // Aggiunge un libro alla lista
    public function add($titolo, $autore, $casa_ed, $argomento, $note){
        global $pdo;
        $query = $pdo->prepare("INSERT INTO `list` (`titolo`,`autore`,`casa_ed`,`argomento`,`note`,`data_aggiunta`,`data_modifica`) VALUES(?, ?, ?, ?, ?, ?, ?)");
        $status = $query->execute([
            $titolo, $autore, $casa_ed, $argomento, $note, time(), time()
        ]);
        // Return ID or false if failed
        if($status){
            return $pdo->lastInsertId();
        }else{
            return false;
        }
    }

    // Aggiorna un libro dato l'id e l'array di update
    public function update($id, $update=[]){
        global $pdo;
        $query = $pdo->prepare("UPDATE `list` SET `data_modifica`=?, `titolo`=?, `autore`=?, `casa_ed`=?, `argomento`=?, `note`=? WHERE `id`=?");
        return $query->execute([
            time(),
            $update["titolo"],
            $update["autore"],
            $update["casa_ed"],
            $update["argomento"],
            $update["note"],
            $id
        ]);
    }

    // Elimina un libro dato l'id
    public function remove($id){
        global $pdo;
        $query = $pdo->prepare("DELETE FROM `list` WHERE `id`=?");
        return $query->execute([$id]);
    }

    // Ottiene la lista di tutti i libri
    public function list(){
        global $pdo;
        $query = $pdo->prepare("SELECT `id`, `titolo`, `autore`, `casa_ed`, `argomento`, `note` FROM `list`");
        if($query->execute([])===false) return false;
        if ($query->rowCount() > 0) {
            return $query->fetchAll();
        }else{
            return [];
        }
    }

    // Risponde alle API con un errore
    public function error($code, $message){
        echo json_encode(["ok"=>false, "error"=>$code, "msg"=>$message]);
        exit;
    }

    // Risponde alle API con un qualsiasi contenuto
    public function return($array){
        $array["ok"] = true;
        echo json_encode($array);
        exit;
    }
}
