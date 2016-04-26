<?php

	function getTimeTable( $courses ){
		global $_mysqli;

		$courses = json_decode( $courses, true );
		$tables = [];
		$chars = 'abcdefghijklmnopqrstuvwxyz';
		$chars = str_split( $chars );
		$sameTimeClass = [];
		$i = 0;
		foreach( $courses as $classname => $courseIds ){
			//优化:先筛选上课时间重复的
			//从用户选择的课程中，获取上课时间不同的课程
			$sql = 'SELECT cid, group_concat(cid) as gc FROM courseinfo3 WHERE cid in(\''.implode("','", $courseIds).'\') AND term='.TERM.' GROUP BY courseTimeSing, courseTimeDoub,courseTimeNght';
			$query = $_mysqli->query( $sql );
			$distinctTimeCids = [];
			while( $class = $query->fetch_assoc() ){
				$distinctTimeCids[] = $class['cid'];
				$sameTimeClass[$class['cid']] = explode(',',$class['gc']);
			}
			$query->free();
			$tables[] = '( SELECT cid, courseTimeSing, courseTimeDoub, courseTimeNght FROM courseinfo3 WHERE cid in(\''.implode("','", $distinctTimeCids).'\') AND term='.TERM.') as '.$chars[$i];
			$i++;
		}



		$whereClause = [];
		$courseChars = array_slice($chars, 0, $i);
		$whereSing = '('.implode('.courseTimeSing & ', $courseChars ) . '.courseTimeSing)';
		$whereDoub = '('.implode('.courseTimeDoub & ', $courseChars ) . '.courseTimeDoub)';
		$whereNght = '('.implode('.courseTimeNght & ', $courseChars ) . '.courseTimeNght)';
		$whereClause[] = '(('.$whereSing.' | '.$whereDoub.' | '.$whereNght.')) = 0';


		$timeTables = [];
		$cids = [];
		$i = 0;
		$page = 0;
		$size = 500;

		$countSql = 'SELECT COUNT(a.cid) as c FROM '.implode( ',', $tables );//.' WHERE '.implode(' AND ', $whereClause );
		$countQuery = $_mysqli->query( $countSql );
		$countResult = $countQuery->fetch_row();
		$rows = $countResult[0];

		$finalSql = 'SELECT * FROM '.implode( ',', $tables );//.' WHERE '.implode(' AND ', $whereClause );

		for( $page = 0; $page<=$rows/$size; $page++ ){
			$query = $_mysqli->query( $finalSql.' LIMIT '.$size.' OFFSET '.($page*$size) );
			while( $timetable = $query->fetch_row() ){
				$timetable = array_chunk( $timetable, 4 );
				$cids[$i] = [];
				$singBin = gmp_init(0);
				$doubBin = gmp_init(0);
				$nghtBin = gmp_init(0);

				$j = 0;
				// echo $i,'<br />';
				foreach( $timetable as $val ){
					$val[1] = gmp_init($val[1],10);
					$val[2] = gmp_init($val[2],10);
					$val[3] = gmp_init($val[3],10);


					$singConf = (gmp_cmp( gmp_and($singBin, $val[1]) , 0 )==0);  //相等时返回值为0，不等于0说明时间冲突
					$singBin  = gmp_or( $singBin, $val[1] );

					$doubConf = (gmp_cmp( gmp_and($doubBin, $val[2]), 0 )==0);
					$doubBin  = gmp_or( $doubBin, $val[2] );

					$nghtConf = (gmp_cmp( gmp_and($nghtBin, $val[3]), 0 ) ==0);
					$nghtBin = gmp_or( $nghtBin, $val[3] );

					if( ($singConf && $doubConf && $nghtConf) == false ){
						unset( $cids[$i] );
						break;
					}

					$courseSql = 'SELECT *, courseTimeSing&courseTimeDoub as allBin, (courseTimeSing&courseTimeDoub)^courseTimeSing as singBin, (courseTimeSing&courseTimeDoub)^courseTimeDoub as doubBin FROM courseinfo3 WHERE term='.TERM.' AND cid=\''.$val[0].'\'';
					$courseQuery = $_mysqli->query( $courseSql );
					while( $courseinfo = $courseQuery->fetch_assoc() ){
						$courseinfo['sameTimeClass'] = [];
						if( isset( $sameTimeClass[$courseinfo['cid']] ) ){
							$courseinfo['sameTimeClass'] = array_diff($sameTimeClass[$courseinfo['cid']], [$courseinfo['cid']]);
							sort($courseinfo['sameTimeClass']);
						}
						$courseinfo['allBin'] = base_convert($courseinfo['allBin'], 10, 2);
						$courseinfo['singBin'] = base_convert($courseinfo['singBin'], 10, 2);
						$courseinfo['doubBin'] = base_convert($courseinfo['doubBin'], 10, 2);
						$courseinfo['nghtBin'] = base_convert($courseinfo['courseTimeNght'], 10, 2);
						$cids[$i][] = $courseinfo;
					}
					$courseQuery->free();
					$j++;
				}
				$i++;
			}
			// var_dump($cids);
			// 	exit;
		}
		array_filter($cids);
		sort($cids);
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
	// 	   FROM courseinfo3
	// 	   WHERE cid in(1900640020,1900640005)
	//    ) AS a,(
	// 	   SELECT id,
	// 	          group_concat(cid),
	// 	          classname,
	// 	          classroom,
	// 	          courseTimeSing,
	// 	          courseTimeDoub
	// 	   FROM courseinfo3
	// 	   WHERE cid in(0803900002, 0803900001)
	//    ) AS b
	// WHERE (
	// 	(a.courseTimeSing & b.courseTimeSing)
	//     AND (a.courseTimeDoub & b.courseTimeDoub)
	// )=0
	//
	// 只返回课表（组合）cid可以为数组
	// 前端获取后，从local storage获取课程信息，还有显示课程选择列表
