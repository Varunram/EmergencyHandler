console.log('loaded cos');
$(document).ready(function(){

	$('.delete-status').on('click', function(){
		console.log('Foundyou');
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

	$('.delete-incident').on('click', function(){
		var id = $(this).data('id');
		var url = '/incidents/delete/'+id;
		if(confirm('Delete Incident?')){
			$.ajax({
				url: url,
				type:'DELETE',
				success: function(result){
					console.log('Deleting incident...');
					window.location.href='/incidents';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});
});
