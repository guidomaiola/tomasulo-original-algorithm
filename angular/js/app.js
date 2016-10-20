var app = angular.module('tomasuloApp', []);


app.controller('InstController', function() {

	this.nInstruction = 1;

    this.defaultInst = {
        type: 'INSTRUCTION',
        dst: 'DST',
        op1: 'OP1',
        op2: 'OP2'
    };

    this.selectedInst = jQuery.extend(true, {}, this.defaultInst);

    this.instructions = [
    {type: 'ADD', cycles: 1},
    {type: 'SUBD', cycles: 1},
    {type: 'MULD', cycles: 1},
    {type: 'DIV', cycles: 1},
    {type: 'ST', cycles: 1},
    {type: 'LD', cycles: 1}];

    this.registers_bank = [
    {name: 'r0', value: '0'},
    {name: 'r2', value: '0'},
    {name: 'r4', value: '0'},
    {name: 'r6', value: '0'},
    {name: 'r8', value: '0'}];

    this.instr_run = [];

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

});