const express = require('express');
const app = express();
const axios = require('axios'); // Use Axios for making HTTP requests to backend

app.use(express.json());
app.use(express.static('public')); // Serve static files (e.g., your HTML, CSS, JavaScript)

// Serve the main page
app.get('/', async (req, res) => {
  try {
    // Fetch the last 10 entries from the backend
    const response = await axios.get('http://backend-service.backend.svc.cluster.local/entries');
    const entries = response.data; // Get entries from the response

    // Render the HTML with the fetched entries
    const indexHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Frontend App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
        <style>
            body {
                background-color: #e9ecef;
                padding-top: 50px;
            }
            .dark-mode {
                background-color: #2c2c2c;
                color: white;
            }
            .dark-mode .container, .dark-mode .entries-container, .dark-mode .form-container {
                background-color: #3c3c3c;
                border-color: #555;
            }
            .dark-mode .card-header, .dark-mode .separator {
                background-color: #007bff;
            }
            .dark-mode .alert {
                color: black;
            }
            .container {
                max-width: 600px;
            }
            .card {
                margin-top: 20px;
                border: 1px solid #ddd;
            }
            .card-header {
                background-color: #007bff;
                color: white;
            }
            .entries-container {
                margin-top: 40px;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                width: 100%;
            }
            .entries-container h5 {
                margin-bottom: 20px;
                font-size: 1.5em;
            }
            .entries-container table {
                width: 100%;
                font-size: 1.2em;
            }
            .entries-container th, .entries-container td {
                padding: 10px;
                border: 1px solid #ddd;
            }
            .entries-container tr:nth-child(even) {
                background-color: #f8f9fa;
            }
            .dark-mode .entries-container tr:nth-child(even) {
                background-color: #4c4c4c;
            }
            .alert {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            .separator {
                border-top: 3px solid #007bff;
                margin-top: 40px;
                margin-bottom: 20px;
            }
            .title {
                text-align: center;
                color: #28a745; /* Bright green color */
                margin-bottom: 20px;
                font-size: 2em;
            }
            .form-container {
                border: 2px solid #87CEEB; /* Sky blue color */
                border-radius: 5px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                background-color: #fff;
            }
            .dark-mode .form-container {
                background-color: #3c3c3c;
                border-color: #555;
            }
            .form-container label {
                font-weight: bold;
            }
            .dark-mode .form-container label {
                color: white;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">Welcome to EKS TechTalk...!!</h1>
            <div class="text-right mb-3">
                <label for="darkModeToggle">Dark Mode</label>
                <input type="checkbox" id="darkModeToggle">
            </div>
            <div class="form-container">
                <h2 class="text-center">User Information</h2>
                <form id="userForm">
                    <div class="form-group">
                        <label for="username">First Name</label>
                        <input type="text" class="form-control" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Last Name</label>
                        <input type="text" class="form-control" id="email" name="email" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Submit</button>
                </form>
            </div>
        </div>

        <div class="separator"></div>

        <div class="entries-container">
            <h5>Last 10 Entries</h5>
            <table>
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                    </tr>
                </thead>
                <tbody id="dataList">
                    ${entries.map((entry, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${entry.first_name}</td>
                            <td>${entry.last_name}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <script>
            $(document).ready(function() {
                $('#userForm').on('submit', function(event) {
                    event.preventDefault();
                    $.ajax({
                        url: '/submit',
                        type: 'POST',
                        contentType: 'application/json', // Set the content type to JSON
                        data: JSON.stringify({
                            firstName: $('#username').val(),
                            lastName: $('#email').val()
                        }),
                        success: function(response) {
                            $('<div class="alert alert-success alert-dismissible fade show" role="alert">' +
                              'Data has been saved successfully!' +
                              '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                              '<span aria-hidden="true">&times;</span>' +
                              '</button></div>').prependTo('.container').delay(3000).fadeOut();
                            setTimeout(function(){ location.reload(); }, 3000);
                        },
                        error: function(response) {
                            $('<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
                              'Failed to save data.' +
                              '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                              '<span aria-hidden="true">&times;</span>' +
                              '</button></div>').prependTo('.container').delay(3000).fadeOut();
                        }
                    });
                });

                // Toggle dark mode
                $('#darkModeToggle').on('change', function() {
                    $('body').toggleClass('dark-mode');
                });
            });
        </script>
    </body>
    </html>
    `;
    res.send(indexHtml);
  } catch (error) {
    console.error('Error fetching entries:', error.message);
    res.status(500).send('Error fetching entries from the backend.');
  }
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const response = await axios.post('http://backend-service.backend.svc.cluster.local/submit', req.body);
    res.send(response.data); // Forward the response from the backend to the client
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send({ message: 'Error invoking Backend API' });
  }
});

app.listen(3000, () => {
  console.log('Frontend server listening on port 3000');
});
