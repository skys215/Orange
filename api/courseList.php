<?php
	function getCourseList(){
		global $_mysqli;
		$sql = "SELECT * FROM courseinfo WHERE classname NOT LIKE '%毕业%' AND term=".TERM;
		$result = $_mysqli->query( $sql );

		$colleges = []; //班级
		$courses = [
			[
				'name' => '所有课程',
				'cid'  => 0,
				'open' => true,
				'nocheck' => true
			]
		]; //课程
		$classes = []; //班级
		while( $course = $result->fetch_assoc( ) ){

			if( !isset( $classes[$course['college']][$course['classname']] ) ){
				if( !isset( $colleges[ $course['college'] ] ) ){
					$college = [
						'cid' => $course['college'],
						'name' => $course['college'],
						'parentName'  => 0,
						'nocheck' => true
					];
					$courses[] = $college;

					$colleges[$course['college']] = true;
				}

				$class = [
					'cid' => $course['classname'].$course['college'],
					'name' => $course['classname'],
					'parentName'=> $course['college']
				];
				$courses[] = $class;
				$classes[$course['college']][$course['classname']] = true;

			}
			$course['parentName'] = $course['classname'].$course['college'];
			$course['name'] = '('.$course['cid'].')'.$course['classname'];
			$course['binTimes'] = explode(',', $course['courseTimeBin']);
			$courses[] = $course;
		}

		return $courses;
	}
