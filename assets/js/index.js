const $inputForm = document.querySelector('#input-form');
const $input = document.querySelector('#input');
const $output = document.querySelector('#output');
const $preview = document.querySelector('#preview');
const $iconState = document.querySelector('#icon-state');
const $iconClearHistory = document.querySelector('#icon-clear-history');
$iconState.style.display = 'none';
$iconClearHistory.style.display = 'none';

renderHistory();

$inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $preview.innerHTML = "";
    const htmlTagIcon = $input.value;
    $preview.innerHTML = htmlTagIcon;
    $output.innerHTML = "";
    $iconState.removeEventListener('click', copyToClipboard);
    $iconState.style.display = 'none';
    $iconState.classList.remove('zoom-in');
    $iconState.classList.remove('zoom-out');
    const checkSVG = setInterval(() => {
        if ($preview.innerHTML.includes('<svg')) {
            saveHistory(htmlTagIcon);
            const regex = /<!--(.*)-->/g;
            const text = $preview.innerHTML.replace(regex, '');
            $output.innerHTML = text;
            $iconState.style.display = 'inline-block';
            $iconState.addEventListener('click', () => copyToClipboard(text));
            clearInterval(checkSVG);
        }
    }, 100);
    $input.value = '';
    $input.focus();
});

function copyToClipboard(text) {
    $iconState.classList.remove('zoom-in');
    $iconState.classList.remove('zoom-out');
    $iconState.innerHTML = '<i class="fa-solid fa-spinner-third fa-spin"></i>';
    navigator.clipboard.writeText(text).then(function () {
        $iconState.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
    }, function (err) {
        $iconState.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    }).finally(() => {
        $iconState.classList.add('zoom-in');
        setTimeout(() => {
            $iconState.classList.remove('zoom-in');
            setTimeout(() => {
                $iconState.classList.add('zoom-out');
                $iconState.innerHTML = '<i class="fa-solid fa-copy"></i>';
            }, 2000);
        }, 1000);
    });
}

function saveHistory(htmlTagIcon) {
    const history = localStorage.getItem('history');
    if (history) {
        const historyArray = JSON.parse(history);
        if (historyArray.includes(htmlTagIcon)) {
            return;
        }
        historyArray.push(htmlTagIcon);
        localStorage.setItem('history', JSON.stringify(historyArray));
    } else {
        const historyArray = [];
        historyArray.push(htmlTagIcon);
        localStorage.setItem('history', JSON.stringify(historyArray));
    }
    renderHistory();
}

function renderHistory() {
    const history = localStorage.getItem('history');
    const $historyList = document.querySelector('#history-list');
    $historyList.innerHTML = '';
    if (history) {
        const historyArray = JSON.parse(history).reverse();
        if(historyArray.length > 0) {
            historyArray.forEach((htmlTagIcon) => {
                const $item = document.createElement('button');
                $item.classList.add('history-item', 'nostyle');
                $item.setAttribute('tag-origin', ''+htmlTagIcon);
                $item.addEventListener('click', innerInputAndSubmit);
                $item.innerHTML = htmlTagIcon;
                $historyList.appendChild($item);
            });
            $iconClearHistory.style.display = 'inline-block';
            $iconClearHistory.addEventListener('click', clearHistory);
        } else $historyList.innerHTML = '<p class="text-center italic w-100">Seus ícones pesquisados aparecerão aqui.</p>';
    } else $historyList.innerHTML = '<p class="text-center italic w-100">Seus ícones pesquisados aparecerão aqui.</p>';
}

function innerInputAndSubmit() {
    const htmlTagIcon = this.getAttribute('tag-origin');
    $input.value = htmlTagIcon;
    $inputForm.querySelector('button[type="submit"]').click();
}

function clearHistory() {
    localStorage.removeItem('history');
    $iconClearHistory.style.display = 'none';
    renderHistory();
}