document.addEventListener('DOMContentLoaded', () => {
    const diskCountSelect = document.getElementById('disk-count');
    const startButton = document.getElementById('start-button');
    const movesCounter = document.getElementById('moves-counter');
    const optimalMovesSpan = document.getElementById('optimal-moves');
    const messageDisplay = document.getElementById('message');
    const towers = document.querySelectorAll('.tower');

    let numDisks = parseInt(diskCountSelect.value);
    let moves = 0;
    let selectedDisk = null;

    /**
     * Menginisialisasi atau memulai ulang permainan.
     */
    function initGame() {
        moves = 0;
        selectedDisk = null;
        messageDisplay.textContent = '';
        messageDisplay.classList.remove('win');
        movesCounter.textContent = moves;
        
        // Menghapus semua piringan dari menara
        towers.forEach(tower => {
            while (tower.children.length > 1) { // biarkan elemen 'peg' dan 'p'
                tower.removeChild(tower.lastChild);
            }
        });

        // Membuat piringan dan menambahkannya ke piring A
        for (let i = numDisks; i > 0; i--) {
            const disk = document.createElement('div');
            disk.classList.add('disk');
            disk.style.width = `${(i / numDisks) * 80 + 20}%`; // Lebar proporsional
            disk.dataset.size = i;
            towers[0].appendChild(disk);
        }

        optimalMovesSpan.textContent = Math.pow(2, numDisks) - 1;
    }

    /**
     * Memeriksa apakah suatu langkah valid.
     * @param {Element} fromTower - Piringan asal.
     * @param {Element} toTower - Piringan tujuan.
     * @returns {boolean} True jika langkah valid, False jika tidak.
     */
    function isMoveValid(fromTower, toTower) {
        const topDiskFrom = fromTower.lastElementChild;
        const topDiskTo = toTower.lastElementChild;

        // Pastikan ada piringan untuk dipindahkan (bukan 'peg' atau 'piring A' dll.)
        if (!topDiskFrom || topDiskFrom.classList.contains('peg')) {
            return false;
        }

        // Jika piringan tujuan kosong atau piringan teratas lebih besar dari piringan yang dipilih
        if (!topDiskTo || topDiskTo.classList.contains('peg') || parseInt(topDiskTo.dataset.size) > parseInt(topDiskFrom.dataset.size)) {
            return true;
        }
        
        return false;
    }

    /**
     * Menangani klik pada piringan atau menara.
     * @param {Event} event - Objek acara klik.
     */
    function handleGameClick(event) {
        const clickedElement = event.target;
        
        // Memilih piringan
        if (clickedElement.classList.contains('disk')) {
            // Jika piringan yang sama sudah dipilih, batalkan pilihan
            if (selectedDisk && selectedDisk === clickedElement) {
                selectedDisk.classList.remove('selected');
                selectedDisk = null;
                return;
            }

            // Memastikan hanya piringan teratas yang dapat dipilih
            const parentTower = clickedElement.parentElement;
            if (parentTower.lastElementChild !== clickedElement) {
                showMessage("Piringan ini tidak dapat dipindahkan!", "error");
                return;
            }

            // Batalkan pilihan piringan sebelumnya jika ada
            if (selectedDisk) {
                selectedDisk.classList.remove('selected');
            }

            // Memilih piringan baru
            selectedDisk = clickedElement;
            selectedDisk.classList.add('selected');

        // Memindahkan piringan
        } else if (clickedElement.classList.contains('tower') || clickedElement.classList.contains('peg')) {
            if (selectedDisk) {
                const destinationTower = clickedElement.classList.contains('peg') ? clickedElement.parentElement : clickedElement;
                const originTower = selectedDisk.parentElement;

                if (isMoveValid(originTower, destinationTower)) {
                    destinationTower.appendChild(selectedDisk);
                    moves++;
                    movesCounter.textContent = moves;
                    selectedDisk.classList.remove('selected');
                    selectedDisk = null;
                    checkWin();
                } else {
                    showMessage("Aturan dilanggar! Piringan yang lebih besar tidak boleh di atas piringan yang lebih kecil.", "error");
                    selectedDisk.classList.remove('selected');
                    selectedDisk = null;
                }
            }
        }
    }

    /**
     * Menampilkan pesan kepada pengguna.
     * @param {string} text - Pesan yang akan ditampilkan.
     * @param {string} type - Tipe pesan ('win' atau 'error').
     */
    function showMessage(text, type) {
        messageDisplay.textContent = text;
        messageDisplay.className = ''; // Reset kelas
        if (type === 'win') {
            messageDisplay.classList.add('win');
        } else {
            messageDisplay.classList.add('error');
        }
    }

    /**
     * Memeriksa kondisi kemenangan.
     */
    function checkWin() {
        const targetTower = towers[2]; // Piringan C
        if (targetTower.children.length === numDisks + 1) { // +1 karena ada elemen peg
            showMessage(`🎉 Selamat! Anda memindahkan ${numDisks} panekuk dalam ${moves} langkah!`, 'win');
        }
    }

    // Event listeners
    startButton.addEventListener('click', initGame);
    diskCountSelect.addEventListener('change', (event) => {
        numDisks = parseInt(event.target.value);
        initGame();
    });
    
    document.getElementById('game-board').addEventListener('click', handleGameClick);

    // Memulai permainan saat halaman dimuat
    initGame();
});
