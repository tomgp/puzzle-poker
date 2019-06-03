const Hand = require('pokersolver').Hand;
//qs, kh, jd, th, 1s
var inquirer = require('inquirer');
inquirer
  .prompt([
    {
      type: 'input',
      name: 'userHand',
      message: 'Enter a set of comma separated cards... (eg qs, kh, jd, th, 1s)',
      default: 'qs, kh, jd, th, 1s'
    },
  ])
  .then(answers => {

    console.log(answers.userHand);
    const cards = answers.userHand.split(',').map(s=>s.replace(' ',''));
    console.log(Hand.solve(cards).name);
    // Use user feedback for... whatever!!
  });