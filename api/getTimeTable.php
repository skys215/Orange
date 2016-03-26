<?php

	function getTimeTable( $courses ){
		global $_mysqli;

		$courses = json_decode( $courses, true );
		$tables = [];
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
			$tables[] = '( SELECT cid, courseTimeSing, courseTimeDoub FROM courseinfo2 WHERE cid in(\''.implode("','", $courseIds).'\') ) as '.$chars[$i];
			$i++;
		}

		$whereClause = [];
		$courseChars = array_slice($chars, 0, $i);
		$whereSing = '('.implode('.courseTimeSing & ', $courseChars ) . '.courseTimeSing)';
		$whereDoub = '('.implode('.courseTimeDoub & ', $courseChars ) . '.courseTimeDoub)';
		$whereClause[] = '('.$whereSing.' AND '.$whereDoub.') = 0';
		$finalSql = 'SELECT * FROM '.implode( ',', $tables ).' WHERE '.implode(' AND ', $whereClause );

		$query = $_mysqli->query( $finalSql );
		$timeTables = [];
		$cids = [];
		$i = 0;
		while( $timetable = $query->fetch_row() ){
			$timetable = array_chunk( $timetable, 3 );
			$cids[$i] = [];
			foreach( $timetable as $val ){
				$cids[$i][] = $val[0];
			}
			$i++;
		}

		return $cids;
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
