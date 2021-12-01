const numericalKeys = document.querySelectorAll('.numerical-keys');
const operationKeys = document.querySelectorAll('.operation-keys');
const screenInput = document.querySelector('#screen-input');
const screenOutput = document.querySelector('#screen-output');
let calcOperation;
let noOfOpenBrackets = 0;
let noOfClosedBrackets = 0;
let noOfMissingBrackets = noOfOpenBrackets - noOfClosedBrackets;
const addNewValue = (newOperand) => {
    if (screenInput.innerHTML.length > 200) {
        console.log("can't enter more than 200 characters");
    } else {
        let inputSelectionStart = screenInput.selectionStart;
        let inputSelectionEnd = screenInput.selectionEnd;
        let valueReplaced = screenInput.selectionEnd - screenInput.selectionStart;
        let currentOperation = screenInput.innerHTML;
        let currentOperationArray = currentOperation.split("");
        let re = /[+÷×−]/;
        let prevValue = currentOperationArray.slice(inputSelectionStart - 1, inputSelectionStart).join('');
        let nextValue = currentOperationArray.slice(inputSelectionEnd, inputSelectionEnd + 1).join('');
        if (re.test(prevValue) && re.test(newOperand)) {
            valueReplaced = 1;
            inputSelectionStart = inputSelectionStart - 1;
        } else if (re.test(nextValue) && re.test(newOperand)) {
            valueReplaced = 1;
        }
        currentOperationArray.splice(inputSelectionStart, valueReplaced, newOperand);
        let newOperation = currentOperationArray.join("");
        calcOperation = newOperation.split('+').join('+').split('−').join('-').split('×').join('*').split('÷').join('/').split('%').join('/100');
        noOfOpenBrackets = calcOperation.replace(/[^(]/g, "").length;
        noOfClosedBrackets = calcOperation.replace(/[^)]/g, "").length;
        noOfMissingBrackets = noOfOpenBrackets - noOfClosedBrackets;
        calcOperation = calcOperation + ')'.repeat(noOfMissingBrackets);
        inputSelectionStart += newOperand.length;
        console.log(newOperand.length);
        screenInput.innerHTML = newOperation;
        screenInput.focus();
        screenInput.selectionStart = inputSelectionStart;
    }
}
operationKeys.forEach(operationKey => {
    operationKey.addEventListener('click', () => {
        if (operationKey.dataset.action === 'clear') {
            screenOutput.value = '';
            screenInput.innerText = '';
        } else if (operationKey.dataset.action === 'equate') {
            screenInput.innerText = eval(calcOperation);
            screenOutput.value = '';
        } else if (operationKey.dataset.action === 'backspace') {
            let inputSelectionStart = screenInput.selectionStart - 1;
            let inputSelectionEnd = screenInput.selectionEnd;
            let valueReplaced = inputSelectionEnd - inputSelectionStart;
            let currentOperation = screenInput.innerHTML;
            let currentOperationArray = currentOperation.split("");
            currentOperationArray.splice(inputSelectionStart, valueReplaced);
            let newOperation = currentOperationArray.join("");
            calcOperation = newOperation.split('+').join('+').split('−').join('-').split('×').join('*').split('÷').join('/').split('%').join('/100');
            inputSelectionStart;
            screenInput.innerHTML = newOperation;
            screenInput.focus();
            screenInput.selectionStart = inputSelectionStart;
        } else if (operationKey.dataset.action === 'bracket') {
            let currentOperation = screenInput.innerHTML;
            let inputSelectionStart = screenInput.selectionStart;
            let inputSelectionEnd = screenInput.selectionEnd;
            let currentOperationArray = currentOperation.split("");
            let prevValue = currentOperationArray.slice(inputSelectionStart - 1, inputSelectionStart).join('');
            let nextValue = currentOperationArray.slice(inputSelectionEnd, inputSelectionEnd + 1).join('');
            if (currentOperation.includes('(')) {
                let re = /[(+÷×−]/;
                if (re.test(prevValue)) {
                    addNewValue('(');
                } else {
                    let reg = new RegExp('^[0-9)]$');
                    if (reg.test(prevValue) && reg.test(nextValue) && noOfMissingBrackets > 0) {
                        addNewValue(')×');
                        } else if (reg.test(prevValue) && noOfMissingBrackets > 0) {
                            addNewValue(')');
                    } else {
                        addNewValue('×(');
                    }
                }
            } else {
                let re = new RegExp('^[0-9]$');
                if (re.test(prevValue)) {
                    addNewValue('×(');
                } else {
                    addNewValue('(');
                }
            }
        } else {
            addNewValue(operationKey.innerText);
        }
    })
});
function getValuePosition(str, position) {
    const n = str.substring(position).match(/^[0-9.%]+/);
    const p = str.substring(0, position).match(/[0-9.%]+$/);
    return !p && !n ? '' : (p || '') + (n || '');
}
numericalKeys.forEach(numericalKey => {
    numericalKey.addEventListener('click', () => {
        if (numericalKey.dataset.action === 'negation') {
            console.log('high');
            let inputSelectionStart = screenInput.selectionStart;
            // let inputSelectionEnd = screenInput.selectionEnd;
            let currentOperation = screenInput.innerHTML;
            let currentOperationArray = currentOperation.split("");
            let selectValue = getValuePosition(screenInput.innerHTML, screenInput.selectionStart);
            let valueIndex = currentOperation.indexOf(selectValue);
            let prevValues = currentOperationArray.slice(valueIndex - 2, valueIndex).join('');
            console.log(valueIndex);
            console.log(prevValues);
            if (prevValues === '(−') {
                currentOperationArray.splice(valueIndex - 2, 2, '');
                console.log('negated');
                inputSelectionStart -= 2;
            } else {
                currentOperationArray.splice(valueIndex, 0, '(−');
                console.log('not negated');
                inputSelectionStart += 2;
            }
            let newOperation = currentOperationArray.join("");
            screenInput.innerHTML = newOperation;
            screenInput.focus();
            screenInput.selectionStart = inputSelectionStart;
        } else if (numericalKey.dataset.action === 'decimal') {
            let inputSelectionStart = screenInput.selectionStart;
            // let inputSelectionEnd = screenInput.selectionEnd;
            let valueReplaced = screenInput.selectionEnd - screenInput.selectionStart;
            let currentOperation = screenInput.innerHTML;
            let currentOperationArray = currentOperation.split("");
            let selectValue = getValuePosition(screenInput.innerHTML, screenInput.selectionStart);
            if (!selectValue.includes('.')) {
                currentOperationArray.splice(inputSelectionStart, valueReplaced, '.');
                let newOperation = currentOperationArray.join("");
                inputSelectionStart++;
                screenInput.innerHTML = newOperation;
                screenInput.focus();
                screenInput.selectionStart = inputSelectionStart;
            }
        } else {
            addNewValue(numericalKey.innerText);
            screenOutput.value = eval(calcOperation);
        }
    })
});
screenInput.addEventListener('keydown', (e) => {
    var reg = new RegExp('^[0-9]$');
    e.preventDefault();
    if (reg.test(e.key)) {
        let keyValue = e.key.toString();
        addNewValue(keyValue);
        screenOutput.value = eval(calcOperation);
    } else {
        console.log('Please use the calculator keypad');
    }
})