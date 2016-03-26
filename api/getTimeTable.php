<?php

	function getTimeTable( $courses ){
		global $_mysqli;

		$courses = json_decode( $courses, true );
		$tables = [];
		$chars = 'abcdefghijklmnopqrstuvwxyz';
		$chars = str_split( $chars );
		$i = 0;
		foreach( $courses as $classname => $courseIds ){
			//优化:先筛选上课时间重复的
			//从用户选择的课程中，获取上课时间不同的课程
			$sql = 'SELECT cid FROM courseinfo2 WHERE cid in(\''.implode("','", $courseIds).'\') AND term='.TERM.' GROUP BY courseTimeSing, courseTimeDoub';
			$query = $_mysqli->query( $sql );
			$distinctTimeCids = [];
			while( $class = $query->fetch_assoc() ){
				$distinctTimeCids[] = $class['cid'];
			}
			$query->free();
			$tables[] = '( SELECT cid, courseTimeSing, courseTimeDoub FROM courseinfo2 WHERE cid in(\''.implode("','", $distinctTimeCids).'\') AND term='.TERM.') as '.$chars[$i];
			$i++;
		}



		$whereClause = [];
		$courseChars = array_slice($chars, 0, $i);
		$whereSing = '('.implode('.courseTimeSing & ', $courseChars ) . '.courseTimeSing)';
		$whereDoub = '('.implode('.courseTimeDoub & ', $courseChars ) . '.courseTimeDoub)';
		$whereClause[] = '('.$whereSing.' AND '.$whereDoub.') = 0';


		$timeTables = [];
		$cids = [];
		$i = 0;
		$page = 0;
		$size = 500;

		$countSql = 'SELECT COUNT(a.cid) as c FROM '.implode( ',', $tables ).' WHERE '.implode(' AND ', $whereClause );
		$countQuery = $_mysqli->query( $countSql );
		$countResult = $countQuery->fetch_row();
		$rows = $countResult[0];

		$finalSql = 'SELECT * FROM '.implode( ',', $tables ).' WHERE '.implode(' AND ', $whereClause );

		for( $page = 0; $page<=$row/$size; $page++ ){
			$query = $_mysqli->query( $finalSql.' LIMIT '.$size.' OFFSET '.($page*$size) );
			while( $timetable = $query->fetch_row() ){
				$timetable = array_chunk( $timetable, 3 );
				$cids[$i] = [];
				foreach( $timetable as $val ){
					$courseSql = 'SELECT * FROM courseinfo2 WHERE term='.TERM.' AND cid=\''.$val[0].'\'';
					$courseQuery = $_mysqli->query( $courseSql );
					while( $courseinfo = $courseQuery->fetch_assoc() ){
						$cids[$i][] = $courseinfo;
					}
					$courseQuery->free();
				}
				$i++;
			}
		}

		$result = [];
		$result['timetables'] = $cids;
		return $result;
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