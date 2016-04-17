function addNodeToSelected( nodes ){
	var parentNode;

	//if is parent, add directly
	if( nodes.isParent ){
		parentNode = slctdTree.copyNode(null, nodes, 'next', false );
		for( var i in parentNode.children){
			addClassToTimeTable( parentNode.children[i] );
		}
		return false;
	}

	parentNode = slctdTree.getNodeByParam( 'cid', nodes.classname+nodes.college );
	//if parent doesn't exists, add parent node
	if( !parentNode ){
		parentNode = slctdTree.copyNode( null, nodes.getParentNode() );
		slctdTree.removeChildNodes( parentNode );
	}
	// append node to parent node
	slctdTree.copyNode( parentNode, nodes );
	// done
	addClassToTimeTable( nodes );
}

function removeNodeFromSelected( nodes ){
	$('div.cid_'+nodes.cid).remove();

	var parentNode;
	var n = slctdTree.getNodeByParam( 'cid', nodes.cid );
	if( nodes.isParent ){
		slctdTree.removeChildNodes( n );
		slctdTree.removeNode( n );
	}
	else{
		slctdTree.removeNode( n );
		parentNode = slctdTree.getNodeByParam( 'cid', n.parentName );
		if( !parentNode.children.length ){
			slctdTree.removeNode( parentNode );
		}
	}
}

$(document).ready(function(){
	$.get('api.php',{action:'course_list'}, function( data ){
		var courseNodes = $.parseJSON( data );
		coursesTree = $.fn.zTree.init(
			$("#all_course_list"),
			{
				data: {
					simpleData: {
						enable: true,
						idKey: 'cid',
						pIdKey: 'parentName'
					},
					key:{
						title:'title'
					}
				},
				check:{
					enable: true,
					autoCheckTrigger: false
				},
				callback: {
					onCheck:function(e, treeId, treeNode){
						if( treeNode.checked ){
							addNodeToSelected( treeNode );
						}
						else{
							removeNodeFromSelected( treeNode );
						}
					}
				}
			},
			courseNodes
		);
	});
	slctdTree = $.fn.zTree.init($("#selected_course_list"), {
		data: {
			simpleData: {
				enable: true,
				idKey: 'cid',
				pIdKey: 'parentName'
			},
			key:{
				title: 'title'
			}
		},
		callback:{
			beforeRemove: function( treeId, treeNode ){
				if( treeNode.isParent == false && treeNode.getParentNode().children.length <=1 ){
					slctdTree.removeNode( treeNode.getParentNode() );
				}
			},
			onRemove:function( event, treeId, treeNode ){
				var cTNode = coursesTree.getNodeByParam('cid', treeNode.cid);
				if( !cTNode ){
					return ;
				}

				coursesTree.checkNode( cTNode, false, true );
			},
			onNodeCreated: function(event, treeId, nodes ){
				if( nodes.isParent ){
					slctdTree.expandNode( nodes, true, false, true );
					return;
				}
				//parseTime
				//checkul
				//addli
				//hide

			}
		},
		edit: {
			enable:true,
			showRenameBtn: false
		}
	}, []);
});
