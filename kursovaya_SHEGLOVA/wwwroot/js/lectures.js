document.addEventListener("DOMContentLoaded", function () {
    // Функция для плавного появления контента
    const mainContent = document.getElementById('main-content');
    mainContent.style.opacity = 1; // Устанавливаем непрозрачность в 1


    const lectureList = document.getElementById('lectureList');
    const pdfCanvas = document.getElementById('pdfCanvas');
    const pdfContainer = document.getElementById('pdfContainer');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    let pdfDoc = null;
    let currentPage = 1;
    let numPages = 0;

    function renderPage(pageNumber) {
        pdfDoc.getPage(pageNumber).then(function (page) {
            const viewport = page.getViewport({ scale: 1 });
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;
            const context = pdfCanvas.getContext('2d');
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);

            currentPage = pageNumber;
            pageInfo.textContent = `Страница ${currentPage} из ${numPages}`;
        });
    }
    function prevPage() {
        if (pdfDoc && currentPage > 1) {
            renderPage(currentPage - 1);
        }
    }

    function nextPage() {
        if (pdfDoc && currentPage < numPages) {
            renderPage(currentPage + 1);
        }
    }

    prevPageButton.addEventListener("click", prevPage)
    nextPageButton.addEventListener("click", nextPage)


    function loadPdf(pdfPath) {
        pdfjsLib.getDocument(pdfPath).promise.then(function (pdf) {
            pdfDoc = pdf;
            numPages = pdf.numPages
            pageInfo.textContent = `Страница ${currentPage} из ${numPages}`;
            pdfContainer.style.display = 'block';
            renderPage(currentPage);
        }).catch(function (error) {
            console.error('Error loading PDF:', error);
            pdfContainer.style.display = 'none';
            alert('Ошибка при загрузке PDF-файла.');
        });
    }
    function displayLectures(lectures) {
        lectureList.innerHTML = '';
        lectures.forEach(lecture => {
            const lectureItem = document.createElement('div');
            lectureItem.classList.add('lecture-item');
            lectureItem.innerText = lecture.fileName;
            lectureItem.addEventListener('click', () => {
                const currentActive = document.querySelector('.lecture-item.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                lectureItem.classList.add('active');
                loadPdf(lecture.filePath);
            })
            lectureList.appendChild(lectureItem);
        });
    }
    async function fetchLectures() {
        try {
            const response = await fetch('/api/Pdf/GetLectures');
            if (!response.ok) {
                alert("Ошибка при получении списка лекций")
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayLectures(data)
        }
        catch (error) {
            console.error("Ошибка при загрузке лекций:", error);
            alert('Ошибка при загрузке списка лекций.');
        }
    }

    fetchLectures();


    // Переключение темы
    const toggleThemeButton = document.getElementById('toggleTheme');
    toggleThemeButton.onclick = () => {
        document.body.classList.toggle('dark-mode'); // Переключаем класс для темной темы
        toggleThemeButton.innerText = document.body.classList.contains('dark-mode') ? 'Переключить на светлую тему' : 'Переключить на темную тему'; // Меняем текст кнопки
    };
});