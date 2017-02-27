
var app = angular.module('tomasuloApp', []);

app.controller('InstController', function() {

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
    {name: 'r0'},
    {name: 'r2'},
    {name: 'r4'},
    {name: 'r6'},
    {name: 'r8'}];

    this.instr_run = [];
    this.adder = [];
    this.mult = [];

    this.setRegTable = function() {
    	var defaultReg = [];
    	defaultReg.push({number:'r0', busy:0, tag:0, data:0}); // pos 0
    	defaultReg.push({number:'r2', busy:0, tag:0, data:4}); // pos 1
    	defaultReg.push({number:'r4', busy:0, tag:0, data:8}); // pos 2
    	defaultReg.push({number:'r6', busy:0, tag:0, data:12}); // pos 3
    	defaultReg.push({number:'r8', busy:0, tag:0, data:16}); // pos 4
    	return defaultReg;
    };
    this.reg = this.setRegTable();


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
    	this.selectedInst['id'] = 'S'+ this.nInstruction;
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
            this.reg = this.setRegTable();
            this.resetInstCycles();
            this.adder = [];
            this.mult = [];
            this.nInstruction = 1;
    };




/**********************************************************************************************/

    this.isRaw = function(reg,pos) {

        var reg = reg.substring(1, reg.length);

        // fix reg number by position
        if (reg>0) {
            reg = reg/2;
        }

        if (this.reg[reg].busy == 0) {
            return {busy:0, data:this.reg[reg].data};
        } else {
            return {busy:1, tag:this.reg[reg].tag};
        }

        return reg;
    };

    this.updateRegTag = function(instr, pos) {
        var dst = instr['dst'];

        $.each(this.reg, function() {
            if (this.number == dst) {
                this.busy = 1;
                this.tag = pos;
            }
        });

    };


    this.addToER = function(instr,ER) {

        // ER del multp de 0-4
        var pos = this.adder.length;

        for (i=1;i<=2;i++) {
           var raw = this.isRaw(instr['op'+i],pos);
            if (raw.busy == 0) {
                instr['tag'+i] = 0;
                instr['op'+i] = raw.data;
            } else {
                instr['tag'+i] = raw.tag;
                instr['op1'+i] = '-'
            } 
        }

        instr['pos'] = pos;

        // lo debería agregar en el primer slot disponible
        ER.push(instr);

        // actualizar banco de reg
        this.updateRegTag(inst, pos);


    };

    // agrego la instruccion a la ER correspondiente
    this.dispatch = function(inst) {

        switch(inst.type) {
            case 'ADD':
                this.addToER(inst,this.adder);
                break;
            case 'SUBD':
                this.addToER(inst,this.mult);
                break;
            case 'MULD':
                var pos = this.addToMul(inst);
                // actualizar banco de reg
                this.updateRegTag(inst, pos);
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

        /*if (!raw(this.adder)) {

        }

        if (!raw(this.mult)) {

        }

        // guardo el tiempo en que se empezó a ejecutar
        instructionToAdd['time'] = time;*/

    };

    // Da TRUE siempre que haya algo para ejecutar o despachar.
    this.keepRunning = function() {
        return ((this.instr_run.length != 0) || (this.adder.length != 0) || (this.mult.length != 0))
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
        this.execute(this.time);
            
            
    };


    

});


