<?php
	include_once( 'db.php' );
	define('TERM', 20152 );

	$action = $_GET['action'];

	$data = [];
	switch( $action ){
		case 'course_list':
			include( 'api/courseList.php' );
			$data = getCourseList( $_mysqli );
			break;
		case 'get_time_table':
			include( 'api/getTimeTable.php' );
			$data = getTimeTable( $_GET['courses'] );
			break;
		case 'search':
			include( 'api/searchClass.php');
			$data['result'] = searchClass( $_GET['keyword'] );
			break;
		default:

			break;
	}

	ob_clean();
	echo json_encode($data, true);
	ob_flush();
