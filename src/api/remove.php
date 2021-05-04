<?php
// Importo l'unica lib richiesta
require_once(__DIR__ ."/../core/classes/lib.php");
$books = new books();

// Controllo mancanza parametri necessari
if(!isset($_POST["id"]) || !filter_var($_POST["id"], FILTER_VALIDATE_INT) ){
    $books->error("params", "Errore interno: impossibile eliminare il libro selezionato. (Campo ID mancante)");
}

// Rimuovo e controllo se e` andato a buon fine
$status = $books->remove($_POST["id"]);
if($status!==false){
    $books->return([]);
}else{
    $books->error("fail", "Errore interno: impossibile eliminare il libro selezionato.");
}
