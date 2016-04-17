var ul = $('#suggestions');

$(document).ready(function(){
	$('#start_arrange').on('click', function(){
		var courses = getSelectedCIds();
		if( courses.length<2 ){
			alert('请至少选择两门课程');
			return false;
		}
		var data = {
			'action' : 'get_time_table',
			'courses': JSON.stringify( courses )
		};
		$.get('api.php', data, function( result ){
			result = JSON.parse(result);
			showTimetables( result['timetables'] );
		});
	});

	genTimetable();
});

function addClassToTimeTable( node ){
	// var times;
	times = Number(node.courseTimeSing).toString(2);
	//pad 60;
	var pre = 60-times.length;
	// everyday
	var st = -1;//start from top
	while( (ind = times.indexOf('1', st+1))>=0 ){
		var sameTimeClass = $('div.'+node.classname+'-'+node.college);
		if( sameTimeClass ){

		}
		ind +=pre;
		var clsDiv = $('<div>')
			.addClass('cid_'+node.cid)
			.addClass(node.classname+'-'+node.college)
			.text(node.classname+'('+node.cid+')');
		var d = Math.floor(ind/12)+1;
		var t = ind%12+1;
		st = ind-pre;
		$('#timetables td.day_'+d+'.class_'+t).append( clsDiv );
	}
}

function showTimetables( possibleSchedules ){
	var ttList = $('#ttList');
	if( !possibleSchedules.length ){
		alert('no timetable matched');
		return false;
	}
	ttList.empty();
	var num = 1;
	for( var i in possibleSchedules ){
		var schedule = possibleSchedules[i];
		var prntLi = $('<li>').attr({'class':'schedule-case'}).text('方案'+num);
		var ul = $('<ul>').attr({'class':'schedule'});
		for( var k in schedule ){
			var course = schedule[k];
			var li = $('<li>').attr({'class':'schedule-course'}).text(course['classname']+course['cid']+'('+course['classroom']+')');
			ul.append( li );
		}
		num++;
		prntLi.append( ul );
		ttList.append( prntLi );
	}
}

function genTimetable(){
	var cells = [];
	for( var i in dayClasses ){

		var tr = $('<tr>');
		var th = [];
		if( i == 0 ){
			th.push( $('<th>').text( '-' ) );
			for( var j in weekDays ){
				th.push( $('<th>').text( weekDays[j] ) );
			}
		}
		else{
			th.push( $('<th>').addClass('class_'+dayClsKeys[i]).text( dayClasses[i] ) );
			for( var j in weekDays ){
				th.push( $('<td>').addClass('day_'+(Number(j)+1)).addClass('class_'+dayClsKeys[i]) );
			}
		}
		tr.addClass('class_'+dayClsKeys[i]);
		tr.append( th );
		$('#timetables').append( tr );
	}
}

function getSelectedCIds(){
	var courses = slctdTree.getNodesByParam('isParent', true);
	var courseIds = [];
	var i = 0;
	for( var parentNodeNum in courses ){
		courseIds[i] = [];
		var classes = courses[parentNodeNum].children;
		for( var classNum in classes ){
			courseIds[i].push( classes[classNum].cid );
		}
		i++;
	}
	return courseIds;
}
