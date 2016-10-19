var app = angular.module('tomasuloApp', []);


app.controller('InstController', function() {

	this.nInstruction = 1;

    this.defaultInst = {
        type: 'Instruction',
        dst: 'Destination',
        op1: 'Operator 1',
        op2: 'Operator 2'
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
    {name: 'R0', value: '0'},
    {name: 'R2', value: '0'},
    {name: 'R4', value: '0'},
    {name: 'R6', value: '0'},
    {name: 'R8', value: '0'}];

    this.instr_run = [
    {
        number: 'S0',
        type: 'ADD',
        dst: 'R0',
        op1: 'R2',
        op2: 'R4'
    }];


    this.select = function(field, instruction) {
        this.selectedInst[field] = instruction;
        this.updateBtnAdd();
    };

    this.allSet = function() {
        var selected = this.selectedInst;
        var def = this.defaultInst;
        return !((selected.type != def.type) && (selected.dst != def.dst) && (selected.op1 != def.op1) && (selected.op2 != def.op2));
    };

    this.updateBtnAdd = function() {

        var btnAdd = $('#btn-add');

        if (!this.allSet()) {
            if (btnAdd.hasClass("disabled"))
                btnAdd.removeClass("disabled");
        } else {
            if (!btnAdd.hasClass("disabled"))
                btnAdd.addClass("disabled");
        }
    };

    this.putInstInTable = function() {
    	this.selectedInst['number'] = 'S'+ this.nInstruction;
    	this.instr_run.push(this.selectedInst);
    	this.nInstruction++;
    	this.selectedInst = jQuery.extend(true, {}, this.defaultInst);
    	this.updateBtnAdd();
    };


});