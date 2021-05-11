<?php
require_once 'core/classes/BundlesManager.php';
require_once 'core/classes/lib.php';

$bundlesManager = new BundlesManager();

//dati ottenuti dalla libreria di tom
$books = new books();
$tableData = $books->list();

$jsGlobalVariables = [
  /* 'PHP_CSRF' => CSRFmanager::getToken(), */
  'PHP_GLOBALS' => [ 
    'table' => $tableData
  ]
];
$bundlesManager->injectJavascriptVariables($jsGlobalVariables);
?>
<!DOCTYPE html>
<!--[if IE 6]>
<html id="ie6" lang="it">
<![endif]-->
<!--[if IE 7]>
<html id="ie7" lang="it">
<![endif]-->
<!--[if IE 8]>
<html id="ie8" lang="it">
<![endif]-->
<!--[if !(IE 6) & !(IE 7) & !(IE 8)]><!-->
<html lang="it">
<!--<![endif]-->
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name='robots' content='noindex,nofollow' />
    <meta name="language" content="it">
    <title>premiata libreria della nonna</title>
    <meta name="description" content="Premiata libreria della nonna - menu di selezione" />

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="keywords" content="pln - menu" />
    <link rel="stylesheet" type="text/css" href="css/common.css">
    <link rel="stylesheet" type="text/css" href="css/catalogo.css">
    <link rel="stylesheet" type="text/css" href="static-bundles/tabulator/dist/css/tabulator_semantic-ui.min.css">

    <script type="text/javascript" src="static-bundles/tabulator/dist/js/tabulator_core.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/responsive_layout.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/resize_table.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/resize_columns.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/page.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/sort.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/filter.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/edit.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/validate.min.js"></script>
    <script type="text/javascript" src="static-bundles/tabulator/dist/js/modules/select_row.min.js"></script>
        <?php $bundlesManager->headOutput();?>
  </head>
  <body>
    <header>
      <div class="nav-container">
        <div>
          <h1>aggiorna catalogo</h1>
          <h2><a href="index.php">menu principale</a></h2>
        </div>
        <hr/>
      </div>
    </header>
    <main>
<form method="POST" action="api/add.php" id="addform">
<input type="text" name="id" hidden="true" id="id"/>
<input type="text" required name="titolo" id="titolo" placeholder="titolo"/>
<input type="text" required name="autore" id="autore" placeholder="autore"/>
<input type="text" required name="casa_ed" id="casa_ed" placeholder="casa editrice"/>
<input type="text" required name="argomento" id="argomento" placeholder="argomento"/>
<input placeholder="note opzionali" id="note" name="note">
<button type="submit" id="send">aggiungi</button>
</form>

<div id="selectmenu" class="selectedmenu hidden">
<h3>righe selezionate: <span id="countview">0</span> </h3>
<button id="delete">elimina righe</button>
</div>
      <div id="table">caricamento...</div>
      <p>Cliccare sul campo ID di un libo per selezionarlo</p>
      <p>Cliccare su un qualsiasi altro campo per modificarlo. Premere Invio per salvare le modifiche</p>
    </main>


    <script type="text/javascript" src="js/common.js?1"></script>
    <script type="text/javascript" src="js/catalogo.js?1"></script>
        <?php $bundlesManager->bodyOutput();?>
  </body>
</html>

