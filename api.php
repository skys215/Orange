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
		default:

			break;
	}

	ob_clean();
	echo json_encode($data, true);
	ob_flush();
