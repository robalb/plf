<?php
// Importo l'unica lib richiesta
require_once(__DIR__ ."/../core/classes/lib.php");
$books = new books();

// Controllo mancanza parametri necessari
$params = ["id", "titolo", "autore", "casa_ed", "argomento", "posizione", "note"];
foreach($params as $param){
    if(isset($_POST[$param])==false){
        $books->error("params", "Errore interno: mancano uno o piu` campi");
    }else{
        $_POST[$param] = trim($_POST[$param]);
    }
}

// Edito
$status = $books->update($_POST["id"], [
    "titolo"    =>$_POST["titolo"],
    "autore"    =>$_POST["autore"], 
    "casa_ed"   =>$_POST["casa_ed"], 
    "argomento" =>$_POST["argomento"],
    "posizione" =>$_POST["posizione"],
    "note"      =>$_POST["note"]
]);
if($status!==false){
    $books->return([]);
}else{
    $books->error("fail", "Errore interno: impossibile modificare il libro richiesto.");
}
