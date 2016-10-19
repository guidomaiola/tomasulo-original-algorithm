var app = angular.module('tomasuloApp', []);


	app.controller('InstController', function InstController($scope) {

		$scope.defaultInst = {type:'Instruction', dst:'Destination', op1:'Operator 1', op2:'Operator 2'};

		$scope.setSelectedInstAsDefault = function() {
			return jQuery.extend(true, {}, $scope.defaultInst);
		};

		$scope.selectedInst = $scope.setSelectedInstAsDefault();

		$scope.instructions = [
      		{type:'ADD', cycles:1},
      		{type:'SUBD', cycles:1},
      		{type:'MULD', cycles:1},
      		{type:'DIV', cycles:1},
      		{type:'ST', cycles:1},
      		{type:'LD', cycles:1}];

      	$scope.registers_bank = [
      		{name:'R0', value:'0'},
      		{name:'R2', value:'0'},
      		{name:'R4', value:'0'},
      		{name:'R6', value:'0'},
      		{name:'R8', value:'0'}];

      	/** {number,type,dst,op1,op2} **/
      	$scope.instr_run= [
      		{number:'S1', type:'ADD', dst:'R0', op1:'R2', op2:'R4'},
      		{number:'S2', type:'SUBD', dst:'R2', op1:'R2', op2:'R4'}];


		$scope.select = function(field, instruction) {

			$scope.selectedInst[field] = instruction;
			updateBtnAdd();
      	};

      	$scope.isDefault = function() {
      		var selected = $scope.selectedInst;
			var def = $scope.defaultInst;
      		return (selected.type != def.type) && (selected.dst != def.dst) && (selected.op1 != def.op1) && (selected.op2 != def.op2);
      	};

      	$scope.updateBtnAdd = function() {
			
			var btnAdd = $('#btn-add');

			if (!isDefault()) {
				if (btnAdd.hasClass("disabled"))
					btnAdd.removeClass("disabled");
			} else {
				if (!btnAdd.hasClass("disabled"))
					btnAdd.addClass("disabled");
			}
		};

		$scope.putInstInTable = function() {

		};


	});