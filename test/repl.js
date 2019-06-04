const Hand = require('pokersolver').Hand;
//qs, kh, jd, th, 1s
var inquirer = require('inquirer');

function inquire(){
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'userHand',
        message: 'Enter a set of comma separated cards...',
        default: 'qs, kh, jd, th, 1s'
      },
    ])
    .then(answers => {

      console.log(answers.userHand);
      const cards = answers.userHand.split(',').map(s=>s.replace(' ',''));
      const solution = Hand.solve(cards);
      console.log(solution.name)
      console.log(solution.descr)
      console.log(solution.cards.join(','));
      // Use user feedback for... whatever!!
      inquire();
    });
  }

inquire();
