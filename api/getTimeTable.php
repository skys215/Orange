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


	// SELECT *
	// FROM(
	// 	SELECT id,
	// 	          group_concat(cid),
	// 	          classname,
	// 	          classroom,
	// 	          courseTimeSing,
	// 	          courseTimeDoub
	// 	   FROM courseinfo2
	// 	   WHERE cid in(1900640020,1900640005)
	//    ) AS a,(
	// 	   SELECT id,
	// 	          group_concat(cid),
	// 	          classname,
	// 	          classroom,
	// 	          courseTimeSing,
	// 	          courseTimeDoub
	// 	   FROM courseinfo2
	// 	   WHERE cid in(0803900002, 0803900001)
	//    ) AS b
	// WHERE (
	// 	(a.courseTimeSing & b.courseTimeSing)
	//     AND (a.courseTimeDoub & b.courseTimeDoub)
	// )=0
	//
	// 只返回课表（组合）cid可以为数组
	// 前端获取后，从local storage获取课程信息，还有显示课程选择列表
