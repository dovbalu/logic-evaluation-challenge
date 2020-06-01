import conditionInput from './condition.json'

/** 
 * Evaluate a condition against the context.
 * @param condition A domain-specific language (DSL) JSON object.
 * @param context An object of keys and values
 * @return boolean
 */

function evaluate(
    condition: typeof conditionInput,
    context: {
        [key: string]: string | undefined
    }
): boolean {
    //evaluate first level blocks
    return runEvaluation(condition, evaluateSingleBlock)

    //util function to keep things DRY
    function runEvaluation(condition: any, fn: any) {
        const[operator, ...rest] = condition;
        //run evaluation function using `some` or `every` on array of conditions
        return [...rest][operator === 'OR' ? "some" : "every"](fn)
    }
  
    function evaluateSingleBlock(conditionBlock: any) {
        return runEvaluation(conditionBlock, evaluateSingleCondition)
    }

    function evaluateSingleCondition(singleCondition: any) {
        const[operator, key, value] = singleCondition;
        if (operator === '==') {
            return context[key.substring(1)] === value;
        } else if (operator === '!=') {
            return context[key.substring(1)] !== value;
        } else { //inner block
            return runEvaluation(singleCondition, evaluateSingleBlock)
        }
    }
    return false
}

/**
 * Click "run" to execute the test cases, which should pass after your implementation.
 */
(function() {
    const cases = [{
        'context': {
            'State': 'Alabama',
            'Profession': 'Software development'
        },
        'expected': true
    }, {
        'context': {
            'State': 'Texas'
        },
        'expected': true
    }, {
        'context': {
            'State': 'Alabama',
            'Profession': 'Gaming'
        },
        'expected': false
    }, {
        'context': {
            'State': 'Utah'
        },
        'expected': false
    }, {
        'context': {
            'Profession': 'Town crier'
        },
        'expected': false
    }, {
        'context': {
            'Profession': 'Tradesperson'
        },
        'expected': true
    }]

    for (const c of cases) {
        const actual = evaluate(conditionInput, c.context)
        console.log(actual === c.expected ? 'yay :-)' : 'nay :-(')
    }
})()