
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

    this.selectedInst = jQuery.extend(true, {}, this.defaultInst);

    this.instructions = [
    {type:'ADD', cycles: 1},
    {type:'SUBD', cycles: 1},
    {type:'MULD', cycles: 1},
    {type:'DIV', cycles: 1},
    {type:'ST', cycles: 1},
    {type:'LD', cycles: 1}];

    this.registers_bank = [
    {name: 'r0', value: '0'},
    {name: 'r2', value: '0'},
    {name: 'r4', value: '0'},
    {name: 'r6', value: '0'},
    {name: 'r8', value: '0'}];

    this.instr_run = [];

    this.setRegTable = function() {
    	var defaultReg = [];
    	defaultReg.push({number:'0', busy:'', tag:'', data:''});
    	defaultReg.push({number:'2', busy:'', tag:'', data:''});
    	defaultReg.push({number:'4', busy:'', tag:'', data:''});
    	defaultReg.push({number:'6', busy:'', tag:'', data:''});
    	defaultReg.push({number:'8', busy:'', tag:'', data:''});
    	return defaultReg;
    };
    this.table_reg = this.setRegTable();

    this.setAdderTable = function() {
    	var defaultAdder = [];
    	defaultAdder.push({inst:'', number:'1', tag1:'', op1:'', tag2:'', op2:''});
    	defaultAdder.push({inst:'', number:'2', tag1:'', op1:'', tag2:'', op2:''});
    	defaultAdder.push({inst:'', number:'3', tag1:'', op1:'', tag2:'', op2:''});
    	return defaultAdder;
    };
    this.table_adder = this.setAdderTable();


	this.setMulTable = function() {
    	var defaultMul = [];
    	defaultMul.push({inst:'', number:'1', tag1:'', op1:'', tag2:'', op2:''});
    	defaultMul.push({inst:'', number:'2', tag1:'', op1:'', tag2:'', op2:''});
    	return defaultMul;
    };
    this.table_mult = this.setMulTable();


    this.select = function(field, instruction) {
        this.selectedInst[field] = instruction;
        this.updateBtns();
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
                    btnRun.removeClass("disabled");
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
            
    };

    

});


