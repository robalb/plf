<?php
// Importo l'unica lib richiesta
require_once(__DIR__ ."/../core/classes/lib.php");
$books = new books();

// Controllo mancanza parametri necessari
$params = ["titolo", "autore", "casa_ed", "argomento", "note", "posizione"];
foreach($params as $param){
    if(isset($_POST[$param])==false){
        $books->error("params", "Errore interno: mancano uno o piu` campi");
    }else{
        $_POST[$param] = trim($_POST[$param]);
    }
}

// Aggiungo e controllo se e` andato a buon fine
$id = $books->add($_POST["titolo"], $_POST["autore"], $_POST["casa_ed"], $_POST["argomento"], $_POST["posizione"], $_POST["note"]);
if($id!==false){
    $books->return(["id"=>$id]);
}else{
    $books->error("fail", "Errore interno: impossibile aggiungere il libro richiesto. Riprova");
}
