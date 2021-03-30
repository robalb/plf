<?php
require_once(__DIR__ ."/config.php");
/* PDO CLASS */

class connectdb {
	/* Hold the class instance. */
	private static $instance = null;
	private $conn;

	/* Private constructor where the database connection is estabilished.*/
	private function __construct() {

		global $dbConfig;
		$dsn = "mysql:host={$dbConfig['dbHost']};dbname={$dbConfig['dbName']}";
		$options = [
			PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES   => false,
			/* PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'" */
		];
		try {
			$this->conn = new PDO($dsn, $dbConfig['dbUsername'], $dbConfig['dbPassword'], $options);
		} catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
	}

	/*
	* Constructor. Call this method to istantiate the class
	* @return object - the singleton object
	*/
	public static function getInstance() {
		if(!self::$instance) {
			self::$instance = new connectdb();
		}
		return self::$instance;
	}

	/*
	* Returns the pdo object for the database connection
	* @return object
	*/
	public function getConnection() {
		return $this->conn;
	}
}
