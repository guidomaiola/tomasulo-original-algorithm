


$(document).ready( function () {

	init();



/**
* Init method: Initialize datatables.
*/
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

        $('#table_adder').DataTable({
                autoWidth: false,
                info: false,
                lengthChange: false,
                ordering:  false,
                pageLength: 5,
                paging: false,
                searching: false
        });

        $('#table_mult').DataTable({
                autoWidth: false,
                info: false,
                lengthChange: false,
                ordering:  false,
                pageLength: 5,
                paging: false,
                searching: false
        });

        $('#table_reg').DataTable({
                autoWidth: false,
                info: false,
                lengthChange: false,
                ordering:  false,
                pageLength: 5,
                paging: false,
                searching: false
        });

        $('#btn-run').addClass("disabled");

        $('#btn-set').on('click', function() {
                set();
        });

        $('#btn-reset').on('click', function() {
                reset();
        });
}



/**
* Set method: 
*   Disable "Instructions", "Cicles" and "Controls" button groups.
*   Enable button "RUN CYCLE"
*/
function set() {

        $('.btn-grp-add-inst').find("button").addClass("disabled");
        $('.cicle-per-instructions').find("button").addClass("disabled");

        if ($('#btn-run').hasClass("disabled")){
                $('#btn-run').removeClass("disabled");
        }
}

/**
* Reset method: Re-enable "Instructions", "Cicles" and "Controls" button groups. Delete tables data.
*/
function reset() {
        $('.btn-grp-add-inst').find("button").removeClass("disabled");
        $('.cicle-per-instructions').find("button").removeClass("disabled");
        $('#btn-run').addClass("disabled");

}

} );