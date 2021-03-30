<?php
// Importo l'unica lib richiesta
require_once("lib.php");
$books = new books();

// Ottengo la lista e la restituisco
$list = $books->list();
if($list!==false){
    $books->return(["lista"=>$list]);
}else{
    $books->error("fail", "Errore interno: impossibile ottenere la lista dei libri.");
}