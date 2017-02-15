
var app = angular.module('tomasuloApp', []);

app.controller('InstController', function() {

	table_instr = $('#table_instr');
	table_adder = $('#table_adder');
	table_mult = $('#table_mult');
	table_reg = $('#table_reg');

	this.nInstruction = 1;

    this.defaultInst = {
        type:'INSTRUCTION',
        dst: 'DST',
        op1: 'OP1',
        op2: 'OP2'
    };

    // Se asigna el valor de la instruccion 'default' (defaultInst)
    this.selectedInst = jQuery.extend(true, {}, this.defaultInst);

    this.instructions = [
    {type:'ADD', cycles: 1},
    {type:'SUBD', cycles: 1},
    {type:'MULD', cycles: 1},
    {type:'DIV', cycles: 1},
    {type:'ST', cycles: 1},
    {type:'LD', cycles: 1}];

    this.instructionsCycles = ['1', '2', '3', '4', '5', '6', '7', '8'];

    this.registers_bank = [
    {name: 'r0', value: '0'},
    {name: 'r2', value: '0'},
    {name: 'r4', value: '0'},
    {name: 'r6', value: '0'},
    {name: 'r8', value: '0'}];

    this.instr_run = [];

    this.setRegTable = function() {
    	var defaultReg = [];
    	defaultReg.push({number:'0', busy:'', tag:'', data:''}); // pos 0
    	defaultReg.push({number:'2', busy:'', tag:'', data:''}); // pos 1
    	defaultReg.push({number:'4', busy:'', tag:'', data:''}); // pos 2
    	defaultReg.push({number:'6', busy:'', tag:'', data:''}); // pos 3
    	defaultReg.push({number:'8', busy:'', tag:'', data:''}); // pos 4
    	return defaultReg;
    };
    this.table_reg = this.setRegTable();


    this.addToAdder = function(instr) {
    	var instructionToAdd = instr;

        // si es raw la funcion le devuelve el valor del tag, segun la dependencia, para el op1
        var tag = isRAW(instructionToAdd,1);
        instructionToAdd['tag1'] = tag;

        // si es raw la funcion le devuelve el valor del tag, segun la dependencia, para el op2
        tag = isRAW(instructionToAdd,2);
        instructionToAdd['tag2'] = tag;

        // lo debería agregar en el primer slot disponible
    	this.table_adder.push(instructionToAdd);
    };
    this.table_adder = [];


	this.addToMul = function(instr) {
    	var instructionToMul = instr;

        // si es raw la funcion le devuelve el valor del tag, segun la dependencia, para el op1
        var tag = isRAW(instructionToMul,1);
        instructionToMul['tag1'] = tag;

        // si es raw la funcion le devuelve el valor del tag, segun la dependencia, para el op2
        tag = isRAW(instructionToMul,2);
        instructionToMul['tag2'] = tag;

        // REEMPLAZAR: lo debería agregar en el primer slot disponible
        this.table_mult.push(instructionToMul);
    };
    this.table_mult = [];


    this.select = function(field, instruction) {
        this.selectedInst[field] = instruction;
        this.updateBtns();
    };

	this.selectCycle = function(op, instCycle) {
		var instArray = this.instructions;
		$.each(instArray, function() {
    		if (this.type == op) {
        		this.cycles = instCycle;
        	}
    	});
	};

	this.resetInstCycles = function() {
		var instArray = this.instructions;
		$.each(instArray, function() {
        	this.cycles = 1;
    	});
	};

    this.isMemInst = function() {
    	var selected = this.selectedInst;
    	return ((selected.type == 'LD') || (selected.type == 'ST'));
    };

    this.allSet = function() {
        var selected = this.selectedInst;
        var def = this.defaultInst;
	    return !((selected.type != def.type) && (selected.dst != def.dst) && (selected.op1 != def.op1) && (selected.op2 != def.op2));
    };

	this.allSetMem = function() {
        var selected = this.selectedInst;
        var def = this.defaultInst;
	    return !((selected.type != def.type) && (selected.dst != def.dst) && (selected.op1 != def.op1));
    };

    this.updateBtns = function() {

        var btnAdd = $('#btn-add');
        var btnOp2 = $('#btn-op2');

        if (!this.isMemInst()) {
        	// update op2 button
        	if (btnOp2.hasClass("disabled"))
        			btnOp2.removeClass("disabled");
			// update add button
        	if (!this.allSet()) {
            	if (btnAdd.hasClass("disabled"))
                	btnAdd.removeClass("disabled");
        	} else {
            	if (!btnAdd.hasClass("disabled"))
                	btnAdd.addClass("disabled");
        	}
        } else {
        	// update op2 button
        	if (!btnOp2.hasClass("disabled"))
        			btnOp2.addClass("disabled");
        	// update add button
        	if (!this.allSetMem()) {
            	if (btnAdd.hasClass("disabled"))
                	btnAdd.removeClass("disabled");
        	} else {
            	if (!btnAdd.hasClass("disabled"))
                	btnAdd.addClass("disabled");
        	}
        }

    };

    this.putInstInTable = function() {
    	this.selectedInst['number'] = 'S'+ this.nInstruction;
    	this.instr_run.push(this.selectedInst);
    	this.nInstruction++;
    	this.selectedInst = jQuery.extend(true, {}, this.defaultInst);
    	this.updateBtns();
    };

    /**
    * Set method: 
    *   Disable "Instructions", "Cicles" and "Controls" button groups.
    *   Enable button "RUN CYCLE"
    */
    this.set = function() {

        
        var btnGrpAdd = $('.btn-grp-add-inst');
        btnGrpAdd.find("button").addClass("disabled");

        var ciclePerInst = $('.cicle-per-instructions');
        ciclePerInst.find("button").addClass("disabled");

        var btnRun = $('#btn-run');
        if (btnRun.hasClass("disabled")){
            if (this.keepRunning()) {
                btnRun.removeClass("disabled");
            }
        }
            
    };


    /**
    * Reset method: Re-enable "Instructions", "Cicles" and "Controls" button groups. Delete tables data.
    */
    this.reset = function() {
            $('.btn-grp-add-inst').find("button").removeClass("disabled");
            $('.cicle-per-instructions').find("button").removeClass("disabled");
            $('#btn-run').addClass("disabled");

            this.instr_run = [];
            this.table_reg = this.setRegTable();
            this.resetInstCycles();
    };


    // agrego la instruccion a la ER correspondiente
    this.dispatch = function(inst) {

        switch(inst.type) {
            case 'ADD':
                this.addToAdder(inst);
                break;
            case 'SUBD':
                this.addToAdder(inst);
                break;
            case 'MULD':
                this.addToMul(inst);
                break;
            case 'DIV':
                this.addToMul(inst);
                break;
            case 'ST':
                /**code block*/
                break;
            case 'LD':
                /**code block*/
                break;
        }

    };


    this.execute = function(time) {

        if (!raw(this.table_adder)) {

        }

        if (!raw(this.table_mult)) {

        }

        // guardo el tiempo en que se empezó a ejecutar
        instructionToAdd['time'] = time;

    };

    // Da TRUE siempre que haya algo para ejecutar o despachar.
    this.keepRunning = function() {
        return ((this.instr_run.length != 0) || (this.table_adder.length != 0) || (this.table_mult.length != 0))
    };


    this.time = 0;

    this.run = function() {

        this.time= this.time + 1;

        // si la lista de instrucciones no esta vacia, despacho.
        if (this.instr_run.length > 0 ) {

            // tomo la primer instruccion de la lista
            var inst = this.instr_run.shift();
        
            // la despacho a la ER correspondiente
            this.dispatch(inst);
        }

            

        // ejecuto lo que haya por ejecutar
        this.execute(time);
            
            
    };


    

});


