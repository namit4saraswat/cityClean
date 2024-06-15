document.getElementById('garbageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        // Get the form data
        const intensity = document.getElementById('intensity').value;
        const description = document.getElementById('description').value;

        // Prepare the data to be sent
        const data = {
            location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            intensity: intensity,
            description: description
        };

        // Use Fetch API to send the data to the server
        fetch('http://localhost:3000/garbage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Garbage data submitted successfully!');
            document.getElementById('garbageForm').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting the data.');
        });
    }, function() {
        alert('Unable to retrieve your location');
    });
});

