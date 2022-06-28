import { el } from 'redom';

export default function autocomplete(inp) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  let currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener('input', (e) => {
    const key = sessionStorage.userToken;
    const arr = localStorage[key].split(',');
    const inputValue = e.target.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!inputValue) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    const autocompleteList = el('div', {
      id: e.target.id + '-autocomplete-list',
      class: 'autocomplete__list',
    });
    /*append the DIV element as a child of the autocomplete container:*/
    e.target.parentNode.append(autocompleteList);
    /*for each item in the array...*/
    for (let i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, inputValue.length) === inputValue) {
        /*create a DIV element for each matching element:*/
        const autocompleteItem = el('div', {
          class: 'autocomplete__item',
          /*make the matching letters bold:*/
          innerHTML: `<strong>${arr[i].substr(
            0,
            inputValue.length
          )}</strong>${arr[i].substr(inputValue.length)}`,
        });
        /*insert a input field that will hold the current array item's value:*/
        autocompleteItem.dataset.value = arr[i];
        /*execute a function when someone clicks on the item value (DIV element):*/
        autocompleteItem.addEventListener('click', (e) => {
          /*insert the value for the autocomplete text field:*/
          inp.value = e.target.dataset.value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        autocompleteList.append(autocompleteItem);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener('keydown', function (e) {
    let x = document.getElementById(e.target.id + '-autocomplete-list');
    if (x) x = x.getElementsByTagName('div');
    if (e.keyCode === 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add('autocomplete__item_active');
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove('autocomplete__item_active');
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    let x = document.getElementsByClassName('autocomplete__list');
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener('click', function (e) {
    closeAllLists(e.target);
  });
}
