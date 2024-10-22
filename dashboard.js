function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    const closeBtn = document.querySelector('.close-btn');
    const hamburger = document.querySelector('.hamburger');
    const logoImg = document.querySelector('.logo-img');
    
    sidebar.classList.toggle('active');
    closeBtn.classList.toggle('active');
    hamburger.classList.toggle('hidden');
    if (sidebar.classList.contains('active')) {
        hamburger.style.display = 'none';
        logoImg.style.display = 'none';
        document.body.classList.add('no-scroll'); // Disable scroll when navbar is active
      } else {
        hamburger.style.display = 'block';
        logoImg.style.display = 'block';
        document.body.classList.remove('no-scroll'); // Re-enable scroll
    }
}
// Toggle dark mode and update text
const toggle = document.getElementById('darkModeToggle');
const darkModeText = document.getElementById('darkModeText');

toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    darkModeText.textContent = toggle.checked ? "Light mode" : "Dark mode";
});

// Select the sidebar and collapse button
const sidebar = document.querySelector('.sidebar');
const collapseButton = document.querySelector('.collapse-btn');
const dashboardContent = document.querySelector('.dashboard-content');

// Toggle the "collapsed" class on the sidebar when collapse button is clicked
collapseButton.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
        dashboardContent.style.marginLeft = '80px';
    } else {
        dashboardContent.style.marginLeft = '250px';
    }
});

// Chart.js - Column chart for event statistics
const ctx = document.getElementById('eventChart').getContext('2d');
const eventChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Event Registrations',
            data: [630, 900, 800, 400, 1000, 500, 820, 270, 820, 650, 950, 580],
            backgroundColor: '#8576FF',
            borderColor: '#8576FF',
            borderWidth: 0.5
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                },
            },
            x: {
                grid: {
                    display: true,
                },
            },
        },
        plugins: {
            legend: {
              display: false,
            },
        },
    }
});

// Image Carousel with auto-slide functionality
const slides = document.querySelector('.slides');
const prevSlide = document.querySelector('.prev-slide');
const nextSlide = document.querySelector('.next-slide');
let index = 0;
const totalSlides = document.querySelectorAll('.slide').length;

function showSlide(i) {
    slides.style.transform = `translateX(${-i * 100}%)`;
}

// Manual navigation
prevSlide.addEventListener('click', () => {
    index = (index > 0) ? index - 1 : totalSlides - 1;
    showSlide(index);
});

nextSlide.addEventListener('click', () => {
    index = (index < totalSlides - 1) ? index + 1 : 0;
    showSlide(index);
});

// Auto-slide
setInterval(() => {
    index = (index < totalSlides - 1) ? index + 1 : 0;
    showSlide(index);
}, 3000);

// fetch data
document.addEventListener("DOMContentLoaded", () => {
    let currentPage = 1; // Start on the first page
    let rowsPerPage = 10; // Show 10 rows by default

    const tableBody = document.querySelector('.event-history-table tbody');
    const modal = document.getElementById('eventModal');
    const closeModalButton = document.querySelector('.close-modal');
    const paginationNumbers = document.querySelector('.pagination-numbers');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const rowsPerPageSelect = document.getElementById('rowsPerPage');

    let data = []; // Will hold the fetched data

    // Fetch and display data
    fetch('./data.json')
      .then(response => response.json())
      .then(fetchedData => {
        data = fetchedData;
        displayData(currentPage, rowsPerPage); // Initial data display
        setupPagination(data, rowsPerPage);    // Setup pagination controls
      });

    // Function to display the correct rows based on the current page
    function displayData(page, rowsPerPage) {
        tableBody.innerHTML = ""; // Clear previous rows
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = data.slice(start, end);

        paginatedItems.forEach(event => {
            const row = document.createElement('tr');

            const eventNameCell = document.createElement('td');
            eventNameCell.textContent = event.eventName;
            const dateCell = document.createElement('td');
            dateCell.textContent = event.date;
            const speakerCell = document.createElement('td');
            speakerCell.textContent = event.speakers[0];

            // Status cell with conditional styling and icon
            const statusCell = document.createElement('td');
            if (event.status === "Completed") {
                statusCell.innerHTML = `
                    <div class="completed-status">
                        <img src="./images/EllipseCompleted.png" alt="">
                        <span>Completed</span>
                    </div>
                `;
            } else if (event.status === "In Progress") {
                statusCell.innerHTML = `
                    <div class="progress-status">
                        <img src="./images/EllipseProcess.png" alt="">
                        <span>In Progress</span>
                    </div>
                `;
            }

            row.appendChild(eventNameCell);
            row.appendChild(dateCell);
            row.appendChild(speakerCell);
            row.appendChild(statusCell);
            tableBody.appendChild(row);
            row.addEventListener('click', () => openModal(event));
        });
    }

    // Function to setup pagination
    function setupPagination(data, rowsPerPage) {
        const pageCount = Math.ceil(data.length / rowsPerPage);

        paginationNumbers.innerHTML = ''; // Clear previous pagination buttons

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('pagination-number');
            if (i === currentPage) {
                button.classList.add('active-page');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                displayData(currentPage, rowsPerPage);
                updatePagination();
            });
            paginationNumbers.appendChild(button);
        }
    }

    // Update the pagination controls (active page, next/prev buttons)
    function updatePagination() {
        document.querySelectorAll('.pagination-number').forEach(button => {
            button.classList.remove('active-page');
            if (parseInt(button.textContent) === currentPage) {
                button.classList.add('active-page');
            }
        });

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(data.length / rowsPerPage);
    }

    // Next and Previous page functionality
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayData(currentPage, rowsPerPage);
            updatePagination();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(data.length / rowsPerPage)) {
            currentPage++;
            displayData(currentPage, rowsPerPage);
            updatePagination();
        }
    });

    // Change rows per page functionality
    rowsPerPageSelect.addEventListener('change', (event) => {
        rowsPerPage = parseInt(event.target.value);
        currentPage = 1; // Reset to first page
        displayData(currentPage, rowsPerPage);
        setupPagination(data, rowsPerPage);
        updatePagination();
    });
    // Function to open the modal and populate it with event data
    function openModal(eventData) {
        // Populate modal with the event data
        document.getElementById('modalEventName').textContent = eventData.eventName;
        document.getElementById('modalEventDate').textContent = eventData.date;
        document.getElementById('modalEventDescription').textContent = eventData.description;
        document.getElementById('modalAttendees').textContent = eventData.attendees + " Attendees ";

        // Format and display speakers
        const speakersList = eventData.speakers.join(', ');
        document.getElementById('modalSpeakers').textContent = "Speakers: " + speakersList;

        // Show the modal
        modal.style.display = 'block';
    }
    // Close modal functionality
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Optional: Close the modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
        modal.style.display = 'none';
        }
    });
});

// Search functionality
const searchInput = document.getElementById('searchInput');
const eventTableBody = document.getElementById('eventTableBody');

// Listen for input event on the search box
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = eventTableBody.getElementsByTagName('tr');
    // Loop through all table rows
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let rowContainsSearchTerm = false;

        // Check if any cell in the row contains the search term
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].innerText.toLowerCase();
            if (cellText.includes(searchTerm)) {
                rowContainsSearchTerm = true;
                break;
            }
        }
        // Show or hide the row based on whether it matches the search term
        row.style.display = rowContainsSearchTerm ? '' : 'none';
    }
});

// Select the table body and date sort button
const dateSortButton = document.getElementById('dateSort');
const tableBody = document.getElementById('eventTableBody');
let sortDirection = 'asc'; // Default sort direction is ascending

// Function to sort table rows by date
function sortTableByDate() {
    // Get all the rows from the table
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Sort rows based on the date in the second column (index 1)
    rows.sort((a, b) => {
        const dateA = new Date(a.cells[1].textContent); // Extract date from first row
        const dateB = new Date(b.cells[1].textContent); // Extract date from second row

        // Compare dates depending on the current sort direction
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // Toggle sort direction for next click
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

    // Remove current rows and append sorted rows back to the table
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}

// Add event listener for date sort button
dateSortButton.addEventListener('click', sortTableByDate);


// Sorting by Status
const statusSort = document.getElementById('sortStatus');
let isAscending = true; // To toggle between ascending and descending

statusSort.addEventListener('click', () => {
    const tableBody = document.getElementById('eventTableBody');
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // Toggle between ascending and descending
    isAscending = !isAscending;

    const sortedRows = rows.sort((rowA, rowB) => {
        const statusA = rowA.querySelector('td:nth-child(4)').textContent.trim();
        const statusB = rowB.querySelector('td:nth-child(4)').textContent.trim();

        // Compare statuses
        if (isAscending) {
            return statusA.localeCompare(statusB);
        } else {
            return statusB.localeCompare(statusA);
        }
    });

    // Clear the table and append sorted rows
    tableBody.innerHTML = '';
    sortedRows.forEach(row => tableBody.appendChild(row));

    // Update the sort icon (optional)
    const dropdownSortIcon = statusSort.querySelector('.dropdownSort');
    dropdownSortIcon.style.transform = isAscending ? 'rotate(0deg)' : 'rotate(180deg)';
});

// Sort event history by name
const sortNameBtn = document.getElementById('sortName');
let nameSortOrder = sortNameBtn.getAttribute('data-sort-order'); // Ascending by default

sortNameBtn.addEventListener('click', () => {
    // Get the table body rows
    const eventTableBody = document.getElementById('eventTableBody');
    const rows = Array.from(eventTableBody.querySelectorAll('tr'));

    // Sort rows by the first column (Event Name)
    const sortedRows = rows.sort((a, b) => {
        const nameA = a.cells[0].textContent.trim().toLowerCase();
        const nameB = b.cells[0].textContent.trim().toLowerCase();

        if (nameSortOrder === 'asc') {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });

    // Reverse the sorting order for next click
    nameSortOrder = (nameSortOrder === 'asc') ? 'desc' : 'asc';
    sortNameBtn.setAttribute('data-sort-order', nameSortOrder);

    // Clear the table and append sorted rows
    eventTableBody.innerHTML = '';
    sortedRows.forEach(row => eventTableBody.appendChild(row));
});

// Function to sort table rows by the most recent date
function sortTableByDate() {
  const tableBody = document.getElementById('eventTableBody');
  const rowsArray = Array.from(tableBody.getElementsByTagName('tr'));

  // Sort rows based on date (assuming date is in the second column, index 1)
  rowsArray.sort((a, b) => {
    const dateA = new Date(a.cells[1].innerText);
    const dateB = new Date(b.cells[1].innerText);
    return dateB - dateA; // Sort in descending order (most recent first)
  });

  // Re-append sorted rows to the table body
  rowsArray.forEach(row => tableBody.appendChild(row));
}

// Add event listener to "Most Recent" sort option
const mostRecentSort = document.getElementById('mostRecentSort');
mostRecentSort.addEventListener('click', () => {
  sortTableByDate();
});

// Function to export data as CSV
function exportTableToCSV(filename) {
    let csv = [];
    const rows = document.querySelectorAll('table tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        let csvRow = [];
        cols.forEach(col => csvRow.push(col.innerText));
        csv.push(csvRow.join(","));
    });

    // Create CSV file
    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Add event listener to the Export button
document.getElementById("exportButton").addEventListener("click", function () {
    exportTableToCSV('event-history.csv');
});
