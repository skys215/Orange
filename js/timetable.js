var allScheds = [];

var dayClasses = ['-', 1,2,3,4,5,6,7,8,'5:30-7:00',9,10,11,12];
var dayClsKeys = [0,1,2,3,4,5,6,7,8, 13, 9,10,11,12];

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
	slctdTree.cancelSelectedNode();
	for( var i in sched ){
		addClassToTimeTable( sched[i] );
	}
}
function addClassToTimeTable( node ){
	var times = {
		'': node.allBin,
		'(单)<br/>': node.singBin,
		'(双)<br/>': node.doubBin
	};
	slctdTree.selectNode( slctdTree.getNodeByParam('cid',node.cid ), true, true );
	// 选中相同的课程
	var sameTimeClass = node.sameTimeClass;
	var sameTxt = '';
	if( sameTimeClass.length ){
		for( var k in sameTimeClass ){
			var n = slctdTree.getNodeByParam( 'cid', sameTimeClass[k] );
			if( n ){
				slctdTree.selectNode( n, true, true );
			}
		}
		sameTxt = '(可选同时间课程：'+sameTimeClass.join(',')+')\n';
	}

	//取消所有 click
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
				td.filter('.class_'+(pre%12+1) ).hide();
			}
			td = td.filter('.class_'+t);
			if( rowspan > 1 ){
				td.attr('rowspan', rowspan);
			}

			td.html(td.text()+node.classname+i).attr('title', node.cid+'\n'+sameTxt+node.classroom);
			pre++;
		}
	}


	if( !node.nghtBin ){
		return;
	}
	//pad 5;
	time = node.nghtBin.split('').reverse();
	pre = 5-time.length;
	while( (b = time.pop())!=undefined ){
		if( b === '0' ){
			pre++;
			continue;
		}

		var d = 1+pre;
		var td = $('#timetables td.day_'+d).filter('.class_13');
		td.html(td.text()+node.classname).attr('title', node.cid+node.classroom);
		pre++;
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
	ttList.css('visibility','visible')
	showSched( 0 );
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
			var txt = dayClasses[i];
			if( i != 9 ){
				txt = '第'+txt+'节';
			}
			th.push( $('<th>').addClass('class_'+dayClsKeys[i]).text( txt ) );
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
