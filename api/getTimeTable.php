<?php

	function getTimeTable( $courses ){
		global $_mysqli;

		$tables = [];
		$courses = [];
		//优化:先筛选上课时间重复的
		//从用户选择的课程中，获取上课时间不同的课程
		// foreach( $courses as $classname => $courseIds ){
		// 	$sql = 'SELECT cid FROM courseinfo2 WHERE cid in (\''.implode('\',\'', $courseIds ).'\') GROUP BY courseTImeSing, courseTimeDoub ORDER BY cid';
		// 	$query = $_mysqli->query( $sql );
		// 	$courses[$classname] = [];
		// 	foreach( $assoc = $query->fetch_assoc() ){
		// 		$courses[$classname][] = $assoc['cid'];
		// 	}
		// }

		$chars = 'abcdefghijklmnopqrstuvwxyz';
		$chars = str_split( $chars );
		$i = 0;
		foreach( $courses as $classname => $courseIds ){
			$tables[] = '( SELECT cid, classname, courseTimeSing, courseTimeDoub FROM courseinfo2 WHERE cid in() ) as '.$chars[$i];
			$i++;
		}

		$whereClause = [];
		$whereSing = implode();
		$finalSql = 'SELECT * FROM '.implode( ',', $tables ).
	}
