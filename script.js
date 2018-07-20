
let gArrWords = [];
let gCtnWords = 0;
let gflShowWords = true;

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function checkValidFile(data) {

    let arrWords = data.split('\n'); // все слова разбиваем по переносу строки

    for (let i = 0; i < arrWords.length; i++) {
       if ( ! /^.*[A-Za-zА-Яа-я0-9ё]+.* \-\- .*[A-Za-zА-Яа-я0-9ё]+.*$/i.test(arrWords[i].trim()) ) {
           alert(`error str: ${i+1} \n ${arrWords[i]} `);
       }
    }
}

function openFile() {

    gArrWords = [];
    gCtnWords = 0;
    gflShowWords = true;


    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = function () {
        let fr = new FileReader();

        fr.onload = function (info) {
            //--------< init >--------
            gArrWords = [];
            view.print("showOllWords","");
            //------------------------
            checkValidFile(info.target.result);
            main(info.target.result);
        };
        fr.readAsText(this.files[0]);
    };

    input.click();

}

function main(data) {

    showOllWords(data);
    let arrWords = data.split('\n'); // все слова разбиваем по переносу строки

    //---< init >----
    let j = 0;
    for(let i=0; i<arrWords.length; i++) {
        if( ! /^.+\*\* *$/i.test(arrWords[i].trim()) ) {
            gArrWords[j] = arrWords[i];
            j++;
        }
    }
    shuffle(gArrWords);  // перетасовуем слова
    let arr = gArrWords[gCtnWords].split('--');
    view.print("word-learn", arr[1].trim());
}

//-------------< if onkeydown Enter >-------------
document.onkeydown = function checkKeycode(e) {
    if(e.which == 13) {clickForm();}
    if(e.which == 38) { SkipWord();}
}

function clickForm() {

    if(gArrWords[gCtnWords] !== undefined) {

        let e = document.getElementById("find");
        e.focus(); // при нажатии на кнопку отправки формы не теряеться фокус формы
        let arr = gArrWords[gCtnWords].split('--');
        let enWord = arr[0].trim();
        let ruWord = arr[1].trim();
        let inputWord = e.value.trim();

        if (enWord == inputWord) {
            view.print('compared', `Правильно! &nbsp; &nbsp; ${'\t'} ${ruWord} - ${inputWord}`);
            document.getElementById('find').value = "";
        } else {
            view.print('compared', `Не правильно`);
            gCtnWords--;
        }

        let RemLastWord = gArrWords[gCtnWords];
        gCtnWords++;
        if (gCtnWords + 1 >= gArrWords.length) {
            gCtnWords = 0;
            shuffle(gArrWords);  // перетасовуем слова
            // что бы не было повтореня слов
            if (RemLastWord == gArrWords[gCtnWords]) {
                gCtnWords++;
            }

            let arr = gArrWords[gCtnWords].split('--');
            view.print("word-learn", arr[1].trim());
        }

        arr = gArrWords[gCtnWords].split('--');
        ruWord = arr[1].trim();
        view.print('word-learn', ruWord);

        view.print("showCurrentWord", "");
        gCtnLetter = 0;
        gFlShowCurrentWord = false;
    }

}

function SkipWord() {

    if(gArrWords[gCtnWords] !== undefined) {

        let RemLastWord = gArrWords[gCtnWords];
        gCtnWords++;
        if (gCtnWords >= gArrWords.length) {
            gCtnWords = 0;
            shuffle(gArrWords);  // перетасовуем слова
            // что бы не было повтореня слов
            if (RemLastWord == gArrWords[gCtnWords]) {
                gCtnWords++;
            }
            let arr = gArrWords[gCtnWords].split('--');
            view.print("word-learn", arr[1].trim());
        }

        let arr = gArrWords[gCtnWords].split('--');
        view.print("word-learn", arr[1].trim());
        document.getElementById('find').value = "";
        view.print("showCurrentWord", "");
        gCtnLetter = 0;
        gFlShowCurrentWord = false;
    }
}

function ClickShowOllWords() {

    if(gflShowWords == true) {
        gflShowWords = false;
        document.getElementById("showOllWords").style.display = "none";
        view.print("showOrHideWords", "Show");
    } else {
        gflShowWords = true;
        document.getElementById("showOllWords").style.display = "block";
        view.print("showOrHideWords", "Hide");
    }
}

function showOllWords(data) {

    let arrWords = data.split('\n'); // все слова разбиваем по переносу строки

    for (let i = 0; i < arrWords.length; i++) {
        if (!/^.+\*\* *$/i.test(arrWords[i].trim())) {
            let arr = arrWords[i].split('--');
            let enWord = ` ${arr[0].trim()} `; // пробели по краях для переводчика(2 клик)
            let ruWord = ` ${arr[1].trim()} `;
            view.showOllWords(enWord, ruWord);
        }
    }
}

//-----< show current word >-------------
let gFlShowCurrentWord = false;

function showCurrentWord() {
    if(gArrWords[gCtnWords] !== undefined) {
        if (gFlShowCurrentWord == true) {
            gFlShowCurrentWord = false;
            view.print("showCurrentWord", "");

        } else {
            gFlShowCurrentWord = true;
            let arr = gArrWords[gCtnWords].split('--');
            view.print("showCurrentWord", arr[0]);
        }
    }
}

let gCtnLetter = 0;

function letter() {
    if(gArrWords[gCtnWords] !== undefined) {
        gCtnLetter++;
        let arr = gArrWords[gCtnWords].split('--');
        let arrChar = arr[0].split('');
        let partStr = "";
        for(let i=0; i<gCtnLetter; i++) {
            if(arrChar[i] !== undefined) {
                partStr += arrChar[i];
            }
        }
        view.print("showCurrentWord", partStr);
    }
}


class View {

   print(id, value) {
       document.getElementById(id).innerHTML = value;
   }

    showOllWords(enWord, ruWord) {
        let div_right = document.createElement("div");
        let div_left = document.createElement("div");
        let div_str = document.createElement("div");

        div_right.className = "showOllWords_right";
        div_left.className = "showOllWords_left";
        div_str.className = "showOllWords_str";

        div_right.innerHTML = enWord;
        div_left.innerHTML = ruWord;
        div_str.appendChild(div_right);
        div_str.appendChild(div_left);

        document.getElementById("showOllWords").appendChild(div_str);
    }
}

let view = new View();

















