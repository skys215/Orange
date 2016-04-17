var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_ENTER = 13;
var KEY_BACKSPACE = 8;
var KEY_SPACE = 20;

var crntItemNum = 0;
var totalItemNum = 0;
var q = '';
$(document).ready(function(){
	q = $('#keyword').val();

	$('.show_all_class').on('click', function(){
		$('#all_course_list').toggle();
	});

	$('#keyword').on('keyup change', function( e ){
		switch( e.keyCode ){
			case KEY_UP:
				e.preventDefault();
				previousItem();
				break;
			case KEY_DOWN:
				e.preventDefault();
				if( ul.css('display') == 'none '){
					getResult();
				}
				else{
					nextItem();
				}
				break;
			case KEY_ENTER:
				if( ul.css('display') == 'none '){
					getResult();
				}
				else{
					addNode();
				}
				break;
			default:
				getResult();
				break;
		}
	});
	$('#keyword').on('blur', function(){
		ul.empty();
	});
	ul.on('mouseover', 'li', function(){
		ul.find('li.highlighted').removeClass('highlighted');
		$(this).addClass('highlighted');
		crntItemNum = $(this).index();
	})
	.on('click', 'li', function(){
		addNode();
	});
});



function getResult( ){
	var keyword = $('#keyword').val();
	if( keyword.length <2){
		ul.empty();
		return ;
	}
	if( keyword == q ){
		return false;
	}
	q = keyword;


	var d = new Date().getTime();
	$.get('api.php', {"action":'search', 'keyword': keyword, 'd': d }, function( data ){
		data = $.parseJSON( data );
		ul.empty();
		crntItemNum = 0;

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
	if( ul.css('display') == 'none' ){
		return false;
	}

	ul.find('li.highlighted').removeClass('highlighted');

	crntItemNum--;
	if( crntItemNum <= 0 ){
		return false;
	}
	var slctdLi = ul.find('li.sug-item:nth-child('+crntItemNum+')');
	if( !slctdLi ){
		crntItemNum = 0;
		return false;
	}

	if( ul[0].scrollTop > slctdLi[0].offsetTop ){
		ul[0].scrollTop = slctdLi[0].offsetTop;
	}
	slctdLi.addClass('highlighted');
}

function nextItem(){
	if( ul.css('display') == 'none' ){
		return false;
	}

	if( crntItemNum >= totalItemNum ){
		return false;
	}
	ul.children('.highlighted').removeClass('highlighted');

	crntItemNum++;
	var slctdLi = ul.find('li.sug-item:nth-child('+crntItemNum+')');
	if( (slctdLi[0].offsetTop + slctdLi[0].offsetHeight) > (ul[0].scrollTop +ul[0].offsetHeight ) ){
		ul[0].scrollTop = ul[0].scrollTop + slctdLi[0].offsetHeight;
	}
	else if( slctdLi[0].offsetTop < ul[0].scrollTop ){
		ul[0].scrollTop = slctdLi[0].offsetTop;
	}
	slctdLi.addClass('highlighted');
}

function addNode(){
	var ele = ul.find('li.highlighted');
	ul.empty();
	$('#keyword').val('');
	var cid = ele.attr('data-cid');

	var node = coursesTree.getNodeByParam('cid', cid );
	var slctd = slctdTree.getNodeByParam('cid', cid);
	if( node && !slctd ){
		addNodeToSelected( node );
	}
}

