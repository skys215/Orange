<?php

	function searchClass( $keyword ){
		global $_mysqli;

		$sql = 'SELECT cid, classname, classroom, classteacher, mainclass, bz, college FROM courseinfo3 WHERE term='.TERM.' AND (cid LIKE \''.$keyword.'%\' OR classname LIKE \'%'.$keyword.'%\' OR classroom LIKE \'%'.$keyword.'%\' OR classteacher LIKE \'%'.$keyword.'%\' OR mainclass LIKE \'%'.$keyword.'%\' OR bz LIKE \'%'.$keyword.'%\') LIMIT 10';

		$query = $_mysqli->query( $sql );

		$courses = [];
		if( !$query ){
			return $courses;
		}

		while( $course = $query->fetch_assoc() ){
			$courses[] = $course;
		}

		return $courses;
	}
