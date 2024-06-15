document.getElementById('garbageForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    navigator.geolocation.getCurrentPosition(function(position) {
        const formData = new FormData();
        formData.append('intensity', document.getElementById('intensity').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('lat', position.coords.latitude);
        formData.append('lng', position.coords.longitude);
        const images = document.getElementById('images').files;
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        // only for debuggin
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        // Use Fetch API to send the FormData to the server
        fetch('http://localhost:3000/garbage', {
            method: 'POST',
            body: formData, // No headers needed, as FormData sets the correct Content-Type
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