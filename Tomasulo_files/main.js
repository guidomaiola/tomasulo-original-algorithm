


$(document).ready( function () {


	init();



    

	function init() {

        $('#table_instr').DataTable({
        	autoWidth: false,
        	info: false,
        	lengthChange: false,
        	ordering:  false,
        	pageLength: 5,
        	paging: false,
        	searching: false
        });
}

} );