
$(document).ready( function () {

        var table_instr = $('#table_instr');
        var table_adder = $('#table_adder');
        var table_mult = $('#table_mult');
        var table_reg = $('#table_reg');

	init();



/**
* Init method: Initialize datatables.
*/
function init() {

        iniTable(table_instr);

        iniTable(table_adder);

        iniTable(table_mult);

        iniTable(table_reg);

        $('#btn-run').addClass("disabled");

        $('#btn-set').on('click', function() {
                set();
        });

        $('#btn-reset').on('click', function() {
                reset();
        });
}

function iniTable(table) {
        table.DataTable({
                autoWidth: false,
                info: false,
                lengthChange: false,
                ordering:  false,
                pageLength: 5,
                paging: false,
                searching: false
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