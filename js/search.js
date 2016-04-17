var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_ENTER = 13;
var KEY_BACKSPACE = 8;
var KEY_SPACE = 20;

var crntItemNum = 0;
var totalItemNum = 0;

$(document).ready(function(){
	$('.show_all_class').on('click', function(){
		$('#all_course_list').toggle();
	});

	$('#keyword').on('keyup change', function( e ){
		var t = $(this).val();
		if( t.length <2 ){
			ul.empty();
			return ;
		}
		switch( e.keyCode ){
			case KEY_UP:
				e.preventDefault();
				previousItem();
				break;
			case KEY_DOWN:
				e.preventDefault();
				nextItem();
				break;
			case KEY_ENTER:
				addNode();
			case KEY_BACKSPACE:
				break;
			default:
				getResult( t );
				break;
		}
	});
	$('#keyword').on('blur', function(){
		ul.empty();
	});
});



function getResult( keyword ){
	var d = new Date().getTime();
	$.get('api.php', {"action":'search', 'keyword': keyword, 'd': d }, function( data ){
		data = $.parseJSON( data );
		ul.empty();

		var lis = [];
		for( var item in data.result ){
			var cls = data.result[item];
			lis.push( '<li class="sug-item" data-cid="'+cls.cid+'" data-classname="'+cls.classname+'" data-college="'+cls.college+'" data-classteacher="'+cls.classteacher+'" data-classroom="'+cls.classroom+'">'+cls.cid+'('+cls.college+'):<br />'+cls.classname+'-'+cls.classteacher+'<br />上课时间：'+cls.classroom+'</li>' );
		}
		totalItemNum = lis.length;
		ul.html(lis.join("\n"));
		ul.find('li:first-child').addClass('highlighted');
	});
}

function previousItem(){
	ul.find('li.highlighted').removeClass('highlighted');
	if( crntItemNum <= 0 ){
		return false;
	}

	var slctdLi = ul.find('li.sug-item:nth-child('+crntItemNum+')');
	if( !slctdLi ){
		crntItemNum = 0;
		return false;
	}

	crntItemNum--;
	if( ul[0].scrollTop > slctdLi[0].offsetTop ){
		ul[0].scrollTop = slctdLi[0].offsetTop;
	}
	slctdLi.addClass('highlighted');
}

function nextItem(){
	ul.children('.highlighted').removeClass('highlighted');

	if( crntItemNum < totalItemNum ){
		crntItemNum++;
	}
	var slctdLi = ul.find('li.sug-item:nth-child('+crntItemNum+')');
	if( (slctdLi[0].offsetTop + slctdLi[0].offsetHeight) > (ul[0].scrollTop +ul[0].offsetHeight ) ){
		ul[0].scrollTop = ul[0].scrollTop + slctdLi[0].offsetHeight;
	}
	slctdLi.addClass('highlighted');
}

function addNode(){
	var ele = ul.find('li.highlighted');
	ul.empty();
	$('#keyword').val('');
	var cid = ele.attr('data-cid');

	var node = coursesTree.getNodeByParam('cid', cid );
	if( node ){
		addNodeToSelected( node );
	}
}

