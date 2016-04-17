var ul = $('#suggestions');
var allScheds = [];
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
			allScheds = result['timetables'];
			addToList( allScheds );
		});
	});

	genTimetable();

	$('#ttList').on('change', function(){
		var slctdSched = $(this).prop('selectedIndex');
		showSched(slctdSched);
	})
});
function showSched( schedNum ){
	var sched = allScheds[schedNum];
	$('#timetables td').text('');
	$('#timetables td').removeAttr('rowspan');
	$('#timetables td').show();
	for( var i in sched ){
		addClassToTimeTable( sched[i] );
	}
}
function addClassToTimeTable( node ){
	var times = {
		'': node.allBin,
		'(单)': node.singBin,
		'(双)': node.doubBin
	};
	for( var i in times ){
		var time = times[i];

		//pad 60;
		var pre = 60-time.length;
		time = time.split('').reverse();
		while( (b = time.pop())!=undefined ){
			if( b === '0' ){
				pre++;
				continue;
			}

			var rowspan = 1;
			var d = 1+Math.floor(pre/12);
			var t = pre%12+1;
			var td = $('#timetables td.day_'+d);
			while( (pre++,c = time.pop()) == '1' ){
				rowspan++;
				td.filter('.class_'+((pre+1)%12) ).hide();
			}
			td = td.filter('.class_'+t);
			if( rowspan > 1 ){
				td.attr('rowspan', rowspan);
			}

			td.text(td.text()+node.classname+i).attr('title', node.cid+node.classroom);
			pre++;
		}
	}
}

function addToList( possibleSchedules ){
	var ttList = $('#ttList');
	if( !possibleSchedules.length ){
		alert('no timetable matched');
		return false;
	}
	ttList.empty();
	var num = possibleSchedules.length;
	for( var i=0; i< num; i++ ){
		var opt = $('<option>').attr({'class':'schedule-case'}).text('方案'+String(i+1));
		opt.append( ul );
		ttList.append( opt );
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
				var div = $('<div>').addClass('parent');
				var td = $('<td>').addClass('day_'+(Number(j)+1)).addClass('class_'+dayClsKeys[i]);
				th.push( td.append( div ) );
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
