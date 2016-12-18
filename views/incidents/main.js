$(document).ready(function(){
	$('.delete-status').on('click', function(){
		var id = $(this).data('id');
		var url = '/statuses/delete/'+id;
		if(confirm('Delete Status?')){
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result){
					console.log('Deleting status...');
					window.location.href='/statuses';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});
});
// refer albums/main.js
