<?php

class BundlesManager{
  //the filename of the bundles that will be injected as external script tags
  private $bundles;
  //an array containing the content of inline <script> tags that wil be injected
  private $scripts;
  //the path to the folder containing all the bundles, relative to $path
  private $folderName;
  //the path to the script serving the bundles, relative to $path
  private $scriptName;
  //the base path for $folderName and $scriptName
  private $path;
  //the nonce to be optionally used in inline script tags
  private $nonce;
  //specify if the bundles will be sourced directly from the folder where they are located, or through the bundles.php endpoint
  private $servingFromScript;

  /*
   * @param string $entryName -the name of a valid entrypoint as configured in webpack
   * @param string $path -the path (relative to the invoking file) where this class should find the bundles folder and the script serving the bundles
   * @param string $position - either the string 'BODY' or 'HEAD' : specify where the bundles should be injected in the HTML response body
   * @param string $nonce -an optional secret string that will be added to the nonce attribute in all injected script tags. NOTE: this class does not handles anything related to CSP headers
   * @param boolean $servingFromScript -specify if the bundles will be sourced directly from the folder where they are located, or through the bundles.php endpoint
   */
  function __construct(string $entryName = null, string $path = './', string $position = 'BODY', string $nonce = '', bool $servingFromScript = false){
    //init class attributes
    $this->bundles = [
      'HEAD' => [],
      'BODY' => []
    ];
    $this->scripts = [
      'HEAD' => [],
      'BODY' => []
    ];
    $this->folderName = 'bundles/';
    $this->scriptName = 'bundles.php?r=';
    $this->path = $path;
    $this->nonce = $nonce;
    $this->servingFromScript = $servingFromScript;

    /*
    //validate parameters
    if(!$entryName){
      throw new \Exception('Invalid bundle entryName');
    }
    if($position !== 'BODY' && $position !== 'HEAD'){
      throw new \Exception('Invalid position parameter');
    }

    //try to import and decode the json file containing the bundle stats
    $jsonStats = file_get_contents( $path . $this->folderName . 'stats.json');
    if($jsonStats == null){
      throw new \Exception("couldn't read stats file at the given path");
    }
    $decodedStats = json_decode($jsonStats, true);
    if($decodedStats == null){
      throw new \Exception("couldn't decode stats file at the given path");
    }

    //read the stats json and get all the bundles associated to the given entrypoint name
    $parseError = 0;
    if(!array_key_exists('entrypoints', $decodedStats))
      $parseError = 1;
    else if(!array_key_exists($entryName, $decodedStats['entrypoints']))
      $parseError = 2;
    else if(!array_key_exists('assets', $decodedStats['entrypoints'][$entryName]))
      $parseError = 3;
    else if(count($decodedStats['entrypoints'][$entryName]['assets']) == 0)
      $parseError = 4;
    if($parseError){
      throw new \Exception("couldn't parse the stats file. Error: $parseError");
      return false;
    }
    $this->bundles[$position] = $decodedStats['entrypoints'][$entryName]['assets'];

    //if the bundles will be served from the bundles.php endopint, add the allowed bundle names to a whitelist
    //(this will only work if session variables are enabled)
    if($this->servingFromScript){
      if(session_status() == PHP_SESSION_NONE){
        throw new \Exception("servingFromScript options is set to true, but a session hasn't been initiated. (A session is required because this parameter makes use of \$_SESSION)");
      }
      if(!isset($_SESSION['allowed_resources'])) $_SESSION['allowed_resources'] = [];
      $_SESSION['allowed_resources'] = array_merge(
        $_SESSION['allowed_resources'],
        $this->bundles[$position]
      );
    }
     */
  }

  /*
   * inject an inline script in the specified position of the HTML document
   * @warning do not pass untrusted or user generated content here. if you need to pass variables to js, use @method $injectJavascriptVariables
   * @param string $code -the code that will be injected in the document
   * @param string $position - either the string 'BODY' or 'HEAD' : specify where the script should be injected in the HTML response body
   * @example passing the string 'alert(1)' as param will result in the following injection: <script>alert(1)</script>
   */
  public function unsafeAddScript(string $code, string $position = 'HEAD'){
    if($position !== 'BODY' && $position !== 'HEAD'){
      throw new \Exception('Invalid position parameter');
    }
    $this->scripts[$position][] = $code;
  }

  /*
   * pass data to js as global variables, safely
   * @param array $variables -an associative array, where the key will be the name of the js global variable injected in the document, and the value  will be json encoded safely
   * @param string $position - either the string 'BODY' or 'HEAD' : specify where the variables should be injected in the HTML response body
   * @example passing the array ['CSRF' => 42069, 'FOO_BAR' => ['hello', [1,2,3], '</script>']
   *          will result in the following injection: <script>var CSRF = 42069; var FOO_BAR = ['hello', [1,2,3], '\u003C\/script\u003E'];</script>
   */
  public function injectJavascriptVariables(array $variables, string $position = 'HEAD'){
    if($position !== 'BODY' && $position !== 'HEAD'){
      throw new \Exception('Invalid position parameter');
    }
    $code = "";
    foreach($variables as $key => $value){
      //check if the current key can be used as a JS variable name (note: not all possible js variable names are allowed, only those matching [a-zA-Z0-9_\$])
      if(!preg_match("/^[a-zA-Z_\$]+[0-9a-zA-Z_]*$/", $key)){
        throw new \Exception("invalid js global variable name being declared");
        return 0;
      }
      //sanitize the content and add the current variable to the code
      $JSencodedData = json_encode($value, JSON_INVALID_UTF8_SUBSTITUTE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
      $code .= "var $key = $JSencodedData;";
    }
    if(strlen($code) > 0) $this->unsafeAddScript($code, $position);
  }

  /*
   * inject all the script elements related to the specified location
   * @param string $location -either 'HEAD' or 'BODY'
   */
  private function printScripts($location){
    //prepare nonce string
    $nonceAttribute = "";
    if(strlen($this->nonce) > 1){
      $nonceAttribute = 'nonce="'. $this->nonce .'"';
    }
    //inject the external script tags
    $locationSpecificBundles = $this->bundles[$location];
    foreach($locationSpecificBundles as $bundleName){
      if($this->servingFromScript){
        $bundlePath = $this->path . $this->scriptName . $bundleName;
      }else{
        $bundlePath = $this->path . $this->folderName . $bundleName;
      }
      echo "<script $nonceAttribute src=\"$bundlePath\"></script>";
    }
    //inject the inline scripts
    $locationSpecificScripts = $this->scripts[$location];
    foreach($locationSpecificScripts as $script){
      //ignore empty scripts
      if ( strlen($script) < 2 ) continue;
      echo "<script $nonceAttribute > $script </script>";
    }
  }

  /*
   * this function MUST be invoked at the end of the HTML head in order to make this class work.
   * It will inject all the bundles or scripts that have been configured as HEAD scripts
   */
  public function headOutput(){
    $this->printScripts('HEAD');
  }

  /*
   * this function MUST be invoked at the end of the HTML body in order to make this class work.
   * It will inject all the bundles or scripts that have been configured as BODY scripts
   */
  public function bodyOutput(){
    $this->printScripts('BODY');
  }
}
