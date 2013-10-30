<?php
/* http://stackoverflow.com/questions/2047264/use-of-pdo-in-classes */

// db
DbConf::write('db.host', 'localhost');
DbConf::write('db.name', 'moodzeek');
DbConf::write('db.char', 'utf8');
DbConf::write('db.user', 'root');
DbConf::write('db.pswd', '');

class DbConf
{
	static $confArray;

	public static function read($name){
		return self::$confArray[$name];
	}
	public static function write($name, $value){
		self::$confArray[$name] = $value;
	}
}

class Connect
{
	public $pdo; // handle of the db connexion
	private static $instance;

	private function __construct(){
		// building data source name from config
		$dsn = 	'mysql:host='   . DbConf::read('db.host').
					 ';dbname=' . DbConf::read('db.name').
					 ';charset='. DbConf::read('db.char');
		try{		
			$this->pdo = new PDO( $dsn, DbConf::read('db.user'), DbConf::read('db.pswd') );
			$this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
		}catch( PDOException $e ){
			echo DEBUG ? 'PB with DB connection :'.$e->getMessage() : 'DB Exception';
		}
	}

	public static function getInstance(){
		if (!isset(self::$instance)){
			$object = __CLASS__;
			self::$instance = new $object;
		}
		return self::$instance;
	}

}
