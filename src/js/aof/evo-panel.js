/**
 * @author Kate Compton
 *
 * Evolutionary algorithm functions
 */

function EvoPanel() {
	var panel = this;

	this.winnerSlots = [];

	// Create winner slots
	for (var i = 0; i < app.winnerSlots; i++) {
		this.winnerSlots[i] = {
			div : $("<div/>", {
				class : "subpanel winner-slot",
			}).appendTo($("#winner-slots"))
		};
	}

	$.each(this.winnerSlots, function(index, slot) {
		slot.div.droppable({
			activeClass : "section-active",
			hoverClass : "section-hover",
			drop : function(event, ui) {
				addToWinnerSlot(index, panel.draggedSlot);
				panel.draggedSlot = undefined;
			}
		});
	});

	function addToWinnerSlot(index, fromSlot) {
		console.log(index + " ", fromSlot);
		panel.winnerSlots[index].fromSlot = fromSlot;
		panel.winnerSlots[index].individual = fromSlot.individual;
		panel.winnerSlots[index].div.css({
			backgroundImage : "url(" + fromSlot.dataURL + ")"
		});

	};

	app.showDNA = true;
	$("#toggle-dna").click(function() {
		app.showDNA = !app.showDNA;
		console.log(app.showDNA);
		if (app.showDNA)
			$(".overlay-content").show();
		else
			$(".overlay-content").hide();
	});
	$("#toggle-forces").click(function() {
		app.showForces = !app.showForces;

	});

	$("#reroll").click(function() {
		app.population.reroll();
		updatePopulationUI();
	});

	$("#mut-chance").slider({
		value : app.mutationChance,
		min : 0,
		max : 1,
		step : .02,
		slide : function(event, ui) {
			console.log("mutationChance: " + ui.value);
			app.mutationChance = ui.value;
		}
	});

	$("#mut-amt").slider({
		value : app.mutationAmt,
		min : 0,
		max : .2,
		step : .01,
		slide : function(event, ui) {
			console.log("mutationAmt: " + ui.value);
			app.mutationAmt = ui.value;
		}
	});

	$("#nextgen").click(function() {
		var evolutionType = $("input[name=evomode]:checked").val();
		console.log(evolutionType);

		var nextGeneration = [];

		var allParents = app.population.individuals;

		switch(evolutionType) {
		case("random") :
			for (var i = 0; i < app.popCount; i++) {
				var randomDNA = app.population.createDNA();
				nextGeneration[i] = app.population.dnaToIndividual(randomDNA);
			}
			break;
		case("mutateAll") :
			console.log("Mutate all parents into new children");
			for (var i = 0; i < app.popCount; i++) {
				var childDNA = allParents[i].dna.createMutant(app.mutationAmt, app.mutationChance);
				nextGeneration[i] = app.population.dnaToIndividual(childDNA);
			}
			break;

		case("mutateWinners") :
			console.log("Mutate all winners into new children");
			// Get all the winners
			var winners = app.evoPanel.winnerSlots.map(function(slot) {
				return slot.individual;
			}).filter(function(winner) {
				return winner !== undefined;
			});

			// Create children from the parents.  At least one chid from each parent,
			//  but the rest can select a random parent from the winner list
			for (var i = 0; i < app.popCount; i++) {
				var parent = winners[i];

				// pick a random parent for extra children
				if (i >= winners.length) {
					parent = winners[Math.floor(winners.length * Math.random())];
				}
				var childDNA = parent.dna.createMutant(app.mutationAmt, app.mutationChance);
				nextGeneration[i] = app.population.dnaToIndividual(childDNA);

			}

			break;
		case("breedWinners") :
			var winners = app.evoPanel.winnerSlots.map(function(slot) {
				return slot.individual;
			}).filter(function(winner) {
				return winner !== undefined;
			});

			// Pick parents randomly from winners, and crossover their DNA to create a new child
			for (var i = 0; i < app.popCount; i++) {
				var rawDNA0 = winners[Math.floor(winners.length * Math.random())].dna.values;
				var rawDNA1 = winners[Math.floor(winners.length * Math.random())].dna.values;
                            // commit bounds
			    
				//console.log(rawDNA0[0])
				

                            // commit bounds
				/*
				 * TODO: Replace this with real crossover
				 * The raw DNA is just an array of floats [0,1]
				 * Use that to fill in the childDNA with the right values
				 */
                            // commit bounds
                            
				var childDNA = app.population.createDNA();
				for (var j = 0; j < childDNA.values.length; j++) {
					childDNA.values[j] = Math.random();
				}
				
				nextGeneration[i] = app.population.dnaToIndividual(childDNA);
                            // commit bounds
                            
				 
				 // crossover
				var childDNA1 = app.population.createDNA();
				var childDNA2 = app.population.createDNA();
				
				var crossoverPoint = Math.floor(Math.random() * childDNA1.values.length);
				 
				
				for (var j = 0; j < childDNA1.values.length; j++) {
					if (j < crossoverPoint) {
						childDNA1.values[j] = rawDNA0[j]
						childDNA2.values[j] = rawDNA1[j]
					}
					else {
						childDNA1.values[j] = rawDNA1[j]
						childDNA2.values[j] = rawDNA0[j]
					}
					 
				}
				
				nextGeneration[i] = app.population.dnaToIndividual(childDNA1);
				i++;
				nextGeneration[i] = app.population.dnaToIndividual(childDNA2);

                            // commit bounds
			
			}

			break;

		/*
		 * Create two new kinds new breeding behavior
		 * Combine mutation with crossover?
		 * The aesthetic DNA is at indicies 0-9, and the behavior DNA is at indicies 10-19
		 * Can you use that information somehow?
		 */
		case("custom1") :
			break;
		case("custom2") :
			break;
		};

		app.population.individuals = nextGeneration;
		app.evoPanel.clearWinners();
		updatePopulationUI();
	});

	$("#set-winners").click(function() {
		/*
		 *
		 *
		 */
            /*
		var sorted = app.population.individuals.sort(function(a, b) {
			return b.food - a.food;
		});
            */
            
		for (var i = 0; i < 3; i++) {
			app.evoPanel.addToWinners(sorted[i], i);
		var scores = [];
		var maxFood = 0;

		for (var i = 0; i < app.popCount; i++) {
			scores[i] = app.population.individuals[i].food;
			if (scores[i] > maxFood)
				maxFood = scores[i];
		}
		var weightedScores = {};
		for (var i = 0; i < app.popCount; i++) {
			// add weighted food scores (50%)
			weightedScores[i] = scores[i]/maxFood * 50;

		    // add weighted color scores (25%)
                    // base it on deviation
                    var col_diff = Math.abs(app.population.individuals[i].hue0 - app.population.individuals[i].hue1);
                    // if col_diff == 0.5
                    // weight = 1 - (0.5 - col_diff)
                    // weight = 1 - (0.5 - 0.5)
                    // weight = 1 - (0)
                    // weight = 1
                    // weight = weight * 25
                    var col_uniq = Math.abs(0.5 - col_diff);
                    col_uniq = 1 - col_uniq;
                    col_uniq = col_uniq * 25;
                    weightedScores[i] += col_uniq;
                    
                    
			



			// add weighted flap scores (25%)
			weightedScores[i] += app.population.individuals[i].dna.values[12] * 25;
		}
		/*var sorted = app.population.individuals.sort(function(a, b) {
			return b.food - a.food;
		});*/
		for (var i = 0; i < 3; i++) {
			var maxScore = 0;
			var maxKey = -1;
			for (var key in weightedScores) {
				if (maxScore < weightedScores[key]) {
					maxScore = weightedScores[key];
					maxKey = key;
				}
			}
			app.evoPanel.addToWinners(app.population.individuals[maxKey], i);
		    delete weightedScores[maxKey]
		}
	        }
        });

EvoPanel.prototype.clearWinners = function() {
	for (var i = 0; i < this.winnerSlots.length; i++) {
		this.winnerSlots[i].div.css({
			backgroundImage : "none"
		});
		this.winnerSlots[i].individual = undefined;
	}
};

EvoPanel.prototype.addToWinners = function(individual, index) {
	this.winnerSlots[index].div.css({
		backgroundImage : "url(" + individual.thumbnailURL + ")",
		backgroundSize : "100%"
	});
	this.winnerSlots[index].individual = individual;
}
};
    
