let p;
let PRONOUNS = {
	  'female': {
	    'subjective': 'she',
	    'objective' : 'her',
	    'possessive': 'her',
	    'reflexive' : 'herself'
	  }, 
	  'male': {
	    'subjective': 'he',
	    'objective' : 'him',
	    'possessive': 'his',
	    'reflexive' : 'himself'        
	  }    
  };
$("#submit").click(function (){
	let arr = $('textarea').val().split("\n")
	renderer(arr);
});

function renderer(arr){
	for (let i = 0; i < arr.length ; i++) {
	let report =arr[i];
		if (report.length> 50) {	
			let modified = beginTest(report)
			console.log(modified);
			if (modified.highlighted[0].includes("span")) {
				$('.main').append(`<h4>${modified.highlighted[1]}</h4>`);
			}else{
				$('.main').append(`<h4>${modified.highlighted[0]}</h4>`);
			}
			let fixed = fixer(modified.highlighted.join(' '))
			$('.main').append(`<p>${fixed}</p>`);
		}	
	}
}
function fixer(str){
	let fixed = "";
	for (let i = 0; i < str.length; i++) {
		if (str[i] === "," || str[i] ==="."){
			fixed = fixed.slice(0, -1)
			fixed += str[i];
		} 
		else {
			fixed += str[i];
		}
		
	}
	return fixed;
}

function splitter(string) {
  const arr = [];
  let word = "";

  for (let char of string) {
    if (char === " ") {
      arr.push(word);
      word = "";
    } else if (char === "." || char === ",") {
      arr.push(word);
      arr.push(char);
      word = "";
    } else {
      word += char;
    }
  }
  return arr;
}


function beginTest(report){
	
	// let old = report.split(/[., ]/);

	let words = splitter(report);

	let pronoun = genderCheck(report, words);

	let sortedWords = words.map(el=> el.toLowerCase()).slice(0).sort();

	let ignoreWords = ["is", "the", "this", "a","an", "in", "to", "as", "and", "of", "be", 'she','her','her','herself','he','him','his','himself','.',',']
	let duplicateWords = [];
	let highlighted = [];
	for (let i = 0; i < sortedWords.length - 1; i++) {
	   if ((sortedWords[i + 1]) == (sortedWords[i]) && !ignoreWords.includes(sortedWords[i].toLowerCase())) {
	       duplicateWords.push(sortedWords[i]);
	    }
	   if(pronoun.includes(sortedWords[i].toLowerCase())) {
	   	duplicateWords.push(sortedWords[i]);
	   } 
	}
	console.log(duplicateWords);
	let m = [];
	duplicateWords =$.unique(duplicateWords);
	for (let j = 0, m = []; j < words.length; j++) {
	   m.push($.inArray(words[j].toLowerCase(),duplicateWords) > -1);
	   if (!m[j] && m[j - 1])
	        highlighted.push('</span>');
	    else if (m[j] && !m[j - 1])
	        highlighted.push('<span class="duplicate">');
	    highlighted.push(words[j]);
	}
	
	return {
		pronoun:pronoun,
		highlighted:highlighted,
	};
	// console.log(duplicateWords, highlighted)
	// p += $('p').html(highlighted.join(' '));
}

function genderCheck(report, words) {
	let gender;
	let sentences = report.split(".");



	name = words[0];
	let males = words.filter((el) => Object.values(PRONOUNS.male).includes(el.toLowerCase()))
	let females = words.filter((el) => Object.values(PRONOUNS.female).includes(el.toLowerCase()))

	console.log(males,females);
	if (males.length>females.length){
		gender = true;
		if(females.length>0){
			return females.map(el=> el.toLowerCase());
		}
	}
	else if (females.length>males.length){
		gender = false;
		if(males.length>0){
			return males.map(el=> el.toLowerCase());
		}
	}


	else{
		return [];
	}

	return [];
}









